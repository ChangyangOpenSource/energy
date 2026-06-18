<template>
  <div class="p-2" v-show="!equipmentDataDetectionFlg">
    <!--查询区域-->
    <div class="jeecg-basic-table-form-container">
      <a-form ref="formRef" @keyup.enter.native="searchQuery" :model="queryParam"
              :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">
          <a-col :lg="4">
            <a-form-item name="stationId">
              <template #label><span title="场站">场站</span></template>
              <select-station-no-clear v-model:value="queryParam.stationId" @ok="changeStation"></select-station-no-clear>
            </a-form-item>
          </a-col>
          <a-col :lg="4">
            <a-form-item name="status">
              <template #label><span title="状态">状态</span></template>
              <j-dict-select-tag v-model:value="queryParam.status" dictCode="equipment_status"
                                 placeholder="请选择状态" allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="name">
              <template #label><span title="设备名称">设备名称</span></template>
              <JInput v-model:value="queryParam.name" placeholder="请输入设备名称"/>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="equipmentCode">
              <template #label><span title="设备编码">设备编码</span></template>
              <JInput v-model:value="queryParam.equipmentCode" placeholder="请输入设备编码"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item name="equipmentTypeId">
              <template #label><span title="计量表类型">设备类型</span></template>
                <a-select
                  v-model:value="queryParam.equipmentTypeId"
                  :options="equipmentTypes"
                  :field-names="{ label: 'title', value: 'key'}"
                  placeholder="请选择设备类型"
                  allow-clear>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-col :lg="6">
                <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">查询</a-button>
                <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset"
                          style="margin-left: 8px">重置</a-button>
              </a-col>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="jeecg-basic-table-form-container">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
        <!-- 总设备卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="text-sm text-gray-600 mb-1">总设备</div>
          <div class="text-2xl font-bold text-gray-900">{{count.count}}</div>
        </div>

        <!-- 状态详情卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 md:col-span-3">
          <div class="grid grid-cols-2 gap-2">
            <div class="text-center">
              <div class="text-sm text-gray-600">在线</div>
              <div class="text-xl font-bold text-green-600">{{count.onlineCount}}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-600">离线</div>
              <div class="text-xl font-bold text-gray-600">{{count.offlineCount}}</div>
            </div>
<!--            <div class="text-center">-->
<!--              <div class="text-sm text-gray-600">异常</div>-->
<!--              <div class="text-xl font-bold text-red-600">{{count.errorCount}}</div>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>

    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增
        </a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownActions(record)"/>
      </template>
      <template v-slot:bodyCell="{ column, record, index, text }">
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <CyEquipmentModal ref="registerModal" @success="handleSuccess"></CyEquipmentModal>
  </div>
  <div v-show="equipmentDataDetectionFlg" >
    <equipment-data-detection-modules ref="EquipmentDataDetectionRef" @goBack="dataDetectionBack"></equipment-data-detection-modules>
  </div>
</template>

<script lang="ts" name="cyEquipment-cyEquipment" setup>
import {ref, reactive, nextTick} from 'vue';
import {BasicTable, TableAction} from '/@/components/Table';
import {useListPage} from '/@/hooks/system/useListPage';
import {columns} from './CyEquipment.data';
import CyEquipmentModal from './components/CyEquipmentModal.vue'
import {useUserStore} from '/@/store/modules/user';
import {useMessage} from '/@/hooks/web/useMessage';
import JInput from "/@/components/Form/src/jeecg/components/JInput.vue";
import {getDateByPicker} from '/@/utils';
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import {loadTreeRootNoTenant} from "@/views/system/category/category.api";
import EquipmentDataDetectionModules from "@/views/energy/meter/modules/EquipmentDataDetectionModules.vue";
import {list, deleteOne, getImportUrl, getExportUrl, equipmentCount, queryById} from "@/views/energy/meter/CyEquipment.api";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const fieldPickers = reactive({});

const formRef = ref();
const count = ref({
  count: 0,
  onlineCount: 0,
  offlineCount: 0,
  errorCount: 0
});
const queryParam = reactive<any>({
  type: 2 // 1计量表 2传感器
});
const registerModal = ref();
const EquipmentDataDetectionRef = ref();//数据实时检测
const equipmentDataDetectionFlg = ref(false);//数据实时检测
const userStore = useUserStore();
const {createMessage} = useMessage();
//注册table数据
const {prefixCls, tableContext, onExportXls, onImportXls} = useListPage({
  tableProps: {
    title: '设备',
    api: list,
    columns,
    canResize: true,
    immediate: false, // 设置为 false 不自动加载
    useSearchForm: false,
    actionColumn: {
      width: 250,
      fixed: 'right',
    },
    beforeFetch: async (params) => {
      for (let key in fieldPickers) {
        if (queryParam[key] && fieldPickers[key]) {
          queryParam[key] = getDateByPicker(queryParam[key], fieldPickers[key]);
        }
      }
      return Object.assign(params, queryParam);
    },
  },
  exportConfig: {
    name: "设备",
    url: getExportUrl,
    params: queryParam,
  },
  importConfig: {
    url: getImportUrl,
    success: handleSuccess
  },
});
const [registerTable, {reload, collapseAll, updateTableDataRecord, getDataSource}, {
  selectedRowKeys
}] = tableContext;
const labelCol = reactive({
  xs: 24,
  sm: 4,
  xl: 6,
  xxl: 4
});
const wrapperCol = reactive({
  xs: 24,
  sm: 20,
});

const equipmentTypes = ref([]);//设备类型

/**
 * 获取设备计数
 */
function getEquipmentCount() {
  equipmentCount(queryParam).then( (res) => {
    count.value = res
  })
}

/**
 * 分类字典
 */
function getEquipmentTypes() {
  loadTreeRootNoTenant({pcode: "C03A02", async: false}).then((res) => {
    equipmentTypes.value = res
  });
}

/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.disableSubmit = false;
  registerModal.value.add(queryParam.stationId);
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
  queryById({id: record.id}).then((res) => {
    registerModal.value.disableSubmit = false;
    registerModal.value.edit(res);
  })
}

/**
 * 详情
 */
function handleDetail(record: Recordable) {
  queryById({id: record.id}).then((res) => {
    registerModal.value.disableSubmit = true;
    registerModal.value.edit(res);
  })
}

/**
 * 实时检测返回
 */
function dataDetectionBack(){
  equipmentDataDetectionFlg.value = false;
}


/**
 * 实时检测
 */
function deviceDetection(record: Recordable) {
  equipmentDataDetectionFlg.value = true;
  nextTick(()=>{
    EquipmentDataDetectionRef.value.init(record, true)
  })

}

/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteOne({id: record.id}, handleSuccess);
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
      label: '实时监测',
      onClick: deviceDetection.bind(null, record),
    }
  ];
}

/**
 * 下拉操作栏
 * @param record
 */
function getDropDownActions(record) {
  return [
    {
      label: '详情',
      onClick: handleDetail.bind(null, record),
    },
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
  ]
}

function changeStation() {
  getEquipmentTypes()
  searchQuery()
}

/**
 * 查询
 */
function searchQuery() {
  getEquipmentCount()
  reload();
}

/**
 * 重置
 */
function searchReset() {
  let selectStationId = queryParam.stationId
  formRef.value.resetFields();
  queryParam.stationId = selectStationId
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

  .query-group-cust {
    min-width: 100px !important;
  }

  .query-group-split-cust {
    width: 30px;
    display: inline-block;
    text-align: center
  }

  .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 16px;
    height: 32px;
  }

  :deep(.ant-picker), :deep(.ant-input-number) {
    width: 100%;
  }
}
</style>
