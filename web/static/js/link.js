(function() {
  
  let switch_Ctn = document.querySelector("#switch-cnt");
  let switch_C1 = document.querySelector("#switch-c1");
  let switch_C2 = document.querySelector("#switch-c2");
  let switch_Circle = document.querySelectorAll(".switch__circle");
  let switch_Btn = document.querySelectorAll(".switch-btn");
  let a_Container = document.querySelector("#a-container");
  let b_Container = document.querySelector("#b-container");


  let changeForm = (e) => {
    e.preventDefault();
    switch_Ctn.classList.add("is-gx");
    setTimeout(function () {
      switch_Ctn.classList.remove("is-gx");
    }, 1500);

    switch_Ctn.classList.toggle("is-txr");
    switch_Circle[0].classList.toggle("is-txr");
    switch_Circle[1].classList.toggle("is-txr");

    switch_C1.classList.toggle("is-hidden");
    switch_C2.classList.toggle("is-hidden");
    a_Container.classList.toggle("is-txl");
    b_Container.classList.toggle("is-txl");
    b_Container.classList.toggle("is-z200");
  };

  for (var i = 0; i < switch_Btn.length; i++)
    switch_Btn[i].addEventListener("click", changeForm);

  const login_Btn = document.getElementById("login");
  const signup_Btn = document.getElementById("signup");

  login_Btn.addEventListener("click", (e) => {
    let parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add("slide-up");
      } else {
        signup_Btn.parentNode.classList.add("slide-up");
        parent.classList.remove("slide-up");
      }
    });
  });

  signup_Btn.addEventListener("click", (e) => {
    let parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add("slide-up");
      } else {
        login_Btn.parentNode.parentNode.classList.add("slide-up");
        parent.classList.remove("slide-up");
      }
    });
  });

})();