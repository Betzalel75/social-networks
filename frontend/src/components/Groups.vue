<template>
  <div class="side-wrapper stories groups">
    <div class="title-container">
      <div class="side-title">GROUPS</div>
      <AddGroup />
    </div>
    <div v-for="(group, index) in groups" :key="index">
      <div class="user">
        <img src="https://picsum.photos/200" alt="" class="user-img" :data-id="group.GroupId" @click="getGroupe($event);"/>
        <div class="username">
          <span>
            {{ group.GroupTitle }}
          </span>
          <div class="album-date">{{ group.GroupDesc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddGroup from "./AddGroup.vue"
</script>
<script>
import myMixin from "@/mixins/global";
export default {
  props: {
    comments: {
      type: Array,
    }
  },
  mixins: [myMixin],
  computed: {
    groups() {
      return this.$store.getters.listGroups;
      // Vérifie si listGroups existe et n'est pas null avant de l'utiliser
      // if (this.$store.getters.listGroups) {
      //   const id = this.$store.getters.localID;
      //   return this.$store.getters.listGroups.filter(item => {
      //     // Vérifie si idUser existe et n'est pas null avant de l'utiliser
      //     if (id) {
      //       if (item.GroupUsers) {
      //         return item.GroupUsers.indexOf(id) >= 0;
      //       }
      //       return false; // Retourne false si item.GroupUsers est undefined
      //     }
      //     return false; // Retourne false si id n'est pas défini
      //   });
      // }
      // // Retourne un tableau vide si listGroups est null
      // return [];
    }
  },
};
</script>


<style scoped>
@import url('../assets/css/groups.css');
</style>