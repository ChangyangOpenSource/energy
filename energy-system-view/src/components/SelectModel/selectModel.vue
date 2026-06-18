<template>
  <div>
    <a-select
      v-model:value="modelId"
      :options="models"
      :field-names="{ label: 'modelName', value: 'id', options: 'children' }"
      placeholder="请选择型号"
      @change="changeParam"
      allow-clear
    >
    </a-select>
  </div>
</template>
<script setup lang="ts">

import {defineProps, ref, watch} from "vue";
import {modelList} from "@/views/energy/model/CyModel.api";

const models = ref([]) // 参数筛选
const modelId = ref(undefined)//选中参数
const props = defineProps({
  brandId: String,
});
const emit = defineEmits();


// 监听equipmentTypeId变化
watch(() => props.brandId, (newVal) => {
  if (props.brandId) {
    getModels();
  }
}, {immediate: true});


function changeParam() {
  emit("update:value", models.value)
}

/**
 * 获取品牌数据
 */
function getModels() {
  modelList({pageSize: -1, brandId: props.brandId}).then((res) => {
    models.value = res.records
  })
}
defineExpose({
  getModels
})
</script>
<style scoped lang="less">

</style>
