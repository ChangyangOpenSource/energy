<script setup lang="ts">

import {defineProps, ref, watch} from "vue";
import {groupTree} from "@/views/energy/group/CyGroup.api";
const groupTreeData = ref([]);
const groupId = ref(undefined);
const emit = defineEmits();

const props = defineProps({
  stationId: String,
});

// 监听equipmentTypeId变化
watch(() => props.stationId, (newVal) => {
  if (props.stationId) {
    getGroupTree();
  }
}, {immediate: true});

function getGroupTree() {
  groupTree({stationId: props.stationId}).then((res) => {
    groupTreeData.value = res
    if (groupTreeData.value && groupTreeData.value.length > 0) {
      groupId.value = groupTreeData.value[0].id

      emit("update:value", groupId.value)
      emit("ok")
    } else {
      groupId.value = undefined
      emit("update:value", groupId.value)
      emit("ok")
    }
  })
}

function selectGroup() {
  emit("update:value", groupId.value)
  emit("ok")
}
</script>

<template>
  <a-tree-select
    v-model:value="groupId"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择分组"
    tree-default-expand-all
    :tree-data="groupTreeData"
    :field-names="{
      children: 'groups',
      label: 'name',
      value: 'id',
    }"
    tree-node-filter-prop="name"
    @change="selectGroup"
  >
  </a-tree-select>
</template>

<style scoped lang="less">

</style>
