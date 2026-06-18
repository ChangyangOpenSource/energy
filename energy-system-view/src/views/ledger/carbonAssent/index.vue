<!-- src/views/ledger/carbonAssent/index.vue -->
<template>
  <div class="m_contentBox">
    <a-card :bordered="false">
      <div>
        <div class="top-tree" v-show="isAss">
          <a-tree-select
            allowClear
            style="width: 15%"
            v-model:value="selectedDeptId"
            :dropdownStyle="{ maxHeight: '600px', overflow: 'auto' }"
            :treeData="deptTreeData"
            @select="handleDeptSelect"
            treeDefaultExpandAll
          >
          </a-tree-select>
        </div>
      </div>
      <div class="page-container">
        <div class="right-content">
          <!--3个卡片-->
          <div>
            <a-row :gutter="24">
              <a-col :xl="6" :lg="12" :md="12" :sm="24">
                <a-card style="background-color: #f7fdf9" :bordered="false">
                  <p style="font-size: 16px; color: #333333; margin-bottom: 0">{{ t('carbon.message.CarbonAssetAvailability') }}(tCO₂e)</p>
                  <a-row :gutter="24">
                    <a-col :span="24" style="font-size: 38px; color: #148958; text-align: center">{{ topLeft.left.total }} </a-col>
                    <a-col :span="12">
                      <div>
                        <span style="color: #777777">{{ t('carbon.message.CarbonQuota') }}</span>
                        {{ topLeft.left.carbonQuota }}
                      </div>
                    </a-col>

                    <a-col :span="12">
                      <div>
                        <span style="color: #777777">{{ t('carbon.message.CarbonCredit') }}</span>
                        {{ topLeft.left.carbonCredit }}
                      </div>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>

              <a-col :xl="6" :lg="12" :md="12" :sm="24">
                <a-card style="background-color: #fdf5f1" :bordered="false">
                  <p style="font-size: 16px; color: #333333; margin-bottom: 0"> {{ t('carbon.message.ExpireInSixMonths') }}(tCO₂e)</p>
                  <a-row :gutter="24">
                    <a-col :span="24" style="font-size: 38px; color: #e37318; text-align: center">
                      {{ topLeft.right.total }}
                    </a-col>
                    <a-col :span="12">
                      <div>
                        <span style="color: #777777">{{ t('carbon.message.CarbonQuota') }}</span>
                        {{ topLeft.right.carbonQuota }}
                      </div>
                    </a-col>

                    <a-col :span="12">
                      <div>
                        <span style="color: #777777">{{ t('carbon.message.CarbonCredit') }}</span>
                        {{ topLeft.right.carbonCredit }}
                      </div>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>

              <a-col :xl="12" :lg="24" :md="24" :sm="24">
                <a-card style="background-color: #f3f5ff" :bordered="false">
                  <a-row :gutter="24">
                    <a-col :span="10">
                      <p style="font-size: 16px; color: #333333; margin-bottom: 0">{{ t('carbon.message.Increase') }}(tCO₂e)</p>
                      <a-row :gutter="24">
                        <a-col :span="24" style="font-size: 38px; color: #1573eb; text-align: center">
                          {{ topRight.left.total }}
                        </a-col>
                        <a-col :span="12">
                            <div>
                              <span style="color: #777777">{{ t('carbon.message.CarbonQuota') }}</span>
                              {{ topRight.left.carbonQuota }}
                            </div>
                        </a-col>

                        <a-col :span="12">
                            <div>
                              <span style="color: #777777">{{ t('carbon.message.CarbonCredit') }}</span>
                              {{ topRight.left.carbonCredit }}
                            </div>
                        </a-col>
                      </a-row>
                    </a-col>

                    <a-col :span="1">
                      <a-divider type="vertical" style="height: 100px; background-color: #e3e3e3" />
                    </a-col>

                    <a-col :span="10">
                      <p style="font-size: 16px; color: #333333; margin-bottom: 0">{{ t('carbon.message.Reduce') }}(tCO₂e)</p>
                      <a-row :gutter="24">
                        <a-col :span="24" style="font-size: 38px; color: #1573eb; text-align: center">
                          {{ topRight.right.total }}
                        </a-col>
                        <a-col :span="12">
                          <div>
                            <span style="color: #777777">{{ t('carbon.message.CarbonQuota') }}</span>
                            {{ topRight.right.carbonQuota }}
                          </div>
                        </a-col>

                        <a-col :span="12">
                          <div>
                            <span style="color: #777777">{{ t('carbon.message.CarbonCredit') }}</span>
                            {{ topRight.right.carbonCredit }}
                          </div>
                        </a-col>
                      </a-row>
                    </a-col>
                    <a-col :span="2">
                      <a-select v-model:value="year" @change="getTopRight">
                        <a-select-option v-for="item in years" :key="item" :value="item">{{ item }}</a-select-option>
                      </a-select>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
            </a-row>
          </div>

          <!--图表-->
          <div style="margin-top: 24px; display: flex">
            <div style="width: 49%; background-color: #fbfbfb">
              <div style="display: flex; padding: 24px">
                <div class="text1">{{ t('carbon.message.CarbonAssetTrends') }}(tCO₂e)</div>
                <div class="tip">{{ t('carbon.message.RecentDecemberData') }}</div>
              </div>
              <div id="carbonAssetTrend" ref="carbonAssetTrendRef"></div>
            </div>
            <div style="width: 2%"></div>
            <div style="width: 49%; background-color: #fbfbfb">
              <div style="padding: 24px">
                <div class="text1">{{ t('carbon.message.AssetHoldingAnalysis') }}(tCO₂e)</div>
                <div id="assetHoldingAnalysis" ref="assetHoldingAnalysisRef"></div>
              </div>
            </div>
          </div>

          <div style="height: 880px">
            <!--tab-->
            <CyCarbonAssetTabs :types="types" @callback="callback"></CyCarbonAssetTabs>
            <!-- 查询区域 -->
            <div class="table-page-search-wrapper">
              <a-form @keyup.enter="searchQuery">
                <a-row :gutter="24">
                  <a-col :span="6" v-if="tab === '1'">
                    <a-form-item :label="t('carbon.message.RegistrationDate')">
                      <a-range-picker
                        v-model:value="queryParam.createTimes"
                        style="width: 100%"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        @calendarChange="
                          (dates) => {
                            queryParam.createStartTime = dates[0];
                            queryParam.createEndTime = dates[1];
                          }
                        "
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="5" v-if="tab === '1'">
                    <a-form-item :label="t('carbon.message.FlowType')">
                      <a-select :placeholder="t('carbon.message.Please_select')" v-model:value="queryParam.typeId" @change="selectCarbonAssetTypes">
                        <a-select-option v-for="(item, index) in types" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="5">
                    <a-form-item :label="t('carbon.message.TypesOfCarbonAssets')">
                      <a-select
                        :placeholder="t('carbon.message.Please_select')"
                        v-model:value="queryParam.carbonAssetTypeId"
                        @change="selectFlowTypes"
                      >
                        <a-select-option v-for="(item, index) in carbonAssetTypes" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="6">
                    <a-form-item :label="tab === '1' ? t('carbon.message.FlowMethod') : t('carbon.message.SourceOfCarbonAssets')">
                      <a-select :placeholder="t('carbon.message.Please_select')" v-model:value="queryParam.flowTypeId">
                        <a-select-option v-for="(item, index) in flowTypes" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="6">
                    <a-form-item :label="tab === '1' ? t('carbon.message.FlowTime') : t('carbon.message.AcquisitionTime')">
                      <a-range-picker
                        v-model:value="queryParam.flowTimes"
                        style="width: 100%"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        @calendarChange="
                          (dates) => {
                            queryParam.flowStartTime = dates[0];
                            queryParam.flowEndTime = dates[1];
                          }
                        "
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="5" v-if="tab !== '1'">
                    <a-form-item :label="t('carbon.message.Status')">
                      <a-select :placeholder="t('carbon.message.Please_select')" v-model:value="queryParam.status">
                        <a-select-option v-for="(item, index) in status" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="5">
                    <a-form-item :label="t('carbon.message.AssetCode')">
                      <a-input v-model:value="queryParam.assetCode" :placeholder="t('carbon.message.Please_enter')" allowClear />
                    </a-form-item>
                  </a-col>

                  <a-col :span="5" v-if="tab === '1'">
                    <a-form-item :label="t('carbon.message.Counterparty')">
                      <a-input v-model:value="queryParam.counterparty" :placeholder="t('carbon.message.Please_enter')" allowClear />
                    </a-form-item>
                  </a-col>

                  <a-col :span="4" v-if="tab === '1'">
                    <a-form-item :label="t('carbon.message.Registrant')">
                      <a-select :placeholder="t('carbon.message.Please_select')" v-model:value="queryParam.createBy">
                        <a-select-option v-for="(item, index) in createBys" :key="item.username" :value="item.username">
                          {{ item.realname }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="6" v-if="tab !== '1'">
                    <a-form-item :label="t('carbon.message.ExpireTime')">
                      <a-range-picker
                        v-model:value="queryParam.expireTimes"
                        style="width: 100%"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        @calendarChange="
                          (dates) => {
                            queryParam.expireStartTime = dates[0];
                            queryParam.expireEndTime = dates[1];
                          }
                        "
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="4">
                    <a-form-item label="" style="">
                      <div style="width: 100%; display: flex; justify-content: flex-end">
                        <a-button type="primary" @click="searchQuery">{{ t('carbon.message.Search') }}</a-button>
                        <a-button style="margin-left: 8px" @click="searchReset">{{ t('carbon.message.Reset') }}</a-button>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <!-- 查询区域-END -->

            <!-- 操作按钮区域 -->
            <div class="table-operator" style="display: flex" v-if="tab === '1'">
              <a-card class="totalOneCard">{{ t('carbon.message.Increase') }}:{{ countValue.addValue }}</a-card>
              <a-card class="totalTwoCard">{{ t('carbon.message.Reduce') }}:{{ countValue.reduceValue }}</a-card>
              <a-button @click="handleAdd" type="primary" preIcon="ant-design:plus-outlined" style="margin-left: auto">
                {{ t('carbon.message.AddFlow') }}
              </a-button>
            </div>

            <!-- table区域-begin -->
            <div>
              <a-table
                ref="tableRef"
                size="middle"
                :scroll="{ x: true }"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                class="j-table-force-nowrap"
                @change="handleTableChange"
              >
                <template #totalCarbonAsset="{ text, record }">
                  <span v-if="tab === '1'">{{ record.totalCarbonAsset }}</span>
                  <span v-else>{{ record.availableCarbonAssets }}</span>
                </template>

                <template #imgSlot="{text,record}">
                  <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
                  <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
                </template>

                <template #status="{ text, record }">
                  <JTag
                    v-if="text == 1"
                    :text="t('carbon.message.Effective')"
                    :style="{ color: '#2BA471', backgroundColor: '#E3F9E9', width: '70px', borderRadius: '3px' }"
                  />
                  <JTag
                    v-if="text == 2"
                    :text="t('carbon.message.RunOut')"
                    :style="{ color: '#000000', backgroundColor: '#F3F3F3', width: '70px', borderRadius: '3px' }"
                  />
                  <JTag
                    v-if="text == 3"
                    :text="t('carbon.message.Expire')"
                    :style="{ color: '#D54941', backgroundColor: '#FFF0ED', width: '70px', borderRadius: '3px' }"
                  />
                </template>

                <template #action="{ text, record }">
                  <span v-if="tab === '1' && record.typeId_dictText !== '减少'">
                    <a :disabled="record.relationFlag === 1? 'disabled' : null" @click="handleEdit(record)">{{ t('carbon.message.Edit') }}</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                      <a :disabled="record.relationFlag === 1? 'disabled' : null">{{ t('carbon.message.Delete') }}</a>
                    </a-popconfirm>
                  </span>
                  <span v-if="tab === '1' && record.typeId_dictText === '减少'"> - </span>
                  <span v-if="tab !== '1'">
                    <a @click="queryLogDetail(record)">{{ t('carbon.message.FlowDetail') }}</a>
                  </span>
                </template>
              </a-table>
            </div>

            <div class="sizeStyle1 m_hoverCP" @click="onSizeLeft(true)" v-if="!isAss">
              <img src="@/assets/carbon/img5.png" alt="" />
            </div>

            <CyCarbonAssentFlowModal ref="modalFormRef" @back="onBack" :types="types" :depts="depts"></CyCarbonAssentFlowModal>
            <CyCarbonAssentLogModal ref="logModalRef" @back="onBack"></CyCarbonAssentLogModal>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import CyCarbonAssentFlowModal from './modules/CyCarbonAssetFlowModal.vue';
import CyCarbonAssentLogModal from './modules/CyCarbonAssetLogModal.vue';
import CyCarbonAssetTabs from './modules/CyCarbonAssetTabs.vue';
import JTag from '/@/components/jeecg/JTag.vue';
import * as echarts from 'echarts';
import {
  getCarbonAssetFlowList,
  deleteCarbonAssetFlow,
  getTypeAndChildren,
  getTopLeft,
  getTopRight,
  getCreateYear,
  getMidScreen,
  getCreateBy,
  getCount,
  getOrgListByUser,
  queryOrgDepartTreeList,
} from './carbonAssent.api';
import {TableImg} from "@/components/Table";


const { t } = useI18n();

// refs
const tableRef = ref();
const modalFormRef = ref();
const logModalRef = ref();
const carbonAssetTrendRef = ref<HTMLDivElement | null>(null);
const assetHoldingAnalysisRef = ref<HTMLDivElement | null>(null);
let carbonAssetTrendChart: echarts.ECharts | null = null;
let assetHoldingAnalysisChart: echarts.ECharts | null = null;

// reactive data
const description = ref<string>('碳资产流水管理页面');
const isAss = ref<boolean>(true);
const queryParam = ref<any>({});
const dataSource = ref<any[]>([]);
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total: number, range: number[]) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条';
  },
  total: 0,
});
const tab = ref<string>('1');

// 表头
const columns = ref<any[]>([]);
const columns1 = ref([
  {
    title: t('carbon.message.RegistrationDate'),
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: t('carbon.message.TypesOfCarbonAssets'),
    align: 'center',
    dataIndex: 'carbonAssetTypeId_dictText',
  },
  {
    title: t('carbon.message.FlowType'),
    align: 'center',
    dataIndex: 'typeId_dictText',
  },
  {
    title: t('carbon.message.FlowMethod'),
    align: 'center',
    dataIndex: 'flowTypeId_dictText',
  },
  {
    title: t('carbon.message.TotalCarbonAsset') + '(tCO₂e)',
    align: 'center',
    dataIndex: 'totalCarbonAsset',
    slots: { customRender: 'totalCarbonAsset' },
  },
  {
    title: t('carbon.message.FlowTime'),
    align: 'center',
    dataIndex: 'flowTime'
  },
  {
    title: t('carbon.message.AssetCode'),
    align: 'center',
    dataIndex: 'assetCode',
  },
  {
    title: t('carbon.message.Counterparty'),
    align: 'center',
    dataIndex: 'counterparty',
  },
  {
    title: t('carbon.message.FlowImg'),
    align: 'center',
    dataIndex: 'flowImg',
    slots: { customRender: 'imgSlot' },
  },
  {
    title: t('carbon.message.Registrant'),
    align: 'center',
    dataIndex: 'updateBy_dictText',
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 147,
    slots: { customRender: 'action' },
  },
]);

const columns2 = ref([
  {
    title: t('carbon.message.AssetCode'),
    align: 'center',
    dataIndex: 'assetCode',
  },
  {
    title: t('carbon.message.TypesOfCarbonAssets'),
    align: 'center',
    dataIndex: 'carbonAssetTypeId_dictText',
  },
  {
    title: t('carbon.message.SourceOfCarbonAssets'),
    align: 'center',
    dataIndex: 'flowTypeId_dictText',
  },
  {
    title: t('carbon.message.AcquisitionTime'),
    align: 'center',
    dataIndex: 'flowTime'
  },
  {
    title: t('carbon.message.TotalCarbonAsset') + '(tCO₂e)',
    align: 'center',
    dataIndex: 'totalCarbonAsset',
  },
  {
    title: t('carbon.message.Reduction') + '(tCO₂e)',
    align: 'center',
    dataIndex: 'reduceCarbonAsset',
    customRender: ({ record }) => {
      return record.totalCarbonAsset - record.availableCarbonAssets
    },
  },
  {
    title: t('carbon.message.AvailableQuantity') + '(tCO₂e)',
    align: 'center',
    dataIndex: 'availableCarbonAssets',
  },
  {
    title: t('carbon.message.ExpireTime'),
    align: 'center',
    dataIndex: 'expireTime',
  },
  {
    title: t('carbon.message.FlowRecord'),
    align: 'center',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
  {
    title: t('carbon.message.Status'),
    align: 'center',
    dataIndex: 'status',
    slots: { customRender: 'status' },
    width: '136px',
  },
]);

const dateFormat = ref<string>('YYYY-MM-DD');
const types = ref([
  {
    label: undefined,
    value: undefined,
    children: [],
  },
  {
    label: undefined,
    value: undefined,
    children: [],
  },
]); //流水类型
const loading = ref<boolean>(false);
const carbonAssetTypes = ref<any[]>([]); //碳资产类型
const flowTypes = ref<any[]>([]); //流水方式
const status = ref([
  {
    label: '有效',
    value: '1',
  },
  {
    label: '已用完',
    value: '2',
  },
  {
    label: '到期',
    value: '3',
  },
]); //状态
const counterparties = ref<any[]>([]); //交易方
const createBys = ref<any[]>([]); //登记人
const topLeft = reactive({
  left: {
    total: 0,
    carbonQuota: 0,
    carbonCredit: 0,
  },
  right: {
    total: 0,
    carbonQuota: 0,
    carbonCredit: 0,
  },
}); //概览左上角 两个卡片
const topRight = reactive({
  left: {
    total: 0,
    carbonQuota: 0,
    carbonCredit: 0,
  },
  right: {
    total: 0,
    carbonQuota: 0,
    carbonCredit: 0,
  },
}); //概览右上角 一个卡片
const year = ref<any>(null);
const years = ref<any[]>([]);
const countValue = ref<any>({});
const depts = ref<any[]>([]); //组织

// 左侧部门树相关
const deptTreeData = ref<any[]>([]); // 部门树形数据
const selectedDeptKeys = ref<any[]>([]); // 选中的部门ID（树形组件用）
const selectedDeptId = ref<string>(''); // 选中的部门ID（用于查询）

// lifecycle
onMounted(() => {
  loadDeptTree(); // 加载部门树形数据
  getOrgListByUserFunc();
  getTypeAndChildrenFunc();
  getCreateByFunc();
});

// watch
watch(tab, (newVal) => {
  if (newVal === '1') {
    columns.value = columns1.value;
  } else {
    columns.value = columns2.value;
  }
});

// methods
async function getOrgListByUserFunc() {
  try {
    const res = await getOrgListByUser();
    if (res.success) {
      depts.value = res.result;
    }
  } catch (error) {
    console.error('获取组织列表失败', error);
  }
}

// 加载部门树形数据
async function loadDeptTree() {
  try {
    const res = await queryOrgDepartTreeList();
    if (res.success) {
      deptTreeData.value = convertToTreeData(res.result);
      let selectedDeptKeysId: string[] = [];
      selectedDeptKeysId.push(deptTreeData.value[0].key);
      selectedDeptKeys.value = selectedDeptKeysId;
      selectedDeptId.value = deptTreeData.value[0].key;
      queryParam.value.deptId = selectedDeptId.value;
      loadData();
    }
  } catch (error) {
    console.error('加载部门树失败', error);
  }
}

// 转换部门数据为树形组件格式
function convertToTreeData(data: any[]) {
  return data.map((item) => ({
    title: item.departName,
    key: item.id,
    value: item.id,
    children: item.children ? convertToTreeData(item.children) : [],
  }));
}

// 处理部门选择事件
function handleDeptSelect(selectedKeys: string[]) {
  selectedDeptKeys.value = [selectedKeys];
  selectedDeptId.value = selectedKeys;
  // 切换部门后自动查询该部门数据
  queryParam.value.deptId = selectedDeptKeys.value[0];
  searchQuery(); // 触发查询
}

async function loadData(arg?: number) {
  if (tab.value === '1') {
    columns.value = columns1.value;
  } else {
    columns.value = columns2.value;
  }

  //加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }

  await Promise.all([getTopLeftFunc(), getTopRightFunc(), operatingCharts(), getCountFunc(), getCreateYearFunc()]);

  var params = queryParam.value;
  params.pageNo = ipagination.current;
  params.pageSize = ipagination.pageSize;

  try {
    const res = await getCarbonAssetFlowList(params);
    console.log(res, 'dataSource');
    if (res.success) {
      dataSource.value = res.result.records || res.result;
      if (res.result.total) {
        ipagination.total = res.result.total;
      } else {
        ipagination.total = 0;
      }
      console.log(dataSource.value);
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('加载数据失败', error);
  }
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  //分页、排序、筛选变化时触发
  //TODO 筛选
  console.log(pagination);
  Object.assign(ipagination, pagination);
  loadData();
}

/**
 * 获取合计
 */
async function getCountFunc() {
  try {
    const res = await getCount(queryParam.value);
    if (res.success) {
      countValue.value = res.result;
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('获取合计失败', error);
  }
}

/**
 * 获取所有组织下的人
 */
async function getCreateByFunc() {
  try {
    const res = await getCreateBy({
      pageNo: 1,
      pageSize: -1,
    });
    if (res.success) {
      createBys.value = res.result.records;
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('获取登记人失败', error);
  }
}

/**
 * 查询流水详情
 */
function queryLogDetail(record: any) {
  if (logModalRef.value) {
    logModalRef.value.loadData(1, record);
  }
}

//碳资产趋势
async function operatingCharts() {
  console.log('operatingCharts');
  try {
    const res = await getMidScreen({ deptId: selectedDeptId.value });
    if (res.success) {
      console.log(res.result.left.xaxisData);
      let option = {
        xAxis: {
          type: 'category',
          data: res.result.left.xaxisData,
          axisLabel: {
            rotate: 45, // 设置文字旋转45度
          },
        },
        color: ['#148958'],
        tooltip: {
          trigger: 'axis',
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '碳资产',
            data: res.result.left.seriesData,
            type: 'line',
          },
        ],
      };

      console.log('carbonAssetTrend');
      if (carbonAssetTrendRef.value) {
        if (carbonAssetTrendChart) {
          carbonAssetTrendChart.dispose();
        }
        carbonAssetTrendChart = echarts.init(carbonAssetTrendRef.value);
        carbonAssetTrendChart.setOption(option);
      }

      let option2 = {
        color: ['#FF8C73', '#1BC08A', '#81E0DB', '#FFC439'],
        title: {
          show: true,
          text: topLeft.left.total + 'tCO₂e', // \n可以换行
          x: '50%', // center
          y: 'center',
          textAlign: 'center',
          textStyle: {
            fontSize: '16',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '28',
            color: '#333',
          },
        },
        legend: {
          selectedMode: false,
          bottom: '0%',
          left: 'center',
          formatter: (params: string) => {
            console.log(params.split('：'), 666666666);
            //切割到冒号
            return params.split('：')[0];
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            return params.name.split('：')[0] + '：' + params.value + 'tCO₂e';
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5,
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'], // 左移20%（原默认值50%）
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            labelLayout: {
              hideOverlap: false, // 不隐藏重叠标签
            },
            name: '',
            label: {
              show: true,
              position: 'outside',
              formatter: function (params: any) {
                return params.percent + '%';
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 15,
                fontWeight: 'bold',
              },
            },
            data: res.result.right,
          },
        ],
      };

      console.log('assetHoldingAnalysis');
      if (assetHoldingAnalysisRef.value) {
        if (assetHoldingAnalysisChart) {
          assetHoldingAnalysisChart.dispose();
        }
        assetHoldingAnalysisChart = echarts.init(assetHoldingAnalysisRef.value);
        assetHoldingAnalysisChart.setOption(option2);
      }
    }
  } catch (error) {
    console.error('获取图表数据失败', error);
  }
}

/**
 * 获取等级年份
 */
async function getCreateYearFunc() {
  try {
    const res = await getCreateYear({ deptId: queryParam.value.deptId });
    if (res.success) {
      years.value = res.result;
      if (years.value) {
        year.value = years.value[0];
        getTopRightFunc();
      }
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('获取年份失败', error);
  }
}

/**
 * 顶部左侧
 */
async function getTopLeftFunc() {
  try {
    const res = await getTopLeft({ deptId: queryParam.value.deptId });
    if (res.success) {
      Object.assign(topLeft, res.result);
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('获取顶部左侧数据失败', error);
  }
}

/**
 * 顶部右侧
 */
async function getTopRightFunc() {
  try {
    const res = await getTopRight({ deptId: queryParam.value.deptId, year: year.value });
    if (res.success) {
      Object.assign(topRight, res.result);
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('获取顶部右侧数据失败', error);
  }
}

/**
 * 获取类型 碳资产类型 流水类型
 */
async function getTypeAndChildrenFunc() {
  try {
    const res = await getTypeAndChildren({
      pcode: 'A06',
      async: false,
    });
    if (res.success) {
      types.value = [];
      carbonAssetTypes.value = [];
      flowTypes.value = [];

      res.result.forEach((item: any) => {
        types.value.push({
          label: item.title,
          value: item.key,
          children: item.children,
        });

        item.children.forEach((item2: any) => {
          carbonAssetTypes.value.push({
            label: item.title + '-' + item2.title,
            value: item2.key,
            children: item2.children,
          });

          item2.children.forEach((item3: any) => {
            flowTypes.value.push({
              label: item.title + '-' + item2.title + '-' + item3.title,
              value: item3.key,
              children: item3.children,
            });
          });
        });
      });
    }
  } catch (error) {
    console.error('获取类型失败', error);
  }
}

/**
 * 获取碳资产类型
 */
function selectCarbonAssetTypes() {
  types.value.forEach((item) => {
    if (item.value === queryParam.value.typeId) {
      carbonAssetTypes.value = [];
      flowTypes.value = [];
      queryParam.value.carbonAssetTypeId = undefined;
      queryParam.value.flowTypeId = undefined;
      item.children.forEach((children: any) => {
        carbonAssetTypes.value.push({
          label: children.title,
          value: children.key,
          children: children.children,
        });
      });
    }
  });
}

/**
 * 获取流水方式
 */
function selectFlowTypes() {
  carbonAssetTypes.value.forEach((item) => {
    if (item.value === queryParam.value.carbonAssetTypeId) {
      flowTypes.value = [];
      queryParam.value.flowTypeId = undefined;
      item.children.forEach((children: any) => {
        flowTypes.value.push({
          label: children.title,
          value: children.key,
          children: children.children,
        });
      });
    }
  });
}

/**
 * 重置
 */
function searchReset() {
  Object.keys(queryParam.value).forEach((key) => {
    delete queryParam.value[key];
  });
  queryParam.value.deptId = selectedDeptId.value;
  queryParam.value.typeId = tab.value === '1' ? undefined : tab.value;
  loadData(1);
}

/**
 * 查询
 */
function searchQuery() {
  loadData(1);
}

/**
 * 切换状态选项事件
 * @param key
 */
function callback(key: string) {
  console.log('当前选中Tab:', key);
  if (key === '1') {
    queryParam.value.typeId = undefined;
  } else {
    queryParam.value.typeId = key;
  }
  console.log(types.value);
  console.log(queryParam.value, 'queryParam.value');
  if (queryParam.value.typeId) {
    carbonAssetTypes.value = [];
    flowTypes.value = [];
    types.value[0].children.forEach((item2: any) => {
      carbonAssetTypes.value.push({
        label: item2.title,
        value: item2.key,
        children: item2.children,
      });
      item2.children.forEach((item3: any) => {
        flowTypes.value.push({
          label: item2.title + '-' + item3.title,
          value: item3.key,
          children: item3.children,
        });
      });
    });
  } else {
    carbonAssetTypes.value = [];
    flowTypes.value = [];
    types.value.forEach((item) => {
      item.children.forEach((item2: any) => {
        carbonAssetTypes.value.push({
          label: item.label + '-' + item2.title,
          value: item2.key,
          children: item2.children,
        });
        item2.children.forEach((item3: any) => {
          flowTypes.value.push({
            label: item.label + '-' + item2.title + '-' + item3.title,
            value: item3.key,
            children: item3.children,
          });
        });
      });
    });
  }

  tab.value = key;
  searchQuery();
  console.log('当前列配置:', columns.value);
}

/* 图片预览 */
function getImgView(avatar: string) {
  try {
    if (avatar && avatar.startsWith('http')) {
      return avatar;
    } else {
      if (avatar && avatar.length > 0 && avatar.indexOf('[') == -1) {
        return window._CONFIG["domianURL"] + "/sys/common/static/" + avatar;
      }
    }
  } catch (err) {
    return;
  }
}

function handleEdit(record: any) {
  if (modalFormRef.value) {
    modalFormRef.value.edit(record);
    modalFormRef.value.title = t('carbon.message.Edit');
    modalFormRef.value.disableSubmit = false;
  }
}

function handleAdd() {
  if (modalFormRef.value) {
    modalFormRef.value.add();
    modalFormRef.value.title = t('carbon.message.Add');
    modalFormRef.value.disableSubmit = false;
  }
}

async function handleDelete(id: string) {
  try {
    const res = await deleteCarbonAssetFlow({ id: id });
    if (res.success) {
      console.log(res.message);
      loadData(1);
    } else {
      console.warn(res.message);
    }
  } catch (error) {
    console.error('删除失败', error);
  }
}

/**
 * 返回
 */
function onBack() {
  loadData(1);
}

//缩放
function onSizeLeft(value: boolean) {
  isAss.value = value;
}
</script>

<style lang="less" scoped>
@import '@/assets/less/common.less';

:deep(.ant-tabs-tab) {
  color: rgba(0, 0, 0, 0.6);
}

:deep(.ant-tree .ant-tree-node-selected) {
  background-color: #ecfff7 !important;
  color: #148958 !important;
}

.page-container {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.m_contentBox {
  padding: 24px;
  background: #f0f2f5;
}

.top-tree {
  background: #fff;
  position: relative;
  padding: 10px;
  border-right: 1px solid #e8e8e8;
  height: 10%;

  .select {
    margin-bottom: 10px;
  }
}

.sizeStyle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: -16px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;

  img {
    width: 16px;
    height: 16px;
  }
}

.sizeStyle1 {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 0px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;

  img {
    width: 16px;
    height: 16px;
  }
}

.right-content {
  flex: 1;
  min-width: 0; /* 解决flex子元素溢出问题 */
}

.text1 {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}
/* 设置所有行高度 */
.ant-table-row {
  height: 50px;
}

.tip {
  font-size: 12px;
  color: #777777;
  margin-left: auto;
  margin-right: 30px;
}

.totalOneCard {
  background-color: #e3f9e9;
  color: #148958;
  height: 32px;
  display: flex;
  align-items: center; /* 文字垂直居中 */
  border-radius: 3px;
}

.totalTwoCard {
  background-color: #fff1e9;
  color: #e37318;
  height: 32px;
  display: flex;
  align-items: center; /* 文字垂直居中 */
  margin-left: 20px;
  border-radius: 3px;
}

#carbonAssetTrend {
  height: 300px;
}

#assetHoldingAnalysis {
  height: 300px;
}
</style>
