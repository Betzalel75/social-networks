<template>
  <div>
    <div v-for="(data, index) in users" :key="index">
      <div class="user userList" :data-user-id="data.UserID">
        <img :src="'http://localhost:8080/images/'+data.Photo" alt="" class="user-img" />
        <div :class="'username-'+data.UserID" style="display: contents; color: lightsteelblue;">
          {{data.Name}}
          <button :class="getInviteClass(data.UserID)"
            @click="sendInvitation(data.UserID)">{{getName(data.UserID)}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-share {
  margin-left: 20px;
}

.status-share.ivnited {
  background-color: green;
}
</style>

<script setup>
import myMixin from "@/mixins/global";
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";
</script>

<script>
export default {
  mixins: [myMixin, app, webSocketGo, utils],
  data() {
    return {
      inviteds: [],
    };
  },
  computed: {
    users() {
      return this.$store.state.external;
    },
    idGroupe() {
      return this.$store.getters.idGroupe;
    },
  },
  methods: {
    getInviteClass(userID) {
      if (this.inviteds.includes(userID)) {
        return "status-share ivnited";
      } else {
        return "status-share";
      }
    },
    getName(userID) {
      if (this.inviteds.includes(userID)) {
        return "Invited...";
      } else {
        return "Invite";
      }
    },
    async sendInvitation(id) {
      try {
        const vals = {
          cookie: this.getCookieValue("session"),
          groupID: this.idGroupe,
          receiverID: id,
          category: "invitation",
        };
        const options = {
          method: "POST",
          body: JSON.stringify(vals),
        };
        const response = await fetch("/api/join", options);

        if (!response.ok) {
          const Errors = {
            status: response.status,
            message: response.statusText,
          };
          store.commit("setError", Errors);
          if (response.status == 401) {
            store.dispatch("disconnect");
            router.push("/login");
          } else {
            throw new Error(
              `Failed to fetch settings. Status: ${response.status}, ${response.statusText}`
            );
          }
        }
        this.privateNotif(id); // send notification
        const data = await response.json();
        this.inviteds.push(id);
        return data;
      } catch (error) {
        //error("Error fetching data:", error);
        router.push("/errors");
        throw error; // Rejeter l'erreur pour laisser le gestionnaire l'attraper
      }
    },
  }
};
</script>