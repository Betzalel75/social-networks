<template>
  <div class="notification-box noti" id="notification-box" style="display: none;">
    <div class="nt-title">
      <h4>Setting</h4>
      <a href="javascript:void(0)" title="">Clear all</a>
    </div>
    <div class="nott-list">
      <!-- 
                  category
                  email
                  senderID
                  type
                  username
                  photo
                  created_at
                  groupID
                  notifID
                -->
      <div v-for="(data, index) in notifications" :key="index">
        <div class="notfication-details">
          <div class="noty-user-img">
            <img :src="'/src/assets/images/'+data.photo" alt="">
          </div>
          <div class="notification-info" @click="show">
            <h3>
              <a href="javascript:void(0)" title="">{{ data.username }}</a><br />
              {{ message(data.category) }}
            </h3><br />
            <span>{{ formatDateTime(data.created_at) }}</span>
          </div>
          <div class="container-buttons" style="display: none;" v-if="data.category !='post'">
            <button class="accept-button"
              @click="reponse(data.senderID, data.groupID,data.notifID, 'accept')">Accepter</button>
            <button class="reject-button"
              @click="reponse(data.senderID, data.groupID,data.notifID, 'reject')">Refuser</button>
          </div>
          <!--  -->
          <div class="container-buttons" style="display: none;" v-if="data.category =='post'">
            <button class="accept-button" @click="notifBell($event);">Refresh</button>
          </div>
        </div>
      </div>
      <div class="view-all-nots">
        <a href="javascript:void(0)" title="" @click="loadAllNotifications" v-if="!showAllNotifications">View All
          Notification</a>
      </div>
    </div><!--nott-list end-->
  </div><!--notification-box end-->
</template>

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
    notifications() {
      return this.$store.getters.notifs;
    },
    showAllNotifications() {
      return this.$store.getters.showAllNotifications;
    }
  },
  methods: {
    show(e) {
      const nextNotificationElement = e.target.closest('.notfication-details').querySelector('.container-buttons');
      if (nextNotificationElement) {
        nextNotificationElement.style.display =
          nextNotificationElement.style.display === "" ? "none" : "";
      }
    },
    message(category) {
      switch (category) {
        case "follow":
          return "vous suit";
        case "post":
          return "a fait une nouvelle publication";
        case "event":
          return "a créé un nouvel événement";
        case "inscription":
          return "veut intégrer votre groupe";
        default:
          return "";
      }
    },
    // Méthode pour charger toutes les notifications
    loadAllNotifications() {
      // Get all notifications
      this.fetchData("/getNotification?page=0").then((data) => {
        this.$store.commit("setNotifs", data.notifications);
        this.$store.commit("setShowAllNotifications", true);
      });
    },
    // Méthode pour accepter une notification
    async reponse(senderID, groupID, notifID, responseType) {
      try {
        const vals = {
          cookie: this.getCookieValue("session"),
          groupID: groupID,
          senderID: senderID,
          category: "inscription",
          type: responseType,
          notifID: notifID,
        };
        const options = {
          method: "POST",
          body: JSON.stringify(vals),
        };
        const response = await fetch("/api/response", options);

        if (!response.ok) {
          const Errors = {
            status: response.status,
            message: response.statusText,
          };
          store.commit("setError", Errors);
          if (response.status == 401) {
            this.$store.dispatch("disconnect");
            this.$router.push("/login");
          } else {
            throw new Error(
              `Failed to fetch settings. Status: ${response.status}, ${response.statusText}`
            );
          }
        }

        const data = await response.json();
        console.log(data);
        // this.$store.commit("setExternal", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        this.$router.push("/errors");
        throw error; // Rejeter l'erreur pour laisser le gestionnaire l'attraper
      }
    },
  },
}
</script>

<style>
@import url("../assets/css/notifList.css");
</style>