<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="search_container">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        </el-col>
        <el-col :span="16" class="button-tree">
          <el-button type="success" @click="addSort">新增分类</el-button>
          <el-button type="danger" @click="batchDelete">批量删除</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="tree-wrapper">
      <el-tree :props="props" :load="loadNode" lazy accordion show-checkbox>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <el-dialog :title="getTitle" :visible.sync="visible">
      <el-form :model="form" :rules="rules" label-width="80px" ref="sortForm">
        <el-form-item label="父级分类">
          <el-cascader
            :options="data"
            v-model="parent_id"
            placeholder="留空为根分类"
            disabled
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类类别" prop="sort_type">
          <el-select
            v-model="form.type"
            :disabled="parent_id.length > 0||form.id !== 0"
            style="width: 100%"
          >
            <el-option v-for="(item,key) in sort_type" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveSort">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import headTop from "@/components/headTop";
import {
  addCategoryM,
  listCategoryM,
  delCategoryM,
  getCategoryAndDeepChildCategory
} from "@/api/getData";

// 0 水质监测 1 新闻 2 文章 3 教程
const sort_type = {
  "0": "水质监测",
  "1": "新闻",
  "2": "文章",
  "3": "教程"
};
export default {
  name: "sort",
  data() {
    return {
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      page_grade: "deleteArticle",
      grade: {
        updateSort: !0,
        deleteSort: !0, // 删除分类权限
        batchDelSort: !0 // 批量删除分类权限
      },
      type: "edit",
      visible: false,
      loading: false,
      filterText: "",
      sort_type,
      parent_id: ["xx"],
      parent_store: null,
      parent_data: null,
      form: {
        id: 0,
        sort_name: "",
        type: 0,
        name: ""
      },
      rules: {
        sort_name: {
          required: true,
          pattern: /^.{2,50}$/,
          message: "请输入2-50个字符的分类名称",
          trigger: "change"
        },
        type: {
          required: true,
          message: "请选择分类类别",
          trigger: "change"
        }
      },
      data: [],
      defaultProps: {
        disabled: "disabled",
        children: "children",
        label: "sort_name",
        value: "id"
      }
    };
  },
  computed: {
    getTitle() {
      return this.type === "edit" ? "编辑分类" : "添加分类";
    }
  },
  components: {
    headTop
  },
  mounted() {
    this.list();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    async loadNode(node, resolve) {
      const res = await listCategoryM();
      if (node.level === 0) {
        return resolve(res.data);
      }
      if (node.level > 1) return resolve([]);
      const currentCategory = node.data;
      const subCategory = await getCategoryAndDeepChildCategory(
        currentCategory._id
      );

      resolve(subCategory.data);
    },
    async list() {
      const res = await listCategoryM();
      let arr = res.data;
      for (let i = arr.length; i--; ) {
        let obj = arr[i];
        arr.forEach(item => {
          item.sort_name = item.name;
          item.parent_id = item.parentId;
        });
      }
      // console.log("arr ### ", arr);
      this.data = arr;
    },
    async batchDelete() {
      let v = this.$refs.tree.getCheckedKeys();
      if (v.length) {
        this.$confirm("确定要删除此分类吗！", "系统提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // utils.ajax.call(this, '/batchDelSort', { ids: v.join(',') }, (d, err) => {
            //   if (!err) {
            //     let a = (obj) => {
            //       obj && obj.forEach((o, i) => {
            //         v.includes(o.id) ? obj.splice(i, 1) : a(o.children)
            //       })
            //     }
            //     a(this.data)
            //   }
            // })
          })
          .catch(() => {});
      } else {
        this.$message("请先选择数据！");
      }
    },
    async saveSort() {
      this.$refs.sortForm.validate(async v => {
        if (v) {
          this.visible = true;
          this.loading = true;
          let parent_id = this.parent_data ? this.parent_data._id : 0;
          this.form.parentId = parent_id;
          const res = await addCategoryM(this.form);
          this.$message({
            message: res.message,
            type: "success"
          });
          this.visible = false;
          this.loading = false;
          this.list();
        }
      });
    },
    addSort() {
      for (let key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = key === "id" ? 0 : "";
        }
      }
      this.parent_id = [];
      this.visible = true;
      this.type = "add";
      this.parent_store = null;
      this.$refs.sortForm && this.$refs.sortForm.resetFields();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.sort_name.indexOf(value) !== -1;
    },
    async del(categoryid) {
      const res = await delCategoryM(categoryid);
      this.$message({
        message: res.message,
        type: "success"
      });
      this.list();
    },
    async headleClick(icon, data, store) {
      if (icon === "delete") {
        this.$confirm("确定要删除此分类吗？", "系统提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.del(data._id);
          })
          .catch(() => {});
      } else if (icon === "plus" || icon === "edit") {
        this.$refs.sortForm && this.$refs.sortForm.resetFields();
        this.type = icon;
        const f = this.form;
        if (icon === "plus") {
          f.id = 0;
          f.sort_name = "";
          this.parent_id.push(data.id);
        } else {
          f.id = data.id;
          f.sort_name = data.sort_name;
        }
        f.sort_type = data.sort_type;
        this.parent_store = store;
        this.parent_data = data;
        this.visible = true;
        console.log("parent_data ### ", data);
      }
    }
  }
  // mixins: [common.mixin]
};
</script>
<style lang="less">
.search_container {
  padding: 20px 20px 0 20px;
}

.tree-wrapper {
  padding-top: 20px;
}
.filter-tree {
  margin-top: 10px;
  border-radius: 5px;
  .el-cascader {
    width: 100%;
  }
  .el-tree-node__content > .el-checkbox {
    line-height: 40px;
  }
  .el-tree-node__content {
    height: 40px;
    border-bottom: 1px dashed #ddd;
    white-space: normal;
  }
}

.button-tree {
  text-align: right;
  button {
    margin-left: 10px;
  }
}
</style>
