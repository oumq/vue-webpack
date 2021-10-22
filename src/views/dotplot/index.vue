<template>
  <div class="dotplot-wrapper">
    <div ref="txt" style="position: absolute; z-index: -999"></div>
    <div class="canvas-wrap" ref="canvas-wrap">
      <canvas id="canvas" width="770" height="300"></canvas>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  name: 'dotplot',
  data() {
    return {
      canvas: null,
      ctx: null,
      img: null,
      percent: 0,
      raf: null,
      angle: ((2 * Math.PI) / 360) * 60
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.ctx.lineWidth = 1
      // this.ctx.strokeStyle = '#F5B09E'
      // this.animate()

      this.img = new Image()
      this.img.src = require('../../assets/logo.png')
      this.img.onload = () => {
        canvas.width = this.img.width
        canvas.height = this.img.height
        this.ctx.drawImage(this.img, 0, 0)
        // this.clip()
        this.imgToText()
        this.h2c()
      }
    },
    drawCurvePath(start, end, curveness) {
      var cp = [
        (start[0] + end[0]) / 2 - (start[1] - end[1]) * curveness,
        (start[1] + end[1]) / 2 - (end[0] - start[0]) * curveness
      ]

      this.ctx.moveTo(start[0], start[1])

      const arr = []

      for (var t = 0; t <= this.percent / 100; t += 0.01) {
        var x = this.quadraticBezier(start[0], cp[0], end[0], t)
        var y = this.quadraticBezier(start[1], cp[1], end[1], t)
        // this.ctx.lineTo(x, y)
        arr.push([x, y])
      }

      return arr
    },
    quadraticBezier(p0, p1, p2, t) {
      var k = 1 - t
      return k * k * p0 + 2 * (1 - t) * t * p1 + t * t * p2 // 这个方程就是二次贝赛尔曲线方程
    },
    animate() {
      this.ctx.clearRect(0, 0, 770, 300)

      this.ctx.beginPath()

      this.ctx.moveTo(0, 300)

      let arr1 = this.drawCurvePath([0, 300], [650, 100], -0.1)
      let arr2 = this.drawCurvePath([0, 300], [670, 135], -0.1)

      const [x1, y1] = arr1[arr1.length - 1]
      const [x2, y2] = arr2[arr2.length - 1]

      const dis = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))

      const k = (y2 - y1) / (x2 - x1)
      const b = y1 - k * x1

      let [nx1, ny1] = this.getInLinePoint(dis, x1, y1, k, b)

      nx1 = x1 - Math.abs(nx1 - x1)
      ny1 = y1 - Math.abs(ny1 - y1)

      const [nx2, ny2] = this.getInLinePoint(dis, x2, y2, k, b)

      const triangleX =
        (nx1 - nx2) * Math.cos(this.angle) -
        (ny1 - ny2) * Math.sin(this.angle) +
        nx2
      const triangleY =
        (nx1 - nx2) * Math.sin(this.angle) +
        (ny1 - ny2) * Math.cos(this.angle) +
        ny2

      for (let i = 0; i < arr1.length; i++) {
        this.ctx.lineTo(arr1[i][0], arr1[i][1])
      }

      this.ctx.lineTo(nx1, ny1)

      this.ctx.lineTo(triangleX, triangleY)

      this.ctx.lineTo(nx2, ny2)

      this.ctx.lineTo(x2, y2)

      arr2.reverse()

      for (let i = 0; i < arr2.length; i++) {
        this.ctx.lineTo(arr2[i][0], arr2[i][1])
      }

      this.ctx.closePath()

      var grad = this.ctx.createLinearGradient(770, 0, 0, 330)

      grad.addColorStop(0, 'rgba(255, 221, 212, 1)')
      grad.addColorStop(1, 'rgba(255, 221, 212, 0.3)')

      this.ctx.fillStyle = grad
      this.ctx.strokeStyle = grad

      this.ctx.fill()

      this.ctx.stroke()

      this.percent += 2

      if (this.percent <= 100) {
        this.raf = requestAnimationFrame(this.animate)
      } else {
        // init()
        cancelAnimationFrame(this.raf)
      }

      // this.percent = (this.percent + 1) % 100

      // this.raf = requestAnimationFrame(this.animate)
    },
    getInLinePoint(distance, x, y, k, b) {
      const L = distance / 2

      const A = Math.pow(k, 2) + 1
      const B = 2 * ((b - y) * k - x)
      const C = Math.pow(b - y, 2) + Math.pow(x, 2) - Math.pow(L, 2)

      const nx1 = (-B + Math.sqrt(Math.pow(B, 2) - 4 * A * C)) / (2 * A)
      const nx2 = (-B - Math.sqrt(Math.pow(B, 2) - 4 * A * C)) / (2 * A)

      const ny1 = k * nx1 + b

      return [nx1, ny1]
    },
    clip() {
      let imageData = this.ctx.getImageData(
        0,
        0,
        this.img.width,
        this.img.height
      )
      // this.ctx.fillStyle = '#ffffff'
      // this.ctx.fillRect(0, 0, this.img.width, this.img.height)

      var gap = 1

      for (var h = 0; h < this.img.height; h += gap) {
        for (var w = 0; w < this.img.width; w += gap) {
          var position = (this.img.width * h + w) * 4
          var r = imageData.data[position],
            g = imageData.data[position + 1],
            b = imageData.data[position + 2]

          var gray = 0.299 * r + 0.587 * g + 0.114 * b
          imageData.data[position] = gray
          imageData.data[position + 1] = gray
          imageData.data[position + 2] = gray
          imageData.data[position + 3] = 255
        }
      }

      // this.ctx.fillStyle = '#ffffff'
      // this.ctx.fillRect(0, 0, this.img.width, this.img.height)

      for (var h = 0; h < this.img.height; h += gap) {
        for (var w = 0; w < this.img.width; w += gap) {
          var position = (this.img.width * h + w) * 4
          var r = imageData.data[position],
            g = imageData.data[position + 1],
            b = imageData.data[position + 2]
          if (r > 100 && r < 200) {
            imageData.data[position] = 255
            imageData.data[position + 1] = 255
            imageData.data[position + 2] = 255
          }
        }
      }

      this.ctx.putImageData(imageData, 0, 0)
    },
    getGray(r, g, b) {
      return 0.299 * r + 0.587 * g + 0.114 * b
    },
    toText(g) {
      if (g <= 30) {
        return '#'
      } else if (g > 30 && g <= 60) {
        return '&'
      } else if (g > 60 && g <= 120) {
        return '$'
      } else if (g > 120 && g <= 150) {
        return 'o'
      } else if (g > 150 && g <= 180) {
        return '*'
      } else if (g > 180 && g <= 210) {
        return '!'
      } else if (g > 210 && g <= 240) {
        return ';'
      } else {
        return '.'
      }
    },
    imgToText() {
      let imageData = this.ctx.getImageData(
        0,
        0,
        this.img.width,
        this.img.height
      )
      let px = imageData.data
      let imgDataWidth = imageData.width
      let imgDataHeight = imageData.height
      let html = ''
      for (let h = 0; h < imgDataHeight; h += 6) {
        let p = '<p style="display: flex; padding: 0; margin: 0;">'
        for (let w = 0; w < imgDataWidth; w += 3) {
          let index = (w + imgDataHeight * h) * 4
          let r = px[index + 0]
          let g = px[index + 1]
          let b = px[index + 2]
          let gray = this.getGray(r, g, b)
          let each =
            '<span style="width:12px;height: 12px;line-height: 12px;">' +
            this.toText(gray) +
            '</span>'
          p += each
        }
        p += '</p>'
        html += p
      }
      this.$refs.txt.innerHTML = html

      for (let i = 0; i < px.length; i++) {
        let r = px[i]
        let g = px[i + 1]
        let b = px[i + 2]
        let gray = this.getGray(r, g, b)
        px[i] = gray
        px[i + 1] = gray
        px[i + 2] = gray
      }

      // this.ctx.putImageData(
      //   imageData,
      //   0,
      //   0,
      //   0,
      //   0,
      //   this.img.width,
      //   this.img.height
      // )
    },
    h2c() {
      html2canvas(this.$refs.txt).then(canvas => {
        canvas.style.width = this.img.width + 'px'
        canvas.style.height = this.img.height + 'px'
        this.$refs['canvas-wrap'].append(canvas)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dotplot-wrapper {
  min-height: 100vh;
  .canvas-wrap {
    min-height: 100vh;
    background: #fff;
  }
}
</style>
