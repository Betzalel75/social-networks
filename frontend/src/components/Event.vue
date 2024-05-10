<template>
  <div>
    <div class="dos" style="display: none">
      <div class="exit-to-event" @click="exitEvent">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
          style="stroke: white; stroke-width: 2px">
          <path
            d="m366-310 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56ZM200-200v-560 560-1 1Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v334q-19-7-39-10.5t-41-3.5v-320H200v560h320q0 21 3.5 41t10.5 39H200Zm560 80-56-56 63-64H600v-80h167l-63-64 56-56 160 160L760-40Z" />
        </svg>
      </div>
      <div class="event-body">
        <h1>Formulaire de création d'événements</h1>
  
        <form id="idEvent" method="POST" enctype="multipart/form-data">
          <div>
            <strong class="errorEvent"> </strong>
          </div>
          <div>
            <label for="titre">Titre de l'événement :</label><br />
            <input type="text" id="titre" name="titre" required />
          </div>
          <div>
            <label for="description">Description de l'événement :</label><br />
            <textarea id="description" name="description" rows="4" cols="50" required></textarea><br />
            <input type="file" id="image" name="image" accept="image/*" />
          </div>
          <div style="margin-top: 10px">
            <label for="date">Date de l'événement :</label><br />
            <input type="date" id="date" name="date" required />
          </div>
          <div style="margin-bottom: 10px;">
            <span>Options:</span>
            <ul class="links">
              <li>
                <input type="checkbox" name="going" value="going" id="event" />
                <label style="color: black;" for="event">Aller</label>
              </li>
              <li>
                <input type="checkbox" name="notgoing" value="notgoing" id="gen" />
                <label style="color: black;" for="gen"> Ne pas y aller</label>
              </li>
            </ul>
          </div>
          <div>
            <button type="submit" @click="createEvent($event)">
              Créer l'événement
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exit-to-event {
  position: absolute;
  padding: 2px;
  top: 22dvh;
  right: 25dvw;
  background-color: whitesmoke;
  box-shadow: 0 0 20px #ffffff;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
}

.dos {
  position: absolute;
  width: 100dvw;
  height: 100dvh;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: #00000096;
}

.activated {
  display: block !important;
}

.event-body {
  position: absolute;
  top: 25dvh;
  left: 25vw;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  z-index: 999;
}

h1 {
  color: #333;
}

form {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

input[type="file"] {
  margin-top: 10px;
}

input[type="date"] {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.errorEvent {
  color: red;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-style: italic;
  text-align: center;
}
</style>

<script>
import myMixin from "@/mixins/global";
import minxinPost from "@/mixins/post";
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";

export default {
  mixins: [myMixin, minxinPost, app, utils, webSocketGo],
  name: "CreateEvent",
  data() {
    return {};
  },
  computed: {
    idGroupe() {
      return this.$store.getters.idGroupe;
    },
  },

  methods: {
    exitEvent() {
      const event = document.querySelector(".dos");
      event.classList.toggle("activated");
    },

    createEvent: async function (e) {
      e.preventDefault();

      const formElement = document.getElementById("idEvent"); // Récupérez l'élément du formulaire
      const form = new FormData(formElement); // Utilisez l'élément du formulaire pour créer FormData
      form.set('groupID', this.idGroupe); // Utilisez la méthode set pour ajouter une paire clé-valeur
      const data = await this.postEvent("/creatEvent", form);
      // Réinitialiser le formulaire après la soumission réussie
      formElement.reset();
      if (data.code == 400) {
        const err = document.querySelector('.errorEvent');
        err.textContent = data.message;
      } else {
        const err = document.querySelector('.errorEvent');
        err.textContent = "";
        this.broadcastGroup(this.idGroupe); // Envoyer la notification
      }
    },
    async postEvent(url, param) {
      try {
        const options = {
          method: "POST",
          body: param,
        };
        const response = await fetch("/api" + url, options);

        if (!response.ok) {
          const Errors = {
            status: response.status,
            message: response.statusText,
          };
          this.$store.commit("setError", Errors);
          if (response.status == 401) {
            this.$router.push("/login");
          } else if (response.status != 400 && response.status != 401) {
            throw new Error(
              `Failed to fetch settings. Status: ${response.status}, ${response.statusText}`
            );
          }
        }
        const data = await response.json();
        return data;
      } catch (error) {
        //error("Error fetching data:", error);

        this.$router.push("/errors");
        throw error; // Rejeter l'erreur pour laisser le gestionnaire l'attraper
      }
    },
  },
};
</script>
