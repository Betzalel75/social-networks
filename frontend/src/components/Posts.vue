<template>
  <div>
    <div :class="'album box ' + classeName" id="content-albums" :data-postId="data.PostID" v-for="(data, index) in posts"
      :key="index">
      <div class="status-main">
        <img :src="avatarName !== '' ? '/src/assets/images/' + avatarName : '/src/assets/images/' + data.Photo"
          class="status-img" />
        <div class="album-detail">
          <div class="album-title">
            <strong style="color: white;">{{ data.Name }}</strong>
          </div>
          <div class="album-date">{{ formatDateTime(data.CreatedAt) }}</div>
        </div>
        <button class="intro-menu"></button>
      </div>
      <div class="album-content" style="color: white; word-break: break-word;">
        {{ this.unescapeHtml(data.Title) }}
        <div class="album-photos">
          <img :src="'/src/assets/images/' + data.Image" alt="" class="album-photo" />
        </div>
        <p style="word-break: break-word; color: white;">{{ this.unescapeHtml(data.Content) }}</p>
      </div>
      <div class="album-actions">
        <a href="javascript:void(0)" class="album-action"
          @click="sendFeedback(data.PostID, 'like', 'post_id'); colorFeedback($event, 'left')"
          :data-post-id="data.PostID">
          <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="css-i6dzq1 svg-left" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z">
            </path>
          </svg>
          <span class="likeCount" :data-post-id="data.PostID">{{ data.LikeCount }}</span>
        </a>
        <a href="javascript:void(0)" class="album-action"
          @click="sendFeedback(data.PostID, 'dislike', 'post_id'); colorFeedback($event, 'right')"
          :data-post-id="data.PostID">
          <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" class="svg-right">
            <path
              d="M20 3h-1v13h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 16h7l-1.122 3.368A2 2 0 0 0 11.775 22H12l5-5.438V3H6l-3.937 8.649-.063.293V14a2 2 0 0 0 2 2z">
            </path>
          </svg>
          <span class="dislikeCount" :data-post-id="data.PostID">{{ data.DislikeCount }}</span>
        </a>
        <a href="javascript:void(0)" class="album-action" @click="myFunction(data.PostID)">
          <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
            class="css-i6dzq1" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span class="commentCount" :data-post-id="data.PostID">{{ data.CommentCount }}</span>
        </a>
        <!-- Add comment div -->
        <div class="status box" :id="data.PostID" style="display: none">
          <div class="" style="border-bottom: 1px solid #272a3a;margin-top: 1%;">
            <form method="POST" class="comment-form" :data-post-id="data.PostID" @submit.prevent="sendcomment">
              <h3 style="margin: 28px 0 0 1%; font-size: 1.5rem; color: #ccc8db;">
                Add a comment
              </h3>
              <span class="login100-form-error ">
  
              </span>
              <div class="status-main">
                <div style="width: 100%">
                  <textarea class="status-textarea" placeholder="Comments Goes Here" name="comment"
                    style="resize: vertical;height: 75px;width: 100%;"></textarea>
                  <label for="postimage">
                    <img class="album-photos" :id="'output-'+data.PostID" />
                  </label>
                  <input type="hidden" name="postID" :value="data.PostID" />
                </div>
                <div class="status-actions">
                  <input class="status-share" type="submit" value="Add comment" name="add" />
                </div>
                <div class="action-comment">
                  <input class="input" type="file" accept="image/*" id="fileInput" name="postimage"
                    @change="loadInput($event, data.PostID)" />
                </div>
              </div>
            </form>
          </div>
          <!-- Tous les commentaires pour ce post -->
          <div class="alls-comments">
            <Comments :comments="data.Comment" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Comments from "./Comments.vue";
import myMixin from "@/mixins/global";
import app from "@/mixins/appSocket";
import utils from "@/mixins/utils";
import webSocketGo from "@/mixins/websocket";

export default {
  mixins: [myMixin, app, webSocketGo, utils],

  props: {
    posts: {
      type: Array, // Définissez le type de la prop comme un tableau
    },
    classeName: {
      type: String,
      default: 'publicPublications'
    },
    avatarName: {
      type: String,
      default: "",
    }
  },
  components: {
    Comments
  },
  methods: {
  },
};
</script>

<style scoped>
@import url("../assets/css/main.css");
</style>