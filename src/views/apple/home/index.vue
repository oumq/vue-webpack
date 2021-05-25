<template>
  <div class="home-wrapper">
    <section class="container mx-auto">
      <section class="bg-black h-96"></section>
      <section class="sticky-wrapper bg-black relative">
        <p class="text-5xl font-semibold text-white float-left mt-10 ml-5">
          apple-sticky
        </p>
        <div class="sticky top-0 right-0 float-right">
          <canvas id="canvas" width="800" height="800"></canvas>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'apple-index',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      document.getElementById('canvas')
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
