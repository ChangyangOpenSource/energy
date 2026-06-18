<template>
  <div>
    <a-select
      v-model:value="selectParamCode"
      style="width: 100%"
      placeholder="请选择"
      @change="changeParam"
      allow-clear>
      <a-select-option v-for="(item, index) in allParams" :key="index"
                       :value="item.paramCode">{{ item.paramName }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script setup lang="ts">

import {defineProps, ref, watch} from "vue";
import {getAllParameters} from "@/views/energy/meter/CyEquipment.api";
const allParams = ref([]) // 参数筛选
const selectParamCode = ref(undefined)//选中参数

const props = defineProps({
  deviceSn: Array,
});
const emit = defineEmits();


watch(props, value => {
  console.log("props.deviceSn", props.deviceSn)
  if (props.deviceSn && props.deviceSn.length > 0) {
    getAllParameters({sn: props.deviceSn}).then((res) => {
      allParams.value = res
    })
  } else {
    allParams.value = []
  }
})

function changeParam() {
  emit("update:value", selectParamCode.value)
}

</script>
<style scoped lang="less">

</style>
