<template>
  <div>
    <div v-for="(data, index) in users" :key="index">
      <div class="user userList" :data-user-id="data.UserID">
        <img :src="'/src/assets/images/'+data.Photo" alt="" class="user-img" />
        <div :class="'username-'+data.UserID" style="display: contents; color: lightsteelblue;">
          {{data.Name}}
          <button class="status-share" @click="sendInvitation(data.UserID)">Invite</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-share{
  margin-left: 20px;
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

  computed: {
    users() {
      return this.$store.state.external;
    },
    idGroupe() {
      return this.$store.getters.idGroupe;
    },
  },
  methods: {
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

        const data = await response.json();
        return data;
        // this.$store.commit("setExternal", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/errors");
        throw error; // Rejeter l'erreur pour laisser le gestionnaire l'attraper
      }
    },
  }
};
</script>