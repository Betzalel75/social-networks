<template>
  <div>
    <button class="add-group-btn" @click="toggleChatPosition">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAhtJREFUSEu11UnoTmEUx/HPXzJEip0hlAVFSLFSrGRIQoYFSkkSsZCFvwxhJSlTyYJQYiEZoyxk2MkUyZxsFSlDhOfU89bf7b73+r/13tW99xm+5znnd35PhzY/HW3eXx2gNxZiJiZgJP7gHR7iGs7jZ7NAqwCzcCRvWnXQV1iDm2WTmgF2pEi35wXvcRZX8Cj/m4i5WIxh+d8m7CtCygCNzb9gGS7ltJQF2AOLcBx9sQEHuk4sAiKqi/iWIp6cFj/9TxFMwV0EcBruNNZ1BfTHCwzGcpwu2TwKHE/ZyTdiP56nwo9vFL7rxLU4nPL6DOOapKUK0CurKwKcjwvFSK4ilLMug8qyUwWI+XuwBcewugj4kAaGYhTeNMl9HWAqbuNBquWkIuBrVkKo4XsGNDasq3Uj1YPwEZ8wsAgIWUahByDe4+kuINZ+zuvj/R81RPVHZwU8aTFFkZb7WShji4AzSWJLsRl7WwRsxa5Ux1OpjiuKgND+SbzEGPzuZh/0TP3zGsOxBOeKgChupCkmrEwmd6KbgPXZJqJZo9F+lHXkDFxvwSrCVu5lq5iepdq05TuxO6shzO5yhUbDeyId0Vj9kkTjFIeqzK4xti0pbGf+eJvtOjr9McISwkrmZScdkuUcTnqwGEzVhTMnGd/R3N1VjRYXzircKptUd2X2SVEvwOxcuBE52lBL6P1GNrVfzSKoA9RZRO142wF/Afg0ahnLfIJIAAAAAElFTkSuQmCC"
      />
    </button>
    <form
      @submit.prevent="creatGroup"
      class="add-group-modal"
      ref="groupx"
      @mousedown="startDrag"
      @mousemove="drag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      :style="{ left: `${left}px`, top: `${top}px` }"
    >
      <div class="header">
        <p class="title">Add a new group</p>
        <button class="close-add-group-modal" @click="closeForm">X</button>
      </div>
      <div class="body">
        <label class="input-container">
          Title:
          <input
            type="text"
            required
            v-model="form.group_title"
            placeholder="The title of the group"
          />
        </label>
        <label class="input-container">
          Description:
          <textarea
            type="text"
            required
            v-model="form.group_desc"
            placeholder="The description of the group"
          ></textarea>
        </label>
        <div class="button-container">
          <button class="submit-btn">Create group</button>
        </div>
      </div>
    </form>
    <!-- <div class="add-group-overlay close-add-group-modal"></div> -->
  </div>
</template>

<style scoped>
@import url("../assets/css/addGroup.css");
.add-group-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.add-group-btn img {
  filter: invert();
}
.add-group-btn img:hover {
  filter: none;
  background-color: white;
  border-radius: 50%;
}
</style>

<script>
import app from "@/mixins/appSocket";

export default {
  data() {
    return {
      form: {
        group_title: "",
        group_desc: "",
      },
      left: -2000,
      top: 10,
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
    };
  },
  mixins: [app],
  emits: {
    submit(form) {},
  },
  methods: {
    async creatGroup() {
      // console.log(this.form);
      this.addGroup(this.form.group_title, this.form.group_desc);
      this.closeModal();
      // this.$emit("submit", this.form);
    },
    closeForm() {
      const chatPosition = document.querySelector(".add-group-modal");
      chatPosition.classList.remove("activated");
      chatPosition.style.transition = "2.3s";
      chatPosition.style.transform = "translateX(-1000%)";
    },
    closeModal() {
      // Récupère la div.chat-position
      const chatPosition = document.querySelector(".add-group-modal");
      // chatPosition.classList.remove("activated");
      this.form.group_title = "";
      this.form.group_desc = "";
    },
    toggleChatPosition() {
      const chatPosition = document.querySelector(".add-group-modal");
      chatPosition.classList.add("activated");
      this.left = 20;
      chatPosition.style.transform = "translateX(0%)";
    },
    startDrag(e) {
      this.isDragging = true;
      this.offsetX = e.clientX - this.left;
      this.offsetY = e.clientY - this.top;
    },
    drag(e) {
      if (!this.isDragging) return;

      // Obtenir la largeur et la hauteur de la div "conversation"
      const conversationWidth = this.$refs.groupx.offsetWidth;
      const conversationHeight = this.$refs.groupx.offsetHeight;

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
  },
};
</script>
