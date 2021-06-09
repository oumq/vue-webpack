<template>
  <div class="dotplot-wrapper">
    <canvas width="500" height="500"></canvas>
  </div>
</template>
<script>
export default {
  name: 'dotplot',
  data() {
    return {
      canvas: null
    }
  },
  methods: {
    init() {}
  }
}
</script>
<style lang="scss" scoped>
.dotplot-wrapper {
  min-height: 100vh;
}
</style>
