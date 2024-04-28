<template>
    <div class="group-M">
        <!--  -->
        <div class="group-chat">
            <div class="user userList" :data-user-id="idGroupe" @click="selectUser(idGroupe)">
                <img src="https://picsum.photos/200" alt="" class="user-img" />
                <div :class="'username-'+idGroupe" style="display: contents; color: lightsteelblue;">
                    Group Chat
                </div>
            </div>
        </div>
        <!--  -->
        <div>
            <div v-for="(data, index) in users" :key="index">
                <div @click="getProfil($event)" class="user" :data-user-id="data.UserID">
                    <img :src="'/src/assets/images/' + data.Photo" alt="" class="user-img" />
                    <div :class="'username-' + data.UserID" style="display: contents; color: lightsteelblue;">
                        {{ data.Name }}
                        <div :class="'user-status ' + data.Status"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";
import myMixin from "@/mixins/global";

export default {
  props: {
    users: {
      type: Array, // Définissez le type de la prop comme un tableau
    },
  },
  mixins: [myMixin, app, utils, webSocketGo],
  computed: {
    idGroupe() {
      return this.$store.state.idGroupe;
    },
  },
  methods: {
    moveUp() {
      const userContainer = document.querySelector(".range-users");
      const user = userContainer.querySelector('.group-chat');
      userContainer.prepend(user);
    },
  },
  mounted() {
    this.moveUp();
  }
};
</script>