import router from "@/router";
import store from "../store/index";
// import app from './appSocket';
import webSocketGo from "./websocket";

const utils = {
  methods: {
    capitalize(str) {
      // Divise la chaîne en mots
      str = str.split(" ");
      // Applique la capitalisation à chaque mot et rejoint le résultat
      return str
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
        .join(" ");
    },
    getSenderName() {
      const senderNameElements = document.querySelectorAll(".profile-name");
      const senderNameElement = senderNameElements[0];
      return senderNameElement ? senderNameElement.textContent.trim() : "";
    },
    incrementCommentNumber(datas) {
      const comment_count = document.querySelector(
        `.album.box.publicPublications .commentCount[data-post-id="${datas.postID}"]`
      );
      var value = parseInt(comment_count ? comment_count.textContent : "0");
      if (comment_count) {
        comment_count.textContent = `${value + 1}`;
      }
      const comment_count_private = document.querySelector(
        `.album.box.userPublications .commentCount[data-post-id="${datas.postID}"]`
      );
      if (comment_count_private) {
        comment_count_private.textContent = `${value + 1}`;
      }
    },
    async verification() {
      const data = await this.fetchData("/getmessages");
      if (!data) {
        return false;
      }
      this.range_chat(data, store.getters.localID);
      if (data.length > 0) {
        for (let i = data.length - 1; i >= data.length - 10; i--) {
          const user = data[i];
          if (user) {
            if (store.getters.localID === user.receiverID) {
              if (!user.Vu.Valid) {
                this.changeMessageState(user.senderID);
              }
            }
          }
        }
      }
    },
    chat(id_message, message, formattedTime, actualUser, messageId, sender) {
      if (actualUser == "vous") {
        this.new_message_send(message, formattedTime, messageId, sender);
      } else {
        this.new_message_receive(
          id_message,
          message,
          formattedTime,
          messageId,
          sender
        );
      }
      if (actualUser == "vous") {
        const chatHistoryElement = document.querySelector("#chatHistory");
        chatHistoryElement.scrollTo(0, chatHistoryElement.clientHeight);
      }
    },
    escapeHtml(unsafe) {
      // Echapper les carracteres
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    unescapeHtml(html) {
      //  décoder les entités HTML
      const textarea = document.createElement("textarea");
      textarea.innerHTML = html;
      return textarea.value;
    },
    new_message_send(message, formattedDate, messageId, sender) {
      const messageList = document.getElementById(`message-list-${messageId}`);
      const conversationList = messageList.querySelector(".messages-bubble");
      const message_to_send = `
            <li class="clearfix">
                <div class="message other-message float-right">
                  <strong>
                    ${sender}
                  </strong>
                  <p>${message}</p>
                  <span class="message-data-time right">${formattedDate}</span>
              </div>
            </li>
            `;
      conversationList.appendChild(
        webSocketGo.methods.strToDom(message_to_send)
      );
      // conversationDiv.appendChild(conversationList);
      this.moveUserToTop(messageId);
    },
    new_message_receive(id_message, message, formattedDate, messageId, sender) {
      const messageList = document.getElementById(`message-list-${messageId}`);
      const conversationList = messageList.querySelector(".messages-bubble");
      const message_to_receive = `
            <li class="clearfix" id=${id_message}>
              <div class="message my-message">
              <strong>
                ${sender}
              </strong>
              <p>${message}</p>
              <span class="message-data-time">${formattedDate}</span>
              </div>
            </li>
            `;
      conversationList.appendChild(
        webSocketGo.methods.strToDom(message_to_receive)
      );
      // conversationDiv.appendChild(conversationList);
    },
    formatDateTime(dateTimeString) {
      const options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };

      const formattedDate = new Date(dateTimeString).toLocaleDateString(
        "fr-FR",
        options
      );
      return formattedDate;
    },
    getCurrentUserInfo() {
      // Obtient l'élément div avec la classe 'profile-avatar' et l'attribut 'id-data' égal à 'userDiv'
      var profileDiv = document.querySelector(
        '.profile-avatar[id-data="userDiv"]'
      );
      if (profileDiv) {
        // Obtient l'élément img à l'intérieur de profileDiv
        var profileImg = profileDiv.querySelector(".profile-img");

        // Obtient l'élément div avec la classe 'profile-name' à l'intérieur de profileDiv
        var profileNameDiv = profileDiv.querySelector(".profile-name");

        // Récupère la valeur de l'attribut 'src' de l'élément img (contenant /web/static/media/{{.PostsProfile.Photo}})
        var photoSrc = profileImg.getAttribute("src");

        // Récupère le contenu de l'élément div avec la classe 'profile-name' (contenant {{.PostsProfile.Name}})
        var profileName = profileNameDiv.textContent.trim();

        return {
          username: profileName,
          photoSrc: photoSrc,
        };
      } else {
        return {
          username: "profileName",
          photoSrc: "photoSrc",
        };
      }
    },
    addComment(data) {
      // Convertit la chaîne JSON en objet JavaScript
      //src
      var content = this.escapeHtml(data.comment);
      //table(data);
      const comment = `
              <div class="status-main listCommentaire" style="padding-top: 20px; background-color: #272a3a;">
                        <img src="http://localhost:8080/images/${data.photoSrc}" class="status-img"
                            style="width: 40px; height: 40px;" />
                        <div class="album-detail">
                            <div class="album-title"><strong>${data.userName}</strong> comment
                                <span>Post</span>
                            </div>
                         <div class="album-date"></div>
                         </div>
                         <div class="album-photos">
          <img src=http://localhost:8080/images/${data.srcImage} alt="" class="album-photo" />
        </div>
                     <p style="width: 100%; word-break: break-word; color: white;">${content}</p>
                     <div class="contenu-a-recharger">
                         <a href="#" class="album-action" data-action="like"
                             onclick="sendFeedback('${data.commentID}', 'like', 'comment_id')"
                            data-post-id="${data.commentID}">
                            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
                                stroke-width="2" fill="none" stroke-linecap="round"
                                stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24"
                                fill="white" class="css-i6dzq1">
                                <path
                                  d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
                              </path>
                          </svg>
                          <span class="likeCount"
                              data-post-id="${data.commentID}">${data.LikeNbr}</span>
                      </a>
                    <a href="#" class="dislikeButton album-action" data-action="dislike"
                        onclick="sendFeedback('${data.commentID}', 'dislike', 'comment_id')"
                        data-post-id="${data.commentID}">
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
                            stroke-width="2" fill="none" stroke-linecap="round"
                            stroke-linejoin="round" viewBox="0 0 24 24">
                         <path
                             d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
                         </path>
                     </svg>
                     <span class="dislikeCount"
                         data-post-id="${data.commentID}">${data.DislikeNbr}</span>
                  </a>
                  </div>
                  </div>
              `;
      const commentHtml = webSocketGo.methods.strToDom(comment);
      const sectionComment = document.querySelector(
        `.status.box[id="${data.postID}"]`
      );
      if (sectionComment) {
        const itemsectionComment =
          sectionComment.querySelector(".alls-comments");
        itemsectionComment.insertBefore(
          commentHtml,
          itemsectionComment.firstChild
        );
      }
    },
    range_chat(data, user_id) {
      if (data.length > 0) {
        const self = this;
        for (const chat of data) {
          if (user_id === chat.receiverID || user_id === chat.senderID) {
            const chatDiv = document.querySelectorAll(".userList");
            chatDiv.forEach((element) => {
              const chatID = element.getAttribute("data-user-id");
              if (chat.receiverID === chatID || chat.senderID === chatID) {
                self.moveUserToTop(chatID);
              }
            });
          }
        }
      }
    },
    sortUsersAlphabetically() {
      const userElements = document.querySelectorAll(".userList");
      const users = Array.from(userElements);

      users.sort((a, b) => {
        const nameA = a.querySelector(`.username-${a.dataset.userId}`);
        const nameB = b.querySelector(`.username-${b.dataset.userId}`);

        if (nameA && nameB) {
          return nameA.innerText.localeCompare(nameB.innerText);
        }

        return 0;
      });

      const userContainer = document.querySelector(".side-wrapper.contacts");
      const rangeList = userContainer.querySelector(".range-users");
      rangeList.innerHTML = "";
      users.forEach((user) => {
        rangeList.appendChild(user);
      });
    },
    notification(senderId) {
      const user = document.querySelector(`.user[data-user-id='${senderId}']`);
      user.style.backgroundColor = "darkslategray";
      this.notifSong();
    },
    notifBlink(userId, id_message) {
      const user = document.querySelector(`.user[data-user-id='${userId}']`);
      this.openMessage(`${userId}`);
      user.classList.add("blinks");
      this.notifSong();
      setTimeout(() => {
        user.classList.remove("blinks");
      }, 3000);
      this.updateMessageVisibility(id_message, true);
    },
    notifSong() {
      var sonnerie = document.createElement("audio");
      sonnerie.src = "/src/assets/music/livechat-129007.mp3";
      sonnerie.addEventListener("loadeddata", function () {
        sonnerie.play();
      });
    },
    moveUserToTop(senderId) {
      const userContainer = document.querySelector(".range-users");
      const user = userContainer.querySelector(
        `.user[data-user-id="${senderId}"]`
      );
      userContainer.prepend(user);
    },
    async fetchData(url, param) {
      try {
        const vals = {
          cookie: this.getCookieValue("session"),
          identifiant: param,
        };
        const options = {
          method: "POST",
          body: JSON.stringify(vals),
        };
        const response = await fetch("/api" + url, options);

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
      } catch (error) {
        //error("Error fetching data:", error);
        router.push("/errors");
        throw error; // Rejeter l'erreur pour laisser le gestionnaire l'attraper
      }
    },
    openMessage(userId) {
      // Sélectionner l'utilisateur par son ID
      const user = document.querySelector(`.user[data-user-id='${userId}']`);

      // Vérifier si l'utilisateur a été trouvé
      if (!user) {
        //error(`L'utilisateur n'a pas été trouvé.`);
        return;
      }
      user.style.backgroundColor = "";
    },
    changeMessageState(userId) {
      const firstButton = document.querySelector("#notification");

      const user = document.querySelector(`.user[data-user-id='${userId}']`);
      user.style.backgroundColor = "darkslategray";
      firstButton.classList.add("ring");
    },
    updateMessageVisibility(id_message, newVisibility) {
      // Endpoint de votre serveur où la requête POST sera envoyée
      const endpoint = "/api/updateMessageVisibility";

      // Objet contenant les données à envoyer
      var data = {
        messageID: id_message,
        newVisibility: newVisibility,
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
    deleteNotif() {
      let users = document.querySelectorAll(".user[data-user-id]");
      const firstButton = document.querySelector("#notification");

      if (users.length > 0) {
        const allMessagesOpened = Array.from(users).every((user) => {
          return user.style.backgroundColor !== "darkslategray";
        });

        if (allMessagesOpened) {
          // Tous les messages sont ouverts, supprime le voyant de notification
          users.forEach((_) => {
            firstButton.classList.remove("ring");
          });
        }
      }
    },
    getCookieValue(cookieName) {
      const cookieArray = document.cookie.split("; ");
      const value = cookieArray
        .find((c) => c.startsWith(cookieName))
        ?.split("=")[1];
      return value !== undefined ? value : undefined;
    },
    async getAll() {
      try {
        const datas = await this.fetchData("/getmessages");
        if (!datas) {
          //error("Fetching messages");
          return;
        }
        this.range_chat(datas, store.getters.localID);
      } catch (error) {
        // Handle or log the error as needed
        //error("Error getting message:", error);
      }
    },
    // Convert the file
    readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(",")[1]; // Ignorer le préfixe "data:image/png;base64,""
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        if (file) {
          reader.readAsDataURL(file);
        }
      });
    },
    // Preview
    loadFile(event) {
      var output = document.getElementById("output");
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // libère l'objet URL
      };
    },
    loadInput(event, postID) {
      var output = document.getElementById(`output-${postID}`);
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // libère l'objet URL
      };
    },
    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    // Gest Groupe List
    getGroups() {
      utils.methods.fetchData("/getgroups").then((response) => {
        store.commit("setGroup", response);
      });
    },
  },
};

export default utils;
