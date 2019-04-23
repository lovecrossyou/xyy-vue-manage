<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="12" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="厂家名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-autocomplete
              v-model="formData.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
              @select="addressSelect"
            ></el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model.number="formData.phone"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="formData.brand"></el-input>
          </el-form-item>
          <el-form-item label="厂家介绍">
            <el-input type="textarea" :rows="2" placeholder="请输入介绍信息" v-model="formData.promotion_info"></el-input>
          </el-form-item>
          <el-form-item label="上传厂家头像">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/shop'"
              :show-file-list="false"
              :on-success="handleShopAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.image_path"
                :src="baseImgPath + formData.image_path"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传营业执照">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/shop'"
              :show-file-list="false"
              :on-success="handleBusinessAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.business_license_image"
                :src="baseImgPath + formData.business_license_image"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传食品经营许可证">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/shop'"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.catering_service_license_image"
                :src="baseImgPath + formData.catering_service_license_image"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import { cityGuess, addFactory, searchplace, foodCategory } from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
export default {
  data() {
    return {
      city: {},
      formData: {
        name: "", //店铺名称
        address: "", //地址
        latitude: "",
        longitude: "",
        brand: "", //品牌
        phone: "",
        promotion_info: "",
        image_path: "",
        business_license_image: "",
        catering_service_license_image: ""
      },
      rules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话" },
          { type: "number", message: "电话号码必须是数字" }
        ]
      },
      options: [],
      baseUrl,
      baseImgPath,
      categoryOptions: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await cityGuess();
      } catch (err) {
        console.log(err);
      }
    },
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchplace(this.city.id, queryString);
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    addressSelect(address) {
      this.formData.latitude = address.latitude;
      this.formData.longitude = address.longitude;
      console.log(this.formData.latitude, this.formData.longitude);
    },
    handleShopAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.image_path = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    handleBusinessAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.business_license_image = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    handleServiceAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.catering_service_license_image = res.image_path;
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
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
    handleDelete(index) {
      this.activities.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            if (this.formData.phone.length === 0) {
              this.$notify.error({
                title: "错误",
                message: "请检查手机号是否合法",
                offset: 100
              });
              return;
            }
            let result = await addFactory(this.formData);
            if (result.status == 1) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.formData = {
                name: "", //店铺名称
                address: "", //地址
                latitude: "",
                longitude: "",
                description: "", //介绍
                phone: "",
                promotion_info: "",
                float_delivery_fee: 0, //运费
                float_minimum_order_amount: 0, //起价
                is_premium: true,
                delivery_mode: true,
                new: true,
                bao: true,
                zhun: true,
                piao: true,
                startTime: "",
                endTime: "",
                image_path: "",
                business_license_image: "",
                catering_service_license_image: ""
              };
              this.selectedCategory = ["快餐便当", "简餐"];
              this.activities = [
                {
                  icon_name: "减",
                  name: "满减优惠",
                  description: "满30减5，满60减8"
                }
              ];
            } else {
              this.$message({
                type: "error",
                message: result.message
              });
            }
            console.log(result);
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.button_submit {
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
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
