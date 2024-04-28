<template>
  <div class="conversation" ref="conversation" @mousedown="startDrag" @mousemove="drag" @mouseup="stopDrag"
    @mouseleave="stopDrag" :style="{ left: `${left}px`, top: `${top}px` }">
    <div class="container-chat" style="display: none">
      <div class="chat">
        <div class="chat-header clearfix">
          <div class="row">
            <div class="col-lg-6">
              <router-link to="/profiles" href="javascript:void(0);" @click="getProfil($event); quitter($event)"
                data-toggle="modal" data-target="#view_info">
                <img src="../assets/images/default.jpg" alt="avatar" style="cursor: pointer" />
              </router-link>
              <div class="chat-about">
                <h2 class="head-discussion"></h2>
                <small class="typing" style="visibility: hidden">
                  <div class="typing-dot">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div>
                </small>
              </div>
            </div>
          </div>
          <svg height="16" width="16" viewBox="0 0 512 512" class="exit" @click="quitter($event)">
            <path
              d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z">
            </path>
          </svg>
  
        </div>
        <div class="chat-history" id="chatHistory">
          <ul class="messages-bubble"></ul>
          <div class="emoji-list">
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
        <div class="chat-message clearfix">
          <textarea id="message-input" type="text" class="form-control" placeholder="Enter text here..."></textarea>
          <div class="input-group">
            <div class="input-group-prepend">
              <a class="publisher-btn" href="javascript:void(0)" alt="😄" data-abc="true" @click="toggleEmojiList()"><i
                  class="fa fa-smile"></i></a>
              <button class="input-group-text" @click="handleClick($event)"><i class="fa fa-send"></i></button>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
@import url("../assets/css/main.css");
</style>

<script>
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import myMixin from "@/mixins/global";
import webSocketGo from "@/mixins/websocket";

export default {
  mixins: [app, webSocketGo, utils, myMixin],
  data() {
    return {
      left: 400,
      top: 0,
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
    };
  },
  props:{
    ok: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    handleClick(event) {
      if (this.ok) {
        this.sendMessages(event);
      } else {
        this.sendRoomMessage(event);
      }
    },
    toggleEmojiList() {
      var emojiList = document.querySelector(".emoji-list");
      emojiList.style.display =
        emojiList.style.display === "none" || emojiList.style.display === ""
          ? "flex"
          : "none";
    },
    insertEmoji(emoji, message_id_chat) {
      var messageInput = document.getElementById(
        `message-input-${message_id_chat}`
      );
      messageInput.value += emoji;
    },
    returnObjetc() {
      // Définir les emojis par catégorie
      return {
        Smileys:
          "😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 🥰 😘 😗 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 🥵 😞 😟 🥶 🥴 😤 😢 😭 😦 😧 🥳 😨 😩 🤯 😬 😰 😱 😳 🤪 😵 😡 🥺 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤥 🤫 🤭 🧐 🤓 😈 👿 🤡 👹 👺 💀 ☠️ 👻 👽 👾 🤖 💩 🙊",
        Amour:
          "💋 💘 💝 💖 💗 💓 💞 💕 💌 ❣️ 💔 ❤️ 🧡 💛 💚 💙 💜 🖤 💟 💍 💎 💐 💒",
        Personnes:
          "👶 🧒 👦 👧 🧑 👨 👱‍♂️ 🧔 👩 👱‍♀️ 🧓 👴 👵 👨‍⚕️ 👩‍⚕️ 👨‍🎓 👩‍🎓 👨‍🏫 👩‍🏫 👨‍⚖️ 👩‍⚖️ 👨‍🌾 👩‍🌾 👨‍🍳 👩‍🍳 👨‍🔧 👩‍🔧 👨‍🏭 👩‍🏭 👨‍💼 👩‍💼 👨‍🔬 👩‍🔬 👨‍💻 👩‍💻 👨‍🎤 👩‍🎤 👨‍🎨 👩‍🎨 👨‍✈️ 👩‍✈️ 👨‍🚀 👩‍🚀 👨‍🚒 👩‍🚒 👮‍♂️ 👮‍♀️ 🕵️‍♂️ 🕵️‍♀️ 💂‍♂️ 💂‍♀️ 👷‍♂️ 👷‍♀️ 🤴 👸 👳‍♂️ 👳‍♀️ 👲 🧕 🤵 👰 🤰 🤱 👼 🎅 🤶 🧙‍♂️ 🧙‍♀️ 🧚‍♂️ 🧚‍♀️ 👨‍🦰 🧛‍♂️ 🧛‍♀️ 👨‍🦱 👨‍🦳 👨‍🦲 🧜‍♂️ 🧜‍♀️ 🧝‍♂️ 👩‍🦰 👩‍🦱 🧝‍♀️ 👩‍🦳 🧞‍♂️ 👩‍🦲 🧞‍♀️ 🧟‍♂️ 🧟‍♀️ 🙍‍♂️ 🙍‍♀️ 🙎‍♂️ 🙎‍♀️ 🙅‍♂️ 🙅‍♀️ 🙆‍♂️ 🙆‍♀️ 💁‍♂️ 💁‍♀️ 🙋‍♂️ 🙋‍♀️ 🙇‍♂️ 🙇‍♀️ 🤦 🤦‍♂️ 🤦‍♀️ 🤷 🤷‍♂️ 🤷‍♀️ 💆‍♂️ 💆‍♀️ 💇‍♂️ 💇‍♀️ 👤 👥 🦸‍♂️ 🦸‍♀️ 🦹‍♂️ 🦹‍♀️ 👫 👬 👭 👩‍❤️‍💋‍👨 👨‍❤️‍💋‍👨 👩‍❤️‍💋‍👩 👩‍❤️‍👨 👨‍❤️‍👨 👩‍❤️‍👩 👨‍👩‍👦 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 👨‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👦 👨‍👦‍👦 👨‍👧 👨‍👧‍👦 👨‍👧‍👧 👩‍👦 👩‍👦‍👦 👩‍👧 👩‍👧‍👦 👩‍👧‍👧",
        Gestes:
          "🦵 🦶 🤳 💪 👈 👉 ☝️ 👆 🖕 👇 ✌️ 🤞 🖖 🤘 🤙 🖐️ ✋ 👌 👍 👎 ✊ 👊 🤛 🤜 🤚 👋 🤟 ✍️ 👏 👐 🙌 🤲 🙏 🤝 👂 👃 👀 👁️ 🧠 👅 👄",
        Activités:
          "🚶‍♂️ 🚶‍♀️ 🏃‍♂️ 🏃‍♀️ 💃 🕺 👯‍♂️ 👯‍♀️ 🧖‍♂️ 🧖‍♀️ 🧗‍♂️ 🧗‍♀️ 🧘‍♂️ 🧘‍♀️ 🛌 🕴️ 🗣️ 🤺 🏇 ⛷️ 🏂 🏌️‍♂️ 🏌️‍♀️ 🏄‍♂️ 🏄‍♀️ 🚣‍♂️ 🚣‍♀️ 🏊‍♂️ 🏊‍♀️ ⛹️‍♂️ ⛹️‍♀️ 🏋️‍♂️ 🏋️‍♀️ 🚴‍♂️ 🚴‍♀️ 🚵‍♂️ 🚵‍♀️ 🏎️ 🏍️ 🤸 🤸‍♂️ 🤸‍♀️ 🤼 🤼‍♂️ 🤼‍♀️ 🤽 🤽‍♂️ 🤽‍♀️ 🤾 🤾‍♂️ 🤾‍♀️ 🤹 🤹‍♂️ 🤹‍♀️ 🎖️ 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🏀 🏐 🏈 🏉 🎾 🎳 🏏 🏑 🥎 🏒 🏓 🏸 🥊 🥋 🥏 🥅 ⛸️ 🎣 🥍 🎿 🛷 🥌 🎯 🎱 🧿 🧩 🧸 🧵 🧶",
        Musique:
          "📢 📣 📯 🔔 🎼 🎵 🎶 🎙️ 🎚️ 🎛️ 🎧 📻 🎷 🎸 🎹 🎺 🎻 🥁 💽 💿 📀 🎥 🎞️ 📽️ 🎬 📺 📷 📸 📹 📼",
        Nourriture:
          "🥭 🍇 🍈 🍉 🍊 🍋 🍌 🍍 🍎 🍏 🍐 🍑 🍒 🥬 🍓 🥝 🍅 🥥 🥑 🍆 🥔 🥕 🌽 🌶️ 🥯 🥒 🥦 🥜 🌰 🍞 🥐 🥖 🥨 🥞 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🥚 🧂 🍳 🥘 🍲 🥣 🥗 🍿 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🥮 🍝 🍠 🍢 🍣 🍤 🍥 🍡 🥟 🥠 🥡 🍦 🍧 🍨 🍩 🍪 🧁 🎂 🍰 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🥢 🍽️ 🍴 🥄 🏺",
        Animaux:
          "😺 😸 😹 😻 😼 😽 🙀 😿 😾 🙈 🙉 🦝 🐵 🐒 🦍 🐶 🐕 🐩 🐺 🦊 🐱 🐈 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🐮 🦙 🐂 🐃 🐄 🐷 🦛 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦒 🐘 🦏 🐭 🐁 🐀 🦘 🐹 🦡 🐰 🐇 🐿️ 🦔 🦇 🐻 🐨 🐼 🐾 🦃 🐔 🦢 🐓 🐣 🐤 🦚 🐥 🐦 🦜 🐧 🕊️ 🦅 🦆 🦉 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🐟 🐠 🐡 🦈 🐙 🐚 🦀 🦟 🦐 🦑 🦠 🐌 🦋 🐛 🐜 🐝 🐞 🦗 🕷️ 🕸️ 🦂 🦞",
        Nature:
          "🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🍄",
        Pictogrammes:
          "⌛ ⏳ ⚡ 🎆 🎇 🔇 🔈 🔉 🔊 🔕 🔒 🔓 🔏 🔐 🚮 🚰 ♿ 🚹 🚺 🚻 🚼 🚾 🛂 🛃 🛄 🛅 ⚠️ 🚸 ⛔ 🚫 🚳 🚭 🚯 🚱 🚷 📵 🔞 ⏭️ ⏯️ ⏮️ ⏸️ ⏹️ ⏺️ ⏏️ 🎦 🔅 🔆 📶 📳 📴 🔱 ℹ️ Ⓜ️ 🅿️",
        Flèches:
          "🧭 ⬆️ ↗️ ➡️ ↘️ ⬇️ ↙️ ⬅️ ↖️ ↕️ ↔️ ↩️ ↪️ ⤴️ ⤵️ 🔃 🔄 🔀 🔁 🔂 ▶️ ⏩ ◀️ ⏪ 🔼 ⏫ 🔽 ⏬",
        Objets:
          "🦷 🦴 🛀 👣 💣 🔪 🧱 🛢️ ⛽ 🛹 🚥 🚦 🚧 🛎️ 🧳 ⛱️ 🔥 🧨 🎗️ 🎟️ 🎫 🧧 🔮 🎲 🎴 🎭 🖼️ 🎨 🎤 🔍 🔎 🕯️ 💡 🔦 🏮 📜 🧮 🔑 🗝️ 🔨 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🔫 🏹 🛡️ 🔧 🔩 ⚙️ 🗜️ ⚖️ ⛓️ ⚗️ 🔬 🔭 📡 💉 💊 🚪 🛏️ 🛋️ 🚽 🚿 🛁 🛒 🚬 ⚰️ ⚱️ 🧰 🧲 🧪 🧴 🧷 🧹 🧻 🧼 🧽 🧯 💠 ♟️",
        Bureau:
          "💺 🎮 🕹️ 🎰 📱 📲 ☎️ 📞 📟 📠 💻 🖥️ 🖨️ ⌨️ 🖱️ 🖲️ 💾 📔 📕 📖 📗 📘 📙 📚 📓 📒 📃 📄 📰 🗞️ 📑 🔖 🏷️ 💰 💴 💵 💶 💷 💸 💳 💹 💱 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳️ ✏️ ✒️ 🖋️ 🖊️ 🖌️ 🖍️ 📝 💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📇 📈 📉 📊 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🗃️ 🗄️ 🗑️ 🧾",
        Vêtements:
          "💅 👓 🕶️ 👔 👕 👖 🧣 🧤 🧥 🧦 👗 👘 👙 👚 👛 👜 👝 🛍️ 🎒 👞 👟 👠 👡 👢 👑 👒 🎩 🎓 🧢 ⛑️ 📿 💄 🌂 ☂️ 🎽 🥽 🥼 🥾 🥿 🧺",
        Véhicules:
          "🚂 🚃 🚄 🚅 🚆 🚇 🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚜 🚲 🛴 🛵 🚏 🛣️ 🛤️ ⛵ 🛶 🚤 🛳️ ⛴️ 🛥️ 🚢 ✈️ 🛩️ 🛫 🛬 🚁 🚟 🚠 🚡 🛰️ 🚀 🛸",
        Lieux:
          "🌍 🌎 🌏 🌐 🗺️ 🗾 🏔️ ⛰️ 🗻 🏕️ 🏖️ 🏜️ 🏝️ 🏞️ 🏟️ 🏛️ 🏗️ 🏘️ 🏚️ 🏠 🏡 🏢 🏣 🏤 🏥 🏦 🏨 🏩 🏪 🏫 🏬 🏭 🏯 🏰 🗼 🗽 ⛪ 🕌 🕍 ⛩️ 🕋 ⛲ ⛺ 🏙️ 🎠 🎡 🎢 🎪 ⛳ 🗿",
        Météo:
          "💦 🌋 🌁 🌃 🌄 🌅 🌆 🌇 🌉 🌌 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 🌡️ ☀️ 🌝 🌞 🌟 🌠 ☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ 🌀 🌈 ☔ ❄️ ☃️ ⛄ ☄️ 💧 🌊 🎑",
        Horloge:
          "⌚ ⏰ ⏱️ ⏲️ 🕰️ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦",
        Texte:
          "🏧 🔙 🔚 🔛 🔜 🔝 🔰 ‼️ ⁉️ ❓ ❔ ❕ ❗ ™️ #️⃣ *️⃣ 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 💯 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 🆔 🆕 🆖 🅾️ 🆗 🆘 🆙 🆚 🈁 🈂️ 🈷️ 🈶 🈯 🉐 🈹 🈚 🈲 🉑 🈸 🈴 🈳 ㊗️ ㊙️ 🈺 🈵 🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿",
        Symboles:
          "💢 ♨️ 💈 ⚓ ♠️ ♥️ ♦️ ♣️ 💲 ☢️ ☣️ 🛐 ⚛️ 🕉️ ✡️ ☸️ ☯️ ✝️ ☦️ ☪️ ☮️ 🕎 🔯 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⛎ ♀️ ♂️ ⚕️ ♻️ ⚜️ ©️ ®️ ♾️",
        Divers:
          "👁️‍🗨️ 💤 💥 💨 💫 💬 🗨️ 🗯️ 💭 🕳️ 🚨 🛑 ⭐ 🎃 🎄 ✨ 🎈 🎉 🎊 🎋 🎍 🎎 🎏 🎐 🎀 🎁 🃏 🀄 🔋 🔌 🔗 🧫 🧬 📛 ⭕ ✅ ☑️ ✔️ ✖️ ❌ ❎ ➕ ➖ ➗ ➰ ➿ 〽️ ✳️ ✴️ ❇️ 〰️ 🔴 🔵 ⚪ ⚫ ⬜ ⬛ ◼️ ◻️ ◽ ◾ ▫️ ▪️ 🔶 🔷 🔸 🔹 🔺 🔻 🔘 🔲 🔳 🏻 🏼 🏽 🏾 🏿",
        Drapeaux:
          "🏁 🚩 🎌 🏴 🏳️ 🏳️‍🌈 🇦🇨 🇦🇩 🇦🇪 🇦🇫 🇦🇬 🇦🇮 🇦🇱 🇦🇲 🇦🇴 🇦🇶 🇦🇷 🇦🇸 🇦🇹 🇦🇺 🇦🇼 🇦🇽 🇦🇿 🇧🇦 🇧🇧 🇧🇩 🇧🇪 🇧🇫 🇧🇬 🇧🇭 🇧🇮 🇧🇯 🇧🇱 🇧🇲 🇧🇳 🇧🇴 🇧🇶 🇧🇷 🇧🇸 🇧🇹 🇧🇻 🇧🇼 🇧🇾 🇧🇿 🇨🇦 🇨🇨 🇨🇩 🇨🇫 🇨🇬 🇨🇭 🇨🇮 🇨🇰 🇨🇱 🇨🇲 🇨🇳 🇨🇴 🇨🇵 🇨🇷 🇨🇺 🇨🇻 🇨🇼 🇨🇽 🇨🇾 🇨🇿 🇩🇪 🇩🇬 🇩🇯 🇩🇰 🇩🇲 🇩🇴 🇩🇿 🇪🇦 🇪🇨 🇪🇪 🇪🇬 🇪🇭 🇪🇷 🇪🇸 🇪🇹 🇪🇺 🇫🇮 🏴‍☠️ 🇫🇯 🇫🇰 🇫🇲 🇫🇴 🇫🇷 🇬🇦 🇬🇧 🇬🇩 🇬🇪 🇬🇫 🇬🇬 🇬🇭 🇬🇮 🇬🇱 🇬🇲 🇬🇳 🇬🇵 🇬🇶 🇬🇷 🇬🇸 🇬🇹 🇬🇺 🇬🇼 🇬🇾 🇭🇰 🇭🇲 🇭🇳 🇭🇷 🇭🇹 🇭🇺 🇮🇨 🇮🇩 🇮🇪 🇮🇱 🇮🇲 🇮🇳 🇮🇴 🇮🇶 🇮🇷 🇮🇸 🇮🇹 🇯🇪 🇯🇲 🇯🇴 🇯🇵 🇰🇪 🇰🇬 🇰🇭 🇰🇮 🇰🇲 🇰🇳 🇰🇵 🇰🇷 🇰🇼 🇰🇾 🇰🇿 🇱🇦 🇱🇧 🇱🇨 🇱🇮 🇱🇰 🇱🇷 🇱🇸 🇱🇹 🇱🇺 🇱🇻 🇱🇾 🇲🇦 🇲🇨 🇲🇩 🇲🇪 🇲🇫 🇲🇬 🇲🇭 🇲🇰 🇲🇱 🇲🇲 🇲🇳 🇲🇴 🇲🇵 🇲🇶 🇲🇷 🇲🇸 🇲🇹 🇲🇺 🇲🇻 🇲🇼 🇲🇽 🇲🇾 🇲🇿 🇳🇦 🇳🇨 🇳🇪 🇳🇫 🇳🇬 🇳🇮 🇳🇱 🇳🇴 🇳🇵 🇳🇷 🇳🇺 🇳🇿 🇴🇲 🇵🇦 🇵🇪 🇵🇫 🇵🇬 🇵🇭 🇵🇰 🇵🇱 🇵🇲 🇵🇳 🇵🇷 🇵🇸 🇵🇹 🇵🇼 🇵🇾 🇶🇦 🇷🇪 🇷🇴 🇷🇸 🇷🇺 🇷🇼 🇸🇦 🇸🇧 🇸🇨 🇸🇩 🇸🇪 🇸🇬 🇸🇭 🇸🇮 🇸🇯 🇸🇰 🇸🇱 🇸🇲 🇸🇳 🇸🇴 🇸🇷 🇸🇸 🇸🇹 🇸🇻 🇸🇽 🇸🇾 🇸🇿 🇹🇦 🇹🇨 🇹🇩 🇹🇫 🇹🇬 🇹🇭 🇹🇯 🇹🇰 🇹🇱 🇹🇲 🇹🇳 🇹🇴 🇹🇷 🇹🇹 🇹🇻 🇹🇼 🇹🇿 🇺🇦 🇺🇬 🇺🇲 🇺🇳 🇺🇸 🇺🇾 🇺🇿 🇻🇦 🇻🇨 🇻🇪 🇻🇬 🇻🇮 🇻🇳 🇻🇺 🇼🇫 🇼🇸 🇽🇰 🇾🇪 🇾🇹 🇿🇦 🇿🇲 🇿🇼 🏴 🏴 🏴",
      };
    },
    // Fonction pour afficher les emojis d'une catégorie spécifique
    afficherEmojisParCategorie(categorie) {
      // Récupérer l'élément div qui contient la liste d'emojis
      var emojiListDivs = document.querySelectorAll(".emoji-list");
      emojiListDivs.forEach(emojiListDiv => { // Utilisation d'une fonction fléchée ici
        // Vider le contenu actuel de la liste
        var element = emojiListDiv.querySelector(`#${categorie}`);
        var content = element.querySelector(".span-content");

        // Récupérer les emojis de la catégorie spécifiée
        var emojisParCategorie = this.returnObjetc();
        var emojis = emojisParCategorie[categorie];

        // Séparer les emojis par espace et les ajouter à la liste
        emojis.split(" ").forEach(emoji => { // Utilisation d'une fonction fléchée ici aussi
          var span = document.createElement("span");
          span.classList.add("emoji");
          span.innerText = emoji;
          content.appendChild(span);
        });
      });
    },
    startDrag(e) {
      this.isDragging = true;
      this.offsetX = e.clientX - this.left;
      this.offsetY = e.clientY - this.top;
    },
    drag(e) {
      if (!this.isDragging) return;

      // Obtenir la largeur et la hauteur de la div "conversation"
      const conversationWidth = this.$refs.conversation.offsetWidth;
      const conversationHeight = this.$refs.conversation.offsetHeight;

      // Obtenir la largeur et la hauteur de la fenêtre du navigateur
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculer les positions maximales pour le déplacement
      const maxLeft = windowWidth - conversationWidth;
      const maxTop = windowHeight - conversationHeight;

      // Calculer les nouvelles positions
      let newLeft = e.clientX - this.offsetX;
      let newTop = e.clientY - this.offsetY;

      // Vérifier si les nouvelles positions dépassent les limites
      if (newLeft < 0) {
        newLeft = 0;
      } else if (newLeft > maxLeft) {
        newLeft = maxLeft;
      }

      if (newTop < 0) {
        newTop = 0;
      } else if (newTop > maxTop) {
        newTop = maxTop;
      }

      // Mettre à jour les positions seulement si elles sont dans les limites
      this.left = newLeft;
      this.top = newTop;
    },
    stopDrag() {
      this.isDragging = false;
    },
    initEvent() {
      this.afficherEmojisParCategorie("Smileys");
      const self = this;

      const all_conversations = document.querySelectorAll(".emoji-list");
      all_conversations.forEach(function (item) {
        const containerChatElement = item.closest(".container-chat");
        // Utiliser event delegation pour gérer les clics sur les emojis
        item.addEventListener("click", function (event) {
          if (event.target.classList.contains("emoji")) {
            const chatID = containerChatElement.getAttribute("id");
            const message_id_chat = chatID.split("message-list-").pop();
            self.insertEmoji(event.target.innerHTML, message_id_chat);
          }
        });
      });

      var obj = this.returnObjetc();

      var categories = Object.keys(obj);
      categories.forEach(categorie => { // Utilisation d'une fonction fléchée ici
        var emojiListDivs = document.querySelectorAll(".emoji-list");
        emojiListDivs.forEach(emojiListDiv => { // Utilisation d'une fonction fléchée ici aussi
          var categorieElement = emojiListDiv.querySelector(`#${categorie}`);
          categorieElement.addEventListener("click", () => { // Utilisation d'une fonction fléchée ici aussi
            //----------------------------------------------------------------//
            var spans = emojiListDiv.querySelectorAll(".span-content");
            if (spans) {
              spans.forEach(span => { // Utilisation d'une fonction fléchée ici aussi
                span.innerHTML = "";
              });
            }
            //----------------------------------------------------------------//
            this.afficherEmojisParCategorie(categorie);
          });
        });
      });
    },
  },
  mounted() {
    this.initEvent();
  },
};

</script>
