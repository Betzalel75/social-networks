<template>
  <div>
    <div class="join-overlay" v-on:click="closeModal()" v-if="showJoinGroupPopup"></div>
    <div :class="showJoinGroupPopup?'join-popup active':'join-popup'">
      <h3>{{ getGroupName }} </h3>
      <p>Would you like to join the group now?</p>
      <hr>
      <div class="btn-containers">
        <button class="primary" v-if="!sent" v-on:click="sendJoindDemande()">Join</button>
        <button class="sent" v-if="sent">Demande sent</button>
        <button class="secondary" v-on:click="closeModal()">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("../assets/css/joinGroupPopup.css");
</style>

<script>
import app from "@/mixins/appSocket";
import myMixin from "@/mixins/global";

export default {
  data() {
    return {
      sent: false
    }
  },
  computed: {
    showJoinGroupPopup() {
      return this.$store.getters.showJoinGroupPopup;
    },
    getGroupID() {
      return this.$store.getters.idGroupe;
    },
    getGroupName() {
      return this.$store.getters.nickNameGroupe.toUpperCase();
    },
  },
  mixins: [app, myMixin],
  methods: {
    sendJoindDemande() {
      const data = {
        type: "joinGroup",
        notifType: "private",
        category: "inscription",
        idGroupe: this.$store.getters.idGroupe,
        idUser: this.$store.getters.localID,
      };

      if (this.getToken("session")) {
        this.$store.dispatch("sendMessage", data);
      } else {
        console.log("cookie not found");
        myMixin.methods.sayonara();
      }
      this.sent = true;
      setTimeout(() => {
        this.closeModal()
      }, 2000);
    },
    closeModal() {
      this.$store.commit('showJoinGroupPopup', false);
    },
  },
};
</script>
