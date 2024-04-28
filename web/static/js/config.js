/*----------------------------------------------------------------/
 ========================= CODE DU FORUM =======================
/----------------------------------------------------------------*/

/**
 * Renvoie un élément HTML depuis une chaine
 * @param {string} str
 * @returns {HTMLElement}
 */
export function strToDom(str) {
  return document.createRange().createContextualFragment(str);
}
var version = 0;

export function uploadPage(datas) {
  let posts_profil = "";
  // console.table(datas);
  const posts = returnPost(datas.Publish.Posts);
  // console.log(posts); // c'est bon
  const datas_published = datas.PostsProfile.Posts;
  if (datas_published) {
    posts_profil = returnPostProfil(datas_published);
  }
  // console.log(posts_profil);
  const users = returnAll_users(datas.PostsProfile.AllUser);
  // console.log(users); // c'est bon
  const conversations = returnConversations();
  // const historique = returnHistories(datas.PostsProfile.AllUser);
  // console.log(conversations); // c'est bon
  const section_form = document.querySelector(".forumPage");
  const section_conversations = document.querySelector(".conversation");

  const forumContent = `
    <div class="container" x-data="{ rightSide: false, leftSide: false }">
        <div class="left-side" :class="{'active' : leftSide}">
          <div class="left-side-button" @click="leftSide = !leftSide">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
              viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <!-- <div class="logo" style="left: 1%;font-size:24px;">FORUM</div> -->
          <div class="side-wrapper">
            <div class="side-title">MENU</div>
            <div class="side-menu">
              <a href="javascript:void(0)" onclick="formu_posts()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                Home
              </a>
              <a href="javascript:void(0)" onclick="formu_posts()">
                <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                  viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Forum
              </a>
              <a href="javascript:void(0)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                Galery
              </a>
            </div>
          </div>
          <a href="https://twitter.com/AysnrTrkk" class="follow-me" target="_blank">
            <span class="follow-text">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                stroke-linejoin="round" class="css-i6dzq1">
                <path
                  d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                </path>
              </svg>
              Follow me on Twitter
            </span>
            <span class="developer">
              <img src="https://twitter.com/AysnrTrkk/photo" />
              Aysenur Turk — @AysnrTrkk
            </span>
          </a>
        </div>
        <!-- Page d'accueil -->
        <div class="main formDiv">
          <div class="search-bar">
            <input type="text" placeholder="Search" style="width: 76%; margin: 0 auto" name="search" />
            <button class="right-side-button" @click="rightSide = !rightSide">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
          <div class="profile" style="max-height: 250px; min-height: 200px">
            <div class="profile-avatar" id-data="userDiv">
              <img src="/web/static/media/${datas.PostsProfile.Photo}" alt="" class="profile-img" />
              <div class="profile-name" data-userId="${datas.IdUser}">
                ${datas.PostsProfile.Name}
              </div>
            </div>
  
            <img src="/web/static/media/cover_zone02.jpg" alt="" class="profile-cover" />
            <div class="profile-menu">
              <a class="public profile-menu-link active" href="/?name=all" onclick="setActiveLink('all')">All Posts</a>
              <a class="public profile-menu-link" href="/?name=Event" onclick="setActiveLink('Event')">Events</a>
              <a class="public profile-menu-link" href="/?name=General" onclick="setActiveLink('General')">Generals</a>
              <a class="public profile-menu-link" href="/?name=Issue" onclick="setActiveLink('Issue')">Issues</a>
            </div>
          </div>
          <!-- part all users -->
          <div class="main-container">
            <div class="timeline">
              <div class="timeline-right" style="padding-left: 0">
                
                <div class="all-posts">
                  ${posts}
                </div>
                
              </div>
            </div>
          </div>
          <!-- single user -->
        </div>
        <!-- Page de Profile -->
        
        <div class="main userDiv" style="background-color: #24273b; display: none">
          <div class="search-bar">
            <input type="text" placeholder="Search" />
            <button class="right-side-button" @click="rightSide = !rightSide">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
          <div class="profile" style="width: 96%; margin: 20px auto 0 auto">
            <div class="profile-avatar">
              <img src="/web/static/media/${datas.PostsProfile.Photo}" alt="" class="profile-img" />
              <div class="profile-name">${datas.PostsProfile.Name}</div>
            </div>
            <img src="/web/static/media/cover_zone02.jpg" alt="" class="profile-cover" />
            <div class="profile-menu">
              <a class="private profile-menu-link active" href="/?name=all" onclick="setActiveLink('all')">All Posts</a>
              <a class="private profile-menu-link" href="/?name=Event" onclick="setActiveLink('Event')">Events</a>
              <a class="private profile-menu-link" href="/?name=General" onclick="setActiveLink('General')">Generals</a>
              <a class="private profile-menu-link" href="/?name=Issue" onclick="setActiveLink('Issue')">Issues</a>
              <a class="private profile-menu-link" href="/?name=Liked" onclick="setActiveLink('Liked')">Liked Post</a>
            </div>
          </div>
          <div class="main-container" style="padding: 10px 18px 20px 28px">
            <div class="timeline">
              <div class="timeline-left">
                <div class="event box">
                  <div class="event-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                      class="event-img" />
                    <div class="event-date">
                      <div class="event-month">Jan</div>
                      <div class="event-day">01</div>
                    </div>
                    <div class="event-title">Winter Wonderland</div>
                    <div class="event-subtitle">01st Jan, 2019 07:00AM</div>
                  </div>
                </div>
                <div class="pages box">
                  <div class="intro-title">
                    Your pages
                    <button class="intro-menu"></button>
                  </div>
                  <div class="user">
                    <img
                      src="https://images.unsplash.com/photo-1549068106-b024baf5062d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0f"
                      alt="" class="user-img" />
                    <div class="username">Chandelio</div>
                  </div>
                  <div class="user">
                    <img
                      src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=d5849d81af587a09dbcf3f11f6fa122f"
                      alt="" class="user-img" />
                    <div class="username">Janet Jolie</div>
                  </div>
                  <div class="user">
                    <img
                      src="https://images.unsplash.com/photo-1546539782-6fc531453083?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                      alt="" class="user-img" />
                    <div class="username">Patrick Watsons</div>
                  </div>
                </div>
              </div>
              <div class="timeline-right">
                <div class="status box">
                  <form method="POST" enctype="multipart/form-data" id="postForm">
                    <div class="status-menu">
                      <ul class="links">
                        <li>
                          <input type="checkbox" name="cat" value="Event" id="event" />
                          <label for="event">Event</label>
                        </li>
                        <li>
                          <input type="checkbox" name="cat" value="General" id="gen" />
                          <label for="gen">General</label>
                        </li>
                        <li>
                          <input type="checkbox" name="cat" value="Issue" id="issue" />
                          <label for="issue">Issue</label>
                        </li>
                      </ul>
                    </div>
                    <div class="status-main" style="border: none; background-image: url()">
                      <img src="/web/static/media/${datas.PostsProfile.Photo}" class="status-img" />
                      <textarea class="status-textarea" placeholder="Title Goes Here" style="resize: none" name="title"
                        required></textarea>
                    </div>
                    <div class="status-main">
                      <textarea class="status-textarea" placeholder="Post Goes Here" name="desc" style="resize: vertical"
                        required></textarea>
                    </div>
                    <div class="status-actions">
                      <a href="#" class="status-action">
                        <input type="file" accept="image/*" id="fileInput" name="postimage" style="display: none" />
                        <label for="fileInput" style="cursor: pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            style="fill: white; width: 28; height: 28">
                            <path
                              d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z">
                            </path>
                          </svg>
                          <sup style="
                                top: -0.3em;
                                font-size: 20px;
                                font-weight: 600;
                                cursor: pointer;
                              ">upload</sup>
                        </label>
                      </a>
                      <input class="status-share" onclick="sendPosts(this)" type="submit" value="Publish" name="publish" />
                    </div>
                  </form>
                </div>
                <div class="all-posts">
                  ${posts_profil}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Partie droite -->
        <div class="right-side" :class="{ 'active': rightSide }" style="z-index: 4">
          <div class="account">
            <button class="account-button" id="notification-bell" href="javascript:void(0)" >
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="css-i6dzq1" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <button class="account-button" id="notification" >
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="css-i6dzq1" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </button>
  
            
            <span href="#" class="account-user" onclick="myFunction('profil')">${datas.PostsProfile.Name}
              <img src="/web/static/media/${datas.PostsProfile.Photo}" alt="" class="account-profile" alt="" />
            </span>
            
          </div>
          <div class="side-wrapper stories" id="profil" style="display: none">
            <div class="side-title">Account</div>
            <div class="user">
              
              <a href="javascript:void(0)" class="album-action" onclick="getContent('userDiv')">
                <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" viewBox="0 0 24 24">
                  <path
                    d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z">
                  </path>
                </svg>
                Profil
              </a>
              
            </div>
            <div class="user">
              <a href="#" data-page-id="setting" class="album-action a_link" onclick="changePage('setting')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="m2.344 15.271 2 3.46a1 1 0 0 0 1.366.365l1.396-.806c.58.457 1.221.832 1.895 1.112V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.598a8.094 8.094 0 0 0 1.895-1.112l1.396.806c.477.275 1.091.11 1.366-.365l2-3.46a1.004 1.004 0 0 0-.365-1.366l-1.372-.793a7.683 7.683 0 0 0-.002-2.224l1.372-.793c.476-.275.641-.89.365-1.366l-2-3.46a1 1 0 0 0-1.366-.365l-1.396.806A8.034 8.034 0 0 0 15 4.598V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.598A8.094 8.094 0 0 0 7.105 5.71L5.71 4.904a.999.999 0 0 0-1.366.365l-2 3.46a1.004 1.004 0 0 0 .365 1.366l1.372.793a7.683 7.683 0 0 0 0 2.224l-1.372.793c-.476.275-.641.89-.365 1.366zM12 8c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z">
                  </path>
                </svg>
                Settings
              </a>
            </div>
            <div class="user">
              <a onclick="sayonara()" class="album-action">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" stroke="currentColor"
                  stroke-width="2" fill="none">
                  >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path>
                  <path
                    d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z">
                  </path>
                </svg>
                Logout
              </a>
            </div>
          </div>
          
          <div class="side-wrapper contacts">
            ${users}
          </div>
          
          <!-- Juste qu'ici -->
          <div class="search-bar right-search">
            <input type="text" placeholder="Search" name="search" />
            <div class="search-bar-svgs">
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="css-i6dzq1" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.34 469.34">
                <path
                  d="M456.84 76.17l-64-64.06c-16.13-16.13-44.18-16.17-60.37.04L45.77 301.67a10.73 10.73 0 00-2.7 4.59L.41 455.73a10.68 10.68 0 0013.19 13.2l149.33-42.7c1.73-.5 3.3-1.42 4.58-2.7l289.33-286.98c8.06-8.07 12.5-18.78 12.5-30.19s-4.44-22.12-12.5-30.2zM285.99 89.74L325.25 129l-205 205-14.7-29.44a10.67 10.67 0 00-9.55-5.9H78.92L286 89.75zM26.2 443.14l13.9-48.64 34.74 34.74-48.64 13.9zm123.14-35.18L98.3 422.54l-51.5-51.5L61.38 320H89.4l18.38 36.77a10.67 10.67 0 004.77 4.77l36.78 18.39v28.03zm21.33-17.54v-17.09c0-4.04-2.28-7.72-5.9-9.54l-29.43-14.7 205-205 39.26 39.26-208.93 207.07zm271.11-268.7l-47.03 46.61L301 74.6l46.59-47c8.06-8.07 22.1-8.07 30.16 0l64 64c4.03 4.03 6.25 9.38 6.25 15.08s-2.22 11.05-6.22 15.05z" />
              </svg>
              <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
        </div>
        <div class="overlay" @click="rightSide = false; leftSide = false" :class="{ 'active': rightSide || leftSide }">
        </div>
      </div>
  `;

  var connectionPage = document.querySelector(".connexionPage");
  connectionPage.textContent = "";
  var errDiv = document.querySelector(".divError");
  if (errDiv) {
    errDiv.parentNode.removeChild(errDiv);
  }

  deleteAll();
  insertStylesheetIcone();
  insertStylesheet("/web/static/css/loginForm.css");
  insertStylesheet("/web/static/css/style.css");
  insertStylesheet("/web/static/css/styles.css");
  insertStylesheet("/web/static/css/main.css");
  insertStylesheet(
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
  );
  insertStylesheet("https://use.fontawesome.com/releases/v5.7.2/css/all.css");
  insertStylesheet("/web/static/css/main.css");
  // insertStylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
  // insertStylesheet("/web/static/css/pop-up.css");
  section_conversations.appendChild(strToDom(conversations));
  section_form.appendChild(strToDom(forumContent));
  rechargerScriptModule(`/web/static/js/live.js?v=${Math.random()}.${version}`);
  rechargerScriptModule(`/web/static/js/move.js?v=${Math.random()}.${version}`);
  rechargerScriptModule(
    `/web/static/js/local-request.js?v=${Math.random()}.${version}`
  );
  // rechargerScript(`/web/static/js/pop-up.js?v=${Math.random()}.${version}`)
  var event = new Event("loadLiveEvent");
  document.dispatchEvent(event);
  version++;
}

export function insertStylesheet(href) {
  var linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = href;
  document.head.appendChild(linkElement);
}

export function insertStylesheetIcone() {
  var linkElement = document.createElement("link");
  linkElement.rel = "shortcut icon";
  linkElement.type = "images/png";
  linkElement.href = "/web/static/media/forum_FILL0_wght400_GRAD0_opsz24.png";
  document.head.appendChild(linkElement);
}

export function deleteAll() {
  var links = document.head.getElementsByTagName("link");

  // Convertissez la liste en tableau
  links = Array.from(links);

  // Parcourez tous les liens et supprimez-les
  for (var i = 0; i < links.length; i++) {
    document.head.removeChild(links[i]);
  }
}

function deleteScript(url) {
  var tags = document.getElementsByTagName("script");
  for (var i = tags.length; i >= 0; i--) {
    if (
      tags[i] &&
      tags[i].getAttribute("src") != null &&
      tags[i].getAttribute("src").indexOf(url) != -1
    )
      tags[i].parentNode.removeChild(tags[i]);
  }
}

// retourner tous les posts

/**
 * @param {string} datas
 * @returns {string}
 */

function returnPost(datas) {
  if (datas) {
    // console.table(datas);
    let comments = "";
    let post = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];
      // console.log('- ',i);
      // console.table(data);
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
            <p style="word-break: break-word;">${data.Content}</style=>
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
    // console.log(post);
    return post;
  } else {
    return "";
  }
}

/**
 * @param {string} datas
 * @returns {string}
 */

export function returnComment(datas) {
  if (datas) {
    let comments = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];
      comments += `<div class="status-main listCommentaire" style="padding-top: 20px">
        <img src="./web/static/media/${data.Photo}" class="status-img"
          style="width: 40px; height: 40px" />
        <div class="album-detail">
          <div class="album-title">
            <strong>${data.Name}</strong> comment
            <span>Post</span>
          </div>
          <div class="album-date"></div>
        </div>
        <p style="width: 100%; word-break: break-word;">${data.Content}</p>
        <div class="contenu-a-recharger">
          <a href="#" class="album-action" data-action="like"
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
          <a href="#" class="dislikeButton album-action" data-action="dislike"
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

function returnAll_users(datas) {
  if (datas) {
    let users = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];
      users += `
          <div class="user userList" data-user-id="${data.UserID}" onclick="selectUser('${data.UserID}')">
              <img src="/web/static/media/${data.Photo}" alt="" class="user-img" />
              <div class="username-${data.UserID}">
                ${data.Name}
                <div class="user-status ${data.Status}"></div>
              </div>
            </div>
          `;
    }
    return users;
  } else {
    return "";
  }
}

/**
 * @param {string} datas
 * @returns {string}
 */

function returnPostProfil(datas) {
  if (datas) {
    // console.table(datas);
    let posts = "";
    let comments = "";
    for (var i = 0; i < datas.length; i++) {
      const data = datas[i];

      if (data.CommentCount > 0) {
        comments = returnUserComments(data.Comment);
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
    // console.log(posts)
    return posts;
  } else {
    return "";
  }
}

/**
 * @param {string} datas
 * @returns {string}
 */

function returnUserComments(datas) {
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

function returnConversations() {
  return `
          <div class="container-chat"  style="display: none">
        <div class="chat">
          <div class="chat-header clearfix">
            <div class="row">
              <div class="col-lg-6">
                <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                  <img src="/web/static/media/default.jpg" alt="avatar" style="cursor: none;"/>
                </a>
                <div class="chat-about">
                  <h2 class="head-discussion">
                    
                  </h2>
                  <small class="typing" style="visibility: hidden;">
                    <div class="typing-dot">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    </div>
                  </small>
                </div>
              </div>
            </div>
            <svg height="16" width="16" viewBox="0 0 512 512" class="exit" onclick="quitter()">
              <path
                d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z">
              </path>
            </svg>
          </div>
          <div class="chat-history" id="chatHistory">
            <ul class="messages-bubble">
            </ul>
          </div>
          <div class="chat-message clearfix">
            <textarea id="message-input"
              type="text"
              class="form-control"
              placeholder="Enter text here..."
            ></textarea>
            <div class="input-group">
              <div class="input-group-prepend">
              <a
                  class="publisher-btn"
                  href="javascript:void(0)"
                  alt="😄"
                  data-abc="true"
                  onclick="toggleEmojiList()"
                  ><i class="fa fa-smile"></i
                ></a>
                <button class="input-group-text" ><i class="fa fa-send"></i></button>
              </div>
            </div>
            <div
              class="emoji-list">
              <div class="emojis-category" id="Smileys">
                <h4 style="color: aliceblue">Smileys</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Personnes">
                <h4 style="color: aliceblue">Personnes</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Gestes">
                <h4 style="color: aliceblue">Gestes</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Nature">
                <h4 style="color: aliceblue">Nature</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Amour">
                <h4 style="color: aliceblue">Amour</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Activités">
                <h4 style="color: aliceblue">Activités</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Musique">
                <h4 style="color: aliceblue">Musique</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Nourriture">
                <h4 style="color: aliceblue">Nourriture</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Animaux">
                <h4 style="color: aliceblue">Animaux</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Pictogrammes">
                <h4 style="color: aliceblue">Pictogrammes</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Flèches">
                <h4 style="color: aliceblue">Flèches</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Objets">
                <h4 style="color: aliceblue">Objets</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Bureau">
                <h4 style="color: aliceblue">Bureau</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Vêtements">
                <h4 style="color: aliceblue">Vêtements</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Véhicules">
                <h4 style="color: aliceblue">Véhicules</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Lieux">
                <h4 style="color: aliceblue">Lieux</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Météo">
                <h4 style="color: aliceblue">Météo</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Horloge">
                <h4 style="color: aliceblue">Horloge</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Texte">
                <h4 style="color: aliceblue">Texte</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Symboles">
                <h4 style="color: aliceblue">Symboles</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Divers">
                <h4 style="color: aliceblue">Divers</h4>
                <div class="span-content"></div>
              </div>
              <div class="emojis-category" id="Drapeaux">
                <h4 style="color: aliceblue">Drapeaux</h4>
                <div class="span-content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
          `;
}

// function returnHistories(data) {
//   if (data) {
//     let tab = [];
//     for (var i = 0; i < data.length; i++) {
//       const historyData = data[i].History;
//       if (historyData) {
//         tab = tab.concat(historyData);
//       }
//     }
//     return tab;
//   }
// }

/*----------------------------------------------------------------/
 ============= FONCTION POUR FETCH LES DONNEES ==================
/----------------------------------------------------------------*/

function rechargerScript(url) {
  var oldScript = document.querySelector(`[src="${url}"]`);
  if (oldScript) {
    oldScript.remove();
  }

  var script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}

function rechargerScriptModule(url) {
  var oldScript = document.querySelector(`[src="${url}"]`);
  if (oldScript) {
    oldScript.remove();
  }

  var script = document.createElement("script");
  script.type = "module";
  script.src = url;
  document.body.appendChild(script);
}

export async function fetchDatas(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      // Objet Erreur
      const Erreurs = {
        status: null,
        message: null,
      };

      Erreurs.status = `${response.status}`;
      Erreurs.message = `${response.statusText}`;
      if (Erreurs.status == 401) {
        sayonara();
      } else {
        erreurs(Erreurs);
      }

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

async function forumHome() {
  const cookieArray = document.cookie.split("; ");
  const value = cookieArray.find((c) => c.startsWith("session"))?.split("=")[1];
  if (value) {
    const datas = await fetchDatas("/check-status");
    uploadPage(datas);
  }
}

window.forumHome = forumHome;

/*----------------------------------------------------------------/
 ======================== ERRORS ========================
/----------------------------------------------------------------*/

export function erreurs(data) {
  const errors = `
      <div class="container divError" x-data="{ rightSide: false, leftSide: false }">
      <div class="left-side" :class="{'active' : leftSide}">
        <div class="left-side-button" @click="leftSide = !leftSide">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>
        <div class="logo" style="left: 1%; font-size: 24px">FORUM</div>
        <div class="side-wrapper">
          <div class="side-title">MENU</div>
          <div class="side-menu">
            <a href="javascript:void(0)" onclick="forumHome()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
              Home
            </a>
            <a href="javascript:void(0)" onclick="forumHome()">
              <svg
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Forum
            </a>
          </div>
        </div>
      </div>
    
      <div class="main">
        <div class="error">${data.status}</div>
        <br /><br />
        <span class="info">${data.message}</span>
      </div>
    </div>
      `;
  const forumPage = document.querySelector(".forumPage");
  var container = forumPage.querySelector(".container");
  if (container) {
    forumPage.removeChild(container);
  }
  const settings = document.querySelector(".settingPage");
  var divContainer = settings.querySelector(".limiter");
  if (divContainer) {
    settings.removeChild(divContainer);
  }

  const services = document.querySelector(".connexionPage");
  var limiter = services.querySelector(".main");
  var phone = services.querySelector(".form-structor");
  if (limiter) {
    services.removeChild(limiter);
  }
  if (phone) {
    services.removeChild(phone);
  }

  const conversation = document.querySelector(".conversation");
  var chat = conversation.querySelector(".container-chat");
  if (chat) {
    conversation.removeChild(chat);
  }

  deleteAll();
  insertStylesheet("/web/static/css/error.css");
  insertStylesheet("/web/static/css/style.css");
  var url = "/web/static/js/local-request.js";
  var oldScript = document.querySelector(`[src="${url}"]`);
  if (!oldScript) {
    rechargerScriptModule(url);
  }

  document.body.appendChild(strToDom(errors));
}

export function sayonara() {
  const data = fetch("/logout", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  var event = new Event("sayonara");
  document.dispatchEvent(event);

  const services = `
    <div class="main">
        <div class="container a-container" id="a-container">
          <form method="POST" class="form" id="a-form">
            <h2 class="form_title title">Create Account</h2>
            <div class="form__icons"><i class="bx bxl-git form__icon"></i></div>
            <span class="form__span ${data.Status}">${data.Message}</span>
            <input type="text" class="form__input values" placeholder="Nickname" name="identifiant" required />
            <input type="number" class="form__input values" name="age" id="age" placeholder="Age" required min="1" />
            <!-- <input type="checkbox" class="form__input values" name="gender" id="gender" placeholder="Gender" required> -->
            <div class="form__input radio">
              <input type="radio" id="male" name="gender" value="male" />
              <label for="male">Homme</label><br />
              <input type="radio" id="female" name="gender" value="female" />
              <label for="female">Femme</label><br />
              <input type="radio" id="other" name="gender" value="other" />
              <label for="other">Autre</label><br />
            </div>
  
            <input type="first-name" class="form__input values" name="first-name" id="first-name" placeholder="First Name"
              required />
            <input type="last-name" class="form__input values" name="last-name" id="last-name" placeholder="Last Name"
              required />
            <input class="form__input" type="email" placeholder="Email" name="email" required />
            <input class="form__input values" type="password" placeholder="Password" name="password" required />
            <input type="submit" class="form__button button submit switch-button-signin" name="signup" value="SIGN UP" />
          </form>
        </div>
        <div class="container b-container" id="b-container">
          <form method="POST" class="form myForm" id="b-form">
            <h2 class="form_title title">Sign in to Website</h2>
            <div class="form__icons"><i class="bx bxl-git form__icon"></i></div>
            <span class="form__span ${data.Status}">${data.Message}</span>
            <input class="form__input values" type="text" placeholder="Email/Nickname" name="identifiant" id="email" required />
            <input class="form__input values" type="password" placeholder="Password" name="password" id="password" required />
            <input type="submit" class="form__button button submit switch-button-signin" name="signin" value="SIGN IN" />
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
            <button class="switch__button button switch-btn">SIGN IN</button>
          </div>
          <div class="switch__container is-hidden" id="switch-c2">
            <h2 class="switch__title title">Hello Friend !</h2>
            <p class="switch__description description">
              Enter your personal details and start journey with us
            </p>
            <button class="switch__button button switch-btn">SIGN UP</button>
          </div>
        </div>
      </div>
      <!-- partial:index.partial.html -->
      <div class="form-structor">
        <form method="POST" class="signup" id="form-a">
          <h2 class="form-title" id="signup"><span>or</span>Sign up</h2>
          <div>
            <span class="form__span mobile_info ${data.Status}">${data.Message}</span>
            <div class="form-holder">
              <input type="text" class="input values" placeholder="Nickname" name="identifiant" required />
              <input type="number" class="input values" name="age" id="age" placeholder="Age" required />
              <div class="input radio">
                <input type="radio" id="male" name="gender" value="male" />
                <label for="male">Homme</label><br />
                <input type="radio" id="female" name="gender" value="female" />
                <label for="female">Femme</label><br />
                <input type="radio" id="other" name="gender" value="other" />
                <label for="other">Autre</label><br />
              </div>
              <input type="first-name" class="input values" name="first-name" id="first-name" placeholder="First Name"
                required />
              <input type="last-name" class="input values" name="last-name" id="last-name" placeholder="Last Name" required />
              <input type="email" class="input" placeholder="Email" name="email" required />
              <input type="password" class="input values" placeholder="Password" name="password" required />
            </div>
          </div>
          <button type="submit" class="submit-btn" name="signup" value="SIGN UP">
            Sign up
          </button>
        </form>
        <div class="login slide-up">
          <form method="POST" class="center myForm" id="form-b">
            <h2 class="form-title" id="login"><span>or</span>Log in</h2>
            <div>
              <span class="form__span mobile_info ${data.Status}">${data.Message}</span>
              <div class="form-holder">
                <input type="text" class="input values" placeholder="Email/Nickname" name="identifiant" required />
                <input type="password" class="input values" placeholder="Password" name="password" required />
              </div>
            </div>
            <button type="submit" class="submit-btn" name="signin" value="SIGN IN">
              Log in
            </button>
          </form>
        </div>
      </div>
    `;

  const forumPage = document.querySelector(".forumPage");
  var container = forumPage.querySelector(".container");
  if (container) {
    forumPage.removeChild(container);
  }

  const settings = document.querySelector(".settingPage");
  var divContainer = settings.querySelector(".limiter");
  if (divContainer) {
    settings.removeChild(divContainer);
  }

  const conversation = document.querySelector(".conversation");
  var chat_container = conversation.querySelectorAll(".container-chat");
  if (chat_container) {
    chat_container.forEach(function (chat) {
      if (chat) {
        conversation.removeChild(chat);
      }
    });
  }

  const sing = document.querySelector(".connexionPage");
  sing.appendChild(strToDom(services));

  deleteScript("/web/static/js/move.js");
  deleteScript("/web/static/js/likeAndDislike.js");
  deleteScript("/web/static/js/upload.js");
  deleteScript("/web/static/js/forum.js");

  deleteAll();
  rechargerScript("/web/static/js/link.js");
  insertStylesheet("/web/static/css/mobile.css");
  insertStylesheet("/web/static/css/login.css");
  insertStylesheet(
    "https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
  );
  insertStylesheet(
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap"
  );
  var event = new Event("newLoad");
  setTimeout(() => {
    document.dispatchEvent(event);
  }, 1500);
}

window.sayonara = sayonara;
