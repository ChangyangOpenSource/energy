<!-- src/views/carbon/asset/CyOrgAssetList.vue -->
<template>
  <div class="p-2">
    <a-card :bordered="false">
      <div class="page-container">
        <!-- 左侧树形区域 -->
        <div class="left-tree">
          <a-tree
              v-if="deptTreeData.length > 0"
              :treeData="deptTreeData"
              :selectedKeys="selectedDeptKeys"
              @select="handleDeptSelect"
              showLine
              :defaultExpandAll="true"
          >
            <template #title="{ title }">
              {{ title }}
            </template>
          </a-tree>
        </div>

        <!-- 右侧内容区域 -->
        <div class="right-content">
          <!-- 折线图区域 -->
          <div class="chart-container">
            <div id="lineChart" style="width: 100%; height: 400px;"></div>
          </div>

          <!--引用表格-->
          <BasicTable @register="registerTable">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> {{ t('carbon.message.Add') }}</a-button>
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)"/>
            </template>
          </BasicTable>
        </div>
      </div>
    </a-card>

    <!-- 表单区域 -->
    <CyOrgAssetModal ref="registerModal" @success="handleSuccess" :defaultDeptId="selectedDeptId"></CyOrgAssetModal>
  </div>
</template>

<script lang="ts" name="cyOrgAsset-cyOrgAsset" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema } from './Asset.data';
import { list, deleteOne, queryOrgDepartTreeList, getChartData } from './Asset.api';
import CyOrgAssetModal from './modules/CyOrgAssetModal.vue';
import * as echarts from 'echarts';

const { t } = useI18n();
const registerModal = ref();
const lineChart = ref<any>(null);
const chartLoading = ref<boolean>(false);

// 左侧部门树相关
const deptTreeData = ref<any[]>([]);
const selectedDeptKeys = ref<any[]>([]);
const selectedDeptId = ref<string>('');

//注册table数据
const { tableContext } = useListPage({
  tableProps: {
    title: t('carbon.message.OrgRevenueTable'),
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
    beforeFetch: (params) => {
      params.deptId = selectedDeptId.value;
      initLineChart();
      return params;
    },
  },
});

const [registerTable, { reload }] = tableContext;

/**
 * 加载部门树形数据
 */
async function loadDeptTree() {
  try {
    const res = await queryOrgDepartTreeList();
    if (res.success) {
      deptTreeData.value = convertToTreeData(res.result);
      // 如果有默认部门，自动选中
      if (deptTreeData.value.length > 0 && !selectedDeptId.value) {
        selectedDeptKeys.value = [deptTreeData.value[0].key];
        selectedDeptId.value = deptTreeData.value[0].key;
        reload();
      }
    }
  } catch (error) {
    console.error('加载部门树失败', error);
  }
}

/**
 * 转换部门数据为树形组件格式
 */
function convertToTreeData(data: any[]) {
  return data.map(item => ({
    title: item.departName,
    key: item.id,
    value: item.id,
    children: item.children ? convertToTreeData(item.children) : []
  }));
}

/**
 * 处理部门选择事件
 */
function handleDeptSelect(selectedKeys: any[]) {
  selectedDeptKeys.value = selectedKeys;
  selectedDeptId.value = selectedKeys[0] || '';
  reload();
  // 部门切换时重新加载图表
  initLineChart();
}

/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.edit({ deptId: selectedDeptId.value });
  registerModal.value.title = t('carbon.message.Add');
  registerModal.value.disableSubmit = false;
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
  registerModal.value.edit(record);
  registerModal.value.title = t('carbon.message.Edit');
  registerModal.value.disableSubmit = false;
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
  // 重新加载折线图
  if (selectedDeptId.value) {
    initLineChart();
  }
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: t('carbon.message.Edit'),
      onClick: handleEdit.bind(null, record),
    },
  ];
}

/**
 * 初始化折线图
 */
async function initLineChart() {
  const deptId = selectedDeptId.value;
  if (!deptId) {
    clearChart();
    return;
  }

  chartLoading.value = true;
  clearChart();

  const params: any = { deptId };
  // 获取当前查询参数中的年份
  const tableQueryParams = (registerTable as any).getForm?.()?.getFieldsValue?.() || {};
  if (tableQueryParams.year) {
    params.year = tableQueryParams.year;
  }

  try {
    const res = await getChartData(params);
    chartLoading.value = false;

    if (res.success && res.result && res.result.data) {
      const { year, data } = res.result;

      // 定义四个指标的固定顺序
      const requiredTypes = [t('carbon.message.turnover'), t('carbon.message.output'), t('carbon.message.employee_count'), t('carbon.message.companyArea')];
      // 处理图表数据，确保顺序和完整性
      const chartData = requiredTypes.map(type => {
        const item = data.find(d => d.type === type) || { type, unit: '', dataList: [] };
        // 补全数据长度（与年份数组一致）
        if (item.dataList.length < year.length) {
          const fillCount = year.length - item.dataList.length;
          item.dataList = [...item.dataList, ...Array(fillCount).fill(null)];
        }
        return item;
      });

      // 定义四个指标对应的颜色（与折线、Y轴绑定）
      const colors = ['#148958', '#FFD700', '#1E90FF', '#FF69B4'];

      // 四个Y轴的配置（每个Y轴对应一个指标）
      const yAxisConfig = [
        // 1. 营业额 - 左侧第一个Y轴
        {
          type: 'value',
          name: t('carbon.message.turnover'),
          nameTextStyle: {
            color: colors[0],
            fontSize: 12,
            padding: [0, 0, 0, 5]
          },
          position: 'left',
          offset: 0,
          axisLine: {
            show: true,
            lineStyle: { color: colors[0] }
          },
          axisTick: { show: true },
          axisLabel: {
            color: colors[0],
            fontSize: 12,
            formatter: '{value}'
          },
          splitLine: { show: false }
        },
        // 2. 产量 - 左侧第二个Y轴
        {
          type: 'value',
          name: t('carbon.message.output'),
          nameTextStyle: {
            color: colors[1],
            fontSize: 12,
            padding: [0, 0, 0, 5]
          },
          position: 'left',
          offset: 70,
          axisLine: {
            show: true,
            lineStyle: { color: colors[1] }
          },
          axisTick: { show: true },
          axisLabel: {
            color: colors[1],
            fontSize: 12,
            formatter: '{value}'
          },
          splitLine: { show: false }
        },
        // 3. 员工 - 右侧第一个Y轴
        {
          type: 'value',
          name: t('carbon.message.employee_count'),
          nameTextStyle: {
            color: colors[2],
            fontSize: 12,
            padding: [0, 5, 0, 0]
          },
          position: 'right',
          offset: 0,
          axisLine: {
            show: true,
            lineStyle: { color: colors[2] }
          },
          axisTick: { show: true },
          axisLabel: {
            color: colors[2],
            fontSize: 12,
            formatter: '{value}'
          },
          splitLine: { show: false }
        },
        // 4. 占地面积 - 右侧第二个Y轴
        {
          type: 'value',
          name: t('carbon.message.companyArea'),
          nameTextStyle: {
            color: colors[3],
            fontSize: 12,
            padding: [0, 5, 0, 0]
          },
          position: 'right',
          offset: 70,
          axisLine: {
            show: true,
            lineStyle: { color: colors[3] }
          },
          axisTick: { show: true },
          axisLabel: {
            color: colors[3],
            fontSize: 12,
            formatter: '{value}'
          },
          splitLine: { show: false }
        }
      ];

      const seriesData = chartData.map((item, index) => ({
        name: item.type,
        type: 'line',
        data: item.dataList,
        yAxisIndex: index,
      }));

      // 图表配置项
      const option = {
        color: colors,
        title: {
          text: t('carbon.message.carbon_intensity_overview'),
          left: "5%",
          subtext: t('carbon.message.carbon_intensity_unit'),
          itemGap: 24
        },
        // 提示框配置
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
        },
        legend: {
          data: chartData.map(item => item.type),
        },
        // 网格配置
        grid: {
          left: '10%',
          right: '10%',
          bottom: '8%',
          top: '30%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: year,
          axisLine: {
            lineStyle: { color: '#ddd' }
          },
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#666',
            fontSize: 12
          }
        },
        yAxis: yAxisConfig,
        series: seriesData
      };

      // 初始化或更新图表
      if (!lineChart.value) {
        lineChart.value = echarts.init(document.getElementById('lineChart'));
        window.addEventListener('resize', handleChartResize);
      }
      lineChart.value.setOption(option);
    } else {
      console.warn('未获取到有效图表数据');
    }
  } catch (error) {
    chartLoading.value = false;
    console.error('获取图表数据失败', error);
  }
}

/**
 * 清除图表
 */
function clearChart() {
  if (lineChart.value) {
    lineChart.value.clear();
  }
}

/**
 * 处理图表响应式
 */
function handleChartResize() {
  if (lineChart.value) {
    lineChart.value.resize();
  }
}

// 生命周期
onMounted(() => {
  loadDeptTree();
  // 确保DOM渲染完成后初始化图表
  setTimeout(() => {
    if (selectedDeptId.value) {
      initLineChart();
    }
  }, 100);
});

onBeforeUnmount(() => {
  if (lineChart.value) {
    window.removeEventListener('resize', handleChartResize);
    lineChart.value.dispose();
    lineChart.value = null;
  }
});
</script>

<style lang="less" scoped>
.page-container {
  display: flex;
  gap: 16px;
}

.left-tree {
  width: 260px;
  min-height: 600px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 16px;
  overflow: auto;
  background: #fff;
  margin-right: 16px;
}

.right-content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 4px;
  padding: 24px;
}

.chart-container {
  margin: 0 0 16px 0;
}

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
