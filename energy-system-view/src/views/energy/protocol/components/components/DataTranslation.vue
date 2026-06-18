<template>
  <j-modal
    title="变量值翻译"
    :height="500"
    :width="800"
    :visible="visible"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-table :columns="columns" :data-source="dataSources" :pagination="false">
    </a-table>
  </j-modal>
</template>

<script lang="ts" setup>
import {defineExpose, nextTick, ref} from 'vue';
import JModal from '/@/components/Modal/src/JModal/JModal.vue';

const visible = ref(false)
const dataSources = ref([
  {
    name: '在线',
    value: 0
  },
  {
    name: '离线',
    value: 1
  }
])
const columns = ref([
  {
    title: '变量值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '翻译值',
    dataIndex: 'name',
    key: 'name',
  },
])

/**
 * 新增
 */
function visTrue() {
  visible.value = true;
}

/**
 * 取消按钮回调事件
 */
function handleCancel() {
  visible.value = false;
}

defineExpose({
  visTrue
});
</script>

<style lang="less">
/**隐藏样式-modal确定按钮 */
.jee-hidden {
  display: none !important;
}
</style>
<style lang="less" scoped></style>
