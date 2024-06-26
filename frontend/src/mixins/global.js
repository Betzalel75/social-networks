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
    iFollow() {
      return store.getters.isFollowing;
    },
    lock() {
      return this.$store.getters.lock;
    },
    idGroupe() {
      return store.getters.idGroupe;
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
            // //table('table-like: ',data);
          })
          .catch((error) => {
            // Objet Erreur
            const Erreur = {
              status: error.status,
              message: error.message,
            };

            store.commit("setError", Erreur);
            router.push("/errors");
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
          //error("Erreur:", error);
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
      const vr = document.querySelector(".verouiller");
      const headerchat = event.target;
      const container = headerchat.closest(".container-chat");
      if (container) {
        const idUser = container
          .getAttribute("id")
          .split("message-list-")
          .pop()
          .trim();
        const name = container
          .querySelector(".head-discussion")
          .textContent.trim();
        newFunction(name, idUser).then(() => {
          if (this.iFollow || !this.lock) {
            router.push("/profiles?name=all");
          } else {
            if (vr && vr.classList.contains("view")) {
              vr.classList.remove("view");
            }
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
            } else {
              if (vr && vr.classList.contains("view")) {
                vr.classList.remove("view");
              }
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
            } else {
              if (vr && vr.classList.contains("view")) {
                vr.classList.remove("view");
              }
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
        } else {
          if (vr && vr.classList.contains("view")) {
            vr.classList.remove("view");
          }
        }
      }

      async function newFunction(name, idUser) {
        const user = store.getters.listUsers.find(function (user) {
          return idUser === user.UserID && user.Name === name.toLowerCase();
        });
        const data = await utils.methods.fetchData("/getDataProfiles", idUser);
        if (!data.publication) {
          store.commit("setLock", true);
        }
        store.commit("setPublicationsUsers", data.publication);
        const datas = await utils.methods.fetchData(
          "/getFollowersInvite",
          idUser
        );
        // Verification de l'accessibilite du profile
        if (datas.isFollow || datas.status == "public") {
          const photo = user ? user.Photo : "defautl.jpg";
          store.commit("setAvatarInvite", photo);
          if (name) {
            store.commit("setNickNameProfil", utils.methods.capitalize(name));
          }
          store.commit("setIdUser", idUser);
          store.commit("setNumberFollowers", datas.nombre);
          store.commit("setIsFollowing", datas.isFollow);
        }
        if (!datas.isFollow && datas.status !== "public") {
          store.commit("setLock", true);
        } else {
          store.commit("setLock", false);
        }
      }
    },
    async queryCategories(e) {
      e.preventDefault();
      const url = e.target.getAttribute("href");
      const query = url.split("?")[1];
      const page = url.split("?")[0].split("/")[1];
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
    queryCatgs(e) {
      e.preventDefault();
      const url = e.target.getAttribute("href");
      const query = url.split("?")[1];
      const page = url.split("?")[0].split("/")[1];

      if (!query) {
        return;
      }
      if (page === "groups") {
        utils.methods
          .fetchData("/groups?" + query, this.idGroupe)
          .then((data) => {
            this.datas = data.publication;
          });
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
          followType = "follow";
          followArea.remove();
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

            response.json().then(() => {
              // this.$store.commit("setSuggestions", data.users);
              if ((followType = "follow")) {
                app.methods.privateNotif(userId);
              }
            });
          } else {
            //error("Erreur lors de l'envoi des données");
          }
        })
        .catch((error) => {
          //error("Erreur lors de la requête:", error);
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
          for (const not of data.notifications) {
            if (!not.vu.Bool) {
              const bell = document.getElementById("notification-bell");
              bell.classList.add("ring");
            }
          }
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
    // verification de la presence de notifications
    validNotifications() {
      utils.methods.fetchData("/getNotification?page=0").then((data) => {
        let found = false;
        for (const not of data.notifications) {
          if (!not.vu.Bool) {
            found = true;
          }
        }
        if (found) {
          const bell = document.getElementById("notification-bell");
          if (bell) {
            bell.classList.add("ring");
          }
        }
      });
    },
  },
};

export default myMixin;
