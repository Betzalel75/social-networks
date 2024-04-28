<template>
  <div class="landing-page">
    <header>
      <div class="container-landing-page">
        <router-link to="/" class="logo"><b>ABOUT</b></router-link>
        <ul class="links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/forum?name=all">Forum</router-link></li>
          <li><router-link to="/login">Sign In</router-link></li>
        </ul>
      </div>
    </header>
    <div class="content-landing-page">
      <div class="container-landing-page">
        <div class="info">
          <h1>Looking For Inspiration</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Repellendus odit nihil ullam nesciunt quidem iste, Repellendus
            odit nihil
          </p>
          <router-link to="/forum?name=all" class="get-started">Get Started</router-link>
        </div>
        <div class="image">
          <img src="../assets/images/landin.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("/src/assets/css/index.css");
</style>

<script>
import app from "@/mixins/appSocket";

export default {
  mixins: [app],
}
</script>