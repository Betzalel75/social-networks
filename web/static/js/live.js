import { sayonara, strToDom } from "./config.js";
import { newPost } from "./local-request.js";

import {
  capitalize, moveUserToTop, fetchData, openMessage, updateMessageVisibility, deleteNotif,
  notifBlink, notification, addComment, getAll, getSenderName, sortUsersAlphabetically, idUser,
  incrementCommentNumber, chat, escapeHtml, getCookieValue, formatDateTime, getCurrentUserInfo, verification,
} from "./utils.js";

(function () {
  // Utilisez le WebSocket pour établir une connexion avec le serveur
  const socket = new WebSocket(`ws://${location.host}/check`);
  const app = {
    ws: null,
    serverUrl: `ws://${location.host}/ws`,

    init() {
      this.connectToWebsocket();
    },

    connectToWebsocket() {
      this.ws = new WebSocket(this.serverUrl);
      this.ws.addEventListener('open', this.onWebsocketOpen.bind(this));
      this.ws.addEventListener('message', this.handleNewMessage.bind(this));
    },

    onWebsocketOpen(event) {
      console.log("Connected to WS!");
    },

    handleNewMessage(event) {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "typing":
          typingFunction(data);
          break;
        case "message":
          messageReceive(data);
          break;
        case "comment":
          commentaireReceive(data);
        case "NewPost":
          newPost(data);
          break;
        default:
          console.error('Type de données non reconnu :', data.type);
      }
    },

    submitMessage(userId) {
      const id = idUser();
      const messageInput = document.getElementById(`message-input-${userId}`);
      const content = escapeHtml(messageInput.value);
      if (userId) {
        if (users_online.some((client) => client.UserID === userId)) {
          if (content !== "") {
            let cookie = getCookieValue("session");
            const data = {
              type: "message",
              cookie: cookie,
              sender: getSenderName(),
              senderID: id,
              receiverID: userId,
              Content: content,
              submit: "Send message",
            };
            if (cookie) {
              this.ws.send(JSON.stringify(data)); // Envoyer l'objet de données au format JSON
              messageInput.value = "";
            } else {
              sayonara();
            }
          }
        } else {
          return false;
        }
      } else {
        console.log("Aucun utilisateur sélectionné.");
      }

    },
    sendCommentaire(postID, comment) {
      const user = getCurrentUserInfo();
      const data = {
        type: "comment",
        postID: postID,
        senderID: idUser(),
        userName: user.username,
        photoSrc: user.photoSrc,
        comment: comment,
        submit: "Add comment",
        LikeNbr: 0,
        DislikeNbr: 0,
      };
      let cookie = getCookieValue("session");
      if (cookie) {
        this.ws.send(JSON.stringify(data));
      } else {
        sayonara();
      }
    },
    typing(idt, value) {
      const data = {
        type: "typing",
        value: value,
        sender: getSenderName(),
        receiverID: idt,
        senderID: idUser(),
      };
      const cookie = getCookieValue("session");
      if (cookie) {
        this.ws.send(JSON.stringify(data));
      } else {
        sayonara();
      }
    },
    brodcastPosts() {
      var cookie = getCookieValue("session");
      const data = {
        type: "NewPost",
        connected: true,
        cookie: cookie,
        name: getSenderName(),
        senderID: idUser(),
      };
      try {
        this.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      }
    },
  };

  app.init();

  function typing(userId) {
    const messageInput = document.getElementById(`message-input-${userId}`);
    let typingTimer;
  
    messageInput.addEventListener("keydown", () => {
      if (users_online.some((client) => client.UserID === userId)) {
        clearTimeout(typingTimer);
        const sendTyping = debounce(
          app.typing(userId, "start"),
          3000
        );
        sendTyping();
      }
    });
  
    messageInput.addEventListener("keyup", () => {
      if (users_online.some((client) => client.UserID === userId)) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          app.typing(userId, "stop");
        }, 1500);
      }
    });
  }

  function nouveauPost() {
    app.brodcastPosts();
  }
  document.addEventListener("new-post", nouveauPost);

  

  function typingFunction(message) {
    const messageDiv = document.getElementById(`message-list-${message.senderID}`);

    if (!messageDiv) {
      return
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

  }

  function messageReceive(message) {
    let messageId;
    let actualUser;
    // Obtenir l'heure actuelle
    let cookie = getCookieValue("session");
    if (!cookie) {
      sayonara();
    }
    const firstButton = document.querySelector("#notification");

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();

    if (getSenderName() == message.sender) {
      actualUser = "vous";
      messageId = message.receiverID;
    } else {
      actualUser = message.sender;
      messageId = message.senderID;
      const messageDiv = document.getElementById(
        `message-list-${messageId}`
      );
      if (messageDiv) {
        if (messageDiv.style.display == "block") {
          const id_message = message.idMessage;
          notifBlink(messageId, id_message);
          moveUserToTop(messageId);
        } else {
          notification(messageId);
          firstButton.classList.add("ring");
          moveUserToTop(messageId);
        }
      } else {
        notification(messageId);
        firstButton.classList.add("ring");
        moveUserToTop(messageId);
        return;
      }
    }
    var id_message = message.idMessage;
    var content = escapeHtml(message.Content);
    chat(id_message, content, formattedTime, actualUser, messageId);
  }

  function commentaireReceive(datas) {
    let cookie = getCookieValue("session");
    if (cookie) {
      if (datas.type === "comment") {
        if (commentTab.some((t) => t.commentID === datas.commentID)) {
          return;
        }
        commentTab.push(datas);
        if (datas.userName == getSenderName()) {
          if (datas.commentID) {
            addComment(datas);
            incrementCommentNumber(datas);
          }
        } else {
          addComment(datas);
          incrementCommentNumber(datas);
        }
      }
    } else {
      sayonara();
    }
  }

  // check
  socket.addEventListener("open", function () {
    let cookie = getCookieValue("session");
    if (cookie !== undefined) {
      const data = {
        type: "check",
        connected: true,
        cookie: cookie,
      };
      try {
        socket.send(JSON.stringify(data));
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  });


  let commentTab = [];


  // Attachez un gestionnaire d'événements au soumission du formulaire
  function sendcomment(params) {
    // Supprimer d'abord tout gestionnaire d'événements existant pour éviter les duplications
    params.parentNode.parentNode.parentNode.removeEventListener(
      "submit",
      submitComment
    );

    // Ajouter le gestionnaire d'événements
    params.parentNode.parentNode.parentNode.addEventListener(
      "submit",
      submitComment
    );
  }

  function submitComment(event) {
    event.preventDefault();
    const postID = this.getAttribute("data-post-id");
    const commentInput = this.querySelector('[name="comment"]');
    const comment = commentInput.value.trim();

    if (comment !== "") {
      // Envoyez le commentaire au serveur
      app.sendCommentaire(postID, comment);
      // Réinitialisez le champ de commentaire
      commentInput.value = "";
    }
  }

  window.sendcomment = sendcomment;

  let visible = 0;
  function activateDiv(userId) {
    // activee la conversation
    const message = document.getElementById(`message-list-${userId}`);
    if (message === null || message === undefined || visible >= 1) {
      return false;
    }

    if (message.style.display === "none") {
      message.style.display = "block";
      openMessage(userId);
      visible++;
    } else {
      message.style.display = "none";
      visible--;
    }
    deleteNotif();
  }

  const quitter = () => {
    // quitter la conversation
    const message = document.querySelector(".container-chat");
    if (message === null || message === undefined) {
      return false;
    }
    message.style.display = "none";
    visible--;
  };

  window.quitter = quitter;

  // Fonction pour envoyer un message privé au serveur
  function sendMessages(userId) {
    app.submitMessage(userId);
  }

  window.sendMessages = sendMessages;

  /*----------------------------------------------------------------/
 === Selection d'un utilateur dans la liste des users en ligne ===
/-----------------------------------------------------------------*/

  // Tableau des users en lignes envoyer par le websocket
  let users_online = [];

  function selectUser(userId) {
    // Sélectionnez tous les éléments de la classe "user"

    const ul = document.querySelector(".messages-bubble");
    var lis = ul.querySelectorAll("li");
    lis.forEach(function (li) {
      if (li) {
        ul.removeChild(li);
      }
    });
    var container = document.querySelector(".container-chat");
    if (container.getAttribute("id")) {
      container.removeAttribute("id");
    }
    container.setAttribute("id", `message-list-${userId}`);
    var btn = container.querySelector(".input-group-text");
    if (btn.getAttribute("onclick")) {
      btn.removeAttribute("onclick");
    }
    btn.setAttribute("onclick", `sendMessages('${userId}')`);
    var input = container.querySelector("textarea");
    input.value = "";
    input.removeAttribute("id");
    input.setAttribute("id", `message-input-${userId}`);
    var img = container.querySelector("img");
    img.removeAttribute("src");
    var emojisList = container.querySelector(".emoji-list");
    if (emojisList.style.display !== "none") {
      emojisList.style.display = "none";
    }

    // La fonction 'some' vérifie si au moins un élément dans le tableau satisfait la condition donnée
    let message = document.querySelector(
      `#message-list-${userId} .head-discussion`
    );
    typing(userId); // Ecouteur de saisie
    // var currentName = message.textContent;
    let userName = document.querySelector(`.username-${userId}`).textContent;
    const containerChatElement = document
      .querySelector(`.username-${userId}`)
      .closest(".userList");
    var imgP = containerChatElement.querySelector("img");
    var srcImage = imgP.src;
    img.src = srcImage;
    userName = capitalize(userName);
    message.textContent = `${userName}`;
    getMessages(userId);
    activateDiv(userId);
  }

  window.selectUser = selectUser;



  /*----------------------------------------------------------------/
================= verification du status du client ================
/----------------------------------------------------------------*/

  socket.addEventListener("message", function (event) {
    const datas = JSON.parse(event.data);
    const id = idUser();
    let cookie = getCookieValue("session");
    if (cookie) {
      check(datas);
      let chatDiv = document.querySelectorAll(".userList[data-user-id]");
      chatDiv.forEach((element) => {
        var chatID = element.getAttribute("data-user-id");
        if (id == chatID) {
          element.parentNode.removeChild(element);
        }
      });
    } else {
      sayonara();
    }
  });


  function check(datas) {
    try {
      if (datas.type === "check") {
        users_online = datas.AllInfos.filter(
          (user) => user.Status !== "offline"
        );
        updateStatus(datas);
        getAll();
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du message côté client:", error);
    }
  }

  if (getSenderName() == null || getSenderName() !== "") {
    socket.addEventListener("close", function (event) {
      console.log("La connexion WebSocket de check est fermée:", event);
    });
  }

  socket.addEventListener("error", (event) => {
    console.error("Erreur WebSocket :", event);
  });

  /*----------------------------------------------------------------/ 
 === Fonction pour mettre a jour le statut des utilisateurs ====
/----------------------------------------------------------------*/

  function updateStatus(datas) {
    var users = datas.AllInfos;
    for (const user of users) {

      let userId = document.querySelector(`.username-${user.UserID}`);
      if (
        user.UserID === undefined ||
        user.UserID === null ||
        user.UserID === idUser()
      ) {
        continue; // ignorer l'utilisateur
      }

      if (userId) {
        let parentDiv = document.querySelector(
          `.user[data-user-id='${user.UserID}']`
        );
        let user_conversation = document.querySelector(
          `#message-list-${user.UserID}`
        );
        if (user_conversation) {
          var photo_profile = user_conversation.querySelector("img");
          photo_profile.src = `/web/static/media/${user.Photo}`;
        }

        var image = parentDiv.querySelector("img");

        image.src = `/web/static/media/${user.Photo}`;
        let statusElement = userId.querySelector(".user-status");

        // Supprimer l'ancien élément de statut s'il existe
        if (statusElement) {
          userId.removeChild(statusElement);
        }

        // Créer et ajouter le nouvel élément de statut
        statusElement = document.createElement("div");
        statusElement.className = "user-status " + user.Status;
        userId.appendChild(statusElement);
      } else {

        if (users_online.some((client) => client.UserID !== user.UserID)) {
          users_online.push(user);
        }
        var event = new Event("NewUser");
        document.dispatchEvent(event);
      }
    }
    setTimeout(() => {
      sortUsersAlphabetically();
    }, 1000);
    verification();
  }

  /*----------------------------------------------------------------/
 ==== FONCTION POUR CHARGER L'HISTORUQUE DES CONVERSATIONS =====
/----------------------------------------------------------------*/

  let counter = 0;

  let messages_restant = {};

  async function getMessages(user_id_chat) {
    try {
      const datas = await fetchData("/api-messages", {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      let messages = []; // Tableau de messages
      if (!datas) {
        return false;
      }
      counter = 0;
      messages = datas.filter(
        (message) =>
          message.receiverID === user_id_chat ||
          message.senderID === user_id_chat
      );
      if (!messages) {
        return;
      }
      // Ajoutez un tableau vide pour chaque utilisateur
      if (!messages_restant[user_id_chat]) {
        messages_restant[user_id_chat] = [];
      }

      history_message(messages);

      messages_restant[user_id_chat] = getNotAddedUsers(messages);
    } catch (error) {
      // Handle or log the error as needed
      console.error("Error getting message:", error);
    }
  }

  let counts = 0;
  function addMessageToList(id, message, formattedDate, messageId, isSender) {
    const messageList = document.getElementById(`message-list-${messageId}`);
    if (messageList) {
      counts -= 1;
      const conversationList = messageList.querySelector(".messages-bubble");
      const messageTemplate = `
    <li class="clearfix" id="${id}">
      <div class="message ${isSender ? "other-message float-right" : "my-message"
        }">
      <p>${message}</p>
      <span class="message-data-time ${isSender ? "right" : ""
        }">${formattedDate}</span>
      </div>
      </li>
      `;
      conversationList.prepend(strToDom(messageTemplate));
    }
  }

  /*--------------------------------------------------------/
  = Fonction pour envoyer les messages à son interlocuteur =
/--------------------------------------------------------*/

  function history_message(data) {
    const id = idUser();

    if (data.length > 0) {
      const lastMessage = data[0];
      if (lastMessage) {
        updateMessageVisibility(lastMessage.idMessage, true);
      }
      for (let i = data.length - 1; i >= data.length - 10; i--) {
        const user = data[i];
        if (user) {
          const formattedDate = formatDateTime(user.CreatedAt);
          updateMessageVisibility(user.idMessage, true);

          if (id === user.receiverID) {
            // Si l'utilisateur actuel est le destinataire du message
            addMessageToList(
              `${user.idMessage}`,
              `${user.Content}`,
              formattedDate,
              `${user.senderID}`,
              false
            );
          } else if (user.senderID === id) {
            // Si l'utilisateur actuel est l'expéditeur du message
            addMessageToList(
              `${user.idMessage}`,
              `${user.Content}`,
              formattedDate,
              `${user.receiverID}`,
              true
            );
          }
        }
      }
    }
  }

  function getNotAddedUsers(data) {
    if (data.length > 10) {
      return data.slice(0, data.length - 10);
    } else {
      return [];
    }
  }

  /*--------------------------------------------------------/
 ======== Fonction pour charger les messages par dix =====
/--------------------------------------------------------*/

  function loadMoreMessages(chat_id) {
    let ok = false;
    counter = 0;
    const id = idUser();

    for (
      let i = counter;
      i < counter + 10 && i < messages_restant[chat_id].length;
      i++
    ) {
      const index = messages_restant[chat_id].length - i - 1;
      if (index >= 0) {
        const message = messages_restant[chat_id][index];
        const formattedDate = formatDateTime(message.CreatedAt);

        if (id === message.receiverID) {
          // Si l'utilisateur actuel est le destinataire du message
          addMessageToList(
            `${message.idMessage}`,
            `${message.Content}`,
            formattedDate,
            `${message.senderID}`,
            false
          );
        } else if (message.senderID === id) {
          // Si l'utilisateur actuel est l'expéditeur du message
          addMessageToList(
            `${message.idMessage}`,
            `${message.Content}`,
            formattedDate,
            `${message.receiverID}`,
            true
          );
        }
        ok = true;
      }
    }

    let tmpTable = getNotAddedUsers(messages_restant[chat_id]);
    if (ok) {
      counter += 10;
      messages_restant[chat_id] = tmpTable;
    }
  }

  function allMessagesLoaded(chat_id) {
    const chatMessages = messages_restant[chat_id];

    // Vérifier si le tableau existe et a une propriété 'length'
    return chatMessages && chatMessages.length === 0;
  }

  const chatHistoryElement = document.querySelector("#chatHistory");
  // chatHistoryElement.scrollTo(0, chatHistoryElement.clientHeight)
  const containerChatElement = document.querySelector(".container-chat");
  let more = false;

  if (chatHistoryElement) {
    chatHistoryElement.addEventListener("scroll", () => {
      const chatID = containerChatElement.getAttribute("id");
      const message_id_chat = chatID.split("message-list-").pop();

      if (chatHistoryElement.scrollTop === 0) {
        more = true;
        debounce(function () {
          if (allMessagesLoaded(message_id_chat)) {
            return;
          }
          if (more) {
            loadMoreMessages(message_id_chat);
            more = false;
          }
        }, 300)();
      }
    });
  }

  function debounce(callback, delay) {
    let timeoutId;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }
 
})();
