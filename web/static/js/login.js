// /*
// 		Designed by: SELECTO
// 		Original image: https://dribbble.com/shots/5311359-Diprella-Login

import { fetchDatas, uploadPage } from "./config.js";

// */
function buttonsSwitchs() {
  (function () {
    let switchCtn = document.querySelector("#switch-cnt");
    let switchC1 = document.querySelector("#switch-c1");
    let switchC2 = document.querySelector("#switch-c2");
    let switchCircle = document.querySelectorAll(".switch__circle");
    let switchBtn = document.querySelectorAll(".switch-btn");
    let aContainer = document.querySelector("#a-container");
    let bContainer = document.querySelector("#b-container");

    let changeForm = (e) => {
      e.preventDefault();
      switchCtn.classList.add("is-gx");
      setTimeout(function () {
        switchCtn.classList.remove("is-gx");
      }, 1500);

      switchCtn.classList.toggle("is-txr");
      switchCircle[0].classList.toggle("is-txr");
      switchCircle[1].classList.toggle("is-txr");

      switchC1.classList.toggle("is-hidden");
      switchC2.classList.toggle("is-hidden");
      aContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-z200");
    };

    for (var i = 0; i < switchBtn.length; i++)
      switchBtn[i].addEventListener("click", changeForm);
  })();
}


/*----------------------------------------------------------------/
 =================== REGEXP DE VALIDATION D'EMAIL ================
/----------------------------------------------------------------*/

function validEmail(email) {
  let emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,10}$/;
  if (!email) {
    return false; // Retourne false si l'email est null ou undefined
  }
  return emailRegExp.test(email); // Renvoie le résultat de la validation
}


/*----------------------------------------------------------------/
 =================== BOUTTONS DE CONNEXION ======================
/----------------------------------------------------------------*/

function bouttons_connexion() {
  const signupForm = document.getElementById("a-form");
  const signinForm = document.getElementById("b-form");

  let Err = null;

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(this);
      // Parcourir tous les champs
      let isFormValid = true;
      // Récupérer tous les champs du formulaire
      const inputs = signupForm.querySelectorAll(".values");

      // Sélectionnez toutes les cases à cocher avec le nom "cat"
      var checkboxes = signupForm.querySelectorAll('input[type="radio"]');
      var lis = signupForm.querySelectorAll('.radio label');

      var auMoinsUneSelectionnee = false;

      // Parcourez toutes les cases à cocher
      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          auMoinsUneSelectionnee = true;
          return;
        }
      });
      if (!auMoinsUneSelectionnee) {
        lis.forEach(function (li) {
          if (li) {
            li.classList.add("invalid");
          }
        });
        isFormValid = false;
      } else {
        lis.forEach(function (li) {
          if (li) {
            li.classList.remove("invalid");
          }
        });
      }

      inputs.forEach(function (input) {
        // Vérifier si un champ est vide
        if (input.value.trim() === "" || (!validCredential(input.value.trim()))) {
          // Mettre en évidence le champ vide (par exemple, ajouter une classe CSS)
          input.classList.add("invalid");
          isFormValid = false;
        } else {
          // Retirer la classe d'invalidité si le champ est rempli
          input.classList.remove("invalid");
        }
      });
      // Vérifier si l'email est valide
      const emailInput = signupForm.querySelector('input[name="email"]');

      if (!validEmail(signupForm.email.value)) {
        emailInput.classList.add("invalid");
        isFormValid = false;
      } else {
        emailInput.classList.remove("invalid");
      }

      var password = signupForm.querySelector("input[name='password']").value;

      if (password.length < 4) {
        alert("Password too short");
        return false;
      }


      const ageInput = signupForm.querySelector("#age");
      const ageValue = parseInt(ageInput.value, 10); // Convertit la valeur en nombre entier
      if (ageValue < 10 && ageValue > 90) {
        ageInput.classList.add("invalid");
        isFormValid = false;
      }

      if (!isFormValid) {
        return false;
      }
      fetch("/register", {
        method: "POST",
        body: formData,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then((response) => {
          // Vérifiez si la réponse est OK (statut 200)
          if (!response.ok) {
            if (response.status === 401 || response.status === 400) {
              Err = "Invalid entries.";
              throw new Error("Invalid entries.");
            } else {
              throw new Error(
                `Network response was not ok, status: ${response.status}`
              );
            }
          }
          // Vérifiez si la réponse a un type de contenu JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            // Parsez la réponse en JSON
            return response.json();
          } else {
            // Si la réponse n'est pas au format JSON, renvoyez une réponse vide
            return { notJson: true };
          }
        })
        .then((result) => {
          // Gérez les cas où la réponse n'est pas JSON
          if (result.notJson) {
          } else {
            // Exemple de redirection côté client
            if (result.redirect) {
              formData = null;
              uploadPage(result.datas);
            }
          }
        })
        .catch(() => {
          // Affichage du message d'erreur
          const errorSpans = signinForm.querySelectorAll(".form__span");
          errorSpans.forEach((errorSpan) => {
            errorSpan.textContent = Err;
            errorSpan.classList.add("nosucces"); // Ajoutez une classe CSS pour un style spécifique si nécessaire
          });
        });
    });
  }

  if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var password = document.getElementById("password").value;
      var email = document.getElementById("email").value;

      if (password.length < 4 || email.trim() === "") {
        alert("Invalid username or password..");
        return false;
      }

      // Récupérer tous les champs du formulaire
      const inputs = signinForm.querySelectorAll(".values");

      // Parcourir tous les champs
      let isFormValid = true;
      inputs.forEach(function (input) {
        // Vérifier si un champ est vide
        if (input.value.trim() === "") {
          // Mettre en évidence le champ vide (par exemple, ajouter une classe CSS)
          input.classList.add("invalid");
          isFormValid = false;
        } else {
          // Retirer la classe d'invalidité si le champ est rempli
          input.classList.remove("invalid");
        }
      });

      if (!isFormValid) {
        return false;
      }

      var formData = new FormData(this);

      fetch("/login", {
        method: "POST",
        body: formData,
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
        .then((response) => {
          // Vérifiez si la réponse est OK (statut 200)
          if (!response.ok) {
            if (response.status === 401) {
              Err = "Invalid username or password.";
              throw new Error("Invalid username or password.");
            } else {
              throw new Error(
                `Network response was not ok, status: ${response.status}`
              );
            }
          }
          // Vérifiez si la réponse a un type de contenu JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            // Parsez la réponse en JSON
            return response.json();
          } else {
            // Si la réponse n'est pas au format JSON, renvoyez une réponse vide
            return { notJson: true };
          }
        })
        .then((result) => {
          // Gérez les cas où la réponse n'est pas JSON
          if (result.notJson) {
          } else {
            // Exemple de redirection côté client
            if (result.redirect) {
              formData = null;
              uploadPage(result.datas);
            }
          }
        })
        .catch((_) => {
          // Affichage du message d'erreur
          const errorSpans = signinForm.querySelectorAll(".form__span");
          errorSpans.forEach((errorSpan) => {
            errorSpan.textContent = Err;
            errorSpan.classList.add("nosucces"); // Ajoutez une classe CSS pour un style spécifique si nécessaire
          });
        });
    });
  }

  // Mobile version Formulaires
  const signupFormM = document.getElementById("form-a");
  const signinFormM = document.getElementById("form-b");

  if (signupFormM) {
    signupFormM.addEventListener("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(this);
      // Récupérer tous les champs du formulaire
      const inputs = signupFormM.querySelectorAll(".values");

      // Parcourir tous les champs
      let isFormValid = true;
      // Sélectionnez toutes les cases à cocher avec le nom "cat"
      var checkboxes = signupFormM.querySelectorAll('input[type="radio"]');
      var lis = signupFormM.querySelectorAll('.radio label');

      var auMoinsUneSelectionnee = false;

      // Parcourez toutes les cases à cocher
      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          auMoinsUneSelectionnee = true;
          return;
        }
      });
      if (!auMoinsUneSelectionnee) {
        lis.forEach(function (li) {
          if (li) {
            li.classList.add("invalid");
          }
        });
        isFormValid = false;
      } else {
        lis.forEach(function (li) {
          if (li) {
            li.classList.remove("invalid");
          }
        });
      }

      inputs.forEach(function (input) {
        // Vérifier si un champ est vide
        if (input.value.trim() === "" || (!validCredential(input.value.trim()))) {
          // Mettre en évidence le champ vide (par exemple, ajouter une classe CSS)
          input.classList.add("invalid");
          isFormValid = false;
        } else {
          // Retirer la classe d'invalidité si le champ est rempli
          input.classList.remove("invalid");
        }
      });

      const ageInput = signupFormM.querySelector("#age");
      const ageValue = parseInt(ageInput.value, 10); // Convertit la valeur en nombre entier
      if (ageValue <= 0 && ageValue > 90) {
        ageInput.classList.add("invalid");
        isFormValid = false;
      }
      const emailInput = signupFormM.querySelector('input[name="email"]');

      if (!validEmail(signupFormM.email.value)) {
        emailInput.classList.add("invalid");
        isFormValid = false;
      } else {
        emailInput.classList.remove("invalid");
      }

      var password = signupFormM.querySelector("input[name='password']").value;

      if (password.length < 4) {
        alert("Password too short");
        return false;
      }


      if (!isFormValid) {
        return false;
      }

      fetch("/register", {
        method: "POST",
        body: formData,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then((response) => {
          // Vérifiez si la réponse est OK (statut 200)
          if (!response.ok) {
            if (response.status === 401 || response.status === 400) {
              Err = "Invalid entries.";
              throw new Error("Invalid entries.");
            } else {
              throw new Error(
                `Network response was not ok, status: ${response.status}`
              );
            }
          }
          // Vérifiez si la réponse a un type de contenu JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            // Parsez la réponse en JSON
            return response.json();
          } else {
            // Si la réponse n'est pas au format JSON, renvoyez une réponse vide
            return { notJson: true };
          }
        })
        .then((result) => {
          // Gérez les cas où la réponse n'est pas JSON
          if (result.notJson) {
          } else {
            // Exemple de redirection côté client
            if (result.redirect) {
              formData = null;
              uploadPage(result.datas);
            }
          }
        })
        .catch((error) => {
          // Affichage du message d'erreur
          console.error(error);
          const errorSpans = signupFormM.querySelectorAll(".form__span");
          errorSpans.forEach((errorSpan) => {
            errorSpan.textContent = Err;
            errorSpan.classList.add("nosucces"); // Ajoutez une classe CSS pour un style spécifique si nécessaire
          });
        });
    });
  }

  if (signinFormM) {
    signinFormM.addEventListener("submit", function (e) {
      e.preventDefault();

      var password = this.querySelector('[name="password"]').value;
      var email = this.querySelector('[name="identifiant"]').value;

      if (password.length < 4 || email.trim() === "") {
        alert("Invalid username or password..");
        return false;
      }

      // Récupérer tous les champs du formulaire
      const inputs = signinFormM.querySelectorAll(".values");

      // Parcourir tous les champs
      let isFormValid = true;
      inputs.forEach(function (input) {
        // Vérifier si un champ est vide
        if (input.value.trim() === "") {
          // Mettre en évidence le champ vide (par exemple, ajouter une classe CSS)
          input.classList.add("invalid");
          isFormValid = false;
        } else {
          // Retirer la classe d'invalidité si le champ est rempli
          input.classList.remove("invalid");
        }
      });
      if (!isFormValid) {
        return false;
      }

      var formData = new FormData(this);

      fetch("/login", {
        method: "POST",
        body: formData,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              Err = "Invalid username or password.";
              throw new Error("Invalid username or password.");
            } else {
              throw new Error(
                `Network response was not ok, status: ${response.status}`
              );
            }
          }
          // Vérifiez si la réponse a un type de contenu JSON
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.indexOf("application/json") !== -1) {
            // Parsez la réponse en JSON
            return response.json();
          } else {
            // Si la réponse n'est pas au format JSON, renvoyez une réponse vide
            return { notJson: true };
          }
        })
        .then((result) => {
          // Gérez les cas où la réponse n'est pas JSON
          if (result.notJson) {
          } else {
            // Exemple de redirection côté client
            if (result.redirect) {
              formData = null;
              uploadPage(result.datas);
            }
          }
        })
        .catch((_) => {
          // Affichage du message d'erreur
          const errorSpans = signinFormM.querySelectorAll(".form__span");
          console.log('error--');
          errorSpans.forEach((errorSpan) => {
            errorSpan.textContent = Err;
            errorSpan.classList.add("nosucces"); // Ajoutez une classe CSS pour un style spécifique si nécessaire
          });
        });
    });
  }
}

/*----------------------------------------------------------------/
============== Requette pour filtrer sur le profile =============
/----------------------------------------------------------------*/

document.addEventListener("loadLiveEvent", function () {
  const links = document.querySelectorAll(".private");
  if (links) {
    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        // Récupérez le nom de la section à partir de l'attribut href
        var sectionName = this.getAttribute("href").split("=")[1];
        // Obtenir la partie du chemin après le nom de domaine
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
        xhr.open("GET", "/getSectionContent?name=" + sectionName, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);

              var posts = data?.Posts;
              // Convertir la NodeList en tableau
              var contentAlbums = Array.from(
                document.querySelectorAll(".userPublications")
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
  }
});


export function newURL(sectionName) {
  const nextURL = "/?name=" + sectionName.toLowerCase();
  // Cela va remplacer l'entrée actuelle dans l'historique du navigateur, sans recharger la page
  window.history.replaceState(null, sectionName, nextURL);
}

async function check_connection() {
  const cookieArray = document.cookie.split("; ");
  const value = cookieArray.find((c) => c.startsWith("session"))?.split("=")[1];
  if (value) {
    const datas = await fetchDatas("/check-status");
    uploadPage(datas);
  }
}

window.addEventListener("load", function () {
  buttonsSwitchs();
  bouttons_connexion();
  check_connection();
});

document.addEventListener("loadLiveForum", function () {
  buttonsSwitchs();
  bouttons_connexion();
  check_connection();
});

document.addEventListener("newLoad", function () {
  bouttons_connexion();
});

function validCredential(textCredential) {
  let credentialRegExp = /^[a-zA-Z0-9._-]{2,15}$/;
  if (!textCredential) {
    return false; // Retourne false si l'identifiant est null ou undefined
  }
  const value = credentialRegExp.test(textCredential); // Renvoie le résultat de la validation
  console.log('creating credential', textCredential, 'etat', value);
  return value;
}
     