<template>
  <div>
    <a-range-picker
      v-if="props.timeValue == 2 || props.timeValue == 3 || props.timeValue == 4"
      v-model:value="rangeValue"
      format="YYYY-MM-DD"
      style="width: 100%"
      value-format="YYYY-MM-DD"
      :placeholder="['开始时间', '结束时间']"
      @change="changeEquipmentData"
    />

    <a-range-picker
      v-if="props.timeValue == 5"
      format="YYYY-MM"
      value-format="YYYY-MM"
      style="width: 100%"
      v-model:value="rangeValue" picker="month"
      :placeholder="['开始时间', '结束时间']"
      @change="changeEquipmentData"
    />
    <a-range-picker
      v-if="props.timeValue == 6"
      format="YYYY"
      value-format="YYYY"
      style="width: 100%"
      v-model:value="rangeValue" picker="year"
      :placeholder="['开始时间', '结束时间']"
      @change="changeEquipmentData"
    />
  </div>
</template>
<script setup lang="ts">
import {defineProps, ref} from "vue";

const props = defineProps({
  timeValue: Number,
});
const rangeValue = ref([])//时间筛选
const emit = defineEmits();

/**
 * 更换选择时间
 */
async function changeEquipmentData() {
  let startTime = rangeValue.value[0];
  let endTime = rangeValue.value[1];
  if(props.timeValue.value == 2){
    startTime = startTime + " 00:00"
    endTime = endTime + " 23:59"
  } else if(props.timeValue.value == 3){
    startTime = startTime + " 00"
    endTime = endTime + " 23"
  }
  emit("update:value", rangeValue.value)
}
</script>

<style scoped lang="less">

</style>
