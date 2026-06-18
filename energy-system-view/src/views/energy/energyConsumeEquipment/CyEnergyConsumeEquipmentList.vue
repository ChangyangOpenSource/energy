<template>
  <div class="p-2">
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
          <a-col :lg="6">
            <a-form-item name="energyConsumeEquipmentName">
              <template #label><span title="设备名称">设备名称</span></template>
              <JInput v-model:value="queryParam.energyConsumeEquipmentName"
                      placeholder="请输入设备名称"/>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="energyConsumeEquipmentCode">
              <template #label><span title="设备编码">设备编码</span></template>
              <JInput v-model:value="queryParam.energyConsumeEquipmentCode"
                      placeholder="请输入设备编码"/>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="energyConsumeEquipmentTypeId">
              <template #label><span title="设备类型">设备类型</span></template>
              <a-select
                v-model:value="queryParam.energyConsumeEquipmentTypeId"
                :options="energyConsumeEquipmentTypes"
                :field-names="{ label: 'name', value: 'id'}"
                placeholder="请选择设备类型"
                allow-clear>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="status">
              <template #label><span title="状态">状态</span></template>
              <j-dict-select-tag v-model:value="queryParam.status" dictCode="equipment_status"
                                 placeholder="请选择状态" allow-clear/>
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
          <div class="text-2xl font-bold text-gray-900">{{ count.count }}</div>
        </div>

        <!-- 状态详情卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 md:col-span-3">
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center">
              <div class="text-sm text-gray-600">在线</div>
              <div class="text-xl font-bold text-green-600">{{ count.onlineCount }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-600">离线</div>
              <div class="text-xl font-bold text-gray-600">{{ count.offlineCount }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-600">异常</div>
              <div class="text-xl font-bold text-red-600">{{ count.errorCount }}</div>
            </div>
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
        <a-dropdown>
          <a> 状态更改 </a>
          <template #overlay>
            <a-menu @click="({ key }) => handleStatusClick(record, key)">
              <a-menu-item key="0">
                <CheckCircleOutlined
                  :style="{ color: record.status === 'online' ? '#52c41a' : '' }"/>
                在线
              </a-menu-item>
              <a-menu-item key="1">
                <CloseCircleOutlined
                  :style="{ color: record.status === 'offline' ? '#8c8c8c' : '' }"/>
                离线
              </a-menu-item>
              <a-menu-item key="2">
                <ExclamationCircleOutlined
                  :style="{ color: record.status === 'abnormal' ? '#f5222d' : '' }"/>
                异常
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-divider type="vertical"/>
        <a @click="handleEdit(record)">编辑</a>

        <a-divider type="vertical"/>
        <a-dropdown>
          <a> 更多 </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <Popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)"
                            placement="left">
                  <a>删除</a>
                </Popconfirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <!--        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>-->
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <CyEnergyConsumeEquipmentModal ref="registerModal"
                                   @success="handleSuccess"></CyEnergyConsumeEquipmentModal>
  </div>
</template>

<script lang="ts" name="cyEnergyConsumeEquipment-cyEnergyConsumeEquipment" setup>
import {ref, reactive} from 'vue';
import {BasicTable, TableAction} from '/@/components/Table';
import {useListPage} from '/@/hooks/system/useListPage';
import {columns, superQuerySchema} from './CyEnergyConsumeEquipment.data';
import {
  list,
  deleteOne,
  consumeEquipmentCount,
  updateStatus
} from './CyEnergyConsumeEquipment.api';
import CyEnergyConsumeEquipmentModal from './components/CyEnergyConsumeEquipmentModal.vue'
import {useUserStore} from '/@/store/modules/user';
import {useMessage} from '/@/hooks/web/useMessage';
import JInput from "/@/components/Form/src/jeecg/components/JInput.vue";
import {getDateByPicker} from '/@/utils';
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import {
  energyConsumeEquipmentTypeList
} from "@/views/energy/energyConsumeEquipmentType/CyEnergyConsumeEquipmentType.api";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined
} from "@ant-design/icons-vue";
import {Popconfirm} from "ant-design-vue";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const fieldPickers = reactive({});
const count = ref({
  count: 0,
  onlineCount: 0,
  offlineCount: 0,
  errorCount: 0
});
const formRef = ref();
const queryParam = reactive<any>({});
const energyConsumeEquipmentTypes = ref([]);
const registerModal = ref();
const userStore = useUserStore();
const {createMessage} = useMessage();
//注册table数据
const {prefixCls, tableContext, onExportXls, onImportXls} = useListPage({
  tableProps: {
    title: '用能设备',
    api: list,
    columns,
    canResize: true,
    useSearchForm: false,
    immediate: false, // 设置为 false 不自动加载
    actionColumn: {
      width: 200,
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
});
const [registerTable, {reload, collapseAll, updateTableDataRecord, getDataSource}, {
  rowSelection,
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

/**
 * 新增事件
 */
function handleStatusClick(record, key) {
  updateStatus({id: record.id, status: key}).then((res) => {
    handleSuccess()
  })
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
function handleEdit(record) {
  registerModal.value.disableSubmit = false;
  registerModal.value.edit(record);
}

/**
 * 详情
 */
function handleDetail(record) {
  registerModal.value.disableSubmit = true;
  registerModal.value.edit(record);
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
 * 获取设备计数
 */
function getConsumeEquipmentCount() {
  consumeEquipmentCount(queryParam).then((res) => {
    count.value = res
  })
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

/**
 * 获取用能设备类型
 */
function getEnergyConsumeEquipmentTypes() {
  energyConsumeEquipmentTypeList({pageSize: -1}).then((res) => {
    energyConsumeEquipmentTypes.value = res.records
  })
}

function changeStation() {
  getEnergyConsumeEquipmentTypes()
  searchQuery()
}

/**
 * 查询
 */
function searchQuery() {
  getConsumeEquipmentCount()
  reload();
}

/**
 * 重置
 */
function searchReset() {
  let selectStationId = queryParam.stationId
  formRef.value.resetFields();
  queryParam.stationId = selectStationId
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
