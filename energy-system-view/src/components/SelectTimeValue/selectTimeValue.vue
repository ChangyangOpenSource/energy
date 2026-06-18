<template>
  <div>
    <a-select v-model:value="innerValue" style="width: 100%" placeholder="请选择"
              @change="handleTimeChange" :options="options">
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  value: {
    type: Number,
  },
  optionsValueList: {
    type: Array,
    default: [1, 2, 3, 4, 5, 6]
  }
});

const options = ref([])
const allOptions = ref([
  {
    value: 1,
    label: "每分钟数据"
  },
  {
    value: 2,
    label: "15分钟数据"
  },
  {
    value: 3,
    label: "小时数据"
  },
  {
    value: 4,
    label: "日数据"
  },
  {
    value: 5,
    label: "月数据"
  },
  {
    value: 6,
    label: "年数据"
  }
])

const emit = defineEmits();

// 内部值
const innerValue = ref(props.value);

// 监听外部传入的 value 变化
watch(() => props.value, (newVal) => {
  innerValue.value = newVal;
});

// 监听外部传入的 value 变化
watch(() => props.optionsValueList, (newVal) => {
  let tempOptions = []
  props.optionsValueList.forEach((item) => {
    allOptions.value.forEach((option) => {
      if (option.value === item) {
        tempOptions.push(option);
      }
    })
  })
  if (!props.value) {
    innerValue = tempOptions[0].value
  }
  options.value = tempOptions;
});

// 监听内部值变化并通知父组件
watch(innerValue, (newVal) => {
  emit('update:value', newVal);
});

function handleTimeChange(value: number) {
  innerValue.value = value;
  emit('update:value', value);
}
</script>
