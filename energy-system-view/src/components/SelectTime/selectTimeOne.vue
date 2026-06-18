<template>
  <a-date-picker style="width: 100%" v-model:value="dataTime" value-format="YYYY-MM-DD" v-if="props.timeValue == 1 || props.timeValue == 2 || props.timeValue == 3 || props.timeValue == 4" @change="changeData"/>
  <a-date-picker style="width: 100%" v-model:value="dataTime" value-format="YYYY-MM" picker="month" v-if="props.timeValue == 5" @change="changeData"/>
  <a-date-picker style="width: 100%" v-model:value="dataTime" value-format="YYYY" picker="year"  v-if="props.timeValue == 6" @change="changeData"/>
</template>
<script setup lang="ts">
import {defineProps, ref, watch} from "vue";
const props = defineProps({
  timeValue: Number,
  dataTime: String
});


const dataTime = ref()//时间筛选
const emit = defineEmits();

// 监听外部传入的 value 变化
watch(() => props.dataTime, (newVal) => {
  dataTime.value = newVal;
});

// 监听内部值变化并通知父组件
watch(dataTime, (newVal) => {
  emit('update:value', newVal);
});

/**
 * 更换选择时间
 */
async function changeData() {
  emit("update:value", dataTime.value)
}
</script>

<style scoped lang="less">

</style>
