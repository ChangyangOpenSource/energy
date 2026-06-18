<template>
  <div class="m_contentBox">
    <a-card :bordered="false" v-show="!detailModalShowFlag">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item :label="t('carbon.message.CustomerName')"
                           :labelCol="{ span: 10 }"
                           :wrapperCol="{ span: 14 }">
                <a-input v-model:value="queryParam.promoterUserName" :placeholder="t('carbon.message.EnterCustomerName')" allowClear />
              </a-form-item>
            </a-col>

            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item :label="t('carbon.message.FillName')"
                 :labelCol="{ span: 10 }"
                 :wrapperCol="{ span: 14 }">
                <a-input v-model:value="queryParam.fillInName" :placeholder="t('carbon.message.EnterFillName')" allowClear />
              </a-form-item>
            </a-col>

            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item :label="t('carbon.message.Product_name')"
                 :labelCol="{ span: 10 }"
                 :wrapperCol="{ span: 14 }">
                <a-input v-model:value="queryParam.productName" :placeholder="t('carbon.message.EnterProductName')" allowClear />
              </a-form-item>
            </a-col>

            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery" >{{ t('carbon.message.Search') }}</a-button>
              <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset"  style="margin-left: 8px">{{ t('carbon.message.Reset') }}</a-button>
            </a-col>

          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->

      <!-- 操作按钮区域 -->
      <div class="table-operator" style="margin-top: 10px">
        <!-- 状态tab -->
        <a-tabs :active-key="activeTabKey" @change="callback">
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

          <template #fillInTypeSlot="{ text, record }">
            <div v-if="record.fillInType == 1">{{ t('carbon.message.Product_carbon_footprint') }}</div>
            <div v-if="record.fillInType == 2">{{ t('carbon.message.Organization_carbon_inventory') }}</div>
          </template>

          <template #fillInStatusSlot="{ record }">
            <div style="display: flex; justify-content: center">
              <j-tag text="待填报" color="blue" v-if="record.fillInStatus == 1" />
              <j-tag text="填报中" color="blue" v-if="record.fillInStatus == 2" />
              <j-tag text="待审核" color="orange" v-if="record.fillInStatus == 3" />
              <j-tag text="审核通过" color="green" v-if="record.fillInStatus == 4" />
              <j-tag text="已驳回待修改" color="red" style="margin:0px 3px 0px 0px" v-if="record.fillInStatus == 5" />
              <img style="object-fit: contain;" v-if="record.fillInStatus == 5" :src="img86"
                   :alt="record.rejectReason" :title="record.rejectReason">
            </div>
          </template>

          <template #fillInSourceSlot="{ record }">
            <div v-if="record.fillInSource == 1">{{ t('carbon.message.Product_carbon_footprint') }}</div>
            <div v-if="record.fillInSource == 2">{{ t('carbon.message.Organization_carbon_inventory') }}</div>
            <div v-if="record.fillInSource == 3">{{ t('carbon.message.Supply_chain_management') }}</div>
          </template>

          <template #htmlSlot="{ text }">
            <div v-html="text"></div>
          </template>

          <template #imgSlot="{ text, record }">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">{{ t('carbon.message.No_image') }}</span>
            <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;" />
          </template>

          <template #fileSlot="{ text }">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">{{ t('carbon.message.No_file') }}</span>
            <a-button
              v-else
              :ghost="true"
              type="primary"
              icon="download"
              size="small"
              @click="downloadFile(text)">
              {{ t('carbon.message.Download') }}
            </a-button>
          </template>

          <template #action="{ record }">
            <a v-if="[1, 2, 5].includes(record.fillInStatus)" @click="openDetailModelByEdit(record)">{{ t('carbon.message.GoFill') }}</a>
            <a v-else @click="openDetailModel(record)">{{ t('carbon.message.Examine') }}</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <!-- 详情model -->
    <div v-show="detailModalShowFlag">
      <CySupplierCarbonDataDetailModal
        ref="detailModalFormRef"
        @ok="modalFormOk"
        @goBack="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import '@/assets/less/TableExpand.less'
import CySupplierCarbonDataDetailModal from './modules/CySupplierCarbonDataDetailModal.vue'
import JTag from '@/components/jeecg/JTag.vue'
import img86 from '@/assets/img/img86.png'

// 获取当前实例和国际化
const { proxy } = getCurrentInstance()
const { t } = useI18n()

// 引用元素
const tableRef = ref(null)
const detailModalFormRef = ref(null)

// 响应式数据
const description = ref('供应商碳数据管理管理页面')
const detailModalShowFlag = ref(false)
const activeTabKey = ref('1')
const loading = ref(false)
const selectedRowKeys = ref([])
const selectionRows = ref([])

// 分页配置
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return t('carbon.message.total', { total: total })
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
})

// 查询参数
const queryParam = reactive({
  fillInStatus: 1,
  requestSourceCode: 2,
  promoterUserName: '',
  fillInName: '',
  productName: ''
})

// 数据源
const dataSource = ref([])

// URL配置
const url = {
  list: "/cySupplierCarbonData/fillInList",
  delete: "/cySupplierCarbonData/delete",
  deleteBatch: "/cySupplierCarbonData/deleteBatch",
  exportXlsUrl: "/cySupplierCarbonData/exportXls",
  importExcelUrl: "cySupplierCarbonData/importExcel",
  dataRecordCount: "/cySupplierCarbonData/dataRecordCount",
  getAllSupplier: "/supplier/all",
  getSupplierProductList: "/supplierProductRelation/supplierProductList",
}

// 字典选项和字段列表
const dictOptions = ref({})
const superFieldList = ref([])

// 统计数据map
const countMap = ref({})

// Tabs配置
const tabs = [
  { key: "1", tab: t('carbon.message.ToBeFilled') },
  { key: "2", tab: t('carbon.message.FillingIn') },
  { key: "3", tab: t('carbon.message.ToBeReviewed') },
  { key: "4", tab: t('carbon.message.Approved') },
  { key: "5", tab: t('carbon.message.Rejected') },
  { key: "-1", tab: t('carbon.message.All') }
]

// 供应商列表
const supplierList = ref([])
const supplierProductList = ref([])

// 表格列定义
const columns = [
  {
    title: t('carbon.message.CustomerName'),
    align: "center",
    dataIndex: 'promoterId_dictText'
  },
  {
    title: t('carbon.message.FillInType'),
    align: "center",
    dataIndex: 'fillInType',
    slots: { customRender: 'fillInTypeSlot' }
  },
  {
    title: t('carbon.message.Product_name'),
    align: "center",
    dataIndex: 'supplierProductId_dictText'
  },
  {
    title: t('carbon.message.FillName'),
    align: "center",
    dataIndex: 'fillInName'
  },
  {
    title: t('carbon.message.TaskStatus'),
    align: "center",
    dataIndex: 'fillInStatus',
    slots: { customRender: 'fillInStatusSlot' }
  },
  {
    title: t('carbon.message.Inviter'),
    align: "center",
    dataIndex: 'fillInUserId_dictText'
  },
  {
    title: t('carbon.message.InviterPhone'),
    align: "center",
    dataIndex: 'promoterPhone'
  },
  {
    title: t('carbon.message.InviterEmail'),
    align: "center",
    dataIndex: 'promoterEmail'
  },
  {
    title: t('carbon.message.Invitation_time'),
    align: "center",
    dataIndex: 'promoteTime'
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: "center",
    fixed: "right",
    width: 147,
    slots: { customRender: 'action' }
  }
]

// 计算属性
const importExcelUrl = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`
})

// 方法定义
const goBack = () => {
  detailModalShowFlag.value = false
  searchQuery()
}

const supplierChange = (supplierId) => {
  if (supplierId) {
    defHttp.get({
      url: url.getSupplierProductList,
      params: { supplierId: supplierId, status: 1 }
    }, { isTransformResponse: false}).then((res) => {
      supplierProductList.value = res.result
    })
  } else {
    supplierProductList.value = []
  }
}

const getAllSupplier = () => {
  defHttp.get({
    url: url.getAllSupplier
  }, { isTransformResponse: false}).then((res) => {
    supplierList.value = res.result
  })
}

const dataRecordCount = () => {
  defHttp.get({
    url: url.dataRecordCount,
    params: queryParam
  }, { isTransformResponse: false}).then((res) => {
    countMap.value = res.result
  })
}

const callback = (key) => {
  activeTabKey.value = key
  if (key == -1) {
    queryParam.fillInStatus = null
  } else {
    queryParam.fillInStatus = key
  }
  searchQuery()
}

const searchReset = () => {
  const key = queryParam.fillInStatus
  Object.assign(queryParam, {
    fillInStatus: key,
    requestSourceCode: 2,
    promoterUserName: '',
    fillInName: '',
    productName: ''
  })
  searchQuery()
}

const openDetailModel = (record) => {
  detailModalFormRef.value.edit(record)
  detailModalShowFlag.value = true
  detailModalFormRef.value.disableSubmit = true
}

const openDetailModelByEdit = (record) => {
  detailModalFormRef.value.edit(record)
  detailModalShowFlag.value = true
  detailModalFormRef.value.disableSubmit = false
}

const searchQuery = () => {
  loadData(1)
  selectedRowKeys.value = []
  selectionRows.value = []
  dataRecordCount()
}

const loadData = (arg) => {
  if (!url.list) {
    proxy.$message.error("请设置url.list属性!")
    return
  }

  if (arg === 1) {
    ipagination.current = 1
  }

  loading.value = true

  // 这里需要根据实际的getQueryParams实现来调整
  const params = {
    ...queryParam,
    page: ipagination.current,
    pageSize: ipagination.pageSize
  }

  defHttp.get({
    url: url.list,
    params: params
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records || res.result
      if (res.result.total) {
        ipagination.total = res.result.total
      } else {
        ipagination.total = 0
      }
    } else {
      proxy.$message.warning(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
}

const initDictConfig = () => {
  // 空实现
}

const getSuperFieldList = () => {
  const fieldList = []
  fieldList.push({ type: 'string', value: 'organizationId', text: '组织ID', dictCode: '' })
  fieldList.push({ type: 'string', value: 'deptId', text: '部门ID', dictCode: '' })
  fieldList.push({ type: 'string', value: 'supplierId', text: '供应商id', dictCode: '' })
  fieldList.push({ type: 'string', value: 'supplierProductId', text: '供应商产品id', dictCode: '' })
  fieldList.push({ type: 'string', value: 'fillInRemark', text: '填报备注', dictCode: '' })
  fieldList.push({ type: 'int', value: 'fillInType', text: '填报类型', dictCode: '' })
  fieldList.push({ type: 'int', value: 'fillInSource', text: '发起填报来源', dictCode: '' })
  fieldList.push({ type: 'string', value: 'fillInName', text: '填报名称', dictCode: '' })
  fieldList.push({ type: 'int', value: 'fillInStatus', text: '数据填报状态', dictCode: '' })
  fieldList.push({ type: 'string', value: 'promoterId', text: '发起人id', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'promoteTime', text: '发起时间' })
  fieldList.push({ type: 'string', value: 'fillInUserId', text: '填报人id', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'fillInTime', text: '填报时间' })
  fieldList.push({ type: 'string', value: 'calculateYear', text: '核算年份', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'calculateBeginTime', text: '核算周期开始时间' })
  fieldList.push({ type: 'datetime', value: 'calculateEndTime', text: '核算周期结束时间' })
  fieldList.push({ type: 'BigDecimal', value: 'carbonEmissions', text: '碳排放量', dictCode: '' })
  fieldList.push({ type: 'string', value: 'carbonEmissionsUnitId', text: '碳排放量单位id', dictCode: '' })
  fieldList.push({ type: 'string', value: 'standardId', text: '核算标准id', dictCode: '' })
  fieldList.push({ type: 'string', value: 'lifeCycleId', text: '生命周期id', dictCode: '' })
  fieldList.push({ type: 'string', value: 'attachment', text: '碳盘查报告/碳足迹报告', dictCode: '' })
  superFieldList.value = fieldList
}

const handleTableChange = (pag, filters, sorter) => {
  // 处理表格变化
  if (pag) {
    ipagination.current = pag.current
    ipagination.pageSize = pag.pageSize
  }
  loadData()
}

const modalFormOk = () => {
  // 处理模态框确认事件
}

const getImgView = (text) => {
  // 实现图片查看逻辑
  return text
}

const downloadFile = (text) => {
  // 实现文件下载逻辑
}

// 生命周期钩子
onMounted(() => {
  loadData(1)
  selectedRowKeys.value = []
  selectionRows.value = []
  dataRecordCount()
  getAllSupplier()
})
</script>

<style scoped>
.m_contentBox {
  padding: 24px;
  background: #f0f2f5;
}
</style>
