/*----------------------------------------------------------------/
========================== Publication ===========================
/*----------------------------------------------------------------*/

import { strToDom, erreurs, returnComment } from "./config.js";
import {
  fetchData,
  getCookieValue,
  getCurrentUserInfo,
} from "./utils.js";

// document.addEventListener("loadLiveEvent", function () {
export function newPost(datas) {
  let type_id = CHECK_MESSAGE_TYPE();
  if (datas.type == type_id) {
    let cookie = getCookieValue("session");
    if (cookie) {
      var bell = document.getElementById("notification-bell");
      bell.setAttribute("onclick", "notifBell()");
      bell.classList.add("ring");
    } else {
      var event = new Event("logOut");
      document.dispatchEvent(event);
    }
  }
}

function validPostDesc(text) {
  let RegExp = /^[\w\p{L}0-9._\-\s\n\r\t!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]{5,500}$/u;
  if (!text) {
    return false; // Retourne false si l'identifiant est null ou undefined
  }
  return RegExp.test(text); // Renvoie le résultat de la validation
}


function validPostTittle(text) {
  let RegExp = /^[\w\p{L}0-9._\-\s\n\r\t!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]{5,50}$/u;
  if (!text) {
    return false; // Retourne false si l'identifiant est null ou undefined
  }
  return RegExp.test(text); // Renvoie le résultat de la validation
}

(function () {
  function submitPosts(formData) {
    fetch("/post", {
      method: "POST",
      body: formData,
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          document.getElementById("postForm").reset(); // Réinitialiser le formulaire
          const Data = data.message.Data.Posts; // Reccupere tous les postes
          const id = data.message.PostID; // Reccupere l'id du post qui vient d'etre creer
          const post = Data.find((post) => post.PostID === id); // Reccupere le Post qui vient d'etre creer dans le tableau des posts
          createNewPost(post);
          var event = new Event("new-post");
          document.dispatchEvent(event);
        } else {
          // Objet Erreur
          const erreur = {
            status: null,
            message: null,
          };
          erreur.status = data.code;
          erreur.message = data.message;
          erreurs(erreur);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête AJAX :", error);
      });
  }

  function sendPosts(params) {
    // Supprimer d'abord tout gestionnaire d'événements existant pour éviter les duplications
    params.parentNode.parentNode.removeEventListener("submit", onSubmitHandler);

    // Ajouter le gestionnaire d'événements
    params.parentNode.parentNode.addEventListener("submit", onSubmitHandler);
  }

  window.sendPosts = sendPosts;
  // onclick="sendPosts(this)"
  function onSubmitHandler(event) {
    event.preventDefault();
    // Sélectionnez toutes les cases à cocher avec le nom "cat"
    var checkboxes = document.querySelectorAll('input[name="cat"]');
    var lis = document.querySelectorAll(".status-menu li");

    var auMoinsUneSelectionnee = false;

    // Parcourez toutes les cases à cocher
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        auMoinsUneSelectionnee = true;
        return;
      }
    });

    var titler = document.querySelector('#postForm textarea[name="title"]');
    var title = titler.value;
    var description = document.querySelector('#postForm textarea[name="desc"]');
    var desc = description.value;
    var publisher = document.querySelector('#postForm input[name="publish"]');
    var publish = publisher.value;

    if (
      publish !== "Publish" ||
      title === "" ||
      desc === "" ||
      !auMoinsUneSelectionnee
    ) {
      console.error("Champs incomplets");
      if (!auMoinsUneSelectionnee) {
        lis.forEach(function (li) {
          if (li) {
            li.classList.add("invalid");
          }
        });
        console.error("At least one checkbox must be selected.");
      } else {
        lis.forEach(function (li) {
          if (li) {
            li.classList.remove("invalid");
          }
        });
      }

      return false;
    }
    if (!validPostTittle(title)) {
      titler.classList.add("invalid");
      return false;
    } else {
      titler.classList.remove("invalid");
    }
    if (!validPostDesc(desc)) {
      description.classList.add("invalid");
      return false;
    } else {
      description.classList.remove("invalid");
    }

    if (auMoinsUneSelectionnee) {
      lis.forEach(function (li) {
        if (li) {
          li.classList.remove("invalid");
        }
      });
    }

    var formData = new FormData(this);
    const cookieArray = document.cookie.split("; ");
    const value = cookieArray
      .find((c) => c.startsWith("session"))
      ?.split("=")[1];
    if (!value) {
      var event = new Event("logOut");
      document.dispatchEvent(event);
      return false;
    }
    submitPosts(formData);
  }
})();

/*----------------------------------------------------------------/
 =================== CREATION DE NOUVEAU POSTS ===================
/-----------------------------------------------------------------*/

function createNewPost(data) {
  const newPost = `
  <div class="album box userPublications" data-postId="${data.PostID}">
  <div class="status-main">
    <img src="./web/static/media/${data.Photo}" class="status-img" />
    <div class="album-detail">
      <div class="album-title">
        <strong>${data.Name}</strong> create new
        <span>Post</span>
      </div>
      <div class="album-date">${data.CreatedAt}</div>
    </div>
    <button class="intro-menu"></button>
  </div>
  <div class="album-content">
    ${data.Title}
    <div class="album-photos">
      <img src="./web/static/media/${data.Image}" alt="" class="album-photo" />
    </div>
    <p style="word-break: break-word;">${data.Content}</p>
  </div>
  <div class="album-actions">
    <a href="#" class="album-action" onclick="sendFeedback('${data.PostID}', 'like', 'post_id')"
      data-post-id="${data.PostID}">
      <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
        stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24"
        fill="white" class="css-i6dzq1">
        <path
          d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
        </path>
      </svg>
      <span class="likeCount" data-post-id="${data.PostID}">${data.LikeCount}</span>
    </a>
    <a href="#" class="album-action" onclick="sendFeedback('${data.PostID}', 'dislike', 'post_id')"
      data-post-id="${data.PostID}">
      <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path
          d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
        </path>
      </svg>
      <span class="dislikeCount" data-post-id="${data.PostID}">${data.DislikeCount}</span>
    </a>
    <a href="#" class="album-action" onclick="myFunction('${data.PostID}')">
      <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
        stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      <span class="commentCount" data-post-id="${data.PostID}">${data.CommentCount}</span>
    </a>
  
  <!-- Add comment div -->
  <div class="status box" id="${data.PostID}" style="display: none; padding: 0 20px 7px 20px">
    <div style="border-bottom: 1px solid #272a3a; margin-top: 1%">
      <form  method="POST" class="comment-form" data-post-id="${data.PostID}">
        <h3 style="margin: 28px 0 0 1%; font-size: 1.5rem">
          Add a comment
        </h3>
        <div class="status-main">
          <div style="width: 100%">
            <textarea class="status-textarea" placeholder="Comments Goes Here" name="comment" style="
                  resize: vertical;
                  height: 75px;
                  width: 100%;
                " required></textarea>
            <input type="hidden" name="postID" value="${data.PostID}" />
          </div>
          <div class="status-actions">
            <input class="status-share" onclick="sendcomment(this)" type="submit" value="Add comment" name="add" />
          </div>
        </div>
      </form>
    </div>
    <!-- Tous les commentaires pour ce post -->
    <div class="alls-comments">
    </div>
  </div>
</div>
</div>                        
    `;
  // Iterer sur tous les éléments .timeline-right
  const user = document.querySelector(".userDiv");
  const div = user.querySelector(".all-posts");
  // Insérer le nouvel élément au-dessus du premier enfant de chaque div
  div.insertBefore(strToDom(newPost), div.firstChild);
}

// notification-bell
function notifBell() {
  const bell = document.getElementById("notification-bell");
  bell.classList.remove("ring");
  bell.removeAttribute("onclick");
  formu_posts();
}
window.notifBell = notifBell;

function CHECK_MESSAGE_TYPE() {
  return "NewPost";
}

/*----------------------------------------------------------------/
 ================== GET POSTS PUBLIC SECTION ====================
/----------------------------------------------------------------*/

async function formu_posts() {
  const cookieArray = document.cookie.split("; ");
  const value = cookieArray.find((c) => c.startsWith("session"))?.split("=")[1];
  if (!value) {
    var event = new Event("logOut");
    document.dispatchEvent(event);
    return;
  }
  const url = "/get-posts?name=all";
  // Effectuez la requête AJAX pour récupérer le contenu de la section
  const datas = await fetchData(url);
  var posts = all_posts(datas.Posts);
  const user = getCurrentUserInfo();
  let current_user_posts = [];
  current_user_posts = datas.Posts.filter(
    (post) => post.Name == user.username.trim()
  );
  var private_publications = post_profil(current_user_posts);
  const publics = document.querySelector(".formDiv");
  const div_public = publics.querySelector(".all-posts");
  const divs = div_public.querySelectorAll(".album.box.publicPublications");
  divs.forEach((div) => {
    div.remove();
  });

  div_public.appendChild(strToDom(posts)); // Ajout pour tous
  const privates = document.querySelector(".userDiv");
  const div_private = privates.querySelector(".all-posts");
  const divs_private = div_private.querySelectorAll(
    ".album.box.userPublications"
  );
  divs_private.forEach((div) => {
    div.remove();
  });

  div_private.appendChild(strToDom(private_publications));
  var event = new Event("ForumContentLoaded");
  document.dispatchEvent(event);
}

window.formu_posts = formu_posts;

// retourner tous les posts

/**
 * @param {string} datas
 * @returns {string}
 */

function all_posts(datas) {
  if (datas) {
    // console.table(datas);
    let comments = "";
    let post = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];
      if (data.CommentCount > 0) {
        comments = returnComment(data.Comment);
      }
      post += `
      <div class="album box publicPublications" id="content-albums"
        style="max-width: 75%; margin: 0 auto; margin-bottom: 20px" data-postId="${data.PostID}">
        <div class="status-main">
          <img src="./web/static/media/${data.Photo}" class="status-img" />
          <div class="album-detail">
            <div class="album-title">
              <strong>${data.Name}</strong> create new
              <span>Post</span>
            </div>
            <div class="album-date">${data.CreatedAt}</div>
          </div>
          <button class="intro-menu"></button>
        </div>
        <div class="album-content">
          ${data.Title}
          <div class="album-photos">
            <img src="./web/static/media/${data.Image}" alt="" class="album-photo" />
          </div>
          <p style="word-break: break-word;">${data.Content}</p>
        </div>
        <div class="album-actions">
          <a href="#" class="album-action" onclick="sendFeedback('${data.PostID}', 'like', 'post_id')"
            data-post-id="${data.PostID}">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24"
              fill="white" class="css-i6dzq1">
              <path
                d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
              </path>
            </svg>
            <span class="likeCount" data-post-id="${data.PostID}">${data.LikeCount}</span>
          </a>
          <a href="#" class="album-action" onclick="sendFeedback('${data.PostID}', 'dislike', 'post_id')"
            data-post-id="${data.PostID}">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path
                d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
              </path>
            </svg>
            <span class="dislikeCount" data-post-id="${data.PostID}">${data.DislikeCount}</span>
          </a>
          <a href="#" class="album-action" onclick="myFunction('${data.PostID}')">
            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
              stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span class="commentCount" data-post-id="${data.PostID}">${data.CommentCount}</span>
          </a>
          <!-- Add comment div -->
          <div class="status box" id="${data.PostID}" style="display: none">
            <div class="" style="
                  border-bottom: 1px solid #272a3a;
                  margin-top: 1%;
                ">
              <form  method="POST" class="comment-form" data-post-id="${data.PostID}">
                <h3 style="margin: 28px 0 0 1%; font-size: 1.5rem">
                  Add a comment
                </h3>
                <div class="status-main">
                  <div style="width: 100%">
                    <textarea class="status-textarea" placeholder="Comments Goes Here" name="comment" style="
                          resize: vertical;
                          height: 75px;
                          width: 100%;
                        " required></textarea>
                    <input type="hidden" name="postID" value="${data.PostID}" />
                  </div>
                  <div class="status-actions">
                    <input class="status-share" onclick="sendcomment(this)" type="submit" value="Add comment" name="add" />
                  </div>
                </div>
              </form>
            </div>
            <!-- Tous les commentaires pour ce post -->
            <div class="alls-comments">
             ${comments}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    return post;
  } else {
    return "";
  }
}

/**
 * @param {string} datas
 * @returns {string}
 */

function post_profil(datas) {
  if (datas) {
    // console.table(datas);
    let posts = "";
    let comments = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];

      if (data.CommentCount > 0) {
        comments = userComments(data.Comment);
      }
      posts += `
      <div class="album box userPublications" data-postId="${data.PostID}">
      <div class="status-main">
        <img src="./web/static/media/${data.Photo}" class="status-img" />
        <div class="album-detail">
          <div class="album-title">
            <strong>${data.Name}</strong> create new
            <span>Post</span>
          </div>
          <div class="album-date">${data.CreatedAt}</div>
        </div>
        <button class="intro-menu"></button>
      </div>
      <div class="album-content">
        ${data.Title}
        <div class="album-photos">
          <img src="./web/static/media/${data.Image}" alt="" class="album-photo" />
        </div>
        <p style="word-break: break-word;">${data.Content}</p>
      </div>
      <div class="album-actions">
        <a href="#" class="album-action" onclick="sendFeedback('${data.PostID}', 'like', 'post_id')"
          data-post-id="${data.PostID}">
          <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24"
            fill="white" class="css-i6dzq1">
            <path
              d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
            </path>
          </svg>
          <span class="likeCount" data-post-id="${data.PostID}">${data.LikeCount}</span>
        </a>
        <a href="#" class="album-action" onclick="sendFeedback('${data.PostID}', 'dislike', 'post_id')"
          data-post-id="${data.PostID}">
          <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path
              d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
            </path>
          </svg>
          <span class="dislikeCount" data-post-id="${data.PostID}">${data.DislikeCount}</span>
        </a>
        <a href="#" class="album-action" onclick="myFunction('${data.PostID}')">
          <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
            stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span class="commentCount" data-post-id="${data.PostID}">${data.CommentCount}</span>
        </a>
      
      <!-- Add comment div -->
      <div class="status box" id="${data.PostID}" style="display: none; padding: 0 20px 7px 20px">
        <div style="border-bottom: 1px solid #272a3a; margin-top: 1%">
          <form  method="POST" class="comment-form" data-post-id="${data.PostID}">
            <h3 style="margin: 28px 0 0 1%; font-size: 1.5rem">
              Add a comment
            </h3>
            <div class="status-main">
              <div style="width: 100%">
                <textarea class="status-textarea" placeholder="Comments Goes Here" name="comment" style="
                      resize: vertical;
                      height: 75px;
                      width: 100%;
                    " required></textarea>
                <input type="hidden" name="postID" value="${data.PostID}" />
              </div>
              <div class="status-actions">
                <input class="status-share" onclick="sendcomment(this)" type="submit" value="Add comment" name="add" />
              </div>
            </div>
          </form>
        </div>
        <!-- Tous les commentaires pour ce post -->
        <div class="alls-comments">
          ${comments}
        </div>
      </div>
    </div>
    </div>
        `;
    }
    return posts;
  } else {
    return "";
  }
}

/**
 * @param {string} datas
 * @returns {string}
 */

function userComments(datas) {
  if (datas) {
    let comments = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];
      // console.table(data);
      comments += `
      <div class="status-main" style="
      padding: 20px;
      background: #272a3a;
      margin-bottom: 13px;
    ">
  <img src="./web/static/media/${data.Photo}" class="status-img" style="width: 40px; height: 40px" />
  <div class="album-detail">
    <div class="album-title">
      <strong>${data.Name}</strong> comment
      <span>Post</span>
    </div>
    <div class="album-date"></div>
  </div>
  <p style="width: 100%; word-break: break-word;">${data.Content}</p>
  <div>
    <a href="#" class="album-action"
      onclick="sendFeedback('${data.CommentID}', 'like', 'comment_id')"
      data-post-id="${data.CommentID}">
      <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
        stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24"
        fill="white" class="css-i6dzq1">
        <path
          d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
        </path>
      </svg>
      <span class="likeCount" data-post-id="${data.CommentID}">${data.LikeNbr}</span>
    </a>
    <a href="#" class="album-action"
      onclick="sendFeedback('${data.CommentID}', 'dislike', 'comment_id')"
      data-post-id="${data.CommentID}">
      <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path
          d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
        </path>
      </svg>
      <span class="dislikeCount" data-post-id="${data.CommentID}">${data.DislikeNbr}</span>
    </a>
  </div>
</div>
        `;
    }
    return comments;
  } else {
    return "";
  }
}

/*----------------------------------------------------------------/
============== Requette pour filtrer sur le Forum =============
/----------------------------------------------------------------*/

document.addEventListener("loadLiveEvent", function () {
  var links = document.querySelectorAll(".public");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // Récupérez le nom de la section à partir de l'attribut href
      var sectionName = this.getAttribute("href").split("=")[1];
      const cookieArray = document.cookie.split("; ");
      const value = cookieArray
        .find((c) => c.startsWith("session"))
        ?.split("=")[1];
      if (!value) {
        sayonara();
        return;
      }
      // Effectuez la requête AJAX pour récupérer le contenu de la section
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/get-posts?name=" + sectionName, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            var posts = data?.Posts;
            // Convertir la NodeList en tableau
            var contentAlbums = Array.from(
              document.querySelectorAll(".publicPublications")
            );

            if (posts === null) {
              contentAlbums.forEach(function (album) {
                album.style.display = "none";
              });
              return;
            }
            // Itérez sur chaque élément et ajustez le style en fonction des données du serveur
            contentAlbums.forEach(function (album) {
              let id = album.getAttribute("data-postId");

              // Vérifiez si l'ID de l'album est dans la liste des IDs reçus du serveur
              let isPostInServerData = posts.some((post) => post.PostID === id);

              // Ajustez le style en conséquence
              if (!isPostInServerData) {
                album.style.display = "none";
              } else {
                album.style.display = "block";
              }
            });
            newURL(sectionName);
          } else {
            console.error(
              "Erreur lors du chargement du contenu de la section :",
              xhr.statusText
            );
          }
        }
      };
      xhr.send();
    });
  });
});
