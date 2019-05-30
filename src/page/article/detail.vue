<template>
  <div>
    <head-top></head-top>
    <div class="main">
      <div class="title">{{articleInfo.title}}</div>
      <div class="time">{{articleInfo.create_time}}</div>
      <div v-html="articleInfo.content"></div>
    </div>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    headTop
  },
  computed: {
    ...mapState("article", ["articleInfo"])
  },
  methods: {
    ...mapActions("article", ["getDetail"])
  },
  mounted() {
    //   console.log('articleInfo ', this.articleInfo);
    // this.getDetail();
  }
};
</script>

<style >
.main {
  padding: 20px 40px;
}
.title {
  font-size: 30px;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
  line-height: 40px;
}
</style>