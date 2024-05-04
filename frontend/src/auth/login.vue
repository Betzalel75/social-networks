<!-- /src/components/login.vue -->

<template>
  <div class="connexionPage">
    <div class="main-connexionPage">
      <div class="container-connexionPage a-container" id="a-container">
        <form method="POST" class="form" id="a-form">
          <h2 class="form_title title">Create Account</h2>
          <div class="form__icons"><i class="bx bxl-git form__icon"></i></div>
          <span class="form__span"></span>
          <input type="text" class="form__input" placeholder="Nickname (Optional)" name="identifiant" />
          <div class="form_input">
            <small> Date of Birth </small>
          </div>
          <input type="date" class="form__input" name="age" id="age" />
          <!-- <input type="checkbox" class="form__input values" name="gender" id="gender" placeholder="Gender" required> -->
          <input type="text" class="form__input radio" name="about" placeholder="About Me (Optional)" />
          <input type="first-name" class="form__input values" name="first-name" id="first-name"
            placeholder="First Name" />
          <input type="last-name" class="form__input values" name="last-name" id="last-name" placeholder="Last Name" />
          <input class="form__input" type="email" placeholder="Email" name="email" />
          <input class="form__input values" type="password" placeholder="Password" name="password" />
          <!-- Photo de profi -->
          <label for="postimage" style="display: none">
            <img class="album-photos" id="output" />
          </label>
          <a href="javascript:void(0)" class="p-action">
            <input type="file" accept="image/*" id="fileInput" name="postimage" style="display: none" />
            <label for="fileInput" style="cursor: pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: #0575e6; width: 28; height: 28">
                <path
                  d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z">
                </path>
              </svg>
              <sup style="
                    top: -0.3em;
                    color: black;
                    font-size: 20px;
                    font-weight: 600;
                    cursor: pointer;
                  ">Avatar</sup>
            </label>
          </a>
          <input type="submit" class="form__button button submit switch-button-signin" name="signup" value="SIGN UP"
            @click="handleSubmit($event)" />
        </form>
      </div>
      <div class="container-connexionPage b-container" id="b-container">
        <form method="POST" class="form myForm" id="b-form">
          <h2 class="form_title title">Sign in to Website</h2>
          <div class="form__icons"><i class="bx bxl-git form__icon"></i></div>
          <span class="form__span"></span>
          <input class="form__input values" type="text" placeholder="Email" name="identifiant" id="email" required />
          <input class="form__input values" type="password" placeholder="Password" name="password" id="password"
            required />
          <input type="submit" class="form__button button submit switch-button-signin" name="signin" value="SIGN IN"
            @click="handleSubmit($event)" />
        </form>
      </div>
      <div class="switch" id="switch-cnt">
        <div class="switch__circle"></div>
        <div class="switch__circle switch__circle--t"></div>
        <div class="switch__container" id="switch-c1">
          <h2 class="switch__title title">Welcome Back !</h2>
          <p class="switch__description description">
            To keep connected with us please login with your personal info
          </p>
          <button class="switch__button button switch-btn" @click="buttonsSwitchs()">
            SIGN IN
          </button>
        </div>
        <div class="switch__container is-hidden" id="switch-c2">
          <h2 class="switch__title title">Hello Friend !</h2>
          <p class="switch__description description">
            Enter your personal details and start journey with us
          </p>
          <button class="switch__button button switch-btn" @click="buttonsSwitchs()">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
    <!-- partial:index.partial.html -->
    <div class="form-structor">
      <form method="POST" class="signup" id="form-a">
        <h2 @click="buttonsSwitchsMobileDeux($event)" class="form-title" id="signup">
          <span>or</span>Sign up
        </h2>
        <div>
          <span class="form__span mobile_info"></span>
          <div class="form-holder">
            <input type="text" class="input" placeholder="Nickname (Optional)" name="identifiant" />
            <!-- <input type="number" class="input" name="age" id="age" placeholder="Age" required /> -->
            <div class="input" style="text-align: center; justify-content: center;">
              <small> Date of Birth </small>
            </div>
            <input type="date" class="input" name="age" id="age" />
            <!--  -->
            <input class="input radio" type="text" id="male" name="gender" placeholder="About Me (Optional)" />
            <!--  -->
            <input type="first-name" class="input values" name="first-name" id="first-name" placeholder="First Name"
              required />
            <input type="last-name" class="input values" name="last-name" id="last-name" placeholder="Last Name"
              required />
            <input type="email" class="input" placeholder="Email" name="email" required />
            <input type="password" class="input values" placeholder="Password" name="password" required />
          </div>
        </div>
        <!-- Photo de profi -->
        <label for="postimage" style="display: none">
          <img class="album-photos" id="output" />
        </label>
        <a href="javascript:void(0)" class="p-action">
          <input type="file" accept="image/*" id="fileInput" name="postimage" style="display: none" />
          <label for="fileInput" style="cursor: pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: #fff; width: 28px; height: 28px">
              <path
                d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z">
              </path>
            </svg>
            <sup style="
                    top: -0.3em;
                    color: black;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                  ">Avatar</sup>
          </label>
        </a>
        <button type="submit" style="margin-top: 0px;" class="submit-btn" name="signup" value="SIGN UP"
          @click="handleSubmit($event)">
          Sign up
        </button>
      </form>
      <div class="login slide-up">
        <form method="POST" class="center myForm" id="form-b">
          <h2 @click="buttonsSwitchsMobile($event)" class="form-title" id="login">
            <span>or</span>Log in
          </h2>
          <div>
            <span class="form__span mobile_info"></span>
            <div class="form-holder">
              <input type="text" class="input values" placeholder="Email" name="identifiant" required />
              <input type="password" class="input values" placeholder="Password" name="password" required />
            </div>
          </div>
          <button @click="handleSubmit($event)" type="submit" class="submit-btn" name="signin" value="SIGN IN">
            Log in
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("../assets/css/login.css");
@import url("../assets/css/mobile.css");

.p-action {
  margin-bottom: -40px;
}
</style>

<script>
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";

export default {
  mixins: [app, webSocketGo, utils],
  Err: "",
  errorSpans: null,
  cookie: "",
  computed: {
    defaultAvatar() {
      return this.$tore.getters.postImage;
    },
  },
  methods: {
    setCookie(name, value, hours) {
      var expires = "";
      if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    },
    changeForm() {
      let switchCtn = document.querySelector("#switch-cnt");
      let switchC1 = document.querySelector("#switch-c1");
      let switchC2 = document.querySelector("#switch-c2");
      let switchCircle = document.querySelectorAll(".switch__circle");
      let aContainer = document.querySelector("#a-container");
      let bContainer = document.querySelector("#b-container");
      switchCtn.classList.add("is-gx");
      setTimeout(() => {
        switchCtn.classList.remove("is-gx");
      }, 1500);

      switchCtn.classList.toggle("is-txr");
      switchCircle[0].classList.toggle("is-txr");
      switchCircle[1].classList.toggle("is-txr");

      switchC1.classList.toggle("is-hidden");
      switchC2.classList.toggle("is-hidden");
      aContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-z200");
    },
    changeFormMobile(element) {
      const parent = element.parentNode;
      if (parent.nodeName == "DIV" || parent.nodeName == "FORM") {
        if (parent.classList.contains("slide-up")) {
          parent.classList.remove("slide-up");
        } else {
          parent.classList.add("slide-up");
        }
      }
    },
    buttonsSwitchs() {
      this.changeForm();
    },
    buttonsSwitchsMobile(e) {
      const form = document.querySelector("#form-a");
      if (form.classList.contains("slide-up")) {
        form.classList.remove("slide-up");
      } else {
        form.classList.add("slide-up");
      }
      this.changeFormMobile(e.target.parentNode);
    },
    buttonsSwitchsMobileDeux(e) {
      const login = document.querySelector(".login");
      if (login.classList.contains("slide-up")) {
        login.classList.remove("slide-up");
      } else {
        login.classList.add("slide-up");
      }
      this.changeFormMobile(e.target);
    },
    async handleSubmit(e) {
      try {
        e.preventDefault();
        const parent = e.target.parentNode;
        const idParent = parent.getAttribute("id");
        if (idParent == "a-form" || idParent == "form-a") {
          this.handleSignup(idParent);
          return;
        }
        const formu = new FormData(document.getElementById(idParent));

        const password = formu.get("password");
        const email = formu.get("identifiant");
        this.errorSpans = parent.querySelectorAll(".form__span");

        // Vérifier les conditions
        if (password.length < 4 || email.trim() === "") {
          alert("Invalid username or password.");
          return;
        }
        document.getElementById(`${idParent}`).reset(); // Réinitialiser le formulaire

        // Objet contenant les données à envoyer
        const data = {
          identifiant: email,
          password: password,
        };

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        const endpoint = "/api/login";

        const response = await fetch(endpoint, options);
        if (!response.ok) {
          const errorMessage =
            response.status === 401
              ? "Invalid username or password."
              : `Network response was not ok, status: ${response.status}`;
          this.Err = "Invalid username or password.";

          throw new Error(errorMessage);
        }

        const result = await response.json();
        localStorage.setItem("cookie", result.cookie);
        this.cookie = result.cookie;
        this.setCookie("session", result.cookie, 1000);

        // Exemple de redirection côté client
        if (result.redirect) {
          this.$store.commit(
            "setAvatar",
            result.datas.PostsProfile.Photo.toString()
          );
          this.$store.commit("setLocalID", result.datas.IdUser.toString());
          this.$store.commit(
            "setNickName",
            this.capitalize(result.datas.PostsProfile.Name.toString())
          );

          this.$store.dispatch("initWebsocket");
          this.$store.dispatch("initChat");
          this.$router.push(result.redirect);
        }
      } catch (error) {
        //error("Error:", error);
        // Affichage du message d'erreur
        this.errorSpans.forEach((errorSpan) => {
          errorSpan.textContent = this.Err;
          errorSpan.classList.add("nosucces"); // Ajoutez une classe CSS pour un style spécifique si nécessaire
        });
      }
    },
    async handleSignup(e) {
      try {
        const formData = new FormData(document.getElementById(`${e}`));
        const signupForm = document.getElementById(`${e}`);
        this.errorSpans = signupForm.querySelectorAll(".form__span");

        // Parcourir tous les champs
        let isFormValid = true;
        const inputs = signupForm.querySelectorAll(".values");

        const self = this;
        inputs.forEach(function (input) {
          // Vérifier si un champ est vide
          if (input) {
            if (
              input.value.trim() === "" ||
              !self.validCredential(input.value.trim())
            ) {
              // Mettre en évidence le champ vide (par exemple, ajouter une classe CSS)
              input.classList.add("invalid");
              isFormValid = false;
            } else {
              // Retirer la classe d'invalidité si le champ est rempli
              input.classList.remove("invalid");
            }
          }
        });

        // Vérifier si l'email est valide
        const emailInput = signupForm.querySelector('input[name="email"]');
        if (!this.validEmail(signupForm.email.value)) {
          emailInput.classList.add("invalid");
          isFormValid = false;
        } else {
          emailInput.classList.remove("invalid");
        }

        const password = signupForm.querySelector(
          "input[name='password']"
        ).value;

        if (password.length < 4) {
          alert("Password too short");
          return false;
        }

        const dateNaissance = new Date(signupForm.querySelector("#age").value);
        const ageInput = signupForm.querySelector("#age");
        if (!this.validBirth(dateNaissance)) {
          ageInput.classList.add("invalid");
          isFormValid = false;
        }

        if (!isFormValid) {
          return false;
        }
        document.getElementById(`${e}`).reset(); // Réinitialiser le formulaire

        // Effectuer la requête HTTP POST vers votre serveur Go
        const response = await fetch("/api/register", {
          method: "POST",
          body: formData,
        });

        // Vérifier la réponse du serveur
        if (!response.ok) {
          if (response.status === 401 || response.status === 400) {
            throw new Error("Invalid entries.");
          } else {
            throw new Error(
              `Network response was not ok, status: ${response.status}`
            );
          }
        }

        const result = await response.json();
        localStorage.setItem("cookie", result.cookie);
        this.cookie = result.cookie;
        this.setCookie("session", result.cookie, 1000);

        // Exemple de redirection côté client
        if (result.redirect) {
          // this.$store.commit('setDatas', result.datas);
          this.$store.commit(
            "setAvatar",
            result.datas.PostsProfile.Photo.toString()
          );

          this.$store.commit("setLocalID", result.datas.IdUser.toString());
          this.$store.commit(
            "setNickName",
            this.capitalize(result.datas.PostsProfile.Name.toString())
          );
          this.$store.commit("setAllPosts", []);
          this.$router.push(result.redirect);
          this.$store.dispatch("initWebsocket");
          this.$store.dispatch("initChat");
        }
      } catch (error) {
        // Affichage du message d'erreur
        //error("Error:", error);
        this.errorSpans.forEach((errorSpan) => {
          errorSpan.textContent = "Invalid entries.";
          errorSpan.classList.add("nosucces"); // Ajoutez une classe CSS pour un style spécifique si nécessaire
        });
      }
    },
    validCredential(textCredential) {
      let credentialRegExp = /^[a-zA-Z0-9._-]{2,15}$/;
      if (!textCredential) {
        return false; // Retourne false si l'identifiant est null ou undefined
      }
      const value = credentialRegExp.test(textCredential); // Renvoie le résultat de la validation
      return value;
    },
    validEmail(email) {
      if (!email) {
        return false;
      }
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validBirth(dateNaissance) {
      const dateActuelle = new Date();
      let age = dateActuelle.getFullYear() - dateNaissance.getFullYear();
      const m = dateActuelle.getMonth() - dateNaissance.getMonth();
      if (m < 0 ||
        (m === 0 && dateActuelle.getDate() < dateNaissance.getDate())
      ) {
        age--; // Si la personne n'a pas encore eu son anniversaire cette année, soustraire 1 de l'âge
      }
      if (age >= 10) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
