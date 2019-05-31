<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="light" router>
          <el-menu-item index="manage">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>数据管理
            </template>
            <el-menu-item index="userList">用户列表</el-menu-item>
            <el-menu-item index="bannerList">首页轮播图</el-menu-item>
            <el-menu-item index="adminList">管理员列表</el-menu-item>
          </el-submenu>

          <el-submenu index="8">
            <template slot="title">
              <i class="el-icon-document"></i>订单管理
            </template>
            <el-menu-item index="orderList">订单列表</el-menu-item>
            <el-menu-item index="orderList">订单设置</el-menu-item>
            <el-menu-item index="orderList">退货申请处理</el-menu-item>
            <el-menu-item index="orderList">退货原因设置</el-menu-item>
          </el-submenu>

          <el-submenu index="9">
            <template slot="title">
              <i class="el-icon-document"></i>商品管理
            </template>
            <el-menu-item index="foodList">商品列表</el-menu-item>
            <el-menu-item index="foodList">商品分类</el-menu-item>
            <el-menu-item index="foodList">品牌管理</el-menu-item>
          </el-submenu>

          <el-submenu index="10">
            <template slot="title">
              <i class="el-icon-document"></i>商家管理
            </template>
            <el-menu-item index="shopList">商家列表</el-menu-item>
            <el-menu-item index="addShop">添加商家</el-menu-item>
          </el-submenu>

           <el-submenu index="11">
            <template slot="title">
              <i class="el-icon-document"></i>厂家管理
            </template>
            <el-menu-item index="factoryList">厂家列表</el-menu-item>
            <el-menu-item index="addFactory">添加厂家</el-menu-item>
          </el-submenu>

          <el-submenu index="12">
            <template slot="title">
              <i class="el-icon-document"></i>营销管理
            </template>
            <el-menu-item index="bannerList">秒杀活动列表</el-menu-item>
            <el-menu-item index="bannerList">优惠券列表</el-menu-item>
            <el-menu-item index="bannerList">品牌推荐</el-menu-item>
            <el-menu-item index="bannerList">新品推荐</el-menu-item>
            <el-menu-item index="bannerList">推荐</el-menu-item>
            <el-menu-item index="bannerList">广告列表</el-menu-item>
          </el-submenu>

           <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-document"></i>文章管理
            </template>
            <el-menu-item index="articleSort">分类管理</el-menu-item>
            <el-menu-item index="articleList">文章列表</el-menu-item>
            <el-menu-item index="articleAdd">添加文章</el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-star-on"></i>图表
            </template>
            <el-menu-item index="visitor">用户分布</el-menu-item>
            <!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-edit"></i>编辑
            </template>
            <!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
            <el-menu-item index="vueEdit">文本编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-setting"></i>设置
            </template>
            <el-menu-item index="adminSet">管理员设置</el-menu-item>
            <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>


<style lang="less" scoped>
@import "../style/mixin";
.manage_page {
}
</style>
