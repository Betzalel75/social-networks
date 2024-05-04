
<template>
  <div data-slide="slide" class="slide">
    <div class="slide-items">
      <div class="event box" :class="{ active: index === activeIndex }" v-for="(data, index) in events" :key="index">
        <div class="event-wrapper">
          <img :src="'/src/assets/images/'+data.Image" class="event-img" />
          <div class="event-date">
            <div class="event-month">{{returnDate(data.Date)[0]}}</div>
            <div class="event-day">{{returnDate(data.Date)[1]}}</div>
          </div>
          <div class="event-title">{{data.Title}}</div>
          <div class="event-subtitle">{{data.Description}}</div>
        </div>
      </div>
    </div>
    <nav class="slide-nav">
      <div class="slide-thumb"></div>
      <button class="slide-prev" @click="prevSlide">Previous</button>
      <button class="slide-next" @click="nextSlide">Next</button>
    </nav>
  </div>
</template>
 

<script>
import myMixin from "@/mixins/global";
import minxinPost from "@/mixins/post";
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";

export default {
  mixins: [myMixin, minxinPost, app, utils, webSocketGo],
  props: {
    events: {
      type: Array,
    }
  },
  watch: {
    events(newEvents) {
      this.slideItems = newEvents;
    },
  },

  data() {
    return {
      activeIndex: 0, // Index de l'élément actif
      slideInterval: null, // Intervalle pour le slider automatique
      slideItems: this.events, // Tableau des evenements passés au composant
    };
  },

  methods: {
    returnDate(date) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = new Date(date).getMonth();
      const day = new Date(date).getDate();
      const month = months[monthIndex];
      return [month, day];
    },
    nextSlide() {
      if (this.slideItems) {
        this.activeIndex = (this.activeIndex + 1) % this.slideItems.length;
      }
    },
    prevSlide() {
      if (this.slideItems) {
        this.activeIndex = (this.activeIndex - 1 + this.slideItems.length) % this.slideItems.length;
      }
    },
  },
  mounted() {
    this.slideInterval = setInterval(this.nextSlide, 3000);
  },
  beforeUnmount() {
    clearInterval(this.slideInterval);
  },

}
</script>

<style scoped>

.slide {
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0px auto;
  display: grid;
  padding: 00px 0;
  overflow: hidden;
}


.slide-items {
  position: relative;
  grid-area: 1/1;
  overflow: visible;
}

.slide-items img {
  object-fit: cover;
  height: 300px;
  width: 100%;
}

.slide-nav {
  grid-area: 1/1;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
}

.slide-items>* {
  position: absolute;
  top: 0;
  opacity: 0;
  pointer-events: none;
}

.slide-items>.active {
  position: relative;
  opacity: 1;
  poiter-events: initial;
}

.slide-nav button {
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  opacity: 0;
}

.slide-thumb {
  display: flex;
  grid-column: 1/3;
  padding: 0 15px;
}

.slide-thumb>span {
  flex: 1;
  display: block;
  height: 2px;
  background: #afafaf;
  margin: 3px;
  margin-top: 20px;
  border-radius: 3px;
  overflow: hidden;
}

.slide-thumb>span.done:after {
  content: "";
  display: block;
  height: inherit;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
}

.slide-thumb>span.active:after {
  content: "";
  display: block;
  height: inherit;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  transform: translateX(-100%);
  animation: thumb 5s forwards linear;
}

@keyframes thumb {
  to {
    transform: initial;
  }
}
</style>