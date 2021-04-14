import { arr, promise } from '../../components/test'
import img from '../../assets/logo.png'
import './index.scss'

const imgEl = document.createElement('img')
imgEl.src = img
document.querySelector('#root').appendChild(imgEl)
console.log('article')
console.log(arr, promise)
