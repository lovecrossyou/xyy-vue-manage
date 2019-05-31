<template>
  <div>
    <head-top></head-top>
    <div class="main">
      <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="collapseTitle" name="1">
        <el-row style="margin-top: 20px;">
          <el-col :span="12" :offset="1">
            <el-form
              ref="articleForm"
              :model="formData"
              :rules="rules"
              label-width="110px"
              class="form"
            >
              <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title"></el-input>
              </el-form-item>
              <el-form-item label="文章副标题" prop="title">
                <el-input v-model="formData.subtitle"></el-input>
              </el-form-item>
              <el-form-item label="文章分类" prop="sort_id">
                <el-input v-model="formData.sort_id"></el-input>
                <!-- <el-cascader
              :options="sort_data"
              v-model="sort_id"
              change-on-select
              :props="defaultProps"
                ></el-cascader>-->
              </el-form-item>
              <el-form-item label="文章概要" prop="description">
                <el-input type="textarea" v-model="formData.description"></el-input>
              </el-form-item>
              <el-form-item label="作者">
                <el-input
                  readonly="readonly"
                  :value="formData.user_name"
                  style="width:217px;opacity: 0.5"
                ></el-input>
              </el-form-item>
              <el-form-item label="来源">
                <el-input v-model="formData.source"></el-input>
              </el-form-item>
              <el-form-item label="封面图片">
                <el-upload
                  class="avatar-uploader"
                  :action="baseUrl + '/v1/addimg/food'"
                  :show-file-list="false"
                  :on-success="uploadImg"
                  :before-upload="beforeImgUpload"
                >
                  <img v-if="formData.pic" :src="baseImgPath + formData.pic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    </div>


    <div class="edit_container">
      <quill-editor
        v-model="formData.content"
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
import headTop from "@/components/headTop";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import ImageResize from "quill-image-resize-module";
import { baseUrl, baseImgPath } from "@/config/env";
import { addArticle, updateArticle } from "@/api/getData";
import { mapState, mapActions } from "vuex";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Quill.register("modules/ImageExtend", ImageExtend);
// use resize module
Quill.register("modules/ImageResize", ImageResize);

export default {
  data() {
    return {
      activeNames: ["1"],
      baseUrl,
      baseImgPath,
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
      },
      grade: {
        updateArticle: !0,
        upFile: !0
      },
      sort_id: [],
      sort_data: [],
      rules: {
        sort_id: { required: true, message: "分类不能为空" },
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "change"
          },
          {
            pattern: /^.{1,100}$/,
            message: "请输入1-100个字符的文章标题",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "文章概要不能为空",
            trigger: "change"
          },
          {
            pattern: /^.{5,255}$/,
            message: "请输入5-255个字符的文章概要",
            trigger: "blur"
          }
        ],
        read_type: [
          {
            required: true,
            type: "number",
            min: 1,
            max: 4,
            message: "请选择阅读权限",
            trigger: "change"
          }
        ],
        content: {
          required: true,
          message: "文章内容不能为空"
        }
      },
      defaultProps: {
        children: "children",
        label: "sort_name",
        value: "id"
      },
      collapseTitle:'点击收起'
    };
  },
  components: {
    headTop,
    quillEditor
  },
  computed: {
    ...mapState("article", ["articleInfo"]),
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    formData() {
      return this.articleInfo;
    }
  },
  methods: {
    ...mapActions('article',[]),
    onProgress(p) {
      this.upProgress = p;
    },
    handleChange(list) {
        if(list.length >0){
          this.collapseTitle = '收起';
        }
        else{
          this.collapseTitle = '展开更多设置';
        }
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    async submit() {
      console.log(this.formData);
      this.$refs["articleForm"].validate(async valid => {
        if (valid) {
          if (this.formData._id) {
            await updateArticle(this.formData);
          } else {
            await addArticle(this.formData);
          }
          this.$message.success("提交成功！");
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
        }
      });
    },
    successUpload(data) {
      this.data.pic = formData.filename;
      this.data.content += '<img src="' + formData.filename + '" />';
    },
    uploadImg(res, file) {
      if (res.status == 1) {
        this.formData.pic = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeImgUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
    }
  }
};
</script>

<style lang="less">
@import "../../style/mixin";

.main{
  padding: 0px  40px;
}

.edit_container {
  padding: 20px 40px;
  margin-bottom: 60px;
}
.editer {
  height: 800px;
}
.submit_btn {
  text-align: center;
}

.ql-snow .ql-editor pre.ql-syntax::after {
  background: #e1e1e1;
}

.form {
  min-width: 400px;
  margin-bottom: 30px;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    border-radius: 6px;
    transition: all 400ms;
  }
}
.food_form {
  border: 1px solid #eaeefb;
  padding: 10px 10px 0;
}

.quill-code {
  height: auto;
  border: none;
  > .title {
    border: 1px solid #ccc;
    border-left: none;
    height: 3em;
    line-height: 3em;
    text-indent: 1rem;
    font-weight: bold;
  }
  > code {
    width: 100%;
    margin: 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-top: none;
    border-left: none;
    border-radius: 0;
    height: 30rem;
    overflow-y: auto;
    background: #ccc;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    overflow: hidden;
  }
}
</style>
