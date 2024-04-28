<template>
  <div>
    <!-- Utilisation correcte de v-html avec une méthode sans doubles accolades -->
    <!-- <div v-html="getUsers(users)"></div> -->
    <div v-for="(data, index) in users" :key="index">
      <div class="user userList" :data-user-id="data.UserID" @click="selectUser(data.UserID)">
        <img :src="'/src/assets/images/'+data.Photo" alt="" class="user-img" />
        <div :class="'username-'+data.UserID" style="display: contents; color: lightsteelblue;">
          {{data.Name}}
          <div :class="'user-status '+data.Status"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
const prosp = defineProps(["users"]);
</script> -->

<script>
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";

export default {
  // props: {
  //   users: {
  //     type: Array, // Définissez le type de la prop comme un tableau
  //   },
  // },
  mixins: [app, utils, webSocketGo],
  computed:{
    users(){
      return this.$store.getters.listUsers;
    }
  },
};
</script>
