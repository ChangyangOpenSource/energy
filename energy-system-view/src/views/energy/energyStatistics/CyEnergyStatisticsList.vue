<template>
  <div class="p-2" style="display: flex; height: 100vh;">

    <div  style="width: 16%; margin-right: 10px; background-color: white; padding: 20px">

      <div class="treeBox" style="height: 400px" >
        <a-tree
          style="height: calc(100vh - 205px)"
          checkable
          checkStrictly
          :tree-data="stationData"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          v-model:checkedKeys="stationId"
          :fieldNames="{
                  children: 'groups',
                  title: 'name',
                  key: 'id',
                  type: 'type'
                }"
          @expand="onExpand"
          @check="getStation"
        >
          <template #title="{ name, type, dataRef }">
            <div class="node-view">
              <span class="node-name">
                <span v-if="type == 1 || type == 2"
                      style="vertical-align: middle; display: inline-block;">
                  <svg
                    class="svg-company"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="256"
                    height="256"
                  >
                    <path
                      d="M234.9 226.9c0-25.9 25.1-46.9 56-46.9h226.9c30.5 0 55.3 21.1 55.3 46.9v580.9h40V340.2h132.5c25.9 0 46.9 21.1 46.9 46.9v413.5h40V387.2c0-47.9-39-86.9-86.9-86.9H613v-73.4c0-23.7-10.2-45.8-28.7-62.3-17.9-15.9-41.5-24.7-66.6-24.7H290.9c-52.9 0-96 39-96 86.9v580.9h40V226.9zM145.8 841.2h734.9v40H145.8z"
                      fill="#333333"
                      p-id="10104">
                    </path>
                    <path
                      d="M286.9 354.1h124.7v40H286.9zM448.1 353.9h63.2v40h-63.2zM286.9 489.1h124.7v40H286.9zM448.1 488.9h63.2v40h-63.2zM286.9 616.6h124.7v40H286.9zM448.1 616.3h63.2v40h-63.2zM638.5 433.1h71v40h-71zM730.2 433h36v40h-36zM638.5 557.9h71v40h-71zM730.2 557.7h36v40h-36zM638.5 684.7h71v40h-71zM730.2 684.5h36v40h-36z"
                      fill="#333333">
                    </path>
                  </svg>
                </span>
                <span v-if="type == 3" style="vertical-align: middle; display: inline-block;">
                  <svg width="15" height="15" viewBox="0 0 48 48" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 44V4H12V20L28 12V20L44 12V44H4Z" fill="none" stroke="#333"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="12" y="28" width="8" height="8" fill="none" stroke="#333"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="28" y="28" width="8" height="8" fill="none" stroke="#333"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                {{ name }}
              </span>
            </div>
          </template>
        </a-tree>
      </div>

      <div style="width: 100%; margin-top: 20px; margin-bottom: 20px">
        <div>
          能源类型
        </div>
        <a-select mode="multiple" style="width: 100%" v-model:value="queryParam.energyType" :placeholder="$t('carbon.message.Please_select')">
          <a-select-option :value="item.value" v-for="(item,index) in energyTypeList" :key="index">
            {{ item.text }}
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

    <div  style="width: 83%;">

      <div style="background-color: white; display: flex; justify-content: space-between; padding: 5px">
        <h2>
          <strong>查询结果</strong>
        </h2>

        <div style="display: flex; gap: 24px">
          <div @click="handleDownload">
            <DownloadOutlined :style="{ fontSize: '24px', cursor: 'pointer'}"/>
          </div>
        </div>
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
    <CyEnergyStatisticsModal ref="registerModal" @success="handleSuccess"></CyEnergyStatisticsModal>
  </div>
</template>

<script lang="ts" name="CyEnergyStatistics-cyEnergyStatistics" setup>
import {ref, reactive, onMounted,watch} from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, superQuerySchema } from './CyEnergyStatistics.data';
import {
  list,
  deleteOne,
  batchDelete,
  getImportUrl,
  getExportUrl,
  countTimeTypeDict, energyTypeDict,exportGroupingEnergy
} from './CyEnergyStatistics.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import CyEnergyStatisticsModal from './components/CyEnergyStatisticsModal.vue'
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
   import {useModal} from '/@/components/Modal';
  import { getDateByPicker } from '/@/utils';
import {getStationTree} from "@/views/energy/station/CyStation.api";
import {DeleteOutlined, DownloadOutlined, EditOutlined} from "@ant-design/icons-vue";
import {dataGetTypeDict} from "@/views/module_emission/dataManage/CyDataManage.api";
import dayjs from "dayjs";
import {treeList} from "@/views/energy/group/CyGroup.api";

  const fieldPickers = reactive({
  });

  const formRef = ref();
  const queryParam = reactive<any>({
    countTimeType: "1",
    energyType: []
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
  const energyTypeList = ref([]);
  // 原始基础列（不随开关变化的列）
  const baseColumns = [
    {
      title: '日期',
      dataIndex: 'dataTime',
      width: 150,
    },
    {
      title: '用能项',
      dataIndex: 'parentName',
      width: 200,
    }
  ];

  // 动态列（根据开关决定是否显示）
  const dynamicColumns = ref([]);

  // 当前完整列配置（响应式）
  const tableColumns = ref([...baseColumns]);
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '',
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

    if(queryParam.energyType && queryParam.energyType.length > 0){
      // 电列
      if (queryParam.energyType.includes("2")) {
        cols.push({
          title: '电(kWh)',
          dataIndex: 'electricity',
          width: 120,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用电量'] ? `${data['用电量']} ` : '-';
          },
        });
      }

      if (queryParam.energyType.includes("2") && isCountCoal.value) {
        cols.push({
          title: '电折标煤(kgce)',
          dataIndex: 'electricityCoal',
          width: 120,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用电量折标煤'] ? `${data['用电量折标煤']} ` : '-';
          },
        });
      }

      if (queryParam.energyType.includes("2") && isCountCarbonEmission.value) {
        cols.push({
          title: '电碳排量(kgCO₂e)',
          dataIndex: 'electricityCarbonEmission',
          width: 150,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用电量碳排'] ? `${data['用电量碳排']} ` : '-';
          },
        });
      }


      // 水列
      if (queryParam.energyType.includes("1")) {
        cols.push({
          title: '水(t)',
          dataIndex: 'water',
          width: 120,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用水量'] ? `${data['用水量']} ` : '-';
          },
        });
      }

      if (queryParam.energyType.includes("1") && isCountCoal.value) {
        cols.push({
          title: '水折标煤(kgce)',
          dataIndex: 'waterCoal',
          width: 120,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用水量折标煤'] ? `${data['用水量折标煤']} ` : '-';
          },
        });
      }

      if (queryParam.energyType.includes("1") && isCountCarbonEmission.value) {
        cols.push({
          title: '水碳排量(kgCO₂e)',
          dataIndex: 'waterCarbonEmission',
          width: 150,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用水量碳排'] ? `${data['用水量碳排']} ` : '-';
          },
        });
      }

      // 气列
      if (queryParam.energyType.includes("3")) {
        cols.push({
          title: '气(m³)',
          dataIndex: 'gas',
          width: 120,
          customRender: ({ record }) => {
            const data = JSON.parse(record.dataValue || '{}');
            return data['用气量'] ? `${data['用气量']} ` : '-';
          },
        });
      }
    }

    if (queryParam.energyType.includes("3") && isCountCoal.value) {
      cols.push({
        title: '气折标煤(kgce)',
        dataIndex: 'gasCoal',
        width: 120,
        customRender: ({ record }) => {
          const data = JSON.parse(record.dataValue || '{}');
          return data['用气量折标煤'] ? `${data['用气量折标煤']} ` : '-';
        },
      });
    }

    if (queryParam.energyType.includes("3") && isCountCarbonEmission.value) {
      cols.push({
        title: '气碳排量(kgCO₂e)',
        dataIndex: 'gasCarbonEmission',
        width: 150,
        customRender: ({ record }) => {
          const data = JSON.parse(record.dataValue || '{}');
          return data['用气量碳排'] ? `${data['用气量碳排']} ` : '-';
        },
      });
    }



    if (isCountCoal.value) {
      cols.push({
        title: '综合折标煤(kgce)',
        dataIndex: 'coal',
        width: 150,
      });
    }

    if (isCountCost.value) {
      cols.push({
        title: '综合成本',
        dataIndex: 'cost',
        width: 120,
      });
    }

    if (isCountCarbonEmission.value) {
      cols.push({
        title: '综合碳排(kgCO₂e)',
        dataIndex: 'carbonEmission',
        width: 150,
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
   * 新增事件
   */
  function handleAdd() {
    registerModal.value.disableSubmit = false;
    registerModal.value.add();
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
   * 下载数据
   */
  function handleDownload(){
    let sendColumnList = [];
    tableColumns.value.forEach((column) => {
      sendColumnList.push(
        {
          title: column.title,
          dataIndex: column.dataIndex
        }
      )
    })
    queryParam.exportColumnList = sendColumnList
    exportGroupingEnergy('分组用能.xlsx', queryParam);
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
    if(queryParam.parentId == null || queryParam.parentId == ''){
      createMessage.warning('请选择公司')
      return
    }
    if(queryParam.energyType == null || queryParam.energyType.length == 0){
      createMessage.warning('请选择能源类型')
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
  console.log('节点数据:', record);
  queryParam.parentId = record.id;
  // 将选择的节点的能源类型赋值给查询参数
  if(record.energyType){
    queryParam.energyType = record.energyType.split(",")
  }else{
    queryParam.energyType = []
  }
  searchQuery();
};

/**
 * 递归展开所有节点
 */
function expandAllNodes(nodes: any[]) {
  if (!nodes || nodes.length === 0) return;

  const keys: string[] = [];

  function collectKeys(nodeList: any[]) {
    nodeList.forEach(node => {
      if (node.id) {
        keys.push(node.id);
      }
      if (node.groups && node.groups.length > 0) {
        collectKeys(node.groups);
      }
    });
  }
  collectKeys(nodes);
  expandedKeys.value = keys;
}


onMounted(async () => {
  // 统计时间维度字典
  countTimeTypeDict().then(res => {
    countTimeTypeList.value = res
  })
  // 能源类型字典
  energyTypeDict().then(res => {
    energyTypeList.value = res
  })


  const res = await treeList();
  stationData.value = res
  // 默认将树展开
  expandAllNodes(res);
  // // 默认选中第一个节点
  // if (res && res.length > 0) {
  //   const firstNode = res[0];
  //   stationId.value = [firstNode.id]; // 设置选中节点ID
  //   // 触发节点点击事件，同步查询参数
  //   onNodeClick(firstNode);
  // }
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
