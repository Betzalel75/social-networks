<template>
  <!-- part Forum -->
  <div>
    <div class="forumPage">
      <!-- Affichage des données récupérées -->
      <div class="container" x-data="{ rightSide: false, leftSide: false }">
        <div class="left-side" :class="{ active: leftSide }">
          <div class="left-side-button" @click="leftSide = !leftSide">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
              viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <div class="logo" style="left: 1%; font-size: 24px">FORUM</div>
          <div class="side-wrapper">
            <div class="side-title">MENU</div>
            <div class="side-menu">
              <router-link to="/" href="javascript:void(0)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                Home
              </router-link>
              <a href="javascript:void(0)">
                <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                  viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Forum
              </a>
            </div>
          </div>
          <a href="https://twitter.com/AysnrTrkk" class="follow-me" target="_blank">
            <span class="follow-text">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                stroke-linejoin="round" class="css-i6dzq1">
                <path
                  d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                </path>
              </svg>
              Follow me on Twitter
            </span>
            <span class="developer">
              <img src="https://twitter.com/AysnrTrkk/photo" />
              Aysenur Turk — @AysnrTrkk
            </span>
          </a>
        </div>
        <!-- Page d'accueil -->
        <div class="main">
          <div class="search-bar">
            <input type="text" placeholder="Search" style="width: 76%; margin: 0 auto" name="search" />
            <button class="right-side-button" @click="rightSide = !rightSide">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
          <!-- <div class="composentsForum"> -->
          <div class="profile" style="max-height: 250px; min-height: 200px">
            <Suggestion />
            <div class="profile-menu-forum">
              <a class="public profile-menu-link active" href="/forum?name=all"
                @click="setActiveLink('all');queryCategory($event);">All Posts</a>
              <a class="public profile-menu-link" href="/forum?name=Event"
                @click="setActiveLink('Event');queryCategory($event);">Events</a>
              <a class="public profile-menu-link" href="/forum?name=General"
                @click="setActiveLink('General');queryCategory($event);">Generals</a>
              <a class="public profile-menu-link" href="/forum?name=Issue"
                @click="setActiveLink('Issue');queryCategory($event);">Issues</a>
            </div>
          </div>
          <!-- </div> -->
  
          <!-- part all users -->
          <div class="main-container-forum">
            <div class="timeline">
              <div class="timeline-right" style="padding-left: 0">
                <div class="all-posts">
                  <!-- COMPOSENT DES POSTS -->
                  <Posts :posts="postPublic" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Partie droite -->
        <div class="right-side" :class="{ active: rightSide }" style="z-index: 4">
          <div class="account">
            <button class="account-button" id="notification-bell" href="javascript:void(0)"
              @click="toggleNotification();">
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="css-i6dzq1" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <button class="account-button" id="notification">
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="css-i6dzq1" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </button>
  
            <span href="javascript:void(0)" class="account-user" @click="myFunction('profil')">{{ nickName }}
              <img :src="'/src/assets/images/' + avatar" alt="" class="account-profile" />
            </span>
          </div>
          <div class="side-wrapper stories" id="profil" style="display: none">
            <div class="side-title">Account</div>
            <div class="user">
              <router-link to="/profile?name=all" href="javascript:void(0)" class="album-action">
                <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" viewBox="0 0 24 24">
                  <path
                    d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z">
                  </path>
                </svg>
                Profil
              </router-link>
            </div>
            <div class="user">
              <router-link to="/settings" data-page-id="setting" class="album-action a_link" href="javascript:void(0)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="m2.344 15.271 2 3.46a1 1 0 0 0 1.366.365l1.396-.806c.58.457 1.221.832 1.895 1.112V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.598a8.094 8.094 0 0 0 1.895-1.112l1.396.806c.477.275 1.091.11 1.366-.365l2-3.46a1.004 1.004 0 0 0-.365-1.366l-1.372-.793a7.683 7.683 0 0 0-.002-2.224l1.372-.793c.476-.275.641-.89.365-1.366l-2-3.46a1 1 0 0 0-1.366-.365l-1.396.806A8.034 8.034 0 0 0 15 4.598V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.598A8.094 8.094 0 0 0 7.105 5.71L5.71 4.904a.999.999 0 0 0-1.366.365l-2 3.46a1.004 1.004 0 0 0 .365 1.366l1.372.793a7.683 7.683 0 0 0 0 2.224l-1.372.793c-.476.275-.641.89-.365 1.366zM12 8c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z">
                  </path>
                </svg>
                Settings
              </router-link>
            </div>
            <div class="user">
              <a @click="sayonara()" class="album-action">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" stroke="currentColor"
                  stroke-width="2" fill="none">
                  >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path>
                  <path
                    d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z">
                  </path>
                </svg>
                Logout
              </a>
            </div>
          </div>
          <Groups />
          <div class="side-wrapper contacts">
            <div style="
                          display: grid;
                          justify-content: center;
                          margin-bottom: 20px;
                        ">
              <router-link to="/profile?name=all" href="javascript:void(0)" class="status-share"
                style="text-decoration: none">New Post</router-link>
            </div>
            <div class="side-title">Contacts</div>
            <!-- COMPOSENTS DE LA LISTE DES UTILISATEURS -->
            <div class="range-users">
              <Users />
            </div>
          </div>
  
          <!-- Juste qu'ici -->
          <div class="search-bar right-search">
            <input type="text" placeholder="Search" name="search" />
            <div class="search-bar-svgs">
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="css-i6dzq1" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.34 469.34">
                <path
                  d="M456.84 76.17l-64-64.06c-16.13-16.13-44.18-16.17-60.37.04L45.77 301.67a10.73 10.73 0 00-2.7 4.59L.41 455.73a10.68 10.68 0 0013.19 13.2l149.33-42.7c1.73-.5 3.3-1.42 4.58-2.7l289.33-286.98c8.06-8.07 12.5-18.78 12.5-30.19s-4.44-22.12-12.5-30.2zM285.99 89.74L325.25 129l-205 205-14.7-29.44a10.67 10.67 0 00-9.55-5.9H78.92L286 89.75zM26.2 443.14l13.9-48.64 34.74 34.74-48.64 13.9zm123.14-35.18L98.3 422.54l-51.5-51.5L61.38 320H89.4l18.38 36.77a10.67 10.67 0 004.77 4.77l36.78 18.39v28.03zm21.33-17.54v-17.09c0-4.04-2.28-7.72-5.9-9.54l-29.43-14.7 205-205 39.26 39.26-208.93 207.07zm271.11-268.7l-47.03 46.61L301 74.6l46.59-47c8.06-8.07 22.1-8.07 30.16 0l64 64c4.03 4.03 6.25 9.38 6.25 15.08s-2.22 11.05-6.22 15.05z" />
              </svg>
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
        </div>
        <div class="overlay" @click="
                      rightSide = false;
                      leftSide = false;
                    " :class="{ active: rightSide || leftSide }"></div>
      </div>
    </div>
    <div>
      <Conversations />
    </div>
    <div>
      <!-- SECTION NOTIFICATION LIST -->
      <Notifications />
      <!-- END -->
    </div>
    <Locked/>
  </div>
</template>

<script setup>
// import Chat from "./DomChat.vue";
import Posts from "./Posts.vue";
import Users from "./Users.vue";
import Conversations from "./Conversations.vue";
import Suggestion from "./Suggession.vue";
import myMixin from "@/mixins/global";
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";
import Groups from "./Groups.vue";
import Notifications from './Notifications.vue';
import Locked from './Locked.vue';
</script>

<style scoped>
@import url("../assets/css/style.css");
@import url("../assets/css/styles.css");
</style>

<script>
export default {
  mixins: [myMixin, app, webSocketGo, utils],
  components: { Conversations, Posts, Users, Suggestion, Groups, Notifications, Locked },

  data() {
    return {
      nickName: this.$store.getters.nickName,
      leftSide: false,
      rightSide: false,
      localID: this.$store.getters.localID,
    };
  },
  computed: {
    Ws() {
      return this.$store.getters.ws; // Exemple de récupération d'une valeur du store Vuex
    },
    Socket() {
      return this.$store.getters.socketStore; // Exemple de récupération d'une valeur du store Vuex
    },
    postPublic() {
      return this.$store.getters.publications;
    },
    avatar() {
      return this.$store.getters.avatar;
    },
    lock() {
      return this.$store.getters.lock;
    },
  },
  cookie: "",
  methods: {
    // Méthode appelée lors du clic sur le lien
    handleClick() {
      // Récupère la div.chat-position
      const chatPosition = document.querySelector(".chat-position");
      chatPosition.classList.add("activated");
    },
    async go() {
      const chatDiv = document.querySelectorAll(".userList");
      chatDiv.forEach((element) => {
        var chatID = element.getAttribute("data-user-id");
        if (this.localID == chatID) {
          element.parentNode.removeChild(element);
        }
      });
      this.cookie = this.getCookieValue("session");
      this.$store.commit("resetVisible");
      this.formu_posts();
    },
  },
  mounted() {
    this.go();
    this.validNotifications();
  },
};
</script>
