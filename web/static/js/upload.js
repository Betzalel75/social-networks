function showDiv() {
  var checkbox = document.getElementById("updateCheckbox");
  var passwordDiv = document.getElementById("passwordDiv");
  var existingPassword = document.getElementById("existingPassword");
  if (checkbox.checked) {
    passwordDiv.style.display = "block";
    existingPassword.style.display = "none";
  } else {
    passwordDiv.style.display = "none";
    existingPassword.style.display = "block";
  }
}

var loadFile = function (event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src) // libère l'objet URL
  }
};


