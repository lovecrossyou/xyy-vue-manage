<template>
  <div class="app-container">
  </div>
</template>
<script>
// import { fetchBrandList } from "@/api/getData";

export default {
  name: "brandList",
  data() {
    return {
      operates: [
        {
          label: "显示品牌",
          value: "showBrand"
        },
        {
          label: "隐藏品牌",
          value: "hideBrand"
        }
      ],
      operateType: null,
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10
      },
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: []
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    
  }
};
</script>
<style lang="scss">
</style>


