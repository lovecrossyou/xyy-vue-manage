<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="user_name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="create_time" label="注册日期" width="220"></el-table-column>
        <el-table-column prop="city" label="地址" width="180"></el-table-column>
        <el-table-column prop="admin" label="权限"></el-table-column>
        <el-table-column label="操作" width="200">
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
    </div>

    <!-- 编辑信息 -->
    <el-dialog title="修改权限" v-model="dialogFormVisible">
      <el-form :model="selectTable">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="selectTable.user_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" label-width="100px">
          <el-select v-model="selectTable.admin" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { adminList, adminCount, updateAdminInfo } from "@/api/getData";
import { fail } from 'assert';
export default {
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
      options: [
        {
          value: "管理员",
          label: "管理员"
        },
        {
          value: "超级管理员",
          label: "超级管理员"
        }
      ],
      selectTable: {
        user_name: "",
        admin: ""
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
    handleEdit(index, row) {
      this.selectTable = row;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {

    },
    async update() {
        const status = this.tableData.value ==='超级管理员'? 2 : 1 ;
        const res = await updateAdminInfo(status);
        this.$message({
          type: "success",
          message: res.message
        });
      this.dialogFormVisible = false;

    },
    async initData() {
      try {
        const countData = await adminCount();
        if (countData.status == 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getAdmin();
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
      this.getAdmin();
    },
    async getAdmin() {
      try {
        const res = await adminList({ offset: this.offset, limit: this.limit });
        if (res.status == 1) {
          this.tableData = [];
          res.data.forEach(item => {
            const tableItem = {
              create_time: item.create_time,
              user_name: item.user_name,
              admin: item.admin,
              city: item.city
            };
            this.tableData.push(tableItem);
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
</style>


