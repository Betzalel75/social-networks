<template>
  <div>
    <div class="check-parent" v-for="(data, index) in users" :key="index">
      <div class="checkbox-wrapper-5">
        <div class="check">
          <input :id="'check-' + data.UserID" type="checkbox">
          <label :for="'check-' + data.UserID">
            <div class="user user-cercle" :data-user-id="data.UserID">
              <img :src="'/src/assets/images/'+data.Photo" alt="" class="user-img" />
              <div :class="'username-'+data.UserID" style="display: contents; color: lightsteelblue;">{{data.FirstName}}
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
    }
  },
}
</script>

<style scoped>
@import url("../assets/css/checkbox.css");
</style>