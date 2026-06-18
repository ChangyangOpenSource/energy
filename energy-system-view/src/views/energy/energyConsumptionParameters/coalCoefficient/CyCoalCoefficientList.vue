<template>
  <div class="p-2">
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"  v-if = "props.stationId"> 新增</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
      </template>
      <template v-slot:bodyCell="{ column, record, index, text }">
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <CyCoalCoefficientModal ref="registerModal" @success="handleSuccess"></CyCoalCoefficientModal>
  </div>
</template>

<script lang="ts" name="cyCoalCoefficient-cyCoalCoefficient" setup>
import {defineProps} from "vue/dist/vue";

  const props = defineProps({
    stationId: { type: String }
  });

watch(() => props.stationId, () => {
  queryParam.stationId = props.stationId;
  reload();
});
import {ref, reactive, watch} from 'vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { useListPage } from '/src/hooks/system/useListPage';
  import { columns, superQuerySchema } from './CyCoalCoefficient.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './CyCoalCoefficient.api';
  import { downloadFile } from '/src/utils/common/renderUtils';
  import CyCoalCoefficientModal from './components/CyCoalCoefficientModal.vue'
  import { useUserStore } from '/src/store/modules/user';
  import { useMessage } from '/src/hooks/web/useMessage';
   import {useModal} from '/src/components/Modal';
  import { getDateByPicker } from '/src/utils';
import JModal from "@/components/Modal/src/JModal/JModal.vue";

  const fieldPickers = reactive({
  });

  const formRef = ref();
  const queryParam = reactive<any>({});
  const toggleSearchStatus = ref<boolean>(false);
  const registerModal = ref();
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      checkbox: false,
      title: '折标煤系数表',
      api: list,
      columns,
      canResize:true,
      useSearchForm: false,
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
      beforeFetch: async (params) => {
        for (let key in fieldPickers) {
          if (queryParam[key] && fieldPickers[key]) {
            queryParam[key] = getDateByPicker(queryParam[key], fieldPickers[key]);
          }
        }
        queryParam.stationId = props.stationId;
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: "折标煤系数表",
      url: getExportUrl,
      params: queryParam,
    },
	  importConfig: {
	    url: getImportUrl,
	    success: handleSuccess
	  },
  });
  const [registerTable, { reload, collapseAll, updateTableDataRecord, findTableDataRecord, getDataSource }, { selectedRowKeys }] = tableContext;
  const labelCol = reactive({
    xs:24,
    sm:4,
    xl:6,
    xxl:4
  });
  const wrapperCol = reactive({
    xs: 24,
    sm: 20,
  });
  /**
   * 高级查询事件
   */
  function handleSuperQuery(params) {
    Object.keys(params).map((k) => {
      queryParam[k] = params[k];
    });
    searchQuery();
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    registerModal.value.disableSubmit = false;
    registerModal.value.add(props.stationId);
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    registerModal.value.disableSubmit = false;
    registerModal.value.edit(record);
  }

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    registerModal.value.disableSubmit = true;
    registerModal.value.edit(record);
  }



  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
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
          placement: 'topLeft',
        },
      }
    ];
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
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
    formRef.value.resetFields();
    selectedRowKeys.value = [];
    //刷新数据
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
