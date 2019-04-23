<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <div class="add_wrapper">
        <el-button type="primary" @click="showDialog">添加轮播</el-button>
      </div>
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column label="图片" >
          <template slot-scope="scope">
            <img class="showimg" width="40" height="40" :src="scope.row.image">
          </template>
        </el-table-column>
        <el-table-column property="url" label="url"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>

      <!-- 编辑信息 -->
      <el-dialog title="添加/修改轮播" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/food'"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="selectTable.image" :src="selectTable.image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="url" label-width="100px">
            <el-input v-model="selectTable.url" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { getBannerList, delBanner, addBanner } from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { fail } from "assert";

export default {
  data() {
    return {
      baseUrl,
      dialogFormVisible: false,
      tableData: [],
      selectTable: {
        image: "",
        url: ""
      },
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1
    };
  },
  components: {
    headTop
  },
  created() {
    this.initData();
  },
  methods: {
    async update() {
      const res = await addBanner(this.selectTable);
      if (res.status === 1) {
        this.initData();
        this.selectTable = {
          image: "",
          url: ""
        };
      } else {
        this.$message({
          type: "error",
          message: "添加失败"
        });
      }
      this.dialogFormVisible = false;
    },
    handleServiceAvatarScucess(res, file) {
      if (res.status == 1) {
        this.selectTable.image = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvatarUpload(file) {
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
    },
    async handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.selectTable = row;
    },

    async showDialog(index, row) {
      this.dialogFormVisible = true;
    },

    async handleDelete(index, row) {
      const res = await delBanner(row._id);
      this.initData();
    },
    async initData() {
      try {
        this.getBannerList();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getBannerList();
    },
    async getBannerList() {
      const res = await getBannerList({
        offset: this.offset,
        limit: this.limit
      });
      this.tableData = res.data;
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}

.add_wrapper {
  margin-bottom: 10px;
}

.showimg {
  width: 60px;
  height: 24px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
