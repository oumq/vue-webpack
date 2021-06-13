<template>
  <div class="home-wrapper">
    <section class="container mx-auto">
      <section class="bg-black h-96"></section>
      <section
        ref="sticky-wrapper"
        class="sticky-wrapper bg-black relative flex"
      >
        <p class="text-5xl font-semibold text-white flex-auto self-center"
          >apple-sticky</p
        >
        <div class="sticky top-40 right-0 self-start">
          <canvas id="canvas" width="720" height="500"></canvas>
        </div>
      </section>
      <section class="bg-black h-screen"></section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'apple-home',
  data() {
    return {
      canvas: null,
      ctx: null,
      imgList: []
    }
  },
  async mounted() {
    await this.preLoadImg()
    this.init()
  },
  methods: {
    init() {
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.ctx.drawImage(this.imgList[0], 0, 0, 720, 500)
      this.bindScroll()
    },
    async preLoadImg() {
      const promise_arr = []
      for (let i = 1; i < 36; i++) {
        promise_arr.push(
          new Promise((resolve, reject) => {
            let img = new Image()
            img.src = require(`@/assets/apple/flow_key_${i}.jpg`)
            img.onload = function () {
              resolve(img)
            }
          })
        )
      }
      await Promise.all(promise_arr).then(res => {
        this.imgList = res
      })
    },
    bindScroll() {
      window.addEventListener('scroll', this.handleScrollEv)
    },
    handleScrollEv(e) {
      const scrollTop =
        e.target.documentElement.scrollTop || e.target.body.scrollTop
      const offsetTop = this.$refs['sticky-wrapper'].offsetTop
      if (scrollTop >= offsetTop && scrollTop < 1800 + scrollTop) {
        this.drawImg(scrollTop - offsetTop)
      }
    },
    drawImg(offset) {
      const index = Math.floor(offset / 36)
      if (index > 0) {
        this.ctx.drawImage(this.imgList[index], 0, 0, 720, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-wrapper {
  min-height: 100vh;
  background: #111;
  .sticky-wrapper {
    height: 1800px;
    .sticky-content {
    }
  }
}
</style>
