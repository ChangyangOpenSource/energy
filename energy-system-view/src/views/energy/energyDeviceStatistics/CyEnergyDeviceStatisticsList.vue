<template>
  <div class="p-2" style="display: flex; height: 100vh;">

    <div  style="width: 18%; margin-right: 10px; background-color: white; padding: 20px">
<!--      设备类型筛选框-->
      <a-select style="width: 100%; margin-bottom: 10px" v-model:value="queryParam.energyDeviceType" placeholder="请选择设备类型" @change="typeChange">
        <a-select-option :value="item.value" v-for="(item,index) in allTypeList" :key="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
<!--      设备名称筛选框-->
      <a-input-search v-model:value="queryParam.equipmentName" placeholder="请输入设备名称" @search="equipmentNameChange"/>

<!--      展示设备的盒子-->
      <div class="treeBox" style="height: 300px; margin-top: 10px;">
        <a-checkbox-group v-model:value="queryParam.equipmentId">
          <a-checkbox v-for="item in equipmentList" :key="item.id" :value="item.id">
            {{ item.energyConsumeEquipmentName }}
          </a-checkbox>
        </a-checkbox-group>
      </div>

      <div style="width: 100%; margin-top: 20px; margin-bottom: 20px">
        <div>
          能耗/产量参数
        </div>
        <a-select mode="multiple" :max-tag-text-length="3" style="width: 100%" v-model:value="queryParam.energyParams" :placeholder="$t('carbon.message.Please_select')">
          <a-select-option :value="item.value" v-for="(item,index) in energyParamsList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>

      <div class="isCountBox">
        <div class="isCountBoxTitle">
          是否统计折标煤
        </div>
        <a-switch v-model:checked="isCountCoal" />
      </div>

<!--      <div class="isCountBox">-->
<!--        <div class="isCountBoxTitle">-->
<!--          是否统计成本-->
<!--        </div>-->
<!--        <a-switch v-model:checked="isCountCost" />-->
<!--      </div>-->

      <div class="isCountBox">
        <div class="isCountBoxTitle">
          是否统计碳排
        </div>
        <a-switch v-model:checked="isCountCarbonEmission" />
      </div>

      <div style="width: 100%; margin-top: 20px">
        <div>
          统计时间维度
        </div>
        <a-select style="width: 100%" v-model:value="queryParam.countTimeType" :placeholder="$t('carbon.message.Please_select')" @change="clearSelectDate">
          <a-select-option :value="item.value" v-for="(item,index) in countTimeTypeList" :key="index">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </div>

      <div style="width: 100%; margin-top: 20px">
        <div>
          选择时间
        </div>
        <!--        <a-range-picker v-model:value="queryParam.selectDate" @change="selectDateChange" />-->
        <a-range-picker style="width: 100%" v-if="queryParam.countTimeType == 1"  v-model:value="queryParam.selectDate" value-format="YYYY" picker="year" @change="selectDateChange"   />
        <a-range-picker style="width: 100%" v-if="queryParam.countTimeType == 2"  v-model:value="queryParam.selectDate" value-format="YYYY-MM" picker="month"  @change="selectDateChange" />
        <a-range-picker style="width: 100%" v-if="queryParam.countTimeType == 3"  v-model:value="queryParam.selectDate" value-format="YYYY-MM-DD" @change="selectDateChange" />
        <a-range-picker style="width: 100%" v-if="queryParam.countTimeType == 4"  v-model:value="queryParam.selectDate" :show-time="{ format: 'HH' }" value-format="YYYY-MM-DD HH" format="YYYY-MM-DD HH" @change="selectDateChange"  />
      </div>

      <div style="width: 100%; margin-top: 20px">
        <a-button style="width: 100%;" type="primary" @click="searchQuery">{{ $t('carbon.message.Search') }}</a-button>
      </div>

    </div>

    <div  style="width: 82%;">
      <div style="background-color: white; display: flex; justify-content: space-between; padding: 5px">
        <h2>
          <strong>查询结果</strong>
        </h2>
      </div>
      <!--引用表格-->
      <BasicTable @register="registerTable" :rowSelection="rowSelection">
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
        </template>
        <template v-slot:bodyCell="{ column, record, index, text }">
        </template>
      </BasicTable>
    </div>

    <!-- 表单区域 -->
    <CyEnergyDeviceStatisticsModal ref="registerModal" @success="handleSuccess"></CyEnergyDeviceStatisticsModal>
  </div>
</template>

<script lang="ts" name="CyEnergyStatistics-cyEnergyStatistics" setup>
import {ref, reactive, onMounted,watch} from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, superQuerySchema } from './CyEnergyDeviceStatistics.data';
import {
  list,
  deleteOne,
  batchDelete,
  getImportUrl,
  getExportUrl,
  countTimeTypeDict, energyTypeDict, getAllType, getAllEquipmentByType
} from './CyEnergyDeviceStatistics.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import CyEnergyDeviceStatisticsModal from './components/CyEnergyDeviceStatisticsModal.vue'
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
   import {useModal} from '/@/components/Modal';
  import { getDateByPicker } from '/@/utils';
import {getStationTree} from "@/views/energy/station/CyStation.api";
import {DeleteOutlined, DownloadOutlined, EditOutlined} from "@ant-design/icons-vue";
import {dataGetTypeDict} from "@/views/module_emission/dataManage/CyDataManage.api";
import dayjs from "dayjs";
import JInput from "../../../components/Form/src/jeecg/components/JInput.vue";

  const fieldPickers = reactive({
  });

  const formRef = ref();
  const queryParam = reactive<any>({
    countTimeType: "1"
  });
  const toggleSearchStatus = ref<boolean>(false);
  const registerModal = ref();
  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const stationId = ref([]) //选中的场站id
  const stationData = ref([]) //场站树形结构
  const expandedKeys = ref([]); //
  const autoExpandParent = ref(true);

  const isCountCoal = ref<boolean>(false);
  const isCountCost = ref<boolean>(false);
  const isCountCarbonEmission = ref<boolean>(false);
  const countTimeTypeList = ref([]);
  const energyParamsList = ref([]);
  const allTypeList = ref([]);
  const equipmentList = ref([]);




  // 原始基础列（不随开关变化的列）
  const baseColumns = [
    {
      title: '日期',
      dataIndex: 'dataTime',
      width: 150,
    },
    {
      title: '设备编号',
      dataIndex: 'equipmentCode',
      width: 150,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      width: 150,
    }
  ];

  // 动态列（根据开关决定是否显示）
  const dynamicColumns = ref([]);

  // 当前完整列配置（响应式）
  const tableColumns = ref([...baseColumns]);
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: "",
      api: list,
      columns: tableColumns,
      canResize:true,
      useSearchForm: false,
      actionColumn: false,
      immediate: false,
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
      name: "用能统计",
      url: getExportUrl,
      params: queryParam,
    },
	  importConfig: {
	    url: getImportUrl,
	    success: handleSuccess
	  },
  });
  const [registerTable, { reload, collapseAll, updateTableDataRecord, findTableDataRecord, getDataSource }] = tableContext;
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
  // 监听开关变化，动态更新列
  watch([queryParam,isCountCoal, isCountCost, isCountCarbonEmission], () => {
    const cols = [];

    if(queryParam.energyParams && queryParam.energyParams.length > 0){
      // 循环所有选中的能耗/产量参数
      queryParam.energyParams.forEach(item => {
        // 找到对应的能耗/产量参数
        const tableItem = energyParamsList.value.find(item2 => item2.id == item)
        // 将table中放置对应的参数列
        cols.push({
          title: tableItem.name,
          width: 120,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data[tableItem.name] ? `${data[tableItem.name]} ` : '-';
          },
        });
      });
    }

    if (isCountCoal.value) {
      cols.push({
        title: '折标煤',
        dataIndex: 'coal',
        width: 120,
      });
    }

    if (isCountCost.value) {
      cols.push({
        title: '成本',
        dataIndex: 'cost',
        width: 120,
      });
    }

    if (isCountCarbonEmission.value) {
      cols.push({
        title: '碳排',
        dataIndex: 'carbonEmission',
        width: 120,
      });
    }

    dynamicColumns.value = cols;
    tableColumns.value = [...baseColumns, ...cols];
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
   * 用能设备类型修改
   */
  function typeChange(e) {
    getAllEquipmentByType({equipmentType: e}).then(res => {
      equipmentList.value = res;
    })
    const record = allTypeList.value.find(item => item.id == e)
    console.log("record",record)
    energyParamsList.value = record.energyConsumeEquipmentTypeParams
  }

  /**
   * 用能设备名称修改
   */
  function equipmentNameChange() {
    getAllEquipmentByType({equipmentType: queryParam.energyDeviceType,equipmentName: queryParam.equipmentName}).then(res => {
      equipmentList.value = res;
    })
    const record = allTypeList.value.find(item => item.id == e)
    console.log("record",record)
    energyParamsList.value = record.energyConsumeEquipmentTypeParams
  }

  /**
   * 重置查询时间
   */
  function clearSelectDate() {
    queryParam.selectDate = []
    queryParam.startTime = null
    queryParam.endTime = null
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
        auth: 'CyEnergyStatistics:cy_energy_statistics:edit'
      },
    ];
  }

/**
 * 时间改变事件
 */
function selectDateChange() {
  if (queryParam.selectDate && queryParam.selectDate.length == 2){
    queryParam.startTime = queryParam.selectDate[0]
    queryParam.endTime = queryParam.selectDate[1]
  }else{
    queryParam.startTime = undefined;
    queryParam.endTime = undefined;
  }
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
        auth: 'CyEnergyStatistics:cy_energy_statistics:delete'
      }
    ]
  }

  /**
   * 查询
   */
  function searchQuery() {
    if(queryParam.energyDeviceType == null || queryParam.energyDeviceType == ''){
      createMessage.warning('请选择设备类型')
      return
    }
    if(queryParam.equipmentId == null || queryParam.equipmentId == ''){
      createMessage.warning('请选择设备')
      return
    }
    if(queryParam.energyParams == null || queryParam.energyParams.length < 0){
      createMessage.warning('请选择能耗/产量参数')
      return
    }
    if(queryParam.startTime == null || queryParam.startTime == '' || queryParam.endTime == null || queryParam.endTime == ''){
      createMessage.warning('请选择时间')
      return
    }
    reload();
  }


/**
 * 初始化场站树形结构
 */
function initStationTree() {
  getStationTree().then((res) => {
    stationData.value = res
  })
}

/**
 * 获取选中场站数据信息
 */
const getStation = (selectedKeys, {node}) => {
  console.log('复选节点:', selectedKeys.checked);
    stationId.value = selectedKeys.checked;

    queryParam.parentId = ''
    for(let i=0; i<stationId.value.length;i++){
      if(i != stationId.value.length-1){
        queryParam.parentId = queryParam.parentId + stationId.value[i] + ','
      }else{
        queryParam.parentId = queryParam.parentId + stationId.value[i]
      }
    }
    searchQuery();
};

/**
 * 展开方法
 * @param keys
 */
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
  console.log("expandedKeys", expandedKeys)
};

// 节点点击事件
const onNodeClick = (record) => {
  // console.log('节点数据:', record);
  // queryParam.parentId = record.id;
  // 将选择的节点的能源类型赋值给查询参数
  if(record.energyType){
    queryParam.energyType = record.energyType.split(",")
  }else{
    queryParam.energyType = []
  }
  searchQuery();
};


onMounted(async () => {
  // 统计时间维度字典
  countTimeTypeDict().then(res => {
    countTimeTypeList.value = res
  })
  // 能源类型字典
  energyTypeDict().then(res => {
    energyTypeList.value = res
  })
  // 查询所有用能设备类型
  getAllType().then(res => {
    console.log("所有用能设备类型", res)
    allTypeList.value = res
  })
})
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

  .treeBox {
    margin-bottom: 10px;
    height: calc(100vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;


    :deep(.ant-tree) {
      height: 100%;
    }
  }

  .isCountBox{
    display: flex;
    margin-bottom: 8px;
  }

  .isCountBoxTitle{
    width: 110px;
  }

</style>
