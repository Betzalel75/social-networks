<template>
  <div class="side-wrapper stories groups">
    <div class="title-container">
      <div class="side-title">GROUPS</div>
      <AddGroup />
      <JoinGroupPopup />
    </div>
    <div v-for="(group, index) in groups" :key="index">
      <div class="user">
        <img src="https://picsum.photos/200" alt="" class="user-img" :data-id="group.GroupId" @click="getGroupe($event,group);"/>
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
import JoinGroupPopup from "./JoinGroupPopup.vue"
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
    }
  },
};
</script>


<style scoped>
@import url('../assets/css/groups.css');
</style>