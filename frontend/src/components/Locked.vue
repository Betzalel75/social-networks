<template>
  <div class="verouiller view">
    <div class="lock-class" @click="close">
      <div class="pages box">
        <div style="display: flex; align-items: center; justify-content: center; padding-top: 0rem;">
          <div class="intro-title" style="color: #fefefe;">
            This profile is locked
          </div>
          <img src="http://localhost:8080/images/locked.svg" alt="" style="max-width: 400px;">
        </div>
      </div>
    </div>
    <div @click="close" class=""
      style="background-color: rgba(0, 0, 0, 0.7); width: 100dvw; height: 100dvh; position: absolute; top: 0; z-index: -1;">
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      const vr = document.querySelector('.verouiller')
      vr.classList.add('view')
    }
  }
}
</script>

<style scoped>
.verouiller {
  top: 0;
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
}

.lock-class {
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* Assurez-vous que .lock-class prend toute la largeur disponible */
}

.intro-title {
  margin-bottom: 0px;
}
</style>