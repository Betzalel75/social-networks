<template>
  <div>
    <!-- Utilisation correcte de v-html avec une méthode sans doubles accolades -->
    <!-- <div v-html="getUsers(users)"></div> -->
    <div v-for="(data, index) in (users ? users : user)" :key="index">
      <div class="user userList" :data-user-id="data.UserID" @click="selectUser(data.UserID)">
        <img :src="'http://localhost:8080/images/'+data.Photo" alt="" class="user-img" />
        <div :class="'username-'+data.UserID" style="display: contents; color: lightsteelblue;">
          {{data.Name ? capitalize(data.Name) : capitalize(data.FirstName) }}
          <div :class="'user-status '+data.Status"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";

export default {
  props: {
    users: {
      type: Array, // Définissez le type de la prop comme un tableau
    },
  },
  mixins: [app, utils, webSocketGo],
  computed: {
    user() {
      return this.$store.getters.listUsers;
    }
  },
};
</script>
