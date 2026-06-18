<!-- src/views/carbon/activitie/index.vue -->
<template>
  <div class="p-2">
    <!-- 查询区域 -->
    <div class="jeecg-basic-table-form-container">
      <a-form @keyup.enter.native="searchQuery" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">
          <a-col :lg="6">
            <a-form-item :label="t('carbon.message.facilities_activities')" name="name">
              <j-input v-model:value="queryParam.name" :placeholder="t('carbon.message.Please_enter')"/>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">{{ t('carbon.message.Search') }}</a-button>
              <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset" style="margin-left: 8px">{{ t('carbon.message.Reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 引用表格 -->
    <BasicTable @register="registerTable">
      <!-- 插槽:table标题 -->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> {{ t('carbon.message.add_facilities_activities') }}</a-button>
      </template>
      <!-- 操作栏 -->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>

    <!-- 表单区域 -->
    <CyOrgActivitieModal ref="registerModal" @success="handleSuccess"></CyOrgActivitieModal>
  </div>
</template>

<script lang="ts" name="activitie" setup>
import { ref, reactive } from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import CyOrgActivitieModal from './modules/CyOrgActivitieModal.vue';
import { list, deleteOne } from './activitie.api';
import { useI18n } from '/@/hooks/web/useI18n';
import JInput from "@/components/Form/src/jeecg/components/JInput.vue";

const queryParam = reactive<any>({});
const registerModal = ref();

// 注册table数据
const { tableContext } = useListPage({
  tableProps: {
    title: '活动设施',
    api: list,
    columns: [
      {
        title: '活动设施名称',
        align: "center",
        dataIndex: 'name'
      },
    ],
    actionColumn: {
      width: 120,
      fixed: 'right',
    },
    beforeFetch: (params) => {
      return Object.assign(params, queryParam);
    },
  },
});
const { t } = useI18n();

const [registerTable, { reload }] = tableContext;

const labelCol = { xs: 24, sm: 4, xl: 6, xxl: 4 };
const wrapperCol = { xs: 24, sm: 20 };

/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.add();
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
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
  reload();
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
    },
    {
      label: '删除',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
      },
    }
  ];
}

/**
 * 查询
 */
function searchQuery() {
  reload();
}

/**
 * 重置
 */
function searchReset() {
  Object.keys(queryParam).forEach(key => {
    queryParam[key] = undefined;
  });
  reload();
}
</script>

<style lang="less" scoped>
.jeecg-basic-table-form-container {
  padding: 0;
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
