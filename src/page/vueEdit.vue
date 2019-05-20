<template>
  <div>
    <head-top></head-top>
    <div class="edit_container">
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        class="editer"
        :options="editorOption"
        @ready="onEditorReady($event)"
      ></quill-editor>
    </div>
    <div class="submit_btn">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import ImageResize from "quill-image-resize-module";

import { baseUrl, baseImgPath } from "@/config/env";

Quill.register("modules/ImageExtend", ImageExtend);
// use resize module
Quill.register("modules/ImageResize", ImageResize);

export default {
  data() {
    return {
      content: "<h3>说些什么吧~~</h3>",
      editorOption: {
        modules: {
          ImageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          ImageExtend: {
            loading: true,
            name: "img",
            action: baseUrl + "/v1/addimg/food",
            response: res => {
              return res.image_path;
            }
          },
          toolbar: {
            container: container,
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id);
              }
            }
          }
        }
      }
    };
  },
  components: {
    headTop,
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    submit() {
      console.log(this.content);
      this.$message.success("提交成功！");
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.edit_container {
  padding: 40px;
  margin-bottom: 40px;
}
.editer {
  height: 350px;
}
.submit_btn {
  text-align: center;
}
</style>
