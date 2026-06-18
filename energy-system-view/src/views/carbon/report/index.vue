<!-- src/views/carbon/report/index.vue -->
<template>
  <div class="p-2">
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)"/>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="carbon-report" setup>
import { ref, reactive, onMounted } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema } from './CarbonReport.data';
import { list, deleteOne, getImportUrl, getExportUrl, loadCategoryTreeRoot, getOrgAllSubjectOfCostCalc } from './CarbonReport.api';
import { getDateByPicker } from '/@/utils';
import * as echarts from 'echarts';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const fieldPickers = reactive({});

const queryParam = reactive<any>({});

//注册table数据
const { tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    title: '碳排报告',
    api: list,
    columns,
    canResize: true,
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 120,
      fixed: 'right',
    }
  },
  exportConfig: {
    name: "碳排报告",
    url: getExportUrl,
    params: queryParam,
  },
  importConfig: {
    url: getImportUrl,
    success: handleSuccess
  },
});

const [registerTable, { reload }] = tableContext;

/**
 * 新增事件
 */
function handleAdd() {
  // TODO: 实现新增逻辑
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
  // TODO: 实现编辑逻辑
}

/**
 * 详情
 */
function handleDetail(record: Recordable) {
  // TODO: 实现详情逻辑
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
function getTableAction(record: { downloadUrl: unknown; }) {
  return [
    {
      label: t('carbon.message.Download'),
      onClick: () => exportXlsTemplate(record.downloadUrl), // 修改为箭头函数
    },
    {
      label: '删除',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
        placement: 'topLeft',
      },
    }
  ];
}

function exportXlsTemplate(value) {
  let url = window._CONFIG['staticDomainURL'] + "/" + value
  console.log('onDownloadReport', url)
  window.open(url, '_blank')
}



// 页面加载时初始化图表
onMounted(() => {
});
</script>

<style lang="less" scoped>
.jeecg-basic-table-form-container {
  padding: 0;
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
  .query-group-cust{
    min-width: 100px !important;
  }
  .query-group-split-cust{
    width: 30px;
    display: inline-block;
    text-align: center
  }
  .ant-form-item:not(.ant-form-item-with-help){
    margin-bottom: 16px;
    height: 32px;
  }
  :deep(.ant-picker),:deep(.ant-input-number){
    width: 100%;
  }
}
</style>
