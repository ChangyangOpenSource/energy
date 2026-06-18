<template>
  <a-drawer
    title="参数管理"
    :width="800"
    :visible="visible"
    @ok="handleCancel"
    :footer-style="{ textAlign: 'right' }"
    @close="handleCancel">
    <a-button type="primary" @click="handleAdd">添加参数</a-button>
    <a-table :columns="columns" :data-source="typeParams" :pagination="false" style="margin-top: 8px">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a @click="handleUpdate(record)">更新参数</a>
            <a-divider type="vertical"/>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <Popconfirm title="确定删除吗？" @confirm="handleDelete(record)">
              <a>删除</a>
            </Popconfirm>
            <a-divider type="vertical"/>
            <a @click="handleCopy(record)">复制</a>
          </span>
        </template>
      </template>
    </a-table>
    <CyEnergyConsumeEquipmentTypeParamModal ref="registerModal" @success="handleSuccess" :energyConsumeEquipmentTypeId="energyConsumeEquipmentTypeId"></CyEnergyConsumeEquipmentTypeParamModal>
  </a-drawer>
</template>

<script lang="ts" name="cyEnergyConsumeEquipmentTypeParam-cyEnergyConsumeEquipmentTypeParam" setup>

import {ref, defineExpose, defineProps, nextTick} from 'vue';
const { createMessage, createWarningModal } = useMessage();
import CyEnergyConsumeEquipmentTypeParamModal from "@/views/energy/energyConsumeEquipmentType/components/components/CyEnergyConsumeEquipmentTypeParamModal.vue";
import {
  list,
  copy,
  deleteOne,
  updateParamToEquipment
} from "@/views/energy/energyConsumeEquipmentType/components/CyEnergyConsumeEquipmentTypeParam.api";
import {useMessage} from "@/hooks/web/useMessage";
import {Popconfirm} from "ant-design-vue";

const emit = defineEmits(['success']);
const energyConsumeEquipmentTypeId = ref('')
const registerModal = ref('')
const visible = ref(false)
const disableSubmit = ref(false)
const typeParams = ref([])
const columns = ref([
  {
    title: '参数名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '参数类型',
    dataIndex: 'paramType_dictText',
    key: 'paramType',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '操作',
    key: 'action',
  },
])


function visTrue(id) {
  visible.value = true
  energyConsumeEquipmentTypeId.value = id
  getTypeParams(id)
}

/**
 * 获取设备下的参数
 */
function getTypeParams(id) {
  list({ energyConsumeEquipmentTypeId: id, pageSize: -1 }).then((res) => {
    typeParams.value = res.records
  })
}

/**
 * 取消按钮回调事件
 */
function handleCancel() {
  visible.value = false;
  emit('success');
}

/**
 * 更新参数
 */
async function handleUpdate(record) {
  await updateParamToEquipment({ id: record.id }, handleSuccess);
}


/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.disableSubmit = false;
  registerModal.value.add();
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
  record.copyId = ""
  registerModal.value.disableSubmit = false;
  registerModal.value.edit(record);
}

/**
 * 复制事件
 */
async function handleCopy(record: Recordable) {
  record.copyId = record.id
  registerModal.value.disableSubmit = false;
  registerModal.value.edit(record);
}


/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteOne({ id: record.id }, handleSuccess);
}

/**
 * 成功回调
 */
function handleSuccess() {
  getTypeParams(energyConsumeEquipmentTypeId.value)
}

defineExpose({
  visTrue
});
</script>

<style lang="less" scoped>
</style>
<script setup lang="ts">
</script>
