<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer>
      <template #detail>
        <a-button type="primary" @click="addData" preIcon="ant-design:plus-outlined" style="margin-top: 10px">
          添加数据点
        </a-button>
        <a-table :columns="protocolDataColumns" :data-source="formData.protocolDatas">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <span>
                <a v-if="record.dataType != 1" @click="editData(record)">编辑</a>
                <a-divider type="vertical" v-if="record.dataType != 1"/>
                <a @click="deleteData(record)" v-if="record.dataType != 1">删除</a>
              </span>
            </template>
          </template>
        </a-table>
      </template>
    </JFormContainer>
  </a-spin>

  <!-- 表单区域 -->
  <CyProtocolDataModal ref="registerModal" :protocolId="formData.id" :equipmentTypeId="formData.equipmentTypeId" @success="addDataSuccess"></CyProtocolDataModal>
</template>

<script lang="ts" setup>
import {ref, reactive, defineExpose} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {Form} from 'ant-design-vue';
import CyProtocolDataModal from './components/CyProtocolDataModal.vue'
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {list, deleteOne} from "@/views/energy/protocol/components/CyProtocolData.api";

const confirmLoading = ref<boolean>(false);
const formRef = ref();
const protocolDataColumns = [
  {
    title: '数据点名称',
    dataIndex: 'dataName',
    key: 'dataName',
  },
  {
    title: '数据点类型',
    dataIndex: 'dataTypeName',
    key: 'dataTypeName',
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
];
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const registerModal = ref();
const formData = reactive<Record<string, any>>({
  id: '',
  protocolDatas: []
});

/**
 * 添加数据点
 */
function addData() {
  registerModal.value.add();
}

/**
 * 编辑数据点
 */
function editData(record) {
  registerModal.value.edit(record);
}

/**
 * 删除数据点
 */
function deleteData(record) {
  deleteOne({id: record.id}).then((res) => {
    initFormData(formData)
  })
}

/**
 * 初始化数据
 */
function initFormData(record) {
  formData.id = record.id
  formData.equipmentTypeId = record.equipmentTypeId
  getProtocolDatas(record.id)
}

/**
 * 添加数据点成功
 */
function addDataSuccess() {
  getProtocolDatas(formData.id)
}

/**
 * 获取已添加的数据点
 */
function getProtocolDatas(protocolId) {
  list({protocolId: protocolId}).then((res) => {
    formData.protocolDatas = res
  })
}

defineExpose({
  initFormData,
});
</script>

<style lang="less" scoped>
.antd-modal-form {
  padding: 14px 20px;
}
</style>
