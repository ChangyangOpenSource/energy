<template>
  <a-tree-select
    v-model:value="equipmentTypeId"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择设备类型"
    tree-default-expand-all
    :tree-data="equipmentTypes"
    :field-names="{
                      children: 'children',
                      label: 'title',
                      value: 'key',
                      selectable: 'selectable',
                    }"
    tree-node-filter-prop="title"
    @change="changeEquipmentType"
  >
  </a-tree-select>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {loadTreeRootNoTenant} from "@/views/system/category/category.api";

const equipmentTypes = ref([])
const equipmentTypeId = ref(undefined)
const emit = defineEmits();

/**
 * 分类字典
 */
function getCategoryTree() {
  loadTreeRootNoTenant({pcode: "C03", async: false}).then((res) => {
    handleTreeNodeValue(res)
    equipmentTypes.value = res
    equipmentTypeId.value = res[0].children[0].key
    changeEquipmentType()
    console.log("equipmentTypeId", equipmentTypeId)
  });
}

/**
 * 处理树形数据
 * @param result
 */
function handleTreeNodeValue(result) {
  for (let i of result) {
    i.value = i['key']
    i.key = i['key']
    i.isLeaf = (!i.leaf) ? false : true
    i.selectable = i.leaf ? true : false //是否可选
    i.checkable = i.leaf ? true : false //设置独立节点是否展示 Checkbox
    if (i.children && i.children.length > 0) {
      handleTreeNodeValue(i.children)
    }
  }
}

function changeEquipmentType() {
  emit("update:value", equipmentTypeId.value)
}

onMounted(async () => {
  getCategoryTree();
});
</script>

