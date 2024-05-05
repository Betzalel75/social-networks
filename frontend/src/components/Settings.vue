<template>
  <div class="settingPage">
    <div class="limiter">
      <div class="container-login100">
        <form method="POST" class="wrap-login100" id="form-data" enctype="multipart/form-data">
          <div class="login100-pic" data-tilt>
            <div class="profile-avatar-settings">
              <input type="file" accept="image/*" name="photo" id="fileInput" @change="loadFile($event)" />
              <label>
                <img class="profile-img-settings" id="output" :src="'http://localhost:8080/images/' + avatar" />
              </label>
            </div>
            <span>Update Avatar</span>
            <sub>Allowed JPG, GIF or PNG. Max size of 800K</sub>
          </div>
          <div class="login100-form validate-form">
            <span class="login100-form-title">
              Account Settings
              <div>
                <button @click="sayonara()" class="status-share">Logout</button>
              </div>
            </span>
            <span :class="'login100-form-error ' + data.Status">
              {{ data.Message }}
            </span>
            <!-- <sub></sub> -->
            <!-- normal form -->
            <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
              <label for="username">Username :</label>
              <input id="username" class="input100" type="text" name="username" :value="data.User.FirstName" />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>
            <div class="back">
              <a href="javascript:void(0)" onclick="history.back()" style="text-decoration: none">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" style="fill: #ffffff">
                  <path d="m12.707 7.707-1.414-1.414L5.586 12l5.707 5.707 1.414-1.414L8.414 12z"></path>
                  <path d="M16.293 6.293 10.586 12l5.707 5.707 1.414-1.414L13.414 12l4.293-4.293z"></path>
                </svg>
              </a>
            </div>
            <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
              <label for="email">Email :</label>
              <input id="email" class="input100" type="text" name="email" :placeholder="data.User.Email"
                disabled="disabled" />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>
            <div id="existingPassword" class="wrap-input100 validate-input" data-validate="Password is required">
              <label for="password">Password :</label>
              <input id="password" class="input100" type="password" name="pass" placeholder="Password" />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            <span><input style="margin-top: 10px" type="checkbox" id="updateCheckbox" @click="showDiv()" />
              Update your password</span>
  
            <!-- update password -->
            <div id="passwordDiv" style="display: none; width: 100%">
              <div class="wrap-input100 validate-input" data-validate="Password is required">
                <label for="newPassword">New password :</label>
                <input type="password" class="input100" id="newPassword" name="newPassword" placeholder="New password" />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
              <div class="wrap-input100 validate-input" data-validate="Password is required">
                <label for="oldPassword">Password :</label>
                <input type="password" class="input100" id="oldPassword" name="oldPassword" placeholder="Password" />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <!-- submit -->
            <div class="container-login100-form-btn">
              <button class="status-share" @click="updateSettings($event)">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
@import url("../assets/css/setting.css");
</style>

<script>
import utils from "@/mixins/utils";
import myMixin from "@/mixins/global";

export default {
  mixins: [utils, myMixin],
  computed: {
    avatar() {
      return this.$store.getters.avatar;
    },
  },
  data() {
    return {
      data: {
        Status: "",
        Message: "",
        User: {
          Username: "",
          Email: "",
          Password: "",
          Photo: "",
        },
      },
      content: null,
    };
  },
  cookie: "",
  methods: {
    showDiv() {
      var checkbox = document.getElementById("updateCheckbox");
      var passwordDiv = document.getElementById("passwordDiv");
      var existingPassword = document.getElementById("existingPassword");
      if (checkbox.checked) {
        passwordDiv.style.display = "block";
        existingPassword.style.display = "none";
      } else {
        passwordDiv.style.display = "none";
        existingPassword.style.display = "block";
      }
    },
    sendData(file) {
      const statusForm = document.querySelector(".login100-form-error");

      fetch("/api/settings", {
        method: "POST",
        body: file,
      })
        .then((response) => {
          if (!response.ok) {
            //error("Reponse : ", response);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Vérifier le statut et effectuer des actions en conséquence
          if (data.status === "success") {
            // Gérer le succès
            if (statusForm.classList.contains("nosuccess")) {
              statusForm.classList.remove("nosuccess");
            }
            this.$store.commit("setAvatar", data.photo);
            statusForm.classList.add(data.status);
            statusForm.innerHTML = data.message;
          }
          if (data.status === "nosuccess") {
            // Gérer l'échec
            if (statusForm.classList.contains("success")) {
              statusForm.classList.remove("success");
            }
            statusForm.classList.add(data.status);
            statusForm.innerHTML = data.message;
          }
        })
        .catch((error) => {
          // Objet Erreur
          const Erreur = {
            status: 401,
            message: "Unauthorized",
          };

          this.$store.commit("setError", Erreur);
          this.$router.push("/errors");
          //error("Error during form submission:", error);
        });
    },
    updateSettings(event) {
      event.preventDefault(); // Empêcher le comportement par défaut du formulaire

      const form = new FormData(document.getElementById("form-data"));

      // Vérifiez si un fichier a été sélectionné
      const photoFile = form.get("photo");
      // const dataPhoto = new FormData
      if (photoFile) {
        const inputFile = document.getElementById("fileInput").files[0]; // Obtenez le fichier à partir de l'élément d'entrée de type fichier
        this.readFileAsBase64(inputFile)
          .then((base64Content) => {
            const options = {
              cookie: this.cookie,
              username: form.get("username"),
              email: form.get("email"),
              password: form.get("pass"),
              newPassword: form.get("newPassword"),
              image: {
                name: "",
                lastModified: "",
                lastModifiedDate: "",
                webkitRelativePath: "",
                size: "",
                type: "",
                content: base64Content,
              },
            };
            // //table(photoFile)
            options.image.name = photoFile.name;
            options.image.lastModified = photoFile.lastModified;
            options.image.lastModifiedDate = photoFile.lastModifiedDate;
            options.image.webkitRelativePath = photoFile.webkitRelativePath;
            options.image.size = photoFile.size;
            options.image.type = photoFile.type;
            const file = JSON.stringify(options); // Envoyez les données au serveur
            this.sendData(file);
          })
          .catch((error) => {
            //error("Erreur lors de la lecture du fichier :", error);
          });
      } else {
        // Aucun fichier sélectionné, envoyez les autres données sans l'image
        const options = {
          cookie: this.cookie,
          username: form.get("username"),
          email: form.get("email"),
          password: form.get("pass"),
          newPassword: form.get("newPassword"),
          image: {
            name: "",
            lastModified: "",
            lastModifiedDate: "",
            webkitRelativePath: "",
            size: "",
            type: "",
            content: "",
          },
        };
        const file = JSON.stringify(options);
        this.sendData(file);
      }
    },
    async getSettings() {
      // c'est cette fonction qui charge les parameters actuales de l'utilisateur.
      const value = this.getCookieValue("session");
      this.cookie = value;
      if (!value) {
        this.$router.push("/login");
        return;
      }
      const options = {
        cookie: this.cookie,
      };
      const object = JSON.stringify(options);
      try {
        const response = await fetch("/api/getsettings", {
          method: "POST",
          body: object,
        });

        if (!response.ok) {
          // Objet Erreur
          const Erreur = {
            status: null,
            message: null,
          };
          Erreur.status = `${response.status}`;
          Erreur.message = `${response.statusText}`;
          this.$store.commit("setError", Erreur);

          throw new Error(
            `Failed to fetch settings. Status: ${response.status}, ${response.statusText}`
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        //error("Error fetching settings:", error);
        this.$router.push("/errors");
        throw error; // Rethrow the error to let the caller handle it
      }
    },
  },
  async mounted() {
    // charger les information des l'ouverture de la page...
    this.data = await this.getSettings();
  },
};
</script>
