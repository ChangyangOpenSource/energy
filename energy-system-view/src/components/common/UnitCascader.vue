<template>
  <a-cascader
      v-model:value="value"
      :disabled="disabled"
      :show-search="{ filter }"
      :options="unitCodeGroup"
      :placeholder="t('carbon.message.please_select_unit')"
      @change="onChange"
  />
  <div style="display: none">
    {{value}}
  </div>
</template>

<script setup>
import { ref, watch, onMounted,getCurrentInstance } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getUnitGroups } from './api/UnitCascader.api';
const instance = getCurrentInstance()

const { t } = useI18n();

// Props
const props = defineProps({
  unitId: {
    type: String,
    required: false,
    default: undefined
  },
  filterName: {
    type: String,
    required: false,
    default: undefined
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
});

// Emits
const emit = defineEmits(['update:value', 'change']);

// Reactive data
const value = ref([]);
const unitCodeGroup = ref([]);

// Watch
watch(() => props.unitId, () => {
  initValue();
});

// Lifecycle
onMounted(() => {
  getUnit();
});

/**
 * 初始化选择对象
 */
function initValue() {
  console.log(22222, props.unitId, props.disabled);
  if (props.unitId) {
    // 清空现有值
    value.value = [];

    unitCodeGroup.value.forEach(item => {
      item.children.forEach(child => {
        if (child.value === props.unitId) {
          // 修复：使用 item.value 而不是 item.label 作为路径的第一级
          value.value = [item.value, props.unitId];
          console.log(value.value);
        }
      });
    });
  } else {
    console.log(3333);
    value.value = [];
  }
}

/**
 * 获取单位
 */
function getUnit() {
  console.log(111111);
  getUnitGroups().then(res => {
    if (res.success) {
      unitCodeGroup.value = [];

      for (let item in res.result) {
        // 只过滤一级 以filterName开头的
        if (props.filterName) {
          if (item.startsWith(props.filterName)) {
            console.log(props.filterName);
            let childrenParam = [];
            res.result[item].forEach(child => {
              childrenParam.push({
                value: child.id,
                label: child.unitCode,
              });
            });
            unitCodeGroup.value.push({
              value: item,
              label: item,
              children: childrenParam,
            });
          }
        } else {
          let childrenParam = [];
          res.result[item].forEach(child => {
            childrenParam.push({
              value: child.id,
              label: child.unitCode,
            });
          });
          unitCodeGroup.value.push({
            value: item,
            label: item,
            children: childrenParam,
          });
        }
      }
      console.log(unitCodeGroup.value);
      initValue();
    }
  });
}

function onChange(val, selectedOptions) {
  console.log(val, selectedOptions);
  if (val && val.length > 1) {
    emit('update:value', val[1]);
    emit('change', val[1], selectedOptions[1].label);
  }
}

function filter(inputValue, path) {
  return path.some(unitCodeGroup => unitCodeGroup.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

// Expose methods if needed
defineExpose({
  initValue,
  getUnit
});
</script>

<style scoped>
</style>
