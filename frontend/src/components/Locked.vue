<template>
  <div class="verouiller">
    <div class="pages box">
      <div class="intro-title">
        This profile is locked
        <button class="intro-menu"></button>
      </div>
      <img src="/src/assets/images/locked.svg" alt="" style="max-width: 400px;">
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.verouiller{
  position: absolute;
  z-index: 33;
  width: 100%;
  height: 100%;
}
</style>