<!-- 产品碳足迹-模型搭建-输入输出表单-选择因子 -->

<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Form_Label_SupplierName')">
                <a-select
                    v-model:value="queryParam.supplierId"
                    allowClear
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    :filter-option="filterOption"
                >
                  <a-select-option
                      :value="item.id"
                      v-for="(item, index) in industryData"
                      :key="index"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.FillName')">
                <a-input
                    v-model:value="queryParam.fillInName"
                    allowClear
                    :placeholder="t('carbon.message.Please_enter')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="t('carbon.message.Product_name')">
                <a-input
                    v-model:value="queryParam.productName"
                    allowClear
                    :placeholder="t('carbon.message.Please_enter')"
                ></a-input>
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
            rowKey="id"
            size="middle"
            @change="handleTableChange"
        >
          <template #action="{ record }">
            <div style="padding: 0 5px;">
              <a @click="onDetail(record)">{{ t('carbon.message.Examine') }}</a>
            </div>
          </template>
        </a-table>
      </div>
    </a-card>

    <!-- 详情弹窗 -->
    <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :title="t('carbon.message.Detail')"
        :visible="isShowDetailPopup"
        :width="1200"
        @close="onClose"
    >
      <CySupplierCarbonDataForm
          ref="cySupplierCarbonDataFormRef"
          :disabled="true"
          @back="back"
      ></CySupplierCarbonDataForm>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { cloneObject } from '/@/utils/index';
import { getAllSupplierCarbonData, getAllSuppliers } from './api/supplier.api';
import CySupplierCarbonDataForm from './CySupplierCarbonDataForm.vue';
import { INDUSTRY } from '@/common/constKey';

// 国际化
const { t } = useI18n();

// Refs
const tableRef = ref<any>(null);
const cySupplierCarbonDataFormRef = ref<any>(null);

// Reactive data
const selectedRowKeys = ref<string[]>([]);
const checkedList = ref<string[]>([]);
const plainOptions = ref([
  { label: t('carbon.message.Carbon_emission_factor_library'), value: "1" },
  { label: t('carbon.message.Tissue_factor_library'), value: "2" },
  { label: t('carbon.message.my_collection'), value: "3" },
]);

const loading = ref(false);
const queryParam = reactive({
  fillInName: '', // 填报名称
  supplierId: null, // supplierId
  productName: '', // 供应商产品id
});

const columns = [
  {
    title: t('carbon.message.Form_Label_SupplierName'),
    align: "center",
    dataIndex: "fillInUserId_dictText",
  },
  {
    title: t('carbon.message.Product_name'),
    align: "center",
    dataIndex: "supplierProductId_dictText",
  },
  {
    title: t('carbon.message.carbonEmissionData'),
    align: "center",
    dataIndex: "carbonEmissions",
  },
  {
    title: t('carbon.message.dataAuditTime'),
    align: "center",
    dataIndex: "updateTime",
  },
  {
    title: t('carbon.message.reviewer'),
    align: "center",
    dataIndex: "promoterId_dictText",
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: "action",
    align: "center",
    fixed: "right",
    width: 140,
    slots: { customRender: "action" },
  }
];

const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30"],
  showTotal: (total: number, range: number[]) => {
    return range[0] + "-" + range[1] + " 共" + total + "条";
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
});

const dataSource = ref<any[]>([]); // 表格数据
const isShowDetailPopup = ref(false); // 详情弹窗
const industryData = ref<any[]>([]); // 行业数据

// Methods
const onClose = () => {
  isShowDetailPopup.value = false;
};

/**
 * 表格选择因子
 * @param selectedRowKeys
 * @param selectedRows
 */
const onSelectChange = (selectedRowKeys: string[], selectedRows: any[]) => {
  if (selectedRowKeys.length == 1 || selectedRowKeys.length < 1) {
    selectedRowKeys.value = selectedRowKeys;
    // Emit the first selected row
    if (selectedRows.length > 0) {
      emit("onselectedRows", selectedRows[0]);
    }
  }
};

/**
 * 来源筛选
 * @param e
 */
const onChangePlainOptions = (e: any) => {
  getData(1);
};

/**
 * 详情
 */
const onDetail = (item: any) => {
  isShowDetailPopup.value = true;
  cySupplierCarbonDataFormRef.value?.edit(item);
};

/**
 * 查询
 */
const searchQuery = () => {
  getData(1);
};

/**
 * 重置
 */
const searchReset = () => {
  Object.assign(queryParam, {
    fillInName: '', // 填报名称
    supplierId: null, // supplierId
    productName: '', // 供应商产品id
  });
  checkedList.value = [];
  getData(1);
};

/**
 * 表格分页
 * @param pagination
 */
const handleTableChange = (pagination: any) => {
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

  getAllSupplierCarbonData(reqData).then((res) => {
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
  getAllSuppliers({ pid: INDUSTRY }).then((res) => {
    if (res.success) {
      industryData.value = res.result || [];
    }
  });
};

/**
 * 下拉框数据过滤
 */
const filterOption = (input: string, option: any) => {
  return (option.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
};

const back = () => {
  isShowDetailPopup.value = false;
  getData(1);
};

// Lifecycle
onMounted(() => {
  getData(1);
  getOption();
});

// Emits
const emit = defineEmits(['onselectedRows']);
</script>

<style lang="less" scoped>
/deep/ .ant-card-body {
  background: #f5f8f7;
  padding: 0;
}

/deep/ .table-page-search-wrapper {
  padding: 24px 24px 4px;
  background: #F3F3F3;
}

/deep/ .table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 20px !important;
}

.laiyuan {
  padding: 24px 0 16px 0;
  display: flex;
  justify-content: end;
  background: #ffffff;
}

.cardBox {
  background: #ffffff;
  border-radius: 3px;
}
</style>
