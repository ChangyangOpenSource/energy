<template>
  <div class="m_contentBox">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <!-- 填报名称 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.FillName')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
              >
                <a-input
                  style="width: 200px"
                  :placeholder="t('carbon.message.EnterFillName')"
                  v-model:value="queryParam.fillInName"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <!-- 供应商名称 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.Form_Label_SupplierName')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
              >
                <a-select
                  option-filter-prop="children"
                  v-model:value="queryParam.fillInUserId"
                  :placeholder="t('carbon.message.SelectSupplier')"
                  show-search
                  style="width: 200px"
                  @change="supplierChange"
                >
                  <a-select-option v-for="supplier in supplierList" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- 填报类型 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.FillInType')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
              >
                <a-select
                  ref="selectRef"
                  v-model:value="queryParam.fillInType"
                  :placeholder="t('carbon.message.SelectFillInType')"
                  style="width: 200px"
                >
                  <a-select-option v-for="typeItem in fillInTypeList" :key="typeItem.id" :value="typeItem.id">
                    {{ typeItem.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- 发起填报来源 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.InitiateSource')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
              >
                <a-select
                  ref="selectRef"
                  v-model:value="queryParam.fillInSource"
                  :placeholder="t('carbon.message.SelectInitiateSource')"
                  style="width: 200px"
                >
                  <a-select-option v-for="sourceItem in fillInSourceList" :key="sourceItem.id" :value="sourceItem.id">
                    {{ sourceItem.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>




      <!-- 查询区域-END -->

      <!-- 操作按钮区域 -->
      <div class="table-operator" style="margin-top: 15px">
        <a-button type="primary" @click="searchQuery" pre-icon="ant-design:search-outlined">{{ t('carbon.message.Search') }}</a-button>
        <a-button type="primary" @click="searchReset" pre-icon="ant-design:reload-outlined" style="margin-left: 8px; margin-right: 8px">{{ t('carbon.message.Reset') }}</a-button>
        <a-button @click="handleAdd" type="primary" pre-icon="ant-design:plus-outlined">{{ t('carbon.message.InitiateCarbonFilling') }}</a-button>

        <!-- 状态tab -->
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.key"
            :tab="`${tab.tab} (${countMap[tab.key] || 0})`">
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="tableRef"
          size="middle"
          :scroll="{x:true}"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">

          <template v-slot:bodyCell="{ column, record, index, text }">
            <template v-if="column.dataIndex === 'fillInType'">
              <div v-if="record.fillInType == 1">{{ t('carbon.message.ProductCarbonFootprint') }}</div>
              <div v-if="record.fillInType == 2">{{ t('carbon.message.OrganizationCarbonInventory') }}</div>
            </template>

            <template v-if="column.dataIndex === 'fillInStatus'">
              <div style="display: flex; justify-content: center">
                <JTag text="待填报" color="blue" v-if="record.fillInStatus == 1"/>
                <JTag text="待审核" color="orange" v-if="record.fillInStatus == 3"/>
                <JTag text="审核通过" color="green" v-if="record.fillInStatus == 4"/>
                <JTag text="已驳回" color="red" style="margin:0px 3px 0px 0px" v-if="record.fillInStatus == 5"/>
                <img style="margin-left: 5px; object-fit: contain;" v-if="record.fillInStatus == 5" src="@/assets/img/img86.png" alt="record.rejectReason" :title="record.rejectReason" />
              </div>
            </template>

            <template v-if="column.dataIndex === 'fillInSource'">
              <div v-if="record.fillInSource == 1">{{ t('carbon.message.ProductCarbonFootprint') }}</div>
              <div v-if="record.fillInSource == 2">{{ t('carbon.message.OrganizationCarbonInventory') }}</div>
              <div v-if="record.fillInSource == 3">{{ t('carbon.message.SupplyChainManagement') }}</div>
            </template>

            <template v-if="column.dataIndex === 'action'">
              <a v-if="record.fillInStatus == 3" @click="openDetailModelByEdit(record)">{{ t('carbon.message.GoToReview') }}</a>
              <a v-else @click="openDetailModel(record)">{{ t('carbon.message.Examine') }}</a>
            </template>
          </template>

        </a-table>
      </div>

            <CySupplierCarbonDataModal ref="modalFormRef" @ok="modalFormOk" />

      <!-- 详情model -->
            <CySupplierCarbonDataDetailModal ref="detailModalFormRef" @ok="modalFormOk" />
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import JTag from "@/components/jeecg/JTag.vue";
import CySupplierCarbonDataModal from './modules/CySupplierCarbonDataModal.vue'
import CySupplierCarbonDataDetailModal from './modules/CySupplierCarbonDataDetailModal.vue'

// 使用 i18n
const { t } = useI18n()

// 引用模板元素
const tableRef = ref()
const modalFormRef = ref()
const detailModalFormRef = ref()
const selectRef = ref()

// 数据定义
const queryParam = reactive({
  fillInStatus: 1,
  requestSourceCode: 1
})
const dataSource = ref([])
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const loading = ref(false)
const countMap = ref({})
const tabs = ref([
  { key: "1", tab: t('carbon.message.ToBeFilled') },
  { key: "3", tab: t('carbon.message.ToBeReviewed') },
  { key: "4", tab: t('carbon.message.Approved') },
  { key: "5", tab: t('carbon.message.Rejected') },
  { key: "-1", tab: t('carbon.message.All') }
])
const fillInTypeList = ref([
  { id: "1", text: t('carbon.message.ProductCarbonFootprint') },
  { id: "2", text: t('carbon.message.OrganizationCarbonInventory') }
])
const fillInSourceList = ref([
  { id: "1", text: t('carbon.message.ProductCarbonFootprint') },
  { id: "2", text: t('carbon.message.OrganizationCarbonInventory') },
  { id: "3", text: t('carbon.message.SupplyChainManagement') }
])
const supplierList = ref([])
const supplierProductList = ref([])

// 表头定义
const columns = computed(() => [
  {
    title: t('carbon.message.Form_Label_SupplierName'),
    align: 'center',
    dataIndex: 'fillInUserId_dictText'
  },
  {
    title: t('carbon.message.FillInType'),
    align: 'center',
    dataIndex: 'fillInType'
  },
  {
    title: t('carbon.message.InitiateSource'),
    align: 'center',
    dataIndex: 'fillInSource'
  },
  {
    title: t('carbon.message.FillName'),
    align: 'center',
    dataIndex: 'fillInName'
  },
  {
    title: t('carbon.message.DataFillingStatus'),
    align: 'center',
    dataIndex: 'fillInStatus'
  },
  {
    title: t('carbon.message.Initiator'),
    align: 'center',
    dataIndex: 'promoterId_dictText'
  },
  {
    title: t('carbon.message.InitiateTime'),
    align: 'center',
    dataIndex: 'promoteTime'
  },
  {
    title: t('carbon.message.Informant'),
    align: 'center',
    dataIndex: 'fillInUserId_dictText'
  },
  {
    title: t('carbon.message.FillInTime'),
    align: 'center',
    dataIndex: 'fillInTime'
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 147
  }
])

const url = {
  list: "/cySupplierCarbonData/fillInList",
  delete: "/cySupplierCarbonData/delete",
  deleteBatch: "/cySupplierCarbonData/deleteBatch",
  exportXlsUrl: "/cySupplierCarbonData/exportXls",
  importExcelUrl: "cySupplierCarbonData/importExcel",
  dataRecordCount: "/cySupplierCarbonData/dataRecordCount",
  getAllSupplier: "/supplier/all",
  getSupplierProductList: "/supplierProductRelation/supplierProductList"
}



const modalFormOk = () => {
  // 新增/修改 成功时，重载列表
  searchQuery()
  // 清空列表选中
  onClearSelected()
}

const supplierChange = (supplierId) => {
  if (supplierId != null && supplierId != undefined && supplierId != '') {
    defHttp.get({ url: url.getSupplierProductList, params: { supplierId: supplierId, status: 1 } }, { isTransformResponse: false}).then((res) => {
      supplierProductList.value = res.result
    })
  } else {
    supplierProductList.value = []
  }
}

const getAllSupplier = () => {
  defHttp.get({ url: url.getAllSupplier }, { isTransformResponse: false}).then((res) => {
    supplierList.value = res.result
  })
}

const dataRecordCount = () => {
  defHttp.get({ url: url.dataRecordCount, params: queryParam }, { isTransformResponse: false}).then((res) => {
    countMap.value = res.result
  })
}

const handleTableChange = (pag, filters, sorter) => {
  // 处理表格变化
  if (pag) {
    ipagination.current = pag.current
    ipagination.pageSize = pag.pageSize
  }
  loadData()
}

const callback = (key) => {
  // 如果传递-1代表查询全部
  if (key == -1) {
    queryParam.fillInStatus = null
  } else {
    queryParam.fillInStatus = key
  }
  searchQuery()
}

const searchReset = () => {
  // 记录选项卡状态
  const key = queryParam.fillInStatus
  Object.keys(queryParam).forEach(key => {
    delete queryParam[key]
  })
  queryParam.fillInStatus = key
  queryParam.requestSourceCode = 1
  searchQuery()
}

const openDetailModelByEdit = (record) => {
  detailModalFormRef.value.edit(record)
  detailModalFormRef.value.title = t('carbon.message.SupplierCarbonDetailReview')
  detailModalFormRef.value.disableSubmit = true
  detailModalFormRef.value.buttonDisabled = false
}

const openDetailModel = (record) => {
  detailModalFormRef.value.edit(record)
  detailModalFormRef.value.title = t('carbon.message.SupplierCarbonDetail')
  detailModalFormRef.value.disableSubmit = true
  detailModalFormRef.value.buttonDisabled = true
}

const handleAdd = () => {
  modalFormRef.value.add()
  modalFormRef.value.title = t('carbon.message.InitiateCarbonFilling')
  modalFormRef.value.disableSubmit = false
}

const searchQuery = () => {
  loadData(1)
  // 点击查询清空列表选中行
  dataRecordCount()
}

const loadData = (arg) => {
  if (!url.list) {
    console.error("请设置url.list属性!")
    return
  }
  // 加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1
  }
  const params = getQueryParams() // 查询条件
  loading.value = true
  defHttp.get({ url: url.list, params }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
      dataSource.value = res.result.records || res.result
      if (res.result.total) {
        ipagination.total = res.result.total
      } else {
        ipagination.total = 0
      }
      // update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
    } else {
      console.warn(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
}

const getQueryParams = () => {
  return {
    ...queryParam,
    pageNo: ipagination.current,
    pageSize: ipagination.pageSize
  }
}

const onClearSelected = () => {}

// 生命周期钩子
onMounted(() => {
  dataRecordCount()
  getAllSupplier()
  searchQuery();
})
</script>

<style scoped>
.m_contentBox {
  padding: 24px;
  background: #f0f2f5;
}
</style>
