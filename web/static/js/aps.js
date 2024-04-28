import { erreurs, strToDom, deleteAll, insertStylesheet, insertStylesheetIcone } from "./config.js";


/*----------------------------------------------------------------/
============== Fonction pour Créer la div Settings ===============
/----------------------------------------------------------------*/


// Fetch les données de l'utilisateur pour la partie settings
async function getSettings() {
  const cookieArray = document.cookie.split("; ");
  const value = cookieArray
    .find((c) => c.startsWith("session"))
    ?.split("=")[1];
  if (!value) {
    var event = new Event("logOut");
    document.dispatchEvent(event);
    return;
  }
  try {
    const response = await fetch("/api/settings", {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      // Objet Erreur
      const Erreur = {
        status: null,
        message: null,
      };
      Erreur.status = `${response.status}`;
      Erreur.message = `${response.statusText}`;
      erreurs(Erreur);
      throw new Error(
        `Failed to fetch settings. Status: ${response.status}, ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error; // Rethrow the error to let the caller handle it
  }
}

async function setSettings() {
  const data = await getSettings();

  return `
<div class="limiter">
            <div class="container-login100">
                <!-- <div > -->
                
                <form method="POST" class="wrap-login100" enctype="multipart/form-data">
                    <div class="login100-pic" data-tilt>
                        <div class="profile-avatar">
                            <input type="file" accept="image/*" name="photo" id="fileInput" onchange="loadFile(event)">
                            <label>
                                <img class="profile-img" id="output" src="/web/static/media/${data.User.Photo}" />
                            </label>
                        </div>
                        <span>Update Avatar</span>
                        <sub>Allowed JPG, GIF or PNG. Max size of 800K</sub>
                    </div>
                    <div class="login100-form validate-form">
                        <span class="login100-form-title">
                            Account Settings
                            <div>
                            <button onclick="sayonara()" class="status-share">Logout</button>
                          </div>
                        </span>
                        <span class="login100-form-error ${data.Status}">
                            ${data.Message}
                        </span>
                        <!-- <sub></sub> -->
                        <!-- normal form -->
                        <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                            <label for="username">Username :</label>
                            <input id="username" class="input100" type="text" name="username"
                                value="${data.User.Username}">
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-envelope" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div class="back">
                            <a href="javascript:void(0)" onclick="changePage('forum')" style="text-decoration: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"
                                    style="fill: #ffffff;">
                                    <path d="m12.707 7.707-1.414-1.414L5.586 12l5.707 5.707 1.414-1.414L8.414 12z">
                                    </path>
                                    <path d="M16.293 6.293 10.586 12l5.707 5.707 1.414-1.414L13.414 12l4.293-4.293z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                        <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                            <label for="email">Email :</label>
                            <input id="email" class="input100" type="text" name="email" placeholder="${data.User.Email}"
                                disabled="disabled">
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-envelope" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div id="existingPassword" class="wrap-input100 validate-input"
                            data-validate="Password is required">
                            <label for="password">Password :</label>
                            <input id="password" class="input100" type="password" name="pass" placeholder="Password">
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-lock" aria-hidden="true"></i>
                            </span>
                        </div>
                        <span><input style="margin-top: 10px;" type="checkbox" id="updateCheckbox" onclick="showDiv()">
                            Update your password</span>

                        <!-- update password -->
                        <div id="passwordDiv" style="display:none ;width: 100%;">
                            <div class="wrap-input100 validate-input" data-validate="Password is required">
                                <label for="newPassword">New password :</label>
                                <input type="password" class="input100" id="newPassword" name="newPassword"
                                    placeholder="New password">
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div class="wrap-input100 validate-input" data-validate="Password is required">
                                <label for="oldPassword">Password :</label>
                                <input type="password" class="input100" id="oldPassword" name="oldPassword"
                                    placeholder="Password">
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                        </div>
                        <!-- submit -->
                        <div class="container-login100-form-btn">
                        <button class="status-share" onclick="updateSettings(event); return false;">
                        Update
                        </button>
                        </div>
                    </div>
                </form>
                
                <!-- </div> -->
            </div>
        </div>
`;
}

async function changePage(section) {
  const SELECTORS = {
    FORUM_PAGE: ".forumPage",
    SETTING_PAGE: ".settingPage",
    CONVERSATION: ".conversation",
  };

  const body = {
    forum: document.querySelector(SELECTORS.FORUM_PAGE),
    settings: document.querySelector(SELECTORS.SETTING_PAGE),
    conversations: document.querySelector(SELECTORS.CONVERSATION),
  };

  switch (section) {
    case "forum":
      if (body.settings) {
        var limiter = body.settings.querySelector(".limiter");
        if (limiter) {
          body.settings.removeChild(limiter);
        }
        deleteAll();
      }
      var event = new Event("loadLiveForum");
      document.dispatchEvent(event);

      break;
    case "setting":
      if (body.forum) {
        var container = body.forum.querySelector(".container");
        if (container) {
          body.forum.removeChild(container);
        }
        deleteAll();
      }
      if (body.conversations) {
        var containers = body.conversations.querySelectorAll(".container-chat");
        if (containers) {
          containers.forEach(function (container) {
            if (container) {
              container.parentNode.removeChild(container);
            }
          });
        }
      }
      insertStylesheetIcone();
      insertStylesheet("/web/static/css/setting.css");
      const newSettingsDiv = document.querySelector(SELECTORS.SETTING_PAGE);
      const settingsContent = await setSettings();
      newSettingsDiv.appendChild(strToDom(settingsContent));
      break;
    default:
      console.error("Aucune section choisie");
      break;
  }
}

window.changePage = changePage;

/*----------------------------------------------------------------/
======================== UPDATE SETTINGS ========================
/----------------------------------------------------------------*/

function updateSettings(event) {
  event.preventDefault(); // Empêcher le comportement par défaut du formulaire

  const statusForm = document.querySelector(".login100-form-error");

  // Get form data
  var formData = new FormData(document.querySelector(".wrap-login100"));

  // Utiliser fetch pour une requête AJAX
  fetch("/settings", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Reponse : ", response);
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Vérifier le statut et effectuer des actions en conséquence
      if (data.status === "success") {
        // Gérer le succès
        if (statusForm.classList.contains("nosuccess")) {
          statusForm.classList.remove("nosuccess");
        }
        statusForm.classList.add(data.status);
        statusForm.innerHTML = data.message;
      }
      if (data.status === "nosuccess") {
        // Gérer l'échec
        if (statusForm.classList.contains("success")) {
          statusForm.classList.remove("success");
        }
        statusForm.classList.add(data.status);
        statusForm.innerHTML = data.message;
      }
    })
    .catch((error) => {
      // Objet Erreur
      const Erreur = {
        status: 401,
        message: "Unauthorized",
      };

      erreurs(Erreur);
      console.error("Error during form submission:", error);
    });
}

window.updateSettings = updateSettings;
