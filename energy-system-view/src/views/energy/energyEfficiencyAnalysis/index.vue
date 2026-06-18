<template>
  <div class="p-2" style="display: flex; height: calc(100vh - 60px);">

    <div  style="width: 18%; margin-right: 10px; background-color: white; padding: 20px">

      <div class="treeBox" style="height: 400px" >
        <a-tree
          style="height: calc(100vh - 205px)"
          checkStrictly
          :tree-data="stationData"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          v-model:checkedKeys="stationId"
          v-model:selectedKeys="selectedStationId"
          :fieldNames="{
                  children: 'groups',
                  title: 'name',
                  key: 'id',
                  type: 'type'
                }"
          @expand="onExpand"
          @select="getStation"
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
    </div>

     <div style="width: 82%; background-color: white; padding: 20px; height: calc(100vh - 100px); overflow-y: auto;">

      <div class="topBox">
        <div class="timeBox">
          <a-radio-group v-model:value="queryParam.countTimeType" @change="countTimeTypeChange">
            <a-radio-button value="1">按年</a-radio-button>
            <a-radio-button value="2">按月</a-radio-button>
          </a-radio-group>
          <a-range-picker v-if="queryParam.countTimeType == '1'"  v-model:value="queryParam.selectDate" value-format="YYYY" picker="year" @change="selectDateChange"   />
          <a-range-picker v-if="queryParam.countTimeType == '2'"  v-model:value="queryParam.selectDate" value-format="YYYY-MM" picker="month"  @change="selectDateChange" />
        </div>
        <a-button type="primary" @click="handleAdd">指标配置</a-button>
      </div>

      <div class="indicatorTypeBox">
        <!-- 左箭头 -->
        <div v-show="indicatorTypeList != null && indicatorTypeList.length > 0" class="arrow arrow-left" @click="scrollLeft">
          <a-icon type="left" />
        </div>

        <!-- 内容容器 -->
        <div v-show="indicatorTypeList != null && indicatorTypeList.length > 0" class="indicatorContent" ref="indicatorContent">
          <div class="indicatorTypeInner" v-for="(item, index) in indicatorTypeList" :key="index">
            <div class="header">
              <span>{{item.indicatorName}}（{{item.indicatorUnit}}）</span>
              <a-tooltip>
                <template #title>
                  <div>
                    说明：{{item.instruction}}
                  </div>
                  <div>
                    计算公式：{{item.calculationFormula}}
                  </div>
                </template>
                <Icon icon="ant-design:question-circle-outlined" />
              </a-tooltip>
            </div>
            <div class="value">{{item.countValue}}</div>
            <div class="trend">
              <span>环比</span>
              <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="item.rateValue > 0" />
              <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="item.rateValue < 0" />
              <span>{{item.rateValue}}%</span>
            </div>
          </div>
        </div>

        <!-- 右箭头 -->
        <div v-show="indicatorTypeList != null && indicatorTypeList.length > 0" class="arrow arrow-right" @click="scrollRight">
          <a-icon type="right" />
        </div>
      </div>
      <!--图表盒子-->
       <div style="width: 100%">
         <div v-if="indicatorTypeList != null && indicatorTypeList.length > 0" class="chartBox" id="chart_bar_gx"></div>
         <div v-else class="falseChartBox"></div>
       </div>

       <div class="tableBox">
         <div v-show="indicatorTypeList != null && indicatorTypeList.length > 0" style="display: flex; justify-content: space-between;">
           <h2>
             <strong>数据明细</strong>
           </h2>

           <div style="display: flex; gap: 24px">
             <div @click="handleDownload">
               <DownloadOutlined :style="{ fontSize: '24px', cursor: 'pointer'}"/>
             </div>
             <a-button type="primary" @click="gotoFillIn">填报</a-button>
           </div>
         </div>

         <div v-show="indicatorTypeList != null && indicatorTypeList.length > 0">
           <!--引用表格-->
           <BasicTable @register="registerTable" :rowSelection="rowSelection">
             <template v-slot:bodyCell="{ column, record, index, text }">
             </template>
           </BasicTable>
         </div>

         <div v-show="indicatorTypeList == null ||  indicatorTypeList == undefined || indicatorTypeList.length <= 0">
           <a-result status="404" title="暂无数据,请先配置指标"> </a-result>
         </div>
      </div>
    </div>
  </div>
  <CyEnergyConsumptionAnalysisIndicatorModal ref="registerModal" @success="handleSuccess" ></CyEnergyConsumptionAnalysisIndicatorModal>
</template>


<script setup lang="ts">
import {onMounted, reactive, ref,nextTick} from "vue";
import {getStationTree} from "@/views/energy/station/CyStation.api";
import {BasicTable} from "@/components/Table";
import {useListPage} from "@/hooks/system/useListPage";
import { useRouter } from 'vue-router'
import {
  getExportUrl,
  getImportUrl,
  indexList,
  energyEfficiencyAnalysisTableColumnList, getIndicatorCardBoxData,
  getEnergyEfficiencyAnalysisChartData, exportEnergyEfficiencyAnalysis
} from "@/views/energy/energyEfficiencyAnalysis/CyEnergyConsumptionAnalysisIndicator.api";
import {getDateByPicker} from "@/utils";
import * as echarts from 'echarts'
import dayjs from "dayjs";
import CyEnergyConsumptionAnalysisIndicatorModal
  from "@/views/energy/energyEfficiencyAnalysis/components/CyEnergyConsumptionAnalysisIndicatorModal.vue";
import {DownloadOutlined} from "@ant-design/icons-vue";
import {treeList} from "@/views/energy/group/CyGroup.api";
const queryParam = reactive<any>({
  countTimeType: "2"
});
const stationData = ref([]) //场站树形结构
const expandedKeys = ref([]);
const autoExpandParent = ref(true);
const stationId = ref([]) //选中的场站id
const indicatorTypeList = ref([]) // 指标类型列表
const indicatorContent = ref<HTMLElement | null>(null);
const fieldPickers = reactive({});
const registerModal = ref()
const selectedStationId = ref([])
const router = useRouter()
// 当前点击节点的类型
const currentClickNodeType = ref()
const lastSelectedKeys = ref([]);

// 当前完整列配置（响应式）
const tableColumns = ref([]);
// 图表绑定的数据源
const option = ref(  {
    title: {
      text: '数据概览'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: []
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: [
      {
        type: 'value',
        name: '能耗值',
        position: 'left'
      }
    ],
    series: []
  });


//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    title: '',
    api: indexList,
    columns: tableColumns,
    canResize:true,
    useSearchForm: false,
    actionColumn: false,
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


/**
 * 展开方法
 * @param keys
 */
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
  console.log("expandedKeys", expandedKeys)
};

/**
 * 查询
 */
async function searchQuery() {
  try {
    const cardRes = await getIndicatorCardBoxData(queryParam);
    indicatorTypeList.value = cardRes;

    const chartRes = await getEnergyEfficiencyAnalysisChartData(queryParam);
    option.value.legend.data = [...chartRes.legendData];
    option.value.series = JSON.parse(JSON.stringify(chartRes.series));
    option.value.xAxis.data = [...(chartRes.xaxisData || [])]; // 防空

    await nextTick(); // 确保 v-if 的 #chart_bar_gx 已挂载
    const chartEl = document.getElementById('chart_bar_gx');

    if (!chartEl) {
      console.warn('chart container #chart_bar_gx not found, skip init');
      return;
    }

    const chart = echarts.getInstanceByDom(chartEl) || echarts.init(chartEl, null, { renderer: 'canvas' });
    chart.setOption(option.value, true);

    if (chartRes.xaxisData?.length === 0) {
      chart.clear();
      chart.setOption({
        graphic: [{
          type: 'text',
          left: 'center',
          top: '50%',
          style: {
            text: '暂无数据',
            fontSize: 16,
            fill: '#999'
          }
        }]
      });
    }

    // 表格列
    const columnRes = await energyEfficiencyAnalysisTableColumnList(queryParam);
    tableColumns.value = [...columnRes];
    reload();
  } catch (error) {
    console.error('searchQuery failed:', error);
  }
}

/**
 * 统计时间维度变化事件
 */
function countTimeTypeChange() {
  // 获取当前日期
  const now = dayjs();
  if(queryParam.countTimeType === '1'){
    const current = now.format('YYYY');
    // 设置默认时间范围为当前月
    queryParam.selectDate = [current, current];
    queryParam.startTime = current;
    queryParam.endTime = current;
  }else{
    const currentMonth = now.format('YYYY-MM');
    // 设置默认时间范围为当前月
    queryParam.selectDate = [currentMonth, currentMonth];
    queryParam.startTime = currentMonth;
    queryParam.endTime = currentMonth;
  }
  searchQuery();
}

/**
 * 跳转到数据管理页面
 */
function gotoFillIn() {
  router.push({
    path: '/module_emission/dataManage/CyDataManageList',
  })
}

/**
 * 下载数据
 */
function handleDownload(){
  exportEnergyEfficiencyAnalysis('用能强度分析.xlsx', queryParam);
}

/**
 * 获取选中场站数据信息
 */
const getStation = (selectedKeys, {node}) => {
  // 如果没有选中任何节点，恢复到最后一次选中的状态
  if (selectedKeys.length === 0 && lastSelectedKeys.value.length > 0) {
    setTimeout(() => {
      selectedStationId.value = lastSelectedKeys.value;
    }, 0);
    return;
  }

  // 更新最后选中状态
  lastSelectedKeys.value = [...selectedKeys];

  queryParam.type = node.type;
  stationId.value = selectedKeys;
  queryParam.parentId = stationId.value
  searchQuery();
};

/**
 * 节点点击事件
 */
const onNodeClick = (record) => {
  console.log('节点数据:', record);
  currentClickNodeType.value = record.type;
  queryParam.parentId = record.id;
  queryParam.type = record.type;
  // 将选择的节点的能源类型赋值给查询参数
  if(record.energyType){
    queryParam.energyType = record.energyType.split(",")
  }else{
    queryParam.energyType = []
  }
  searchQuery();
};

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
  searchQuery();
}

/**
 * 向左滚动
 */
function scrollLeft() {
  if (indicatorContent.value) {
    indicatorContent.value.scrollBy({
      left: -450,
      behavior: 'smooth'
    });
  }
}

/**
 * 成功回调
 */
function handleSuccess() {
  searchQuery();
}


/**
 * 向右滚动
 */
function scrollRight() {

  if (indicatorContent.value) {
    indicatorContent.value.scrollBy({
      left: 450,
      behavior: 'smooth'
    });
  }
}

/**
 * 打开设置抽屉
 */
function handleAdd(){
  registerModal.value.disableSubmit = false;
  registerModal.value.add(stationId.value[0],queryParam.type);
}

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
      if (node.children && node.children.length > 0) {
        collectKeys(node.children);
      }
    });
  }
  collectKeys(nodes);
  expandedKeys.value = keys;
}


onMounted(async () => {
  // 获取当前日期
  const now = dayjs();
  const currentMonth = now.format('YYYY-MM');

  // 设置默认时间范围为当前月
  queryParam.selectDate = [currentMonth, currentMonth];
  queryParam.startTime = currentMonth;
  queryParam.endTime = currentMonth;

  const res = await treeList();
  stationData.value = res
  // 默认选中第一个节点
  if (res && res.length > 0) {
    const firstNode = res[0];
    stationId.value = [firstNode.id]; // 设置选中节点ID
    selectedStationId.value = [firstNode.id];
    // 触发节点点击事件，同步查询参数
    onNodeClick(firstNode);
  }
  // 默认将树形展开
  expandAllNodes(res);

  // // 使用 nextTick 确保 DOM 渲染完成
  // await nextTick();
  // // 查询图表数据
  // getEnergyEfficiencyAnalysisChartData(queryParam).then(res => {
  //   // 修改图表的数据
  //   option.value.legend.data = res.legendData;
  //   option.value.series = res.series;
  //   option.value.xAxis.data = res.xaxisData;
  //   // 初始化图表
  //   let chart_bar_gx = echarts.init(document.getElementById('chart_bar_gx'))
  //   // 给图表放置数据
  //   chart_bar_gx.setOption(option.value)
  // });
  // // 查询出表格要用到的列
  // energyEfficiencyAnalysisTableColumnList(queryParam).then(res => {
  //   // 正确的方式：将返回的列配置与基础列合并
  //   tableColumns.value = [...tableColumns.value, ...res];
  //   // 如果需要重新加载表格数据
  //   reload();
  // });
  // // 查询指标卡片盒子数据
  // getIndicatorCardBoxData(queryParam).then(res => {
  //   indicatorTypeList.value = res;
  // });
})





</script>

<style scoped lang="less">
.topBox{
  display: flex;
  justify-content: space-between;
}

.timeBox{
  display: flex;
  gap: 54px;
}

.chartBox{
  margin-top: 20px;
  width: 100%;
  height: 400px;
}

.falseChartBox{
  margin-top: 20px;
  width: 100%;
  height: 10px;
}

.indicatorTypeBox {
  margin-top: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;

  .arrow {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;

    &:hover {
      background: #e8e8e8;
    }

    &.arrow-left {
      order: -1;
    }
  }

  .indicatorContent {
    flex: 1;
    overflow-x: hidden;
    padding: 0 10px;
    white-space: nowrap;

    .indicatorTypeInner {
      width: 390px;
      height: 135px;
      border: 1px solid #E9E9E9;
      padding: 20px;
      display: inline-block;
      vertical-align: top;
      margin-right: 24px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        span {
          font-size: 14px;
          color: #666;
        }
      }

      .value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .trend {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: #666;

        .anticon {
          font-size: 12px;
        }
      }
    }
  }
}




</style>
