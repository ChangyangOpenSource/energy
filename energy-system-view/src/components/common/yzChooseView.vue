<!-- 产品碳足迹-模型搭建-输入输出表单-选择因子 -->
<template>
  <div style="padding: 20px">
    <a-card :bordered="false" v-show="!isShowDetailPopup">
      <div class="laiyuan">{{ t('carbon.message.Source') }}：
        <a-checkbox-group
            v-model:value="queryParam.checkedList"
            :options="plainOptions"
            @change="onChangePlainOptions"
        />
      </div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam"  :labelCol="{ span: 7 }"
                :wrapperCol="{ span: 17 }" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Factor_name')">
                <a-input
                    v-model:value="queryParam.name"
                    allow-clear
                    :placeholder="t('carbon.message.Please_enter')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Product_classification')">
                <a-select
                    v-model:value="queryParam.productClassification"
                    allow-clear
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    :filter-option="filterOption"
                >
                  <a-select-option
                      :value="item.value"
                      v-for="(item,index) in product_typeData"
                      :key="index"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Applicable_scenario')">
                <a-input
                    v-model:value="queryParam.scene"
                    allow-clear
                    :placeholder="t('carbon.message.Please_enter')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Applicable_industries')">
                <a-select
                    v-model:value="queryParam.industryId"
                    allow-clear
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    :filter-option="filterOption"
                >
                  <a-select-option
                      :value="item.id"
                      v-for="(item,index) in industryData"
                      :key="index"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Release_country_organization')">
                <a-input
                    v-model:value="queryParam.ownership"
                    allow-clear
                    :placeholder="t('carbon.message.Please_enter')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Emission_factor_category')">
                <a-select
                    v-model:value="queryParam.category"
                    allow-clear
                    :placeholder="t('carbon.message.Please_enter')"
                    show-search
                    :filter-option="filterOption"
                >
                  <a-select-option
                      :value="item.value"
                      v-for="(item) in emission_factor_category"
                      :key="item.value"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="">
                <a-button type="primary" @click="searchQuery">{{ t('carbon.message.Search') }}</a-button>
                <a-button style="margin-left: 8px" @click="searchReset">{{ t('carbon.message.Reset') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="cardBox">
        <a-table
            ref="tableRef"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
            :columns="columns"
            :data-source="dataSource"
            :loading="loading"
            :pagination="ipagination"
            :scroll="{ x: true }"
            :bordered="false"
            class=""
            row-key="id"
            size="middle"
            @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'factorValue'">
              <div>{{ (Number(record.factorValue)).toFixed(4) }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'unit'">
              <div>{{ record.numeratorUnit }}/{{ record.denominatorUnit }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'type'">
              <div v-if="record.type == 1">{{ t('carbon.message.Carbon_emission_factor_library') }}</div>
              <div v-if="record.type == 2">{{ t('carbon.message.Tissue_factor_library') }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <div class="m_cbFlex" style="padding: 0 5px;">
                <a @click="onDetail(record)">{{ t('carbon.message.Detail') }}</a>
                <a-popconfirm
                    :title="t('carbon.message.collect')"
                    :cancel-text="t('carbon.message.Cancel')"
                    :ok-text="t('carbon.message.Confirm')"
                    @confirm="() => onCollect(record)"
                    v-if="record.collectStatus === '0' && record.type == 1"
                >
                  <a>{{ t('carbon.message.collect') }}</a>
                </a-popconfirm>
                <a-popconfirm
                    :title="t('carbon.message.Cancel_collect')"
                    :cancel-text="t('carbon.message.Cancel')"
                    :ok-text="t('carbon.message.Confirm')"
                    @confirm="() => onCollect(record)"
                    v-if="record.collectStatus === '1' && record.type == 1"
                >
                  <a>{{ t('carbon.message.Cancel_collect') }}</a>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
    <!-- 详情弹窗 -->
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <tpyzDetail ref="tpyzDetailRef" @back="back"></tpyzDetail>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { cloneObject } from '/@/utils/index';
import tpyzDetail from './tpyzDetail.vue';
import { INDUSTRY } from './constKey';
// 导入API方法
import {
  getPrivateFactorList,
  addFactorCollect,
  deleteFactorCollect,
  getChildList,
  getDictItems
} from './api/yzChooseView.api';
import {BasicForm} from "@/components/Form";

const { t } = useI18n();
const { createMessage } = useMessage();

// 定义 emits
const emit = defineEmits(['onselectedRows']);

// Refs
const tableRef = ref();
const tpyzDetailRef = ref();

// 响应式数据
const selectedRowKeys = ref([]);
const isShowDetailPopup = ref(false);
const loading = ref(false);
const dataSource = ref([]);

const queryParam = reactive({
  checkedList: [],
  emissionFactorOption: 0, // 碳排因子库
  privateFactorOption: 0, // 组织因子库
  myFactorOption: 0, // 我的收藏
  state: 1, // 发布状态
  name: '',
  productClassification: undefined,
  scene: '',
  industryId: undefined,
  ownership: '',
  category: undefined,
});

const plainOptions = [
  { label: t('carbon.message.UK_GHG_conversion_factors'), value: "1" },
  { label: t('carbon.message.IPCC_Emission_Source_Database'), value: "2" },
  { label: t('carbon.message.Taiwan_Greenhouse_Gas_Inventory_Database'), value: "3" },
  { label: t('carbon.message.Carbon_Footprint_Database_of_Taiwan_EPA'), value: "4" },
  { label: t('carbon.message.China_Life_Cycle_GHG_Emission_Factor_Database'), value: "5" },
  { label: t('carbon.message.In_house_Database'), value: "8" },
  { label: t('carbon.message.Tissue_factor_library'), value: "9" },
  { label: t('carbon.message.my_collection'), value: "10" },
];

const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30"],
  showTotal: (total: number, range: number[]) => {
    return `${range[0]}-${range[1]} 共${total}条`;
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
});

const columns = [
  {
    title: t('carbon.message.Emission_factor_database'),
    align: 'center',
    dataIndex: 'emissionFactorDatabase_dictText',
  },
  {
    title: t('carbon.message.Factor_name'),
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: t('carbon.message.Factor_value'),
    align: 'center',
    dataIndex: 'factorValue',
  },
  {
    title: t('carbon.message.Unit'),
    align: 'center',
    dataIndex: 'unit',
  },
  {
    title: t('carbon.message.Product_classification'),
    align: 'center',
    dataIndex: 'productClassification_dictText',
  },
  {
    title: t('carbon.message.Applicable_scenario'),
    align: 'center',
    dataIndex: 'scene',
  },
  {
    title: t('carbon.message.Applicable_industries'),
    align: 'center',
    dataIndex: 'industry',
  },
  {
    title: t('carbon.message.Release_organization'),
    align: 'center',
    dataIndex: 'releaseOrg',
  },
  {
    title: t('carbon.message.Release_date'),
    align: 'center',
    dataIndex: 'releaseYear',
    sorter: (a: any, b: any) => a.releaseYear - b.releaseYear,
  },
  {
    title: t('carbon.message.Release_country_organization'),
    align: 'center',
    dataIndex: 'ownership',
  },
  {
    title: t('carbon.message.Emission_factor_category'),
    align: 'center',
    dataIndex: 'category_dictText',
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 120,
  }
];

// 选项数据
const fmData = ref([]); // 分母选项数据
const industryData = ref([]); // 行业数据
const product_typeData = ref([]); // 产品类型数据
const emission_factor_category = ref([]); // 排放因子分类数据
const emission_factor_database = ref([]); // 排放因子数据库数据

// 生命周期
onMounted(() => {
  getData(1);
  getOption();
});

/**
 * 收藏碳排因子
 */
const onCollect = (item: any) => {
  if (item.collectStatus === "1") {
    // 取消收藏
    deleteFactorCollect({
      id: item.id,
    }).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.delete_collect_success'));
        getData(1);
      }
    });
  } else if (item.collectStatus === "0") {
    // 收藏
    addFactorCollect({
      id: item.id,
    }).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.collect_success'));
        getData(1);
      }
    });
  }
};

/**
 * 表格选择因子
 * @param selectedRowKeys
 * @param selectedRows
 */
const onSelectChange = (selectedRowKeysVal: any[], selectedRows: any[]) => {
  console.log('onSelectChange', selectedRowKeysVal, selectedRows);
  if (selectedRowKeysVal.length == 1 || selectedRowKeysVal.length < 1) {
    selectedRowKeys.value = selectedRowKeysVal;
    emit("onselectedRows", selectedRows[0]);
  }
};

/**
 * 来源筛选
 * @param e
 */
const onChangePlainOptions = (e: any) => {
  if (queryParam.checkedList.indexOf("9") != -1) {
    queryParam.privateFactorOption = 1;
  } else {
    queryParam.privateFactorOption = 0;
  }
  if (queryParam.checkedList.indexOf("10") != -1) {
    queryParam.myFactorOption = 1;
  } else {
    queryParam.myFactorOption = 0;
  }
  getData(1);
};

/**
 * 详情
 */
const onDetail = (item: any) => {
  console.log('onDetail', item);
  isShowDetailPopup.value = true;
  setTimeout(() => {
    console.log("onDetail", tpyzDetailRef.value);
    if (tpyzDetailRef.value) {
      tpyzDetailRef.value.detailIndex = 0;
      tpyzDetailRef.value.detailKeys = [item.id];
      tpyzDetailRef.value.getData();
    }
  }, 0);
};

/**
 * 查询
 */
const searchQuery = () => {
  console.log("searchQuery");
  getData(1);
};

/**
 * 重置
 */
const searchReset = () => {
  console.log("searchReset");
  Object.assign(queryParam, {
    checkedList: [],
    emissionFactorOption: 0, // 碳排因子库
    privateFactorOption: 0, // 组织因子库
    myFactorOption: 0, // 我的收藏
    name: '',
    productClassification: undefined,
    scene: '',
    industryId: undefined,
    ownership: '',
    category: undefined,
  });
  getData(1);
};

/**
 * 表格分页
 * @param pagination
 */
const handleTableChange = (pagination: any) => {
  console.log(pagination);
  Object.assign(ipagination, pagination);
  getData();
};

const getData = (page?: number) => {
  // 表格数据
  if (page === 1) {
    ipagination.current = 1;
  }
  loading.value = true;

  const reqData = cloneObject(queryParam);
  reqData.pageNo = ipagination.current;
  reqData.pageSize = ipagination.pageSize;

  getPrivateFactorList(reqData).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records || [];
      ipagination.total = res.result.total;
    }
  }).finally(() => {
    loading.value = false;
  });
};

const getOption = () => {
  // 行业
  getChildList({
    pid: INDUSTRY,
  }).then((res) => {
    if (res.success) {
      industryData.value = res.result || [];
    }
  });

  // 产品类型
  getDictItems({
    dictCode: 'product_type'
  }).then((res) => {
    product_typeData.value = res || [];
    console.log('getDictItems product_type =>', res);
  });

  // 排放因子种类
  getDictItems({
    dictCode: 'emission_factor_category'
  }).then((res) => {
    emission_factor_category.value = res || [];
    console.log('getDictItems document_type =>', res);
  });

  // 碳排因子数据库
  getDictItems({
    dictCode: 'emission_factor_database'
  }).then((res) => {
    emission_factor_database.value = res || [];
    console.log('getDictItems document_type =>', res);
  });
};

/**
 * 下拉框数据过滤
 */
const filterOption = (input: string, option: any) => {
  return (
      option.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
};

const back = () => {
  isShowDetailPopup.value = false;
  getData(1);
};
</script>

<style lang="less" scoped>
:deep(.ant-card-body) {
  background: #f5f8f7;
  padding: 0;
}

:deep(.table-page-search-wrapper) {
  padding: 24px 24px 4px;
  background: #F3F3F3;
}

:deep(.table-page-search-wrapper .ant-form-inline .ant-form-item) {
  margin-bottom: 20px !important;
}

.laiyuan {
  background: #ffffff;
  height: 30px;
}

.cardBox {
  background: #ffffff;
  border-radius: 3px;
}
</style>
