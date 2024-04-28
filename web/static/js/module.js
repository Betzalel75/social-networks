import { strToDom } from "./config.js";
import { fetchData } from "./utils.js";


function toggleEmojiList() {
  var emojiList = document.querySelector('.emoji-list');
  emojiList.style.display =
    emojiList.style.display === "none" || emojiList.style.display === ""
      ? "flex"
      : "none";
}

window.toggleEmojiList = toggleEmojiList;

function insertEmoji(emoji, message_id_chat) {
  var messageInput = document.getElementById(
    `message-input-${message_id_chat}`
  );
  messageInput.value += emoji;
}

document.addEventListener("loadLiveEvent", function () {
  afficherEmojisParCategorie("Smileys");

  const all_conversations = document.querySelectorAll(".emoji-list");
  all_conversations.forEach(function (item) {
    const containerChatElement = item.closest(".container-chat");
    // Utiliser event delegation pour gérer les clics sur les emojis
    item.addEventListener("click", function (event) {
      if (event.target.classList.contains("emoji")) {
        const chatID = containerChatElement.getAttribute("id");
        const message_id_chat = chatID.split("message-list-").pop();
        insertEmoji(event.target.innerHTML, message_id_chat);
      }
    });
  });
});
//
function returnObjetc() {
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
    Nature: "🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🍄",
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
}
// Fonction pour afficher les emojis d'une catégorie spécifique
export function afficherEmojisParCategorie(categorie) {
  // Récupérer l'élément div qui contient la liste d'emojis
  var emojiListDivs = document.querySelectorAll(".emoji-list");
  emojiListDivs.forEach(function (emojiListDiv) {
    // Vider le contenu actuel de la liste
    var element = emojiListDiv.querySelector(`#${categorie}`);
    var content = element.querySelector(".span-content");

    // Récupérer les emojis de la catégorie spécifiée
    var emojisParCategorie = returnObjetc();
    var emojis = emojisParCategorie[categorie];

    // Séparer les emojis par espace et les ajouter à la liste
    emojis.split(" ").forEach(function (emoji) {
      var span = document.createElement("span");
      span.classList.add("emoji");
      span.innerText = emoji;
      content.appendChild(span);
    });
  });
}

window.afficherEmojisParCategorie = afficherEmojisParCategorie;

document.addEventListener("loadLiveEvent", function () {
  // Ajouter un gestionnaire d'événements pour chaque catégorie
  var obj = returnObjetc();

  var categories = Object.keys(obj);
  categories.forEach(function (categorie) {
    var emojiListDivs = document.querySelectorAll(".emoji-list");
    emojiListDivs.forEach(function (emojiListDiv) {
      var categorieElement = emojiListDiv.querySelector(`#${categorie}`);
      categorieElement.addEventListener("click", function () {
        //----------------------------------------------------------------//
        var spans = emojiListDiv.querySelectorAll(".span-content");
        if (spans) {
          spans.forEach(function (span) {
            span.innerHTML = "";
          });
        }
        //----------------------------------------------------------------//
        afficherEmojisParCategorie(categorie);
      });
    });
  });
});

async function returnUsers(data) {
  try {
    if (data) {
      // console.table(data);
      let parentDiv = document.querySelector(
        `.user[data-user-id='${data.UserID}']`
      );
      if (!parentDiv) {
        return `
          <div class="user userList" data-user-id="${data.UserID}" onclick="selectUser('${data.UserID}')">
          <img src="/web/static/media/${data.Photo}" alt="" class="user-img" />
          <div class="username-${data.UserID}">
          ${data.Name}
          <div class="user-status ${data.Status}"></div>
          </div>
          </div>
          `;
      }
    } else {
      return "";
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la génération des utilisateurs :",
      error
    );
    return ""; // Retourne une chaîne vide en cas d'erreur
  }
}

async function dataReturn() {
  try {
    const datas = await fetchData("/allUsers");
    if (datas && datas.length > 0) {
      return datas[datas.length - 1];
    } else {
      console.error(
        "Aucune donnée n'a été récupérée ou le tableau de données est vide."
      );
      return null; // Retourne null si les données sont vides
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données :",
      error
    );
    return null; // Retourne null en cas d'erreur
  }
}


function creatUserEvent() {
  // Exécuter la fonction après l'événement
  // Utilisation
  (async () => {
    const data = await dataReturn();
    if (data !== null) {
      const userHtml = await returnUsers(data);
      const userList = document.querySelector(".side-wrapper.contacts");
      if (userList) {
        userList.appendChild(strToDom(userHtml));
      }
    }
  })();
}

// Ajouter l'écouteur d'événement à document
document.addEventListener("NewUser", creatUserEvent);

// SOURCE EMOJI : https://smiley.cool/fr/emoji-list.php
