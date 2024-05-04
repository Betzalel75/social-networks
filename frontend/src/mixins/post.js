import router from "@/router";
import app from "./appSocket";
import utils from "./utils";
import store from "@/store";

const minxinPost = {
  computed: {
    image() {
      return store.getters.postImage;
    },
  },
  methods: {
    submitPosts(formData, url, statusPost, users) {
      // Convertir formData en JSON
      store.commit("setPostImage", {});
      const statusForm = document.querySelector(".login100-form-error");

      const data = JSON.stringify(formData);

      const options = {
        method: "POST",
        body: data,
      };
      fetch(`/api${url}`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            if (statusForm.classList.contains("nosuccess")) {
              statusForm.classList.remove("nosuccess");
              statusForm.innerHTML = "";
            }
            document.getElementById("postForm").reset(); // Réinitialiser le formulaire
            const Data = data.message.Data.Posts; // Reccupere tous les postes
            const id = data.message.PostID; // Reccupere l'id du post qui vient d'etre creer
            const post = Data.find((post) => post.PostID === id); // Reccupere le Post qui vient d'etre creer dans le tableau des posts
            /***
            //unshift pour ajouter au debut du tableau.
            ***/
            if (url === "/post") {
              if (!statusPost) {
                app.methods.broadcastPosts();
              } else {
                app.methods.privateNotif(users);
              }
              store.commit("addAllPost", post);
            } else if (url === "/post-groups") {
              app.methods.broadcastGroup(store.getters.idGroupe);
              if (this.datas) {
                this.datas.unshift(post);
              } else {
                this.datas = [];
                this.datas.unshift(post);
              }
            }
          } else if (data.status === "nosuccess") {
            // Gérer l'échec
            if (statusForm.classList.contains("success")) {
              statusForm.classList.remove("success");
            }
            statusForm.classList.add(data.status);
            statusForm.innerHTML = data.message;
          } else {
            // Objet Erreur
            const erreur = {
              status: null,
              message: null,
            };
            erreur.status = data.code;
            erreur.message = data.message;
            store.commit("setError", erreur);
            router.push("/errors");
          }
        })
        .catch((error) => {
          // Objet Erreur
          const Erreur = {
            status: error.status,
            message: error.message,
          };

          store.commit("setError", Erreur);
          router.push("/errors");
          //error("Erreur lors de la requête AJAX :", error);
        });
    },
    async sendPosts(event) {
      event.preventDefault();
      var pathArray = window.location.pathname.split("/")[1];

      let urlPost = "";
      if (pathArray === "profile") {
        urlPost = "/post";
      } else if (pathArray === "groups") {
        urlPost = "/post-groups";
      }
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

      const formData = new FormData(document.getElementById("postForm"));
      const titler = document.querySelector('#postForm textarea[name="title"]');
      const title = formData.get("title");
      const description = document.querySelector(
        '#postForm textarea[name="desc"]'
      );
      const typePost = formData.get("dropdown");
      let statusPost = false;
      if (typePost == "public") {
        statusPost = false;
      } else {
        statusPost = true;
      }
      // Sélectionne tous les éléments <input type="checkbox"> cochés
      const checkedCheckboxes = document.querySelectorAll(
        '.checkbox-wrapper-5 input[type="checkbox"]:checked'
      );
      const userSelected = this.getCheckedUsers(checkedCheckboxes);

      const desc = description.value; // formData.get('desc');
      const publisher = document.querySelector(
        '#postForm input[name="publish"]'
      );
      const publish = publisher.value;
      const attribut = document.getElementById("output").getAttribute("src");
      // Vérifiez si un fichier a été sélectionné

      if (attribut) {
        const photoFile = formData.get("postimage");
        const inputFileElement = document.getElementById("fileInput"); // Obtenez l'élément d'entrée de type fichier
        const inputFile = inputFileElement.files[0]; // Obtenez le fichier à partir de l'élément d'entrée de type fichier
        const img = await utils.methods
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

            const file = document.getElementById("output");
            if (file) {
              file.removeAttribute("src");
              // Réinitialisez le champ de sélection de fichier
              inputFileElement.value = ""; // Réinitialisez la valeur de l'élément d'entrée de type fichier
            }
            if (base64Content) {
              return image;
            } else {
              return {};
            }
          });
        store.commit("setPostImage", img);
      }

      if (
        publish !== "Publish" ||
        title === "" ||
        desc === "" ||
        !auMoinsUneSelectionnee
      ) {
        //error("Champs incomplets");
        if (!auMoinsUneSelectionnee) {
          lis.forEach(function (li) {
            if (li) {
              li.classList.add("invalid");
            }
          });
          //error("At least one checkbox must be selected.");
        } else {
          lis.forEach(function (li) {
            if (li) {
              li.classList.remove("invalid");
            }
          });
        }

        return false;
      }
      if (!this.validPostTittle(title)) {
        titler.classList.add("invalid");
        return false;
      } else {
        titler.classList.remove("invalid");
      }
      if (!this.validPostDesc(desc)) {
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

      const dataPost = {
        cookie: "",
        title: formData.get("title"),
        desc: formData.get("desc"),
        publish: publish,
        cat: formData.getAll("cat"),
        image: this.image,
        private: statusPost,
        type: typePost,
        users: userSelected,
        groupID: store.getters.idGroupe,
      };

      const value = utils.methods.getCookieValue("session");
      if (!value) {
        //error("no session cookie");
        myMixin.methods.sayonara();
        return false;
      }
      dataPost.cookie = value;

      this.submitPosts(dataPost, urlPost, statusPost, userSelected);
    },
    validPostDesc(text) {
      let RegExp =
        /^[\w\p{L}0-9._\-\s\n\r\t!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]{1,500}$/u;
      if (!text) {
        return false; // Retourne false si l'identifiant est null ou undefined
      }
      return RegExp.test(text); // Renvoie le résultat de la validation
    },
    validPostTittle(text) {
      let RegExp =
        /^[\w\p{L}0-9._\-\s\n\r\t!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]{1,50}$/u;
      if (!text) {
        return false; // Retourne false si l'identifiant est null ou undefined
      }
      return RegExp.test(text); // Renvoie le résultat de la validation
    },
    getCheckedUsers(checkedCheckboxes) {
      let checkedUsers = [];
      // Parcourt chaque checkbox coché
      checkedCheckboxes.forEach((checkbox) => {
        // Trouve l'élément <li> parent du checkbox
        const userLi = checkbox.closest(".check");
        if (userLi) {
          // Récupère le nom d'utilisateur et l'image
          const userID = userLi
            .querySelector(".user")
            .getAttribute("data-user-id")
            .trim();
          // const userName = userLi.querySelector(`.username-${userID}`).textContent;

          // Ajoute l'utilisateur à l'objet checkedUsers
          checkedUsers.push(userID);
        }
      });

      return checkedUsers;
    },
  },
};

export default minxinPost;
