import { erreurs, strToDom } from "./config.js";

// Fonction pour capitaliser la première lettre de chaque mot dans une chaîne
export function capitalize(str) {
  // Divise la chaîne en mots
  str = str.split(" ");
  // Applique la capitalisation à chaque mot et rejoint le résultat
  return str
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join(" ");
}
export function getSenderName() {
  const senderNameElements = document.querySelectorAll(".profile-name");
  const senderNameElement = senderNameElements[0];
  return senderNameElement ? senderNameElement.textContent.trim() : "";
}

export function idUser() {
  const senderNameElements = document.querySelectorAll(".profile-name");
  const senderNameElement = senderNameElements[0];
  return senderNameElement.getAttribute("data-userId");
}

export function incrementCommentNumber(datas) {
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
}

export async function verification() {
  const id = idUser();
  const data = await fetchData("/api-messages");
  if (!data) {
    return false;
  }
  if (data.length > 0) {
    for (let i = data.length - 1; i >= data.length - 10; i--) {
      const user = data[i];
      if (user) {
        if (id === user.receiverID) {
          if (!user.Vu.Valid) {
            changeMessageState(user.senderID);
          }
        }
      }
    }
  }
}

// Fonction pour envoyer les messages a son interlocuteur
export function chat(
  id_message,
  message,
  formattedTime,
  actualUser,
  messageId
) {
  if (actualUser == "vous") {
    new_message_send(message, formattedTime, messageId);
  } else {
    new_message_receive(id_message, message, formattedTime, messageId);
  }
  if (actualUser == "vous") {
    const chatHistoryElement = document.querySelector("#chatHistory");
    chatHistoryElement.scrollTo(0, chatHistoryElement.clientHeight);
  }
}

export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function new_message_send(message, formattedDate, messageId) {
  const messageList = document.getElementById(`message-list-${messageId}`);
  const conversationList = messageList.querySelector(".messages-bubble");
  const message_to_send = `
  <li class="clearfix">
      <div class="message other-message float-right">
        <p>${message}</p>
        <span class="message-data-time right">${formattedDate}</span>
    </div>
  </li>
  `;
  conversationList.appendChild(strToDom(message_to_send));
  // conversationDiv.appendChild(conversationList);
  moveUserToTop(messageId);
}

export function new_message_receive(
  id_message,
  message,
  formattedDate,
  messageId
) {
  const messageList = document.getElementById(`message-list-${messageId}`);
  const conversationList = messageList.querySelector(".messages-bubble");
  const message_to_receive = `
  <li class="clearfix" id=${id_message}>
    <div class="message my-message"><p>${message}</p>
    <span class="message-data-time">${formattedDate}</span>
    </div>
  </li>
  `;
  conversationList.appendChild(strToDom(message_to_receive));
  // conversationDiv.appendChild(conversationList);
}

/**
 *
 * @param {string} cookieName
 * @returns {string}
 */

export function getCookieValue(cookieName) {
  const cookieArray = document.cookie.split("; ");
  const value = cookieArray
    .find((c) => c.startsWith(cookieName))
    ?.split("=")[1];
  return value !== undefined ? value : undefined;
}

export function formatDateTime(dateTimeString) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // timeZoneName: 'short',
  };

  const formattedDate = new Date(dateTimeString).toLocaleDateString(
    "fr-FR",
    options
  );
  return formattedDate;
}

export function getCurrentUserInfo() {
  // Obtient l'élément div avec la classe 'profile-avatar' et l'attribut 'id-data' égal à 'userDiv'
  var profileDiv = document.querySelector('.profile-avatar[id-data="userDiv"]');

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
}

// Affichage des commentaires en live sur le navigateur.
export function addComment(data) {
  // Convertit la chaîne JSON en objet JavaScript
  console.log("ajout du commentaire");
  // const user = getCurrentUserInfo();
  var content = escapeHtml(data.comment);
  const comment = `
    <div class="status-main listCommentaire" style="padding-top: 20px; background-color: #272a3a;">
              <img src="${data.photoSrc}" class="status-img"
                  style="width: 40px; height: 40px;" />
              <div class="album-detail">
                  <div class="album-title"><strong>${data.userName}</strong> comment
                      <span>Post</span>
                  </div>
               <div class="album-date"></div>
           </div>
           <p style="width: 100%;">${content}</p>
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
  const commentHtml = strToDom(comment);
  const sectionComment = document.querySelector(
    `.status.box[id="${data.postID}"]`
  );
  if (sectionComment) {
    const itemsectionComment = sectionComment.querySelector(".alls-comments");
    itemsectionComment.insertBefore(commentHtml, itemsectionComment.firstChild);
    console.log("Added comment section");
  }
}

export async function getAll() {
  try {
    const id = idUser().trim();

    const datas = await fetchData("/api-messages");
    if (!datas) {
      console.error("Fetching messages");
      return;
    }
    range_chat(datas, id);
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error getting message:", error);
  }
}

function range_chat(data, user_id) {
  if (data.length > 0) {
    for (const chat of data) {
      if (user_id === chat.receiverID || user_id === chat.senderID) {
        const chatDiv = document.querySelectorAll(".user.userList");
        chatDiv.forEach((element) => {
          const chatID = element.getAttribute("data-user-id");
          if (chat.receiverID === chatID || chat.senderID === chatID) {
            moveUserToTop(chatID);
          }
        });
      }
    }
  }
}

/*----------------------------------------------------------------/
============ TRIALLAGE DE LA LIST DES UTILISATEURS =============
/----------------------------------------------------------------*/

export function sortUsersAlphabetically() {
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
  userContainer.innerHTML = "";

  users.forEach((user) => {
    userContainer.appendChild(user);
  });
}

/*----------------------------------------------------------------/
======================= NOTIFICATION MESSAGE =====================
/----------------------------------------------------------------*/

export function notification(senderId) {
  const user = document.querySelector(`.user[data-user-id='${senderId}']`);
  user.style.backgroundColor = "darkslategray";
  notifSong();
}

export function notifBlink(userId, id_message) {
  const user = document.querySelector(`.user[data-user-id='${userId}']`);
  openMessage(`${userId}`);
  user.classList.add("blinks");
  notifSong();
  setTimeout(() => {
    user.classList.remove("blinks");
  }, 3000);
  updateMessageVisibility(id_message, true);
}

export function notifSong() {
  var sonnerie = document.createElement("audio");
  sonnerie.src = "/web/static/media/livechat-129007.mp3";
  sonnerie.addEventListener("loadeddata", function () {
    sonnerie.play();
  });
}

export function moveUserToTop(senderId) {
  const userContainer = document.querySelector(".side-wrapper.contacts");
  const user = userContainer.querySelector(`.user[data-user-id="${senderId}"]`);
  userContainer.prepend(user);
}

export async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      const Errors = {
        status: null,
        message: null,
      };
      Errors.status = `${response.status}`;
      Errors.message = `${response.statusText}`;
      erreurs(Errors);

      throw new Error(
        `Failed to fetch settings. Status: ${response.status}, ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to let the caller handle it
  }
}

// Ouvrir le nouveau message
export function openMessage(userId) {
  // Sélectionner l'utilisateur par son ID
  const user = document.querySelector(`.user[data-user-id='${userId}']`);

  // Vérifier si l'utilisateur a été trouvé
  if (!user) {
    console.error(`L'utilisateur n'a pas été trouvé.`);
    return;
  }

  // Réinitialiser la couleur de fond de l'utilisateur
  user.style.backgroundColor = "";
}

// Fonction pour changer l'etat du message vu ou non vu
export function changeMessageState(userId) {
  const firstButton = document.querySelector("#notification");

  const user = document.querySelector(`.user[data-user-id='${userId}']`);
  user.style.backgroundColor = "darkslategray";
  firstButton.classList.add("ring");
}

export function updateMessageVisibility(id_message, newVisibility) {
  // Endpoint de votre serveur où la requête POST sera envoyée
  var endpoint = "/updateMessageVisibility";

  // Objet contenant les données à envoyer
  var data = {
    messageID: id_message,
    newVisibility: newVisibility,
  };

  // Convertir l'objet JavaScript en chaîne JSON
  var jsonData = JSON.stringify(data);

  // Options pour la requête fetch
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
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
      console.error("Échec de la mise à jour du statut du message:", error);
      erreurs(error);
    });
}

// Supprime le voyant de notification si tous les messages sont ouverts
export function deleteNotif() {
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
}
