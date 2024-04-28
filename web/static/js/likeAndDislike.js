// Fonction pour envoyer la rétroaction (feedback) au serveur
function sendFeedback(postId, action, url) {
  const likeCountPost = document.querySelectorAll(`.likeCount[data-post-id="${postId}"]`);
  const dislikeCountPost = document.querySelectorAll(`.dislikeCount[data-post-id="${postId}"]`);

  const cookieArray = document.cookie.split("; ");
  const value = cookieArray.find((c) => c.startsWith("session"))?.split("=")[1];
  if (value) {
  // Exemple de requête Fetch API
  fetch("/like?name=" + url, {
    method: 'POST',
    body: JSON.stringify({ postId: postId, action: action }),
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }
  })
    .then(response => response.json())
    .then(data => {
      // Mettez à jour les compteurs avec les données de la réponse du serveur
      likeCountPost.forEach(like => {
        like.textContent = data.likeCount;
      });
      dislikeCountPost.forEach(dislike => {
        dislike.textContent = data.dislikeCount;
      });
      // console.table('table-like: ',data);
    })
    .catch(error => {
      console.error(error);
    });
  }else{
      var event = new Event("logOut");
        document.dispatchEvent(event);
    }
}

