<template>
  <div
    class="container divError"
    x-data="{ rightSide: false, leftSide: false }"
  >
    <div class="left-side" :class="{ active: leftSide }">
      <div class="left-side-button" @click="leftSide = !leftSide">
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
      <div class="logo" style="left: 1%; font-size: 24px">FORUM</div>
      <div class="side-wrapper">
        <div class="side-title">MENU</div>
        <div class="side-menu">
          <router-link to="/" href="javascript:void(0)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
            Home
          </router-link>
          <router-link to="/forum" href="javascript:void(0)">
            <svg
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Forum
          </router-link>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="error">{{ status }}</div>
      <br /><br />
      <span class="info-error">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftSide: false,
      rightSide: false,
      status: "",
      message: "",
    };
  },
  computed:{
    err(){
      return this.$store.getters.errors;
    },
  },
  created() {
    this.status = this.err.status || "404"; // Définissez une valeur par défaut si nécessaire
    this.message = this.err.message || "Not Found"; // Définissez une valeur par défaut si nécessaire
  },
};
</script>

<style>
@import url("../assets/css/error.css");
@import url("../assets/css/style.css");
</style>
