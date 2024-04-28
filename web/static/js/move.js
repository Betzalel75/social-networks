import { newURL } from "./login.js";

// Function to set the active link based on URL parameter
function setActiveLink(nameParam) {
  // const urlParams = new URLSearchParams(window.location.search);
  // const nameParam = urlParams.get('name');
  const links = document.querySelectorAll(".profile-menu-link");
  // Remove the "active" class from all links
  links.forEach((link) => link.classList.remove("active"));
  // Add the "active" class to the link with the corresponding name parameter
  links.forEach((link) => {
    if (link.getAttribute("href").includes(`name=${nameParam}`)) {
      link.classList.add("active");
    }
  });
}

window.setActiveLink = setActiveLink;

(function() {
// Check if no link has the "active" class, then add it to the "All Posts" link
const activeLinks = document.querySelectorAll(
  ".profile-menu-link.active"
);

if (activeLinks.length === 0) {
  document
    .querySelector('.profile-menu-link[href^="/"]')
    .classList.add("active");
}
})();


function getContent(page) {
  const divForum = document.querySelector(".formDiv");
  const userDiv = document.querySelector(".userDiv");
  setActiveLink("all");
  newURL("all");

  switch (page) {
    case "formDiv":
      divForum.style.display = "flex";
      userDiv.style.display = "none";
      break;
    case "userDiv":
      userDiv.style.display = "flex";
      const div_public = divForum.querySelector(".all-posts");
      const divs = div_public.querySelectorAll(".album.box.publicPublications");
      divs.forEach((div) => {
        div.remove();
      });
      divForum.style.display = "none";
      break;
    default:
      divForum.style.display = "none";
      userDiv.style.display = "flex";
      break;
  }
}
window.getContent = getContent;

document.addEventListener("loadLiveEvent", function () {
  const divActiv = "formDiv";
  getContent(divActiv);
  setActiveLink("all");
});

document.addEventListener('ForumContentLoaded', function() {
  const divActiv = "formDiv";
  getContent(divActiv);
  setActiveLink("all");
});
