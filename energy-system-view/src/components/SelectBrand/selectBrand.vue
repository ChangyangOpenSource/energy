<template>
  <div>
    <a-select
      v-model:value="brandId"
      :options="brands"
      :field-names="{ label: 'brandName', value: 'id', options: 'children' }"
      placeholder="请选择品牌"
      @change="changeParam"
      allow-clear
    >
    </a-select>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";
import {brandList} from "@/views/energy/model/components/components/CyBrand.api";

const brands = ref([]) // 参数筛选
const brandId = ref(undefined)//选中参数

const emit = defineEmits();

function changeParam() {
  emit("update:value", brandId.value)
}

/**
 * 获取品牌数据
 */
function getBrands() {
  brandList({pageSize: -1}).then((res) => {
    brands.value = res.records
  })
}

defineExpose({
  getBrands
})
</script>
<style scoped lang="less">

</style>
