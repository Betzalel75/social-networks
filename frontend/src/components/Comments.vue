<template>
  <div>
    <div v-for="(data, index) in comments" :key="index">
      <div class="status-main listCommentaire" style="padding-top: 20px">
        <img :src="'http://localhost:8080/images/'+data.Photo" class="status-img" style="width: 40px; height: 40px" />
        <div class="album-detail">
          <div class="album-title">
            <strong>{{data.Name}}</strong> comment
            <span>Post</span>
          </div>
          <div class="album-date"></div>
        </div>
        <div class="album-photos">
          <img :src="'http://localhost:8080/images/' + data.Image" alt="" class="album-photo" />
        </div>
        <p style="width: 100%; word-break: break-word; color: antiquewhite">{{data.Content}}</p>
        <div class="contenu-a-recharger">
          <a href="javascript:void(0)" class="album-action" data-action="like"
            @click="sendFeedback(data.CommentID, 'like', 'comment_id'); colorFeedback($event, 'left')"
            :data-post-id="data.CommentID">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="css-i6dzq1" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
              </path>
            </svg>
            <span class="likeCount" :data-post-id=data.CommentID>{{data.LikeNbr}}</span>
          </a>
          <a href="javascript:void(0)" class="dislikeButton album-action" data-action="dislike"
            @click="sendFeedback(data.CommentID, 'dislike', 'comment_id'); colorFeedback($event, 'right')"
            :data-post-id="data.CommentID">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path
                d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
              </path>
            </svg>
            <span class="dislikeCount" :data-post-id="data.CommentID">{{data.DislikeNbr}}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import myMixin from "@/mixins/global";
export default {
  props: {
    comments: {
      type: Array,
    }
  },
  mixins: [myMixin],
};
</script>


<style scoped>
@import url(@/assets/css/style.css);
@import url(@/assets/css/loginForm.css);
</style>