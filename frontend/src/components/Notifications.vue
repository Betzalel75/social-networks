<template>
  <div class="notification-box noti" id="notification-box" style="display: none;">
    <div class="notification-overlay" @click="closePopup()"></div>
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
                      groupName
                      vu
                      -->
      <div v-for="(data, index) in notifications" :key="index">
        <div :class="setNotifClass(data.category, data.vu)" @click="updateView(data.notifID, $event, data.category)">
          <div class="noty-user-img">
            <img :src="'http://localhost:8080/images/'+data.photo" alt="">
          </div>
          <div class="notification-info" @click="show">
            <h3>
              <a href="javascript:void(0)" title="">{{ data.username }}</a><br />
              {{ message(data.category, data.groupName) }}
            </h3><br />
            <span>{{ formatDateTime(data.created_at) }}</span>
          </div>
          <div class="container-buttons" style="display: none;" v-if="data.category !='post'">
            <button class="accept-button"
              @click="reponse(data.senderID, data.groupID,data.notifID,data.category, 'accept')">Accepter</button>
            <button class="reject-button"
              @click="reponse(data.senderID, data.groupID,data.notifID,data.category, 'reject')">Refuser</button>
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
  data() {
    return {
      obj: false,
    };
  },
  methods: {
    setNotifClass(cat, vu) {
      if (cat !== "post" || !vu.Bool) {
        return "notfication-details";
      }
      if (vu.Bool) {
        return "notfication-details object";
      }
    },
    updateView(notifID, event, cat) {
      event.preventDefault();
      if (cat !== "post") {
        return false;
      }
      const parent = event.target.closest('.notfication-details')
      if (parent) {
        parent.classList.add('object');
      }

      // Endpoint de votre serveur où la requête POST sera envoyée
      const endpoint = "/api/updateNotif";

      // Objet contenant les données à envoyer
      var data = {
        messageID: notifID,
        newVisibility: true,
        cookie: this.getCookieValue("session"),
      };

      // Convertir l'objet JavaScript en chaîne JSON
      var jsonData = JSON.stringify(data);

      // Options pour la requête fetch
      var options = {
        method: "POST",
        body: jsonData,
      };

      // Utiliser fetch pour envoyer la requête
      fetch(endpoint, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Erreur réseau lors de la mise à jour du statut du message"
            );
          }
        })
        .catch((error) => {
          // //error("Échec de la mise à jour du statut du message:", error);
          // Objet Erreur
          const Erreur = {
            status: error.status,
            message: error.message,
          };

          this.$store.commit("setError", Erreur);
          router.push("/errors");
        });
    },
    closePopup() {
      let box = document.querySelector("#notification-box");
      if (box) {
        box.style.display = "none";

        const bell = document.getElementById("notification-bell");
        if (bell.classList.contains("ring")) {
          bell.classList.remove("ring");
        }
      }
    },
    show(e) {
      const nextNotificationElement = e.target.closest('.notfication-details').querySelector('.container-buttons');
      if (nextNotificationElement) {
        nextNotificationElement.style.display =
          nextNotificationElement.style.display === "" ? "none" : "";
      }
    },
    message(category, name) {
      switch (category) {
        case "follow":
          return "vous suit";
        case "post":
          var str = "a fait une nouvelle publication";
          if (name) {
            str = "a fait une nouvelle publication dans le groupe " + name;
          }
          return str;
        case "event":
          var str = "a créé un nouvel événement";
          if (name) {
            str = "a créé un nouvel événement dans le groupe " + name;
          }
          return str;
        case "inscription":
          var str = "veut intégrer votre groupe";
          if (name) {
            str = "veut intégrer votre groupe " + name;
          }
          return str;
        case "invitation":
          return "vous invite à intégrer un groupe";
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
    async reponse(senderID, groupID, notifID, category, responseType) {
      try {
        const vals = {
          cookie: this.getCookieValue("session"),
          groupID: groupID,
          senderID: senderID,
          category: category,
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
        this.$store.commit("setNotifs", data.notifications);
        return data
      } catch (error) {
        //error("Error fetching data:", error);
        this.$router.push("/errors");
        throw error; // Rejeter l'erreur pour laisser le gestionnaire l'attraper
      }
    },
  },
}
</script>

<style>
@import url("../assets/css/notifList.css");

.notification-overlay {
  position: fixed;
  background-color: transparent;
  width: 100dvw;
  height: 100dvh;
  left: 0;
  top: 0;
  z-index: -1;
}

.notfication-details.object {
  background-color: rgba(46, 40, 40, 0.5);
}
</style>