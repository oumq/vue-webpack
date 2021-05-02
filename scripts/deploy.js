const path = require('path')
const archiver = require('archiver')
const fs = require('fs')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const srcPath = path.resolve(__dirname, '../dist')

console.log('开始压缩dist目录...')
startZip()

//压缩dist目录为public.zip
function startZip() {
  var archive = archiver('zip', {
    zlib: { level: 5 } //递归扫描最多5层
  }).on('error', function (err) {
    throw err //压缩过程中如果有错误则抛出
  })

  var output = fs
    .createWriteStream(path.join(__dirname, '../') + '/dist.zip')
    .on('close', function (err) {
      /*压缩结束时会触发close事件，然后才能开始上传，
          否则会上传一个内容不全且无法使用的zip包*/
      if (err) {
        console.log('关闭archiver异常:', err)
        return
      }
      console.log('已生成zip包')
      console.log('开始上传dist.zip至远程机器...')
      uploadFile()
    })

  archive.pipe(output) //典型的node流用法
  archive.directory(srcPath, '/dist') //将srcPach路径对应的内容添加到zip包中/public路径
  archive.finalize()
}

//将dist目录上传至正式环境
function uploadFile() {
  ssh
    .connect({
      //configs存放的是连接远程机器的信息
      host: '',
      username: '',
      privateKey: ''
    })
    .then(function () {
      console.log(path.join(__dirname, '../dist.zip'))
      ssh
        .putFiles([
          {
            local: path.join(__dirname, '../dist.zip'),
            remote: '/project/dist.zip'
          }
        ])
        .then(res => {
          // console.log('res', res)
          // process.exit(0)
          startRemoteShell()
        })
        .catch(err => {
          console.error('err', err)
          process.exit(0)
        })
    })
    .catch(err => {
      console.log('ssh连接失败:', err)
      process.exit(0)
    })
}

//执行远端部署脚本
function startRemoteShell() {
  //在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
  ssh
    .execCommand('sh deploy.sh', { cwd: '/project' })
    .then(function (result) {
      // console.log('远程STDOUT输出: ' + JSON.stringify(result))
      // console.log('远程STDERR输出: ' + result.stderr)
      if (!result.stderr) {
        console.log('发布成功!')
        process.exit(0)
      }
    })
    .catch(err => {
      console.error(err)
      process.exit(0)
    })
}
