<template>
  <div :class="color">
    {{ text }}
  </div>
</template>

<script setup>
// 定义 props
const props = defineProps({
  // 表单禁用
  color: {
    type: String,
    required: false,
    default: 'default'
  },
  // 表单禁用
  text: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
div {
  padding: 5px 12px;
  font-weight: 400;
  font-size: 14px;
  width: auto;
  border-radius: 3px;
  margin: 0 auto;
  white-space: nowrap;
}
.default {
  color: #A9A9A9;
  background: #F3F3F3;
  border: 1px solid #A9A9A9;
}

.green {
  color: #2BA471;
  background: #E3F9E9;
  border: 1px solid #2BA471;
}

.blue {
  color: #0052D9;
  background: #F2F3FF;
  border: 1px solid #0052D9;
}

.orange {
  color: #E37318;
  background: #FFF1E9;
  border: 1px solid #E37318;
}

.red {
  color: #D54941;
  background: #FFF0ED;
  border: 1px solid #D54941;
}
</style>
