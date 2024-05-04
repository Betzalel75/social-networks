<template>
  <div>
    <div class="svg-chat">
      <svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 512 512">
        <path fill="#74C0FC"
          d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
      </svg>
    </div>
    <div class="chat-position">
      <div class="main-chat">
        <div class="blur-background"></div>
        <div class="wrapper-chat">
          <div class="exit-to-chat">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
              style="stroke: white; stroke-width: 2px">
              <path
                d="m366-310 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56ZM200-200v-560 560-1 1Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v334q-19-7-39-10.5t-41-3.5v-320H200v560h320q0 21 3.5 41t10.5 39H200Zm560 80-56-56 63-64H600v-80h167l-63-64 56-56 160 160L760-40Z" />
            </svg>
          </div>
          <div class="container-chat">
            <div class="left">
              <div class="top">
                <input type="text" placeholder="Search" />
                <a href="javascript:;" class="search"></a>
              </div>
              <ul class="people">
                <li class="person" data-chat="person1">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/thomas.jpg" alt="" />
                  <span class="name">Thomas Bangalter</span>
                  <span class="time">2:09 PM</span>
                  <span class="preview">I was wondering...</span>
                </li>
                <li class="person" data-chat="person2">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/dog.png" alt="" />
                  <span class="name">Dog Woofson</span>
                  <span class="time">1:44 PM</span>
                  <span class="preview">I've forgotten how it felt before</span>
                </li>
                <li class="person" data-chat="person3">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/louis-ck.jpeg" alt="" />
                  <span class="name">Louis CK</span>
                  <span class="time">2:09 PM</span>
                  <span class="preview">But we’re probably gonna need a new carpet.</span>
                </li>
                <li class="person" data-chat="person4">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/bo-jackson.jpg" alt="" />
                  <span class="name">Bo Jackson</span>
                  <span class="time">2:09 PM</span>
                  <span class="preview">It’s not that bad...</span>
                </li>
                <li class="person" data-chat="person5">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/michael-jordan.jpg" alt="" />
                  <span class="name">Michael Jordan</span>
                  <span class="time">2:09 PM</span>
                  <span class="preview">Wasup for the third time like is you blind bitch</span>
                </li>
                <li class="person" data-chat="person6">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/drake.jpg" alt="" />
                  <span class="name">Drake</span>
                  <span class="time">2:09 PM</span>
                  <span class="preview">howdoyoudoaspace</span>
                </li>
              </ul>
            </div>
            <div class="right">
              <div class="top">
                <span>To: <span class="name">Dog Woofson</span></span>
              </div>
              <div class="chat" data-chat="person1">
                <div class="conversation-start">
                  <span>Today, 6:48 AM</span>
                </div>
                <div class="bubble you">Hello,</div>
                <div class="bubble you">it's me.</div>
                <div class="bubble you">I was wondering...</div>
              </div>
              <div class="chat" data-chat="person2">
                <div class="conversation-start">
                  <span>Today, 5:38 PM</span>
                </div>
                <div class="bubble you">Hello, can you hear me?</div>
                <div class="bubble you">I'm in California dreaming</div>
                <div class="bubble me">... about who we used to be.</div>
                <div class="bubble me">Are you serious?</div>
                <div class="bubble you">When we were younger and free...</div>
                <div class="bubble you">I've forgotten how it felt before</div>
              </div>
              <div class="chat" data-chat="person3">
                <div class="conversation-start">
                  <span>Today, 3:38 AM</span>
                </div>
                <div class="bubble you">Hey human!</div>
                <div class="bubble you">
                  Umm... Someone took a shit in the hallway.
                </div>
                <div class="bubble me">... what.</div>
                <div class="bubble me">Are you serious?</div>
                <div class="bubble you">I mean...</div>
                <div class="bubble you">It’s not that bad...</div>
                <div class="bubble you">
                  But we’re probably gonna need a new carpet.
                </div>
              </div>
              <div class="chat" data-chat="person4">
                <div class="conversation-start">
                  <span>Yesterday, 4:20 PM</span>
                </div>
                <div class="bubble me">Hey human!</div>
                <div class="bubble me">
                  Umm... Someone took a shit in the hallway.
                </div>
                <div class="bubble you">... what.</div>
                <div class="bubble you">Are you serious?</div>
                <div class="bubble me">I mean...</div>
                <div class="bubble me">It’s not that bad...</div>
              </div>
              <div class="chat" data-chat="person5">
                <div class="conversation-start">
                  <span>Today, 6:28 AM</span>
                </div>
                <div class="bubble you">Wasup</div>
                <div class="bubble you">Wasup</div>
                <div class="bubble you">
                  Wasup for the third time like is <br />you blind bitch
                </div>
              </div>
              <div class="chat" data-chat="person6">
                <div class="conversation-start">
                  <span>Monday, 1:27 PM</span>
                </div>
                <div class="bubble you">So, how's your new phone?</div>
                <div class="bubble you">You finally have a smartphone :D</div>
                <div class="bubble me">Drake?</div>
                <div class="bubble me">Why aren't you answering?</div>
                <div class="bubble you">howdoyoudoaspace</div>
              </div>
              <div class="write">
                <a href="javascript:;" class="write-link attach"></a>
                <input type="text" />
                <a href="javascript:;" class="write-link smiley"></a>
                <a href="javascript:;" class="write-link send"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url(@/assets/css/styles.css);
</style>

<script>
export default {
  mounted() {
    // Vous pouvez appeler la méthode pour initialiser le comportement du chat lors du montage du composant
    this.moveToMessage();
    this.hoverSelected();
  },
  methods: {
    hoverSelected() {
      //
      const friends = {
        list: document.querySelector("ul.people"),
        all: document.querySelectorAll(".left .person"),
        name: "",
      };
      //
      friends.all.forEach((f) => {
        f.addEventListener("mousedown", () => {
          if (!f.classList.contains("active")) {
            this.setActiveChat(f);
          }
        });
      });
    },
    setActiveChat(f) {
      //
      const friends = {
        list: document.querySelector("ul.people"),
        all: document.querySelectorAll(".left .person"),
        name: "",
      };
      const chat = {
        containerChat: document.querySelector(".container-chat .right"),
        current: null,
        person: null,
        name: document.querySelector(".container-chat .right .top .name"),
      };
      //
      if (friends.list.classList.contains("active")) {
        friends.list.querySelector(".active").classList.remove("active");
      }
      friends.all.forEach((item) => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
      });
      f.classList.add("active");
      chat.current = chat.containerChat.querySelector(".active-chat");
      if (chat.current) {
        chat.current.classList.remove("active-chat");
      }
      chat.person = f.getAttribute("data-chat");
      chat.containerChat
        .querySelector('[data-chat="' + chat.person + '"]')
        .classList.add("active-chat");
      friends.name = f.querySelector(".name").innerText;
      chat.name.innerHTML = friends.name;
    },
    moveToMessage() {
      const svgChat = document.querySelector(".svg-chat");
      const messageButton = svgChat.querySelector("svg");
      // Récupère la div.chat-position
      const chatPosition = document.querySelector(".chat-position");
      // Récupère la div.container-chat
      const containerChat = document.querySelector(".container-chat");
      const svg = document.querySelector(".exit-to-chat");
      svg.addEventListener("click", () => {
        //log("click to exit to chat");
        chatPosition.style.left = "-150%"; // Déplace la div vers la gauche
        chatPosition.classList.remove("activated");
      });
      const originPath =
        "M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z";
      const overPath =
        "M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z";
      messageButton.addEventListener("mouseover", () => {
        svgChat.classList.add("hovered");
        const path = messageButton.querySelector("path"); // Utiliser messageButton au lieu de chatPosition et utiliser querySelector pour sélectionner le chemin SVG
        path.setAttribute("d", overPath);
      });

      messageButton.addEventListener("mouseout", () => {
        svgChat.classList.remove("hovered");
        const path = messageButton.querySelector("path");
        path.setAttribute("d", originPath);
      });

      messageButton.addEventListener("click", () => {
        //log("click to enter into chat");
        chatPosition.classList.add("activated");
      });
    },
  },
};
</script>
