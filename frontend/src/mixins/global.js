// Dans le fichier mixin.js
import utils from "./utils";
import store from "../store/index";
import router from "@/router";
import app from "./appSocket";

const myMixin = {
  computed: {
    idUser() {
      return store.getters.idUser;
    },
    iFollow(){
      return store.getters.isFollowing;
    },
    lock() {
      return this.$store.getters.lock;
    },
  },
  methods: {
    getCookieValue(cookieName) {
      const value = localStorage.getItem("cookie");
      return value !== undefined ? value : undefined;
    },
    sendFeedback(postId, action, url) {
      const likeCountPost = document.querySelectorAll(
        `.likeCount[data-post-id="${postId}"]`
      );
      const dislikeCountPost = document.querySelectorAll(
        `.dislikeCount[data-post-id="${postId}"]`
      );

      const value = this.getCookieValue("session");
      if (value) {
        // Exemple de requête Fetch API
        fetch("/api/like?name=" + url, {
          method: "POST",
          body: JSON.stringify({
            postId: postId,
            action: action,
            cookie: value,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Mettez à jour les compteurs avec les données de la réponse du serveur
            likeCountPost.forEach((like) => {
              like.textContent = data.likeCount;
            });
            dislikeCountPost.forEach((dislike) => {
              dislike.textContent = data.dislikeCount;
            });
            // console.table('table-like: ',data);
          })
          .catch((error) => {
            // Objet Erreur
            const Erreur = {
              status: error.status,
              message: error.message,
            };

            store.commit("setError", Erreur);
            router.push("/errors");
            console.error(error);
          });
      } else {
        var event = new Event("logOut");
        document.dispatchEvent(event);
      }
    },
    myFunction(postID) {
      document.getElementById(postID).classList.toggle("show");
    },
    setActiveLink(nameParam) {
      // const urlParams = new URLSearchParams(window.location.search);
      // const nameParam = urlParams.get("name");
      const links = document.querySelectorAll(".profile-menu-link");

      // Remove the "active" class from all links
      links.forEach((link) => link.classList.remove("active"));

      // Add the "active" class to the link with the corresponding name parameter
      links.forEach((link) => {
        if (link.getAttribute("href").includes(`name=${nameParam}`)) {
          link.classList.add("active");
        }
      });

      // Check if no link has the "active" class, then add it to the "All Posts" link
      const activeLinks = document.querySelectorAll(
        ".profile-menu-link.active"
      );
      if (activeLinks.length === 0) {
        document
          .querySelector('.profile-menu-link[href^="/forum"]')
          .classList.add("active");
      }
      const time = document.querySelector(".timeline-left");
      if (time && time.classList.contains("view")) {
        time.classList.remove("view");
      }
      const allPosts = document.querySelector(".all-posts");
      if (allPosts && allPosts.classList.contains("view")) {
        allPosts.classList.remove("view");
      }
      const status_actions = document.querySelector(".status.box");
      if (status_actions && status_actions.classList.contains("view")) {
        status_actions.classList.remove("view");
      }
      const infosUser = document.querySelector(".infosUser");
      if (infosUser) {
        infosUser.classList.add("view");
      }
    },
    colorFeedback(e, side) {
      const p = e.target.parentNode;
      const parent = p.closest(".album-actions");

      const element = parent.querySelector(`.svg-${side}`);
      // Correction orthographique et utilisation directe de 'element'
      if (side == "right") {
        parent.querySelector(".svg-left").style.fill = "none";
      } else if (side == "left") {
        parent.querySelector(".svg-right").style.fill = "none";
      }
      // Utilisation de 'element.style.fill' pour la vérification et le changement de couleur
      if (element.style.fill != "white") {
        element.style.fill = "white";
      } else {
        element.style.fill = "none";
      }
    },
    sayonara() {
      const data = JSON.stringify({ cookie: this.getCookieValue("session") });
      fetch("/api/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST", // Spécifiez la méthode HTTP
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            console.log("reponse: ", response);
            throw new Error("Erreur réseau");
          }
          return response.json(); // Convertissez la réponse en JSON
        })
        .then((data) => {
          localStorage.removeItem("cookie");
          store.dispatch("disconnect");
          router.push(data.redirect);
          return;
        })
        .catch((error) => {
          localStorage.removeItem("cookie");
          store.dispatch("disconnect");
          router.push("/login");
          console.error("Erreur:", error);
        });
    },
    async getFollowers() {
      const idfollowedUser = store.getters.localID.trim();
      const followers = document.querySelector(`.followers-${idfollowedUser}`);

      const data = await utils.methods.fetchData("/followers");

      followers.textContent = data;
      followers.style.fontSize = "24px";
      followers.style.fontWeight = "700";
    },
    async queryCategory(e) {
      e.preventDefault();
      const url = e.target.getAttribute("href");
      const query = url.split("?")[1];
      const page = url.split("?")[0].split("/")[1];

      if (!query) {
        return;
      }
      if (page === "profile") {
        const data = await utils.methods.fetchData(
          "/getSectionContent?" + query
        );
        store.commit("setAllPosts", data.publication);
      }
      if (page === "forum") {
        const data = await utils.methods.fetchData("/get-posts?" + query);
        store.commit("setPublications", data.content.publication);
        store.commit("setSuggestions", data.users);
      }
      router.push(url.toLowerCase());
    },
    async getProfil(event) {
      event.preventDefault();
      const headerchat = event.target;
      const container = headerchat.closest(".container-chat");
      if (container) {
        const idUser = container
          .getAttribute("id")
          .split("message-list-")
          .pop()
          .trim();
        const name = container.querySelector(".head-discussion")
          .textContent.trim();
        newFunction(name, idUser).then(() => {
          if (this.iFollow || !this.lock) {
            router.push("/profiles?name=all");
          }else{
            alert("profile is locked");
          }
        });
        return;
      }
      let parent = headerchat.closest(".group-M");
      if (parent) {
        if (headerchat.classList.contains("user-img")) {
          parent = headerchat.closest(".user");
          const idUser = parent.getAttribute("data-user-id").trim();
          if (idUser == store.getters.localID) {
            router.push("/profile?name=all");
            return;
          } else {
            const name = parent
              .querySelector(`.username-${idUser}`)
              .textContent.trim();
            await newFunction(name, idUser);
            if (this.iFollow || !this.lock) {
              router.push("/profiles?name=all");
            }else{
              alert("profile is locked");
            }
          }
        } else {
          const idUser = headerchat.getAttribute("data-user-id").trim();
          if (idUser == store.getters.localID) {
            router.push("/profile?name=all");
          } else {
            const name = headerchat
              .querySelector(`.username-${idUser}`)
              .textContent.trim();
            await newFunction(name, idUser);
            if (this.iFollow || !this.lock) {
              router.push("/profiles?name=all");
            }else{
              alert("profile is locked");
            }
          }
        }
      } else {
        const container = headerchat.closest(".user_status");
        const idUser = container.getAttribute("data-user-id").trim();
        const name = container
          .querySelector(`.username-${idUser}`)
          .textContent.trim();
        await newFunction(name, idUser);
        if (this.iFollow || !this.lock) {
          router.push("/profiles?name=all");
        }else{
          alert("profile is locked");
        }
      }

      async function newFunction(name, idUser) {
        const user = store.getters.listUsers.find(function (user) {
          return idUser === user.UserID && user.Name === name.toLowerCase();
        });
        const photo = user ? user.Photo : "defautl.jpg";
        store.commit("setAvatarInvite", photo);
        if (name) {
          store.commit("setNickNameProfil", utils.methods.capitalize(name));
        }
        store.commit("setIdUser", idUser);
        const data = await utils.methods.fetchData("/getDataProfiles", idUser);
        if (!data.publication) {
          store.commit("setLock", true);
        }
        store.commit("setPublicationsUsers", data.publication);
        const datas = await utils.methods.fetchData(
          "/getFollowersInvite",
          idUser
        );
        store.commit("setNumberFollowers", datas.nombre);
        store.commit("setIsFollowing", datas.isFollow);
        if (!datas.isFollow && datas.status !=="public") {
          store.commit("setLock", true)
        }else{
          store.commit("setLock", false)
        }
      }
    },
    async queryCategories(e) {
      e.preventDefault();
      const url = e.target.getAttribute("href");
      const query = url.split("?")[1];
      const page = url.split("?")[0].split("/")[1];

      console.log(this.idUser);
      if (!query) {
        return;
      }
      if (page === "profiles") {
        const data = await utils.methods.fetchData(
          "/getDataProfiles?" + query,
          this.idUser
        );
        store.commit("setPublicationsUsers", data.publication);
      }
      router.push(url.toLowerCase());
    },
    // Fonction Followers
    followedUser(userId, e) {
      if (!this.getToken("session")) {
        this.sayonara();
        return;
      }
      const parent = e.target.closest(".user_status");
      let followType;
      if (parent) {
        const followArea = parent.querySelector(`.follow-${userId}`);
        if (followArea.textContent != "Unfollow") {
          followArea.textContent = "Unfollow";
          followType = "follow";
        } else {
          followArea.textContent = "Follow";
          followType = "unfollow";
        }
      } else {
        const parent = e.target;
        if (parent.textContent != "Unfollow") {
          parent.textContent = "Unfollow";
          followType = "follow";
          store.commit("setIsFollowing", true);
        } else {
          parent.textContent = "Follow";
          followType = "unfollow";
          store.commit("setIsFollowing", false);
        }
      }
      // return false;
      fetch("/api/follow", {
        method: "POST",

        body: JSON.stringify({
          followedUserName: userId,
          followType: followType.trim(),
          cookie: localStorage.getItem("cookie").trim(),
        }),
      })
        .then((response) => {
          if (response.ok) {
            app.methods.broadcastPosts(); // Envoyer la notification

            response.json().then((data) => {
              // this.$store.commit("setSuggestions", data.users);
            });
          } else {
            console.error("Erreur lors de l'envoi des données");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la requête:", error);
        });
    },
    // Functions Event
    addEvent() {
      const event = document.querySelector(".dos");
      event.classList.toggle("activated");
    },
    cacher() {
      const timeleft = document.querySelector(".timeline-left");
      timeleft.style.display = "none";
      const timeright = document.querySelector(".timeline-right");
      timeright.style.display = "none";
    },
    //
    selectAllUsers() {
      const checkboxes = document.querySelectorAll(
        '.checkbox-wrapper-5 input[type="checkbox"]'
      );
      let allChecked = true;

      // Vérifier si toutes les cases sont déjà cochées
      for (const checkbox of checkboxes) {
        if (!checkbox.checked) {
          allChecked = false;
          break;
        }
      }

      // Basculer l'état de toutes les cases en fonction de la vérification précédente
      for (const checkbox of checkboxes) {
        // Inverser l'état de la case à cocher
        checkbox.checked = !allChecked;
      }
    },
    cercleSelect(e) {
      if (e.target.value == "circle") {
        const cercle = document.querySelector(".cercle");
        cercle.classList.toggle("active");
      } else {
        const cercle = document.querySelector(".cercle");
        if (cercle.classList.contains("active")) {
          cercle.classList.remove("active");
        }
      }
      if (e.target.value == "private") {
        this.selectAllUsers();
      }
    },
    validateSelector() {
      const cercle = document.querySelector(".cercle");
      if (cercle.classList.contains("active")) {
        cercle.classList.remove("active");
      }
    },
    toggleNotification() {
      // Cacher l'élément avec l'ID 'message'
      const messageElement = document.getElementById("message");
      if (messageElement) {
        messageElement.style.display = "none";
      }
      const bell = document.getElementById("notification-bell");
      if (bell.classList.contains("ring")) {
        bell.classList.remove("ring");
      }

      // Cacher tous les éléments avec la classe 'user-account-settingss'
      const userAccountSettingsElements = document.querySelectorAll(
        ".user-account-settingss"
      );
      userAccountSettingsElements.forEach((el) => {
        el.style.display = "none";
      });

      // Toggler l'élément suivant avec l'ID 'notification'
      const nextNotificationElement =
        this.$el.nextElementSibling.querySelector("#notification-box");
      if (nextNotificationElement.style.display === "none") {
        // Méthode pour charger les trois premières notifications
        // Get 3 notifications
        utils.methods.fetchData("/getNotification?page=1").then((data) => {
          console.table(data.notifications);
          store.commit("setNotifs", data.notifications);
        });
        store.commit("setShowAllNotifications", false);
      }
      if (
        nextNotificationElement &&
        nextNotificationElement.id == "notification-box"
      ) {
        nextNotificationElement.style.display =
          nextNotificationElement.style.display === "" ? "none" : "";
      }
    },
    async getGroupe(e, group) {
      e.preventDefault();
      let ok = await this.isGroupMember(group.GroupId);
      if (ok) {
        // S'il es membre
        const atr = e.target.getAttribute("data-id");
        store.commit("setIdGroupe", atr);
        const title = e.target
          .closest(".user")
          .querySelector(".username span")
          .textContent.trim();
        store.commit("setNickNameGroupe", title);
        router.push("/groups");
      } else {
        // S'il n'est pas membre
        store.commit("setIdGroupe", group.GroupId);
        store.commit("setNickNameGroupe", group.GroupTitle);
        store.commit("showJoinGroupPopup", true);
      }
    },
    isGroupMember(groupId) {
      const idUser = store.getters.localID.trim();
      return new Promise((resolve, reject) => {
        utils.methods
          .fetchData("/getmembers", groupId)
          .then((response) => {
            let member = response.members.find(
              (member) => member.UserID === idUser
            );
            if (member) {
              // user found in group members
              resolve(true);
            } else {
              // user not found in group members
              resolve(false);
            }
          })
          .catch(() => reject("Error getting members"));
      });
    },
    // Dynamiser la couverture en fonction de la photo de profile
    extractColors() {
      const img = this.$refs.profileImage;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      r = Math.floor(r / (imageData.length / 4));
      g = Math.floor(g / (imageData.length / 4));
      b = Math.floor(b / (imageData.length / 4));

      this.dominantColor = `rgb(${r}, ${g}, ${b})`;
    },
    setInfo() {
      const profile = document.querySelector(".profile");
      profile.style.height = "26dvh";
      const timelineLeft = document.querySelector(".timeline-left");
      const allPosts = document.querySelector(".all-posts");
      if (allPosts) {
        allPosts.classList.add("view");
      }
      if (timelineLeft) {
        timelineLeft.classList.add("view");
      }
      const status_actions = document.querySelector(".status.box");
      if (status_actions) {
        status_actions.classList.add("view");
      }
      const infosUser = document.querySelector(".infosUser");
      if (infosUser) {
        infosUser.classList.remove("view");
      }
    },
  },
};

export default myMixin;
