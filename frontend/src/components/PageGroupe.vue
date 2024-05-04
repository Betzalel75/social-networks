<template>
    <!-- part Profil -->
    <div>
        <div class="forumPage">
            <div class="container" x-data="{ rightSide: false, leftSide: false }">
                <div class="left-side" :class="{ active: leftSide }">
                    <div class="left-side-button" @click="leftSide = !leftSide">
                        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                            stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                        <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                            stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div class="logo" style="left: 1%;font-size:24px;">GROUPE</div>
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
                            <router-link to="/forum?name=all" href="javascript:void(0)" @click="formu_posts()">
                                <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                                    stroke-linejoin="round" viewBox="0 0 24 24">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                </svg>
                                Forum
                            </router-link>
                            <a href="javascript:void(0)">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                                Galery
                            </a>
                            <a href="javascript:void(0)" @click="addEvent()">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#fff">
                                    <path
                                        d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192zm176 40c-13.3 0-24 10.7-24 24v48H152c-13.3 0-24 10.7-24 24s10.7 24 24 24h48v48c0 13.3 10.7 24 24 24s24-10.7 24-24V352h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V256c0-13.3-10.7-24-24-24z" />
                                </svg>
                                New Event
                            </a>
                        </div>
                    </div>
                    <a href="https://twitter.com/AysnrTrkk" class="follow-me" target="_blank">
                        <span class="follow-text">
                            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
                                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
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
                <div class="main" style="background-color: #24273b">
                    <div class="search-bar">
                        <input type="text" placeholder="Search" />
                        <button class="right-side-button" @click="rightSide = !rightSide">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2"
                                fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="composent">
                        <div class="profile" style="width: 96%; margin: 20px auto 0 auto">
                            <div class="profile-avatar-group">
                                <img src="https://picsum.photos/200" alt="" class="profile-img" />
                            </div>
                            <div class="group-name" :data-userId="localID">{{ nickNameGroupe }}</div>
                            <img src="/src/assets/images/cover_zone02.jpg" alt="" class="profile-cover" />
                            <div class="group-menu">
                                <a class="private profile-menu-link active" href="/groups/?name=all"
                                    @click="setActiveLink('all'); queryCatgs($event); toggleLeftSide();">All 
                                    Posts</a>
                                <a class="private profile-menu-link" href="/groups/?name=Event"
                                    @click="setActiveLink('Event'); queryCatgs($event); toggleLeftSide();">Events</a>
                                <a class="private profile-menu-link" href="/groups/?name=General"
                                    @click="setActiveLink('General'); queryCatgs($event); toggleLeftSide();">Generals</a>
                                <a class="private profile-menu-link" href="/groups/?name=Issue"
                                    @click="setActiveLink('Issue'); queryCatgs($event); toggleLeftSide();">Issues</a>
                                <a class="private profile-menu-link" href="/groups/?name=Liked"
                                    @click="setActiveLink('Liked'); queryCatgs($event); toggleLeftSide();">Liked
                                    Post</a>
                                <a class="private profile-menu-link " href="/groups/?name=External"
                                    @click="setActiveLink('External'); toggleFiltre($event);">External Users</a>
                            </div>
                        </div>
                    </div>
                    <div class="main-container" style="padding: 10px 18px 20px 28px">
                        <div class="timeline">
                            <!-- List des utilisateurs externes au groupe -->
                            <div class="pages box ex" style="display: none;">
                                <div class="intro-title">External Users</div>
                                <External></External>
                            </div>
                            <!-- FIN -->
                            <div class="timeline-left">
                                <!-- composant event-box -->
                                <Event-Box :events="events"></Event-Box>
                                <!-- END -->
                            </div>
                            <div class="timeline-right">
                                <div class="status box">
                                    <form method="POST" enctype="multipart/form-data" id="postForm">
                                        <div class="status-menu">
                                            <ul class="links">
                                                <li>
                                                    <input type="checkbox" name="cat" value="Event" id="event" />
                                                    <label style="color: aliceblue;" for="event"> Event</label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name="cat" value="General" id="gen" />
                                                    <label style="color: aliceblue;" for="gen"> General</label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name="cat" value="Issue" id="issue" />
                                                    <label style="color: aliceblue;" for="issue"> Issue</label>
                                                </li>
                                            </ul>
                                        </div>
                                        <span class="login100-form-error ">
    
                                        </span>
                                        <div class="status-main" style="border: none; background-image: url()">
                                            <img src="https://picsum.photos/200" class="status-img" />
                                            <textarea class="status-textarea" placeholder="Title Goes Here"
                                                style="resize: none" name="title" required></textarea>
    
                                        </div>
                                        <div class="status-main content-publication">
                                            <textarea class="status-textarea" placeholder="Post Goes Here" name="desc"
                                                style="resize: none; width: 95%;" required>
                                                                                    </textarea>
                                            <label for="postimage">
                                                <img class="album-photos" id="output" />
                                            </label>
                                        </div>
                                        <div class="status-actions">
                                            <a href="javascript:void(0)" class="status-action">
                                                <input type="file" accept="image/*" id="fileInput" name="postimage"
                                                    style="display: none" @change="loadFile($event)" />
                                                <label for="fileInput" style="cursor: pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        style="fill: white; width: 28; height: 28">
                                                        <path
                                                            d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z">
                                                        </path>
                                                    </svg>
                                                    <sup
                                                        style="top: -0.3em;font-size: 20px;font-weight: 600;cursor: pointer;">upload</sup>
                                                </label>
                                            </a>
                                            <input class="status-share" @click="sendPosts($event)" type="submit"
                                                value="Publish" name="publish" />
                                        </div>
                                    </form>
                                </div>
                                <div class="all-posts">
                                    <Posts :posts="datas" :classeName="classe" />
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
                            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                                stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                        </button>
                        <button class="account-button" id="notification">
                            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                                stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <path d="M22 6l-10 7L2 6" />
                            </svg>
                        </button>
    
                        <span href="javascript:void(0)" class="account-user" @click="myFunction('profil')">{{ nickName
                            }}
                            <img :src="'/src/assets/images/' + avatar" alt="" class="account-profile" />
                        </span>
                    </div>
                    <div class="side-wrapper stories" id="profil" style="display: none">
                        <div class="side-title">Account</div>
                        <div class="user">
                            <router-link to="/profile?name=all" href="javascript:void(0)" class="album-action">
                                <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                    <path
                                        d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z">
                                    </path>
                                </svg>
                                Profil
                            </router-link>
                        </div>
                        <div class="user">
                            <a data-page-id="setting" class="album-action a_link" href="/settings">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="m2.344 15.271 2 3.46a1 1 0 0 0 1.366.365l1.396-.806c.58.457 1.221.832 1.895 1.112V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.598a8.094 8.094 0 0 0 1.895-1.112l1.396.806c.477.275 1.091.11 1.366-.365l2-3.46a1.004 1.004 0 0 0-.365-1.366l-1.372-.793a7.683 7.683 0 0 0-.002-2.224l1.372-.793c.476-.275.641-.89.365-1.366l-2-3.46a1 1 0 0 0-1.366-.365l-1.396.806A8.034 8.034 0 0 0 15 4.598V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.598A8.094 8.094 0 0 0 7.105 5.71L5.71 4.904a.999.999 0 0 0-1.366.365l-2 3.46a1.004 1.004 0 0 0 .365 1.366l1.372.793a7.683 7.683 0 0 0 0 2.224l-1.372.793c-.476.275-.641.89-.365 1.366zM12 8c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z">
                                    </path>
                                </svg>
                                Settings
                            </a>
                        </div>
                        <div class="user">
                            <a @click="sayonara()" class="album-action">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px"
                                    stroke="currentColor" stroke-width="2" fill="none">
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
    
                    <div class="side-wrapper contacts">
                        <div class="side-title">MEMBERS</div>
                        <!-- COMPOSENTS DE LA LISTE DES MEMBRES DU GROUPE -->
                        <div class="range-users">
                            <groupe-membres :users="members" />
                        </div>
                    </div>
    
                    <!-- Juste qu'ici -->
                    <div class="search-bar right-search">
                        <input type="text" placeholder="Search" name="search" />
                        <div class="search-bar-svgs">
                            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                                stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3" />
                                <path
                                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                            </svg>
                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.34 469.34">
                                <path
                                    d="M456.84 76.17l-64-64.06c-16.13-16.13-44.18-16.17-60.37.04L45.77 301.67a10.73 10.73 0 00-2.7 4.59L.41 455.73a10.68 10.68 0 0013.19 13.2l149.33-42.7c1.73-.5 3.3-1.42 4.58-2.7l289.33-286.98c8.06-8.07 12.5-18.78 12.5-30.19s-4.44-22.12-12.5-30.2zM285.99 89.74L325.25 129l-205 205-14.7-29.44a10.67 10.67 0 00-9.55-5.9H78.92L286 89.75zM26.2 443.14l13.9-48.64 34.74 34.74-48.64 13.9zm123.14-35.18L98.3 422.54l-51.5-51.5L61.38 320H89.4l18.38 36.77a10.67 10.67 0 004.77 4.77l36.78 18.39v28.03zm21.33-17.54v-17.09c0-4.04-2.28-7.72-5.9-9.54l-29.43-14.7 205-205 39.26 39.26-208.93 207.07zm271.11-268.7l-47.03 46.61L301 74.6l46.59-47c8.06-8.07 22.1-8.07 30.16 0l64 64c4.03 4.03 6.25 9.38 6.25 15.08s-2.22 11.05-6.22 15.05z" />
                            </svg>
                            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                                stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="overlay" @click="rightSide = false;leftSide = false;"
                    :class="{ active: rightSide || leftSide }"></div>
            </div>
        </div>
        <div class="conversation">
            <Conversations :ok="false" />
        </div>
        <!-- <div class="chat">
            <Chat />
        </div> -->
        <!-- Event -->
        <Event />
        <!-- SECTION NOTIFICATION LIST -->
        <Notifications />
        <!-- END -->
        <Locked />
    </div>
</template>

<script setup>
// import Chat from "./DomChat.vue";


import Posts from "./Posts.vue";
import Users from "./Users.vue";
import Conversations from "./Conversations.vue";
</script>

<style scoped>
@import url("../assets/css/style.css");
@import url("../assets/css/loginForm.css");
@import url("../assets/css/styles.css");

.profile-avatar-group {
    position: absolute;
    align-items: center;
    display: flex;
    z-index: 1;
    bottom: 100px;
    left: 24px;
}

.group-menu {
    position: absolute;
    left: -3px;
    bottom: -2rem;
    display: flex;
    justify-content: space-between;
}

.group-name {
    position: absolute;
    padding: 0px 0px 10px 50px;
    bottom: 50px;
    font-size: 22px;
    color: #fff;
    font-weight: 600;
    font-family: "DM Sans", sans-serif;
}

.composent {
    padding-bottom: 2rem;
    display: flex;
    width: 100%;
    background-color: #151728;
}

.content-publication {
    display: inline;
}

.nosuccess {
    color: #ff0000 !important;
    display: block !important;
}

.login100-form-error {
    font-family: Poppins-Bold;
    font-size: 16px;
    color: #333333;
    text-align: center;
    width: 100%;
    display: none;
}
</style>

<script>
import myMixin from "@/mixins/global";
import minxinPost from "@/mixins/post";
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";
import GroupeMembres from './GroupeMembres.vue';
import Notifications from './Notifications.vue';
import External from './External.vue';
import EventBox from './Event-Box.vue';
import Event from './Event.vue';
import Locked from './Locked.vue';



export default {
  props: {
    posts: {
      type: Array, // Définissez le type de la prop comme un tableau
    },
    classeName: {
      type: String,
      default: 'publicPublications'
    },
    avatarName: {
      type: String,
      default: "",
    }
  },
  components: { Posts, Users, GroupeMembres, Notifications, External, EventBox, Event, Locked },
  mixins: [myMixin, minxinPost, app, utils, webSocketGo],
  data() {
    return {
      classe: "userPublications",
      localID: "",
      nickName: this.$store.getters.nickName,
      listUsers: this.$store.getters.listUsers,
      leftSide: false,
      rightSide: false,
      members: [],
      datas: [],
      events: [],
    };
  },
  computed: {
    avatar() {
      return this.$store.getters.avatar;
    },
    nickNameGroupe() {
      return this.$store.getters.nickNameGroupe;
    },
    idGroupe() {
      return this.$store.getters.idGroupe;
    },
  },
  methods: {
    // Méthode appelée lors du clic sur le lien
    handleClick() {
      // Récupère la div.chat-position
      const chatPosition = document.querySelector(".chat-position");
      chatPosition.classList.add("activated");
    },
    go() {
      const chatDiv = document.querySelectorAll(".userList");
      chatDiv.forEach((element) => {
        var chatID = element.getAttribute("data-user-id");
        if (this.localID == chatID) {
          element.parentNode.removeChild(element);
        }
      });
      const parent = document.querySelector('.content-publication');
      const child = parent.querySelector('.status-textarea');
      child.innerHTML = "";
      this.$store.commit("resetVisible");
      this.verification().then(() => {
        this.fetchData("/getmembers", this.idGroupe).then((members) => {
          this.members = members.members;
          this.$store.commit("setExternal", members.externals);
        });
      });
      this.fetchData("/groups?all", this.idGroupe).then((groups) => {
        const data = groups.publication;
        if (data !== null) {
            this.datas = data;
        }
        this.events = groups.events;
      });
    },
    async verificateMember() {
      let groupId = this.$store.getters.idGroupe
      let ok = await this.isGroupMember(groupId);
      if (ok) { // User is member in group
        this.go();
      } else {
        this.$router.push({ name: 'Errors' }); // This should work
      }
    },
    toggleFiltre(event) {
      event.preventDefault();
      // Toggler l'élément suivant avec l'ID 'notification'
      const external = document.querySelector(".ex");
      const r = document.querySelector(".timeline-right");
      const l = document.querySelector(".timeline-left");

      r.style.display = "none";
      l.style.display = "none";

      external.style.display = "";

    },
    toggleLeftSide() {
      const external = document.querySelector(".ex");
      external.style.display = "none";
      const r = document.querySelector(".timeline-right");
      const l = document.querySelector(".timeline-left");

      r.style.display = "";
      l.style.display = "";
    },
  },
  mounted() {
    // this.go();
    this.verificateMember();
    this.validNotifications();
  },
};
</script>