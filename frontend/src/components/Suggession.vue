<template>
  <div >
    <div class="content-carousel" @scroll="handleScroll">
      <div class="carousel" v-for="(data, index) in suggestion" :key="index">
        <div class="status_top">
          <div class="user_status" :data-user-id="data.UserID">
            <a
              
              href="javascript:void(0);"
              @click="getProfil($event)"
            >
              <img
                :src="'/src/assets/images/' + data.Photo"
                alt=""
                class="user-img"
                style="cursor: pointer"
              />
            </a>
            <div :class="'username-' + data.UserID">
              {{ data.Name }}
            </div>
            <div class="btn-follow">
              <button
                :class="'follow-' + data.UserID"
                @click="followedUser(data.UserID, $event)"
              >
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myMixin from "@/mixins/global";
import app from "@/mixins/appSocket";

export default {
  mixins: [myMixin, app],

  // props: {
  //   suggestion: {
  //     type: Array
  //   }
  // },
  computed: {
    suggestion() {
      return this.$store.getters.suggestions;
    },
  },
  methods: {
    handleScroll(event) {
      const conteneur = event.target;
      if (
        conteneur.scrollLeft + conteneur.clientWidth >
        conteneur.scrollWidth
      ) {
        // L'utilisateur a atteint la fin de la liste, retourner au début
        conteneur.scrollLeft = 0;
      }
    },
  },
};
</script>

<style scoped>
.status_top {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  margin: 0px;
  height: 160px;
}

.user_status {
  padding: 5px 15px;
  margin: 15px 25px;
  flex-shrink: 0;
  box-shadow: 2px 4px 9px 0px black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.status_top .user-img {
  width: 80px;
  height: 80px;
  margin: 0;
}

.status_top button {
  background: rgba(66, 66, 247, 0.934);
  color: rgba(245, 245, 245, 0.86);
  padding: 5px 15px;
  border-radius: 5px;
  margin-top: 5px;
  font-size: 14px;
  border: 1px solid rgba(189, 189, 189, 0.226);
}

.btn-follow {
  cursor: pointer;
}

.content-carousel {
  display: inline-flex;
  overflow: scroll;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
}
</style>
