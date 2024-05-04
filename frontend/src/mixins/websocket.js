import store from "../store/index";
import app from "./appSocket";
import myMixin from "./global";
import utils from "./utils";

const webSocketGo = {
  more: false,
  messages_restant: {},
  commentTab: [],
  chatHistoryElement: document.querySelector("#chatHistory"),
  containerChatElement: document.querySelector(".container-chat"),
  computed: {
    image() {
      return store.getters.postImage;
    },
  },
  methods: {
    /**
     * Renvoie un élément HTML depuis une chaine
     * @param {string} str
     * @returns {HTMLElement}
     */
    strToDom(str) {
      return document.createRange().createContextualFragment(str);
    },
    typing(userId) {
      const messageInput = document.getElementById(`message-input-${userId}`);
      let typingTimer;

      messageInput.addEventListener("keydown", () => {
        if (
          store.getters.users_online.some((client) => client.UserID === userId)
        ) {
          clearTimeout(typingTimer);
          const sendTyping = this.debounce(
            app.methods.typing(userId, "start"),
            3000
          );
          sendTyping();
        }
      });

      messageInput.addEventListener("keyup", () => {
        if (
          store.getters.users_online.some((client) => client.UserID === userId)
        ) {
          clearTimeout(typingTimer);
          typingTimer = setTimeout(() => {
            app.methods.typing(userId, "stop");
          }, 1500);
        }
      });
    },
    typingFunction(message) {
      const messageDiv = document.getElementById(
        `message-list-${message.senderID}`
      );

      if (!messageDiv) {
        return;
      }
      const typingmsg = messageDiv.querySelector(".typing");
      if (message.value === "start") {
        afficherMessageTyping();
      }
      if (message.value === "stop") {
        cacherMessageTyping();
      }
      // Fonction pour masquer l'élément après 300 millisecondes
      function cacherMessageTyping() {
        typingmsg.style.visibility = "hidden";
      }

      // Fonction pour afficher l'élément
      function afficherMessageTyping() {
        typingmsg.style.visibility = "visible";
      }
    },
    messageReceive(message) {
      let messageId;
      let actualUser;
      // Obtenir l'heure actuelle
      if (!utils.methods.getCookieValue("session")) {
        //error("cookie not set");
        myMixin.methods.sayonara();
        return;
      }
      const firstButton = document.querySelector("#notification");

      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString();

      if (store.getters.nickName.toLowerCase() == message.sender) {
        actualUser = "vous";
        messageId = message.receiverID;
      } else {
        actualUser = message.sender;
        messageId = message.senderID;
        const messageDiv = document.getElementById(`message-list-${messageId}`);
        if (messageDiv) {
          if (messageDiv.style.display == "block") {
            const id_message = message.idMessage;
            utils.methods.notifBlink(messageId, id_message);
            utils.methods.moveUserToTop(messageId);
          } else {
            utils.methods.notification(messageId);
            firstButton.classList.add("ring");
            utils.methods.moveUserToTop(messageId);
          }
        } else {
          utils.methods.notification(messageId);
          firstButton.classList.add("ring");
          utils.methods.moveUserToTop(messageId);
          return;
        }
      }
      var id_message = message.idMessage;
      var content = utils.methods.escapeHtml(message.message);
      utils.methods.chat(
        id_message,
        content,
        formattedTime,
        actualUser,
        messageId,
        message.sender
      );
    },
    commentaireReceive(datas) {
      if (utils.methods.getCookieValue("session")) {
        if (datas.type === "comment") {
          if (
            store.getters.commentTab.some(
              (t) => t.commentID === datas.commentID
            )
          ) {
            return;
          }
          store.getters.commentTab.push(datas);
          if (datas.userName == store.getters.nickName.toLowerCase()) {
            if (datas.commentID) {
              utils.methods.addComment(datas);
              utils.methods.incrementCommentNumber(datas);
            }
          } else {
            utils.methods.addComment(datas);
            utils.methods.incrementCommentNumber(datas);
          }
        }
      } else {
        myMixin.methods.sayonara();
        //error("cookie has not been");
        return;
      }
    },
    verifyFile(r, comment) {
      if (r.name == undefined && comment !== "") {
        return "Type file not supported";
      }
      // Vérifiez si la taille du fichier est inférieure à 800KB
      if (r.size > 800 * 1024) {
        return "File too large";
      }
      // Vérifiez si le fichier est une image
      const ext = "." + r.name.split(".").pop().toLowerCase();
      const authorizedExtensions = [".jpg", ".png", ".svg", ".gif", ".jpeg"];
      if (!authorizedExtensions.includes(ext)) {
        return "Non-authorized file format. Ex: .jpg, .svg, .gif, .jpeg, .png";
      }
      return null; // Tout est valide
    },
    async imageAvatar(e, postID) {
      const element = e.target;
      const formData = new FormData(element);
      const typeFile = formData.get("postimage").type.split("/")[0];

      const attribut = element.querySelector(`#output-${postID}`).getAttribute("src");
      if (attribut && typeFile == "image") {
        const photoFile = formData.get("postimage");
        const inputFileElement = element.querySelector("#fileInput"); // Obtenez l'élément d'entrée de type fichier
        const inputFile = inputFileElement.files[0]; // Obtenez le fichier à partir de l'élément d'entrée de type fichier
        return utils.methods
          .readFileAsBase64(inputFile)
          .then((base64Content) => {
            const image = {
              name: photoFile.name,
              lastModified: photoFile.lastModified,
              lastModifiedDate: photoFile.lastModifiedDate,
              webkitRelativePath: photoFile.webkitRelativePath,
              size: photoFile.size,
              type: photoFile.type,
              content: base64Content,
            };

            const file = element.querySelector(`#output-${postID}`);
            if (file) {
              file.removeAttribute("src");
              // Réinitialisez le champ de sélection de fichier
              inputFileElement.value = ""; // Réinitialisez la valeur de l'élément d'entrée de type fichier
            }
            if (base64Content) {
              store.commit("setPostImage", image);
              return image;
            } else {
              store.commit("setPostImage", {});
              return {};
            }
          });
      }
    },
    sendcomment(event) {
      // A Modifier
      event.preventDefault();

      const postID = event.target.getAttribute("data-post-id");
      const commentInput = event.target.querySelector('[name="comment"]');
      const comment = commentInput.value.trim();

      // if (comment !== "") {
        // Envoyez le commentaire au serveur
        this.imageAvatar(event, postID).then(() => {
          const img = this.image;
          if (img.src !== undefined) { 
            const err = this.verifyFile(img, comment);
            if (err !== null) {
              const spam = event.target.querySelector(".login100-form-error");
              spam.classList.add("nosuccess");
              spam.innerHTML = err;
              return false;
            }
          }

          app.methods.sendCommentaire(postID, comment, this.image);
          // Réinitialisez le champ de commentaire
          commentInput.value = "";
          store.commit("setPostImage", {});
        });
      // }
    },
    quitter(e) {
      // quitter la conversation
      const message = e.target.closest(".container-chat");
      if (message === null || message === undefined) {
        return false;
      }
      message.style.display = "none";
      store.commit("decrementVisible");
    },
    sendMessages(event) {
      const parent = event.target.parentNode;
      const containerChatElement = parent.closest(".container-chat");
      const idUser = containerChatElement.getAttribute("id");
      const message_id_chat = idUser.split("message-list-").pop();
      this.submitMessage(message_id_chat.trim());
    },
    activateDiv(userId) {
      // activee la conversation
      const message = document.getElementById(`message-list-${userId}`);
      if (
        message === null ||
        message === undefined ||
        store.getters.visible >= 1
      ) {
        return false;
      }

      if (message.style.display === "none") {
        message.style.display = "block";
        utils.methods.openMessage(userId);
        store.commit("incrementVisible");
      } else {
        message.style.display = "none";
        store.commit("decrementVisible");
      }
      utils.methods.deleteNotif();
    },
    selectUser(userId,groupID = null) {
      // alert(userId);
      const parent = document.querySelector(".conversation");
      const ul = parent.querySelector(".messages-bubble");
      var lis = ul.querySelectorAll("li");
      lis.forEach(function (li) {
        if (li) {
          ul.removeChild(li);
        }
      });
      const container = parent.querySelector(".container-chat");

      if (container.getAttribute("id")) {
        container.removeAttribute("id");
      }
      container.setAttribute("id", `message-list-${userId}`);

      const input = container.querySelector("textarea");
      input.value = "";
      input.removeAttribute("id");
      input.setAttribute("id", `message-input-${userId}`);
      const img = container.querySelector("img");
      img.removeAttribute("src");
      const emojisList = container.querySelector(".emoji-list");
      if (emojisList.style.display !== "none") {
        emojisList.style.display = "none";
      }

      // La fonction 'some' vérifie si au moins un élément dans le tableau satisfait la condition donnée
      let message = document.querySelector(
        `#message-list-${userId} .head-discussion`
      );
      this.typing(userId); // Ecouteur de saisie
      const containerUsers = document.querySelector(".range-users");
      let userName = containerUsers.querySelector(
        `.username-${userId}`
      ).textContent;
      const containerChatElement = containerUsers
        .querySelector(`.username-${userId}`)
        .closest(".userList");

      var imgP = containerChatElement.querySelector("img");
      var srcImage = imgP.src;
      img.src = srcImage;
      userName = utils.methods.capitalize(userName);
      message.textContent = `${userName}`;
      
      this.getMessages(userId,groupID);
      this.activateDiv(userId);
    },
    check(datas) {
      try {
        if (datas.type === "check") {
          store.commit(
            "setUsersOnline",
            datas.AllInfos.filter((user) => user.Status !== "offline")
          );
          store.commit("setListUsers", datas.AllInfos);
          utils.methods.verification();
        }
      } catch (error) {
        console.error(
          "Erreur lors de la gestion du message côté client:",
          error
        );
      }
    },
    async getMessages(user_id_chat,groupID = null) {

      let url = groupID? '/get-group-messages?groupID='+groupID : "/getmessages"
      try {
        const datas = await utils.methods.fetchData(url);
        let messages = []; // Tableau de messages
        if (!datas) {
          return false;
        }

        //log("datas",datas);
        messages = datas.filter(
          (message) =>
            Boolean(groupID) ||
            message.receiverID === user_id_chat ||
            message.senderID === user_id_chat
        );
        if (!messages) {
          return;
        }
        // Ajoutez un tableau vide pour chaque utilisateur
        if (!store.getters.messages_restant[user_id_chat]) {
          // Commit avec un objet contenant user_id_chat et les messages
          store.commit("setMessages_restant", { user_id_chat, messages: [] });
        }

        if (Boolean(groupID)) {
          messages =  messages.map(msg => {
            if (msg.receiverID === groupID && msg.senderID !== store.getters.localID) {
              msg.receiverID = store.getters.localID
              msg.senderID = groupID
            }
            return msg
          })
        }
        this.history_message(messages);

        store.getters.messages_restant[user_id_chat] =
          this.getNotAddedUsers(messages);
      } catch (error) {
        // Handle or log the error as needed
        //error("Error getting message:", error);
      }
    },
    addMessageToList(id, message, formattedDate, messageId, isSender,sender) {
      const messageList = document.getElementById(`message-list-${messageId}`);
      if (messageList) {
        const conversationList = messageList.querySelector(".messages-bubble");
        const messageTemplate = `
            <li class="clearfix" id="${id}">
            <div class="message ${
              isSender ? "other-message float-right" : "my-message"
            }">
            <strong>
              ${sender}
            </strong>
            <p>${message}</p>
              <span class="message-data-time ${
                isSender ? "right" : ""
              }">${formattedDate}</span>
              </div>
              </li>
              `;
        conversationList.prepend(this.strToDom(messageTemplate));
      }
    },
    history_message(data) {
      if (data.length > 0) {
        const lastMessage = data[0];
        if (lastMessage) {
          this.updateMessageVisibility(lastMessage.idMessage, true);
        }
        for (let i = data.length - 1; i >= data.length - 10; i--) {
          const user = data[i];
          if (user) {
            const formattedDate = this.formatDateTime(user.CreatedAt);
            this.updateMessageVisibility(user.idMessage, true);

            if (store.getters.localID === user.receiverID) {
              // Si l'utilisateur actuel est le destinataire du message
              this.addMessageToList(
                `${user.idMessage}`,
                `${user.message}`,
                formattedDate,
                `${user.senderID}`,
                false,
                user.sender
              );
            } else if (user.senderID === store.getters.localID) {
              // Si l'utilisateur actuel est l'expéditeur du message
              this.addMessageToList(
                `${user.idMessage}`,
                `${user.message}`,
                formattedDate,
                `${user.receiverID}`,
                true,
                user.sender
              );
            }
          }
        }
      }
    },
    getNotAddedUsers(data) {
      if (data.length > 10) {
        return data.slice(0, data.length - 10);
      } else {
        return [];
      }
    },
    loadMoreMessages(chat_id) {
      let ok = false;
      counter = 0;
      const id = store.getters.localID;

      for (
        let i = counter;
        i < counter + 10 && i < store.getters.messages_restant[chat_id].length;
        i++
      ) {
        const index = store.getters.messages_restant[chat_id].length - i - 1;
        if (index >= 0) {
          const message = store.getters.messages_restant[chat_id][index];
          const formattedDate = this.formatDateTime(message.CreatedAt);

          if (id === message.receiverID) {
            // Si l'utilisateur actuel est le destinataire du message
            this.addMessageToList(
              `${message.idMessage}`,
              `${message.Content}`,
              formattedDate,
              `${message.senderID}`,
              false,
              message.sender
            );
          } else if (message.senderID === id) {
            // Si l'utilisateur actuel est l'expéditeur du message
            this.addMessageToList(
              `${message.idMessage}`,
              `${message.Content}`,
              formattedDate,
              `${message.receiverID}`,
              true,
              message.sender
            );
          }
          ok = true;
        }
      }

      let tmpTable = this.getNotAddedUsers(
        store.getters.messages_restant[chat_id]
      );
      if (ok) {
        counter += 10;
        store.getters.messages_restant[chat_id] = tmpTable;
      }
    },
    allMessagesLoaded(chat_id) {
      const chatMessages = store.getters.messages_restant[chat_id];

      // Vérifier si le tableau existe et a une propriété 'length'
      return chatMessages && chatMessages.length === 0;
    },
    moreMessage() {
      this.chatHistoryElement.addEventListener("scroll", () => {
        const chatID = this.containerChatElement.getAttribute("id");
        const message_id_chat = chatID.split("message-list-").pop();

        if (chatHistoryElement.scrollTop === 0) {
          this.more = true;
          this.debounce(function () {
            if (this.allMessagesLoaded(message_id_chat)) {
              return;
            }
            if (more) {
              this.loadMoreMessages(message_id_chat);
              this.more = false;
            }
          }, 300)();
        }
      });
    },
    debounce(callback, delay) {
      let timeoutId;
      return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
      };
    },
    // Websocket connection
    init() {
      store.getters.sokectStore.addEventListener(
        "open",
        this.onChecksocketOpen.bind(this)
      );
      store.getters.sokectStore.addEventListener(
        "message",
        this.checkNewMessage.bind(this)
      );
      utils.methods.getGroups();
    },

    onChecksocketOpen() {
      const cookie = localStorage.getItem("cookie");
      if (
        utils.methods.getCookieValue("session") !== undefined &&
        utils.methods.getCookieValue("session") !== null &&
        utils.methods.getCookieValue("session") !== ""
      ) {
        const data = {
          type: "check",
          connected: true,
          cookie: cookie,
        };
        try {
          store.getters.sokectStore.send(JSON.stringify(data));
        } catch (error) {
          //error("Erreur lors de l'envoi du message:", error);
        }
      } else {
        //error("Token expired");
        myMixin.methods.sayonara();
        return;
      }
    },

    checkNewMessage(event) {
      const datas = JSON.parse(event.data);

      if (utils.methods.getCookieValue("session")) {
        this.check(datas);
      } else {
        //error("cookie not found");
        myMixin.methods.sayonara();
      }
    },
    // UTILS................................
  },
};

export default webSocketGo;
