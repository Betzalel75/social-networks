import store from "../store/index";
import webSocketGo from "./websocket";
import utils from "./utils";
import myMixin from "./global";
import { computed } from "vue";

const app = {
  // data() {
  //     return {
  // ws: store.getters.ws,
  //     }
  // },
  computed: {
    rooms() {
      return store.getters.listGroups;
    },
  },

  methods: {
    findRoom(roomName) {
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].name === roomName) {
          return this.rooms[i];
        }
      }
    },
    sendRoomMessage(event) {
      const parent = event.target.parentNode
      const containerChatElement = parent.closest(".container-chat");
      const idUser = containerChatElement.getAttribute("id");
      const message_id_chat = idUser.split("message-list-").pop();
      this.sendMessageRoom(message_id_chat.trim());
    },
    sendMessageRoom(userId) {
      // send message to correct room.
      const messageInput = document.getElementById(`message-input-${userId}`);
      const content = utils.methods.escapeHtml(messageInput.value);
      if (content !== "") {
        const data = {
          type: "messageRoom",
          action: "send-message",
          message: content,
          target: store.getters.nickNameGroupe,
          cookie: this.getToken("session"),
          sender: store.getters.nickName.toLowerCase(),
          senderID: store.getters.localID,
          receiverID: userId, // id of room
          submit: "Send message",
        };
        store.dispatch("sendMessage", data);
        room.newMessage = "";
      }
    },
    getToken(cookieName) {
      const cookie = localStorage.getItem("cookie");
      const session = utils.methods.getCookieValue(`${cookieName}`);
      if (!cookie || !session) {
        return false;
      }
      return cookie;
    },
    init() {
      this.connectToWebsocket();
    },

    connectToWebsocket() {
      store.getters.ws.addEventListener(
        "open",
        this.onWebsocketOpen.bind(this)
      );
      store.getters.ws.addEventListener(
        "message",
        this.handleNewMessage.bind(this)
      );
    },

    onWebsocketOpen(event) {
      // console.log("Connected to WS!", event);
    },

    handleNewMessage(event) {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "typing":
          webSocketGo.methods.typingFunction(data);
          break;
        case "message":
          webSocketGo.methods.messageReceive(data);
          break;
        case "comment":
          webSocketGo.methods.commentaireReceive(data);
        case "NewPost":
          this.newPost(data);
          break;
        case "Broadcast":
          this.newPost(data);
          break;
        case "Private":
          this.newPost(data);
          break;
        case "joinGroup":
          this.newPost(data);
          break;
        case "messageRoom":
          webSocketGo.methods.messageReceive(data);
          break;
        case "NewGroup":
          this.newGroup(data);
          break;
        default:
          console.error("Type de données non reconnu :", data.type);
      }
    },

    submitMessage(userId) {
      const messageInput = document.getElementById(`message-input-${userId}`);
      const content = utils.methods.escapeHtml(messageInput.value);
      if (userId) {
        if (
          store.getters.users_online.some((client) => client.UserID === userId)
        ) {
          if (content !== "") {
            const data = {
              type: "message",
              cookie: this.getToken("session"),
              sender: store.getters.nickName.toLowerCase(),
              senderID: store.getters.localID,
              receiverID: userId,
              Content: content,
              submit: "Send message",
            };
            if (this.getToken("session")) {
              store.dispatch("sendMessage", data);
              messageInput.value = "";
            } else {
              console.log("cookie not found");
              myMixin.methods.sayonara();
            }
          }
        } else {
          return false;
        }
      } else {
        console.log("Aucun utilisateur sélectionné.");
      }
    },
    sendCommentaire(postID, comment, image) {
      let ext = "";
      if (image.src !== undefined) { 
        ext = "." + image.name.split(".").pop().toLowerCase();
      }

      const data = {
        type: "comment",
        postID: postID,
        senderID: store.getters.localID,
        userName: store.getters.nickName.toLowerCase(),
        image: image,
        photoSrc: store.getters.avatar,
        srcImage: "comment-"+postID+ext,
        comment: comment,
        submit: "Add comment",
        LikeNbr: 0,
        DislikeNbr: 0,
      };

      if (this.getToken("session")) {
        store.dispatch("sendMessage", data);
      } else {
        console.log("cookie not found");
        myMixin.methods.sayonara();
      }
    },
    typing(idt, value) {
      const data = {
        type: "typing",
        value: value,
        sender: store.getters.nickName.toLowerCase(),
        receiverID: idt,
        senderID: store.getters.localID,
      };

      if (this.getToken("session")) {
        store.dispatch("sendMessage", data);
      } else {
        myMixin.methods.sayonara();
      }
    },
    broadcastPosts() {
      const data = {
        type: "NewPost",
        connected: true,
        cookie: this.getToken("session"),
        name: store.getters.nickName.toLowerCase(),
        senderID: store.getters.localID,
      };
      try {
        store.dispatch("sendMessage", data);
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      }
    },
    privateNotif(receivers) {
      const data = {
        type: "Private",
        connected: true,
        cookie: this.getToken("session"),
        name: store.getters.nickName.toLowerCase(),
        senderID: store.getters.localID,
        receivers: receivers,
      };
      try {
        store.dispatch("sendMessage", data);
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      }
    },
    broadcastGroup(groupID) {
      const data = {
        type: "Broadcast",
        connected: true,
        cookie: this.getToken("session"),
        name: store.getters.nickName.toLowerCase(),
        senderID: store.getters.localID,
        receiverID: groupID,
      };
      try {
        store.dispatch("sendMessage", data);
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      }
    },
    newPost(datas) {
      // if (datas.type == "NewPost" || datas.type == "Broadcast" || datas.type == "Private" || datas.type == "joinGroup") {
        if (datas.name !== store.getters.nickName.toLowerCase()) {
          const bell = document.getElementById("notification-bell");
          bell.classList.add("ring");
        }
      // };
    },
    notifBell(e) {
      e.preventDefault();
      const bell = document.getElementById("notification-bell");
      if (bell.classList.contains("ring")) {
        bell.classList.remove("ring");
      }
      this.formu_posts();
    },
    async formu_posts() {
      const datas = await utils.methods.fetchData("/get-posts");
      store.commit("setPublications", datas.content.publication);
      store.commit("setSuggestions", datas.users);
      store.commit("setLocalID", datas.userID.toString());
    },
    addGroup(title, description) {
      const data = {
        type: "addGroup",
        GroupTitle: title,
        GroupDesc: description,
        GroupOwner: store.getters.localID,
      };

      if (this.getToken("session")) {
        store.dispatch("sendMessage", data);
      } else {
        console.log("cookie not found");
        myMixin.methods.sayonara();
      }
    },
    newGroup(data) {
      if (data.type == "NewGroup") {
        // if (data.name !== store.getters.nickName.toLowerCase()) {
        //     const bell = document.getElementById("notification-bell");
        //     bell.classList.add("ring");
        // }
        // console.log(store.actions);
        store.commit("addGroup", data);
      }
    },
  },
};

export default app;
