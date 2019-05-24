<template>
  <div class="app-container">
    <head-top></head-top>

    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions"></el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.specfoods[0].item_id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.image_path">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.specfoods[0].price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>
              上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.publishStatus"
              >></el-switch>
            </p>
            <p>
              新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.newStatus"
              ></el-switch>
            </p>
            <p>
              推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommandStatus"
              ></el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowSkuEditDialog(scope.$index, scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.month_sales}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button type="text" @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <p></p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input
        placeholder="按sku编号搜索"
        v-model="editSkuInfo.keyword"
        size="small"
        style="width: 50%;margin-left: 20px"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in editSkuInfo.productAttr"
          :label="item.name"
          :key="item.id"
          align="center"
        >
          <template slot-scope="scope">{{getProductSkuSp(scope.row,index)}}</template>
        </el-table-column>
        <el-table-column label="销售价格" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import headTop from "@/components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";
import {
  getFoods,
  getFoodsCount,
  getMenu,
  updateFood,
  deleteFood,
  getResturantDetail,
  getMenuById,
  getResturants
} from "@/api/getData";

import { fail } from "assert";

const list = [
  {
    id: 26,
    brandId: 3,
    productCategoryId: 19,
    feightTemplateId: 0,
    productAttributeCategoryId: 3,
    name: "华为 HUAWEI P20 ",
    pic:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf58Ndefaac16.jpg",
    productSn: "6946605",
    deleteStatus: 0,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    verifyStatus: 0,
    sort: 100,
    sale: 0,
    price: 3788,
    promotionPrice: null,
    giftGrowth: 3788,
    giftPoint: 3788,
    usePointLimit: 0,
    subTitle:
      "AI智慧全面屏 6GB +64GB 亮黑色 全网通版 移动联通电信4G手机 双卡双待手机 双卡双待",
    originalPrice: 4288,
    stock: 1000,
    lowStock: 0,
    unit: "件",
    weight: 0,
    previewStatus: 1,
    serviceIds: "2,3,1",
    keywords: "",
    note: "",
    albumPics:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ab46a3cN616bdc41.jpg,http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf5fN2522b9dc.jpg",
    detailTitle: "",
    promotionStartTime: null,
    promotionEndTime: null,
    promotionPerLimit: 0,
    promotionType: 1,
    brandName: "华为",
    productCategoryName: "手机通讯",
    description: null,
    detailDesc: null,
    detailHtml: null,
    detailMobileHtml: null
  },
  {
    id: 27,
    brandId: 6,
    productCategoryId: 19,
    feightTemplateId: 0,
    productAttributeCategoryId: 3,
    name: "小米8 全面屏游戏智能手机 6GB+64GB 黑色 全网通4G 双卡双待",
    pic:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/xiaomi.jpg",
    productSn: "7437788",
    deleteStatus: 0,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    verifyStatus: 0,
    sort: 0,
    sale: 0,
    price: 2699,
    promotionPrice: null,
    giftGrowth: 2699,
    giftPoint: 2699,
    usePointLimit: 0,
    subTitle:
      "骁龙845处理器，红外人脸解锁，AI变焦双摄，AI语音助手小米6X低至1299，点击抢购",
    originalPrice: 2699,
    stock: 100,
    lowStock: 0,
    unit: "",
    weight: 0,
    previewStatus: 0,
    serviceIds: "",
    keywords: "",
    note: "",
    albumPics: "",
    detailTitle: "",
    promotionStartTime: null,
    promotionEndTime: null,
    promotionPerLimit: 0,
    promotionType: 3,
    brandName: "小米",
    productCategoryName: "手机通讯",
    description: null,
    detailDesc: null,
    detailHtml: null,
    detailMobileHtml: null
  },
  {
    id: 28,
    brandId: 6,
    productCategoryId: 19,
    feightTemplateId: 0,
    productAttributeCategoryId: 3,
    name: "小米 红米5A 全网通版 3GB+32GB 香槟金 移动联通电信4G手机 双卡双待",
    pic:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5a9d248cN071f4959.jpg",
    productSn: "7437789",
    deleteStatus: 0,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    verifyStatus: 0,
    sort: 0,
    sale: 0,
    price: 649,
    promotionPrice: null,
    giftGrowth: 649,
    giftPoint: 649,
    usePointLimit: 0,
    subTitle:
      "8天超长待机，137g轻巧机身，高通骁龙处理器小米6X低至1299，点击抢购",
    originalPrice: 649,
    stock: 100,
    lowStock: 0,
    unit: "",
    weight: 0,
    previewStatus: 0,
    serviceIds: "",
    keywords: "",
    note: "",
    albumPics: "",
    detailTitle: "",
    promotionStartTime: null,
    promotionEndTime: null,
    promotionPerLimit: 0,
    promotionType: 4,
    brandName: "小米",
    productCategoryName: "手机通讯",
    description: null,
    detailDesc: null,
    detailHtml: null,
    detailMobileHtml: null
  },
  {
    id: 29,
    brandId: 51,
    productCategoryId: 19,
    feightTemplateId: 0,
    productAttributeCategoryId: 3,
    name: "Apple iPhone 8 Plus 64GB 红色特别版 移动联通电信4G手机",
    pic:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5acc5248N6a5f81cd.jpg",
    productSn: "7437799",
    deleteStatus: 0,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    verifyStatus: 0,
    sort: 0,
    sale: 0,
    price: 5499,
    promotionPrice: null,
    giftGrowth: 5499,
    giftPoint: 5499,
    usePointLimit: 0,
    subTitle:
      "【限时限量抢购】Apple产品年中狂欢节，好物尽享，美在智慧！速来 >> 勾选[保障服务][原厂保2年]，获得AppleCare+全方位服务计划，原厂延保售后无忧。",
    originalPrice: 5499,
    stock: 100,
    lowStock: 0,
    unit: "",
    weight: 0,
    previewStatus: 0,
    serviceIds: "",
    keywords: "",
    note: "",
    albumPics: "",
    detailTitle: "",
    promotionStartTime: null,
    promotionEndTime: null,
    promotionPerLimit: 0,
    promotionType: 0,
    brandName: "苹果",
    productCategoryName: "手机通讯",
    description: null,
    detailDesc: null,
    detailHtml: null,
    detailMobileHtml: null
  },
  {
    id: 30,
    brandId: 50,
    productCategoryId: 8,
    feightTemplateId: 0,
    productAttributeCategoryId: 1,
    name: "HLA海澜之家简约动物印花短袖T恤",
    pic:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ad83a4fN6ff67ecd.jpg!cc_350x449.jpg",
    productSn: "HNTBJ2E042A",
    deleteStatus: 0,
    publishStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    verifyStatus: 0,
    sort: 0,
    sale: 0,
    price: 98,
    promotionPrice: null,
    giftGrowth: 0,
    giftPoint: 0,
    usePointLimit: 0,
    subTitle:
      "2018夏季新品微弹舒适新款短T男生 6月6日-6月20日，满300减30，参与互动赢百元礼券，立即分享赢大奖",
    originalPrice: 98,
    stock: 100,
    lowStock: 0,
    unit: "",
    weight: 0,
    previewStatus: 0,
    serviceIds: "",
    keywords: "",
    note: "",
    albumPics: "",
    detailTitle: "",
    promotionStartTime: null,
    promotionEndTime: null,
    promotionPerLimit: 0,
    promotionType: 0,
    brandName: "海澜之家",
    productCategoryName: "T恤",
    description: null,
    detailDesc: null,
    detailHtml: null,
    detailMobileHtml: null
  }
];

const brands = [
  {
    id: 6,
    name: "小米",
    firstLetter: "M",
    sort: 500,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 100,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/1e34aef2a409119018a4c6258e39ecfb_222_222.png",
    bigPic:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180518/5afd7778Nf7800b75.jpg",
    brandStory: null
  },
  {
    id: 49,
    name: "七匹狼",
    firstLetter: "S",
    sort: 200,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 77,
    productCommentCount: 400,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/18d8bc3eb13533fab466d702a0d3fd1f40345bcd.jpg",
    bigPic: null,
    brandStory: null
  },
  {
    id: 50,
    name: "海澜之家",
    firstLetter: "H",
    sort: 200,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 66,
    productCommentCount: 300,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/99d3279f1029d32b929343b09d3c72de_222_222.jpg",
    bigPic: "",
    brandStory: null
  },
  {
    id: 51,
    name: "苹果",
    firstLetter: "A",
    sort: 200,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 55,
    productCommentCount: 200,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg",
    bigPic: null,
    brandStory: null
  },
  {
    id: 2,
    name: "三星",
    firstLetter: "S",
    sort: 100,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 100,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg (1).jpg",
    bigPic: null,
    brandStory: null
  },
  {
    id: 3,
    name: "华为",
    firstLetter: "H",
    sort: 100,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 100,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/17f2dd9756d9d333bee8e60ce8c03e4c_222_222.jpg",
    bigPic: null,
    brandStory: null
  },
  {
    id: 4,
    name: "格力",
    firstLetter: "G",
    sort: 30,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 100,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/dc794e7e74121272bbe3ce9bc41ec8c3_222_222.jpg",
    bigPic: null,
    brandStory: null
  },
  {
    id: 5,
    name: "方太",
    firstLetter: "F",
    sort: 20,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 100,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg (4).jpg",
    bigPic: null,
    brandStory: null
  },
  {
    id: 1,
    name: "万和",
    firstLetter: "W",
    sort: 0,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 100,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg(5).jpg",
    bigPic: "",
    brandStory: null
  },
  {
    id: 21,
    name: "OPPO",
    firstLetter: "O",
    sort: 0,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 88,
    productCommentCount: 500,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg(6).jpg",
    bigPic: "",
    brandStory: null
  },
  {
    id: 58,
    name: "NIKE",
    firstLetter: "N",
    sort: 0,
    factoryStatus: 1,
    showStatus: 1,
    productCount: 33,
    productCommentCount: 100,
    logo:
      "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/timg (51).jpg",
    bigPic: "",
    brandStory: null
  }
];

const children = [
  {
    id: 1,
    parentId: null,
    name: "服装",
    level: null,
    productCount: null,
    productUnit: null,
    navStatus: null,
    showStatus: null,
    sort: null,
    icon: null,
    keywords: null,
    description: null,
    children: [
      {
        id: 7,
        parentId: null,
        name: "外套",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 8,
        parentId: null,
        name: "T恤",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 9,
        parentId: null,
        name: "休闲裤",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 10,
        parentId: null,
        name: "牛仔裤",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 11,
        parentId: null,
        name: "衬衫",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 29,
        parentId: null,
        name: "男鞋",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      }
    ]
  },
  {
    id: 2,
    parentId: null,
    name: "手机数码",
    level: null,
    productCount: null,
    productUnit: null,
    navStatus: null,
    showStatus: null,
    sort: null,
    icon: null,
    keywords: null,
    description: null,
    children: [
      {
        id: 19,
        parentId: null,
        name: "手机通讯",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 30,
        parentId: null,
        name: "手机配件",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 31,
        parentId: null,
        name: "摄影摄像",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 32,
        parentId: null,
        name: "影音娱乐",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 33,
        parentId: null,
        name: "数码配件",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 34,
        parentId: null,
        name: "智能设备",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      }
    ]
  },
  {
    id: 3,
    parentId: null,
    name: "家用电器",
    level: null,
    productCount: null,
    productUnit: null,
    navStatus: null,
    showStatus: null,
    sort: null,
    icon: null,
    keywords: null,
    description: null,
    children: [
      {
        id: 35,
        parentId: null,
        name: "电视",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 36,
        parentId: null,
        name: "空调",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 37,
        parentId: null,
        name: "洗衣机",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 38,
        parentId: null,
        name: "冰箱",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 39,
        parentId: null,
        name: "厨卫大电",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 40,
        parentId: null,
        name: "厨房小电",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 41,
        parentId: null,
        name: "生活电器",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 42,
        parentId: null,
        name: "个护健康",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      }
    ]
  },
  {
    id: 4,
    parentId: null,
    name: "家具家装",
    level: null,
    productCount: null,
    productUnit: null,
    navStatus: null,
    showStatus: null,
    sort: null,
    icon: null,
    keywords: null,
    description: null,
    children: [
      {
        id: 43,
        parentId: null,
        name: "厨房卫浴",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 44,
        parentId: null,
        name: "灯饰照明",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 45,
        parentId: null,
        name: "五金工具",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 46,
        parentId: null,
        name: "卧室家具",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 47,
        parentId: null,
        name: "客厅家具",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      }
    ]
  },
  {
    id: 5,
    parentId: null,
    name: "汽车用品",
    level: null,
    productCount: null,
    productUnit: null,
    navStatus: null,
    showStatus: null,
    sort: null,
    icon: null,
    keywords: null,
    description: null,
    children: [
      {
        id: 48,
        parentId: null,
        name: "全新整车",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 49,
        parentId: null,
        name: "车载电器",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 50,
        parentId: null,
        name: "维修保养",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      },
      {
        id: 51,
        parentId: null,
        name: "汽车装饰",
        level: null,
        productCount: null,
        productUnit: null,
        navStatus: null,
        showStatus: null,
        sort: null,
        icon: null,
        keywords: null,
        description: null
      }
    ]
  }
];

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};

export default {
  name: "productList",
  data() {
    return {
      offset: 0,
      limit: 20,
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: "",
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null
      },
      operates: [
        {
          label: "商品上架",
          value: "publishOn"
        },
        {
          label: "商品下架",
          value: "publishOff"
        },
        {
          label: "设为推荐",
          value: "recommendOn"
        },
        {
          label: "取消推荐",
          value: "recommendOff"
        },
        {
          label: "设为新品",
          value: "newOn"
        },
        {
          label: "取消新品",
          value: "newOff"
        },
        {
          label: "转移到分类",
          value: "transferCategory"
        },
        {
          label: "移入回收站",
          value: "recycle"
        }
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: list,
      total: null,
      listLoading: false,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: children,
      brandOptions: brands,
      publishStatusOptions: [
        {
          value: 1,
          label: "上架"
        },
        {
          value: 0,
          label: "下架"
        }
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过"
        },
        {
          value: 0,
          label: "未审核"
        }
      ]
    };
  },
  components: {
    headTop
  },
  created() {
    this.getList();
    this.getBrandList();
    this.getProductCateList();
  },
  watch: {
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    }
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "审核通过";
      } else {
        return "未审核";
      }
    }
  },
  methods: {
    getProductSkuSp(row, index) {
      if (index === 0) {
        return row.sp1;
      } else if (index === 1) {
        return row.sp2;
      } else {
        return row.sp3;
      }
    },
    async getList() {
      const params = {
        offset: this.offset,
        limit: this.limit,
        restaurant_id: this.restaurant_id
      };
      if(this.product_name){
        params.keyword = this.product_name;
      }

      const Foods = await getFoods(params);
      this.list = Foods;
      // this.listLoading = true;
      // fetchList(this.listQuery).then(response => {
      //   this.listLoading = false;
      //   this.list = response.data.list;
      //   this.total = response.data.total;
      // });
    },
    getBrandList() {
      // fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
      //   this.brandOptions = [];
      //   let brandList = response.data.list;
      //   for (let i = 0; i < brandList.length; i++) {
      //     this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
      //   }
      // });
    },
    getProductCateList() {
      // fetchListWithChildren().then(response => {
      //   let list = response.data;
      //   this.productCateOptions = [];
      //   for (let i = 0; i < list.length; i++) {
      //     let children = [];
      //     if (list[i].children != null && list[i].children.length > 0) {
      //       for (let j = 0; j < list[i].children.length; j++) {
      //         children.push({label: list[i].children[j].name, value: list[i].children[j].id});
      //       }
      //     }
      //     this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
      //   }
      // });
    },
    handleShowSkuEditDialog(index, row) {
      this.editSkuInfo.dialogVisible = true;
      this.editSkuInfo.productId = row.id;
      this.editSkuInfo.productSn = row.productSn;
      this.editSkuInfo.productAttributeCategoryId =
        row.productAttributeCategoryId;
      this.editSkuInfo.keyword = null;
      fetchSkuStockList(row.id, { keyword: this.editSkuInfo.keyword }).then(
        response => {
          this.editSkuInfo.stockList = response.data;
        }
      );
      fetchProductAttrList(row.productAttributeCategoryId, { type: 0 }).then(
        response => {
          this.editSkuInfo.productAttr = response.data.list;
        }
      );
    },
    handleSearchEditSku() {
      fetchSkuStockList(this.editSkuInfo.productId, {
        keyword: this.editSkuInfo.keyword
      }).then(response => {
        this.editSkuInfo.stockList = response.data;
      });
    },
    handleEditSkuConfirm() {
      if (
        this.editSkuInfo.stockList == null ||
        this.editSkuInfo.stockList.length <= 0
      ) {
        this.$message({
          message: "暂无sku信息",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updateSkuStockList(
          this.editSkuInfo.productId,
          this.editSkuInfo.stockList
        ).then(response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
          this.editSkuInfo.dialogVisible = false;
        });
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAddProduct() {
      this.$router.push({ path: "/pms/addProduct" });
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updatePublishStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[4].value:
            this.updateNewStatus(1, ids);
            break;
          case this.operates[5].value:
            this.updateNewStatus(0, ids);
            break;
          case this.operates[6].value:
            break;
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    handleNewStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNewStatus(row.newStatus, ids);
    },
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateRecommendStatus(row.recommandStatus, ids);
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({ path: "/pms/updateProduct", query: { id: row.id } });
    },
    handleShowProduct(index, row) {
      console.log("handleShowProduct", row);
    },
    handleShowVerifyDetail(index, row) {
      console.log("handleShowVerifyDetail", row);
    },
    handleShowLog(index, row) {
      console.log("handleShowLog", row);
    },
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("newStatus", newStatus);
      updateNewStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("recommendStatus", recommendStatus);
      updateRecommendStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000
        });
      });
      this.getList();
    }
  }
};
</script>
<style lang="less">
// @import "../../style/mixin";
.app-container {
  padding: 20px;
}
</style>



