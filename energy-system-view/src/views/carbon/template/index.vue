<!-- src/views/carbon/template/index.vue -->
<template>
  <div class="p-2">
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <templateDrawer ref="registerModal" @success="handleSuccess"></templateDrawer>

    <section class="m_popupBox" v-if="isShowDetailPopup">
      <carbonReportingDetail
          isTemplate="true"
          ref="tpyzDetailRef"
          @back="back"
          :newForm="tpyzObject">
      </carbonReportingDetail>
    </section>
  </div>
</template>

<script lang="ts" name="carbon-template" setup>
import { ref, reactive, onMounted } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema } from './Template.data';
import { list, deleteOne, loadCategoryTreeRoot } from './Template.api';
import templateDrawer from "./modules/templateDrawer.vue";
import carbonReportingDetail from "@/components/common/carbonReportingDetail.vue";

const isShowDetailPopup = ref<boolean>(false);
const tpyzDetailRef = ref();
const registerModal = ref();
const tpyzObject = reactive<any>({
  year: "",
  targetId: undefined,
  checkId: undefined,
  status: 0
});

//注册table数据
const { tableContext } = useListPage({
  tableProps: {
    title: '碳排模板',
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
    },
  },
});

const [registerTable, { reload }] = tableContext;

/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.title = '新增';
  registerModal.value.add();
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
  registerModal.value.title = '编辑';
  registerModal.value.edit(record);
}

/**
 * 详情
 */
function handleDetail(record: Recordable) {
  Object.assign(tpyzObject, record);
  tpyzObject.checkId = record.id;
  tpyzObject.status = 0;
  isShowDetailPopup.value = true;
}

function back() {
  isShowDetailPopup.value = false;
  reload();
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
  ];
}

/**
 * 下拉操作栏
 */
function getDropDownAction(record) {
  return [
    {
      label: '详情',
      onClick: handleDetail.bind(null, record),
    }, {
      label: '删除',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
        placement: 'topLeft',
      },
    }
  ]
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

.m_popupBox {
  // 根据实际需要添加样式
}
</style>
