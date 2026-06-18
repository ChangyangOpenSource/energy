<template>
  <div class="search-container">
    <a-form ref="formRef" @keyup.enter="searchQuery" :model="queryParam"
            :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
      <a-row :gutter="16" align="middle">
        <!-- 品牌名称 -->
        <a-col :span="6" class="form-col">
          <a-form-item name="brandName" label="品牌名称" class="form-item">
            <a-select
              v-model:value="queryParam.brandId"
              :options="brands"
              :field-names="{ label: 'brandName', value: 'id', options: 'children' }"
              placeholder="请选择品牌"
              allow-clear
              @change="getModels">
            </a-select>
          </a-form-item>
        </a-col>

        <!-- 型号名称 -->
        <a-col :span="6" class="form-col">
          <a-form-item name="modelName" label="型号名称" class="form-item">
            <a-select
              v-model:value="queryParam.modelId"
              :options="models"
              :field-names="{ label: 'modelName', value: 'id', options: 'children' }"
              placeholder="请选择品牌型号"
              allow-clear>
            </a-select>
          </a-form-item>
        </a-col>

        <!-- 协议名称 -->
        <a-col :span="6" class="form-col">
          <a-form-item name="protocolName" label="协议名称" class="form-item">
            <JInput v-model:value="queryParam.protocolName"
                    placeholder="请输入协议名称"
                    allow-clear/>
          </a-form-item>
        </a-col>

        <!-- 按钮组 -->
        <a-col :span="6" class="button-col">
          <a-space>
            <a-button type="primary" @click="searchQuery" preIcon="ant-design:search-outlined">
              查询
            </a-button>
            <a-button @click="searchReset" preIcon="ant-design:reload-outlined">
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :columns="protocolColumn"
      :data-source="protocols"
      :pagination="false"
      :row-key="record => record.id">

      <!-- 自定义选择列 -->
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'selection'">
          <a-radio :checked="selectedRowKeys.includes(record.id)" @change="onSelectChange(record)"/>
        </template>
      </template>
    </a-table>

  </div>
</template>

<script setup lang="ts">

import JInput from "@/components/Form/src/jeecg/components/JInput.vue";
import {defineExpose, ref} from "vue";
import {protocolList} from "@/views/energy/protocol/CyProtocol.api";
import {brandList} from "@/views/energy/model/components/components/CyBrand.api";
import {modelList} from "@/views/energy/model/CyModel.api";

const emit = defineEmits(['ok']);

const formRef = ref();
const brands = ref([]);
const models = ref([]);
const queryParam = ref({
  brandId: undefined,
  modelId: undefined,
  protocolName: undefined
});
const protocols = ref([]); //协议


const protocolColumn = ref([
  {
    title: '选择',
    dataIndex: 'selection',
    key: 'selection',
    align: 'right'
  },
  {
    title: '协议',
    align: 'center',
    dataIndex: 'protocolName',
  },
  {
    title: '品牌',
    align: 'center',
    dataIndex: 'brandName',
  },
  {
    title: '型号',
    align: 'center',
    dataIndex: 'modelName',
  },
])
// 选中的行key
const selectedRowKeys = ref([]);
// 选中的行数据
const selectedRows = ref([]);

// 单选处理方法
const onSelectChange = (record) => {
  if (selectedRowKeys.value.includes(record.id)) {
    // 如果已选中，则取消选中
    selectedRowKeys.value = [];
    selectedRows.value = [];
  } else {
    // 选中新行
    selectedRowKeys.value = [record.id];
    selectedRows.value = [record];
  }
};


/**
 * 初始化计量表
 */
function initProtocol() {
  getBrands()
  loadData()
}

function loadData() {
  protocolList({
    brandId: queryParam.value.brandId,
    modelId: queryParam.value.modelId,
    protocolName: queryParam.value.protocolName,
    pageSize: -1
  }).then((res) => {
    protocols.value = res.records
  });
}

/**
 * 初始化品牌型号
 */
function getModels() {
  if (queryParam.value.brandId) {
    queryParam.value.modelId = undefined
  }
  modelList({pageSize: -1, brandId: queryParam.value.brandId}).then((res) => {
    models.value = res.records
  });
}

/**
 * 获取品牌数据
 */
function getBrands() {
  brandList({pageSize: -1}).then((res) => {
    brands.value = res.records
  })
}
/**
 * 查询
 */
function searchQuery() {
  loadData();
}

/**
 * 重置
 */
function searchReset() {
  formRef.value.resetFields();
  //刷新数据
  loadData();
}

function submitForm() {
  emit("ok", selectedRows.value)
}

defineExpose({
  initProtocol,
  submitForm
});
</script>

<style scoped lang="less">
.search-container {
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
  border-radius: 4px;
}

/* 统一所有表单列的高度 */
.form-col {
  display: flex;
  align-items: center;
  height: 64px; /* 统一高度 */
}

/* 统一表单项样式 */
.form-item {
  width: 100%;
  margin-bottom: 0 !important;
}

/* 确保输入框宽度 */
:deep(.form-item .ant-input),
:deep(.form-item .ant-input-affix-wrapper) {
  width: 100% !important;
}

/* 按钮列对齐 */
.button-col {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px; /* 与其他列高度一致 */
}

/* 移除可能的内边距 */
:deep(.ant-form-item) {
  margin-bottom: 0;
}

/* 移除可能的外边距 */
:deep(.ant-row) {
  margin: 0 !important;
}

/* 表格与搜索框的间距 */
.a-table {
  margin-top: 16px;
}
</style>
