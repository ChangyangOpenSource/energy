<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-bottom: 10px">
      <a-button @click="handleAdd" preIcon="ant-design:plus-outlined" type="primary">{{ $t('carbon.message.Add') }}</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="tableRef"
        size="middle"
        :scroll="{x:true}"
        bordered
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template #htmlSlot="{text}">
          <div v-html="text"></div>
        </template>

        <template #imgSlot="{text,record}">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>

        <template #fileSlot="{text}">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <template #action="{text, record}">
          <a @click="handleEdit(record)">{{ $t('carbon.message.Edit') }}</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">{{ $t('carbon.message.more') }}<a-icon type="down" /></a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="handleDetail(record)">{{ $t('carbon.message.Detail') }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>{{ $t('carbon.message.Delete') }}</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </div>

    <CyHistoryReferenceValueModal ref="modalFormRef" @ok="modalFormOk"></CyHistoryReferenceValueModal>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { message } from 'ant-design-vue'
import { defHttp } from '/@/utils/http/axios'
import '@/assets/less/TableExpand.less'
import CyHistoryReferenceValueModal from './modules/CyHistoryReferenceValueModal.vue'

// i18n
const { t } = useI18n()

// Refs
const tableRef = ref()
const modalFormRef = ref()
const selectedRowKeys = ref([])
const loading = ref(false)
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// Reactive data
const description = ref('历史基准值管理页面')
const dataSource = ref([])
const selectionRows = ref([])

const columns = [
  {
    title:'行业',
    align:"center",
    dataIndex: 'industry'
  },
  {
    title:'年份',
    align:"center",
    dataIndex: 'year'
  },
  {
    title:'基准值',
    align:"center",
    dataIndex: 'referenceValue'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align:"center",
    fixed:"right",
    width:147,
    slots: { customRender: 'action' }
  }
]

const url = {
  list: "/cyHistoryReferenceValue/cyHistoryReferenceValue/list",
  delete: "/cyHistoryReferenceValue/cyHistoryReferenceValue/delete",
  deleteBatch: "/cyHistoryReferenceValue/cyHistoryReferenceValue/deleteBatch",
  exportXlsUrl: "/cyHistoryReferenceValue/cyHistoryReferenceValue/exportXls",
  importExcelUrl: "cyHistoryReferenceValue/cyHistoryReferenceValue/importExcel",
}

const dictOptions = ref({})
const superFieldList = ref([])
const isorter = reactive({
  column: 'createTime',
  order: 'desc'
})

// Computed
const importExcelUrl = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`
})

// Methods
const initDictConfig = () => {}

const getSuperFieldList = () => {
  let fieldList = []
  fieldList.push({type:'string',value:'industry',text:'行业',dictCode:''})
  fieldList.push({type:'string',value:'industryId',text:'行业id',dictCode:''})
  fieldList.push({type:'string',value:'year',text:'年份',dictCode:''})
  fieldList.push({type:'BigDecimal',value:'referenceValue',text:'基准值',dictCode:''})
  fieldList.push({type:'string',value:'organizationId',text:'组织id',dictCode:''})
  fieldList.push({type:'string',value:'deptId',text:'部门id',dictCode:''})
  superFieldList.value = fieldList
}

const loadData = (arg) => {
  if (arg === 1) {
    ipagination.current = 1
  }

  let params = {
    ...ipagination,
    ...isorter
  }

  loading.value = true
  defHttp.get({ url: url.list, params }, { isTransformResponse: false}).then(res => {
    if (res.success) {
      dataSource.value = res.result.records
      ipagination.total = res.result.total
    }
    loading.value = false
  })
}

const reCalculatePage = (size) => {
  // 重新计算分页
  if (size > 0) {
    ipagination.total -= size
  }

  if (ipagination.total < 0) {
    ipagination.total = 0
  }

  if (ipagination.current > Math.ceil(ipagination.total / ipagination.pageSize)) {
    ipagination.current = Math.ceil(ipagination.total / ipagination.pageSize) || 1
  }
}

const handleAdd = () => {
  modalFormRef.value.add()
  modalFormRef.value.title = t('carbon.message.Add')
  modalFormRef.value.disableSubmit = false
}

const handleEdit = (record) => {
  modalFormRef.value.edit(record)
  modalFormRef.value.title = t('carbon.message.Edit')
  modalFormRef.value.disableSubmit = false
}

const handleDetail = (record) => {
  modalFormRef.value.edit(record)
  modalFormRef.value.title = t('carbon.message.Detail')
  modalFormRef.value.disableSubmit = true
}

const handleDelete = (id) => {
  if (!url.delete) {
    message.error("请设置url.delete属性!")
    return
  }

  defHttp.delete({ url: url.delete, params: { id: id } }, { joinParamsToUrl: true, isTransformResponse: false }).then(res => {
    if (res.success) {
      //重新计算分页问题
      reCalculatePage(1)
      message.success(res.message)
      loadData()
    } else {
      message.warning(res.message)
    }
  })
}

const searchQuery = () => {
  loadData(1)
  // 点击查询清空列表选中行
  selectedRowKeys.value = []
  selectionRows.value = []
}

const modalFormOk = () => {
  // 新增/修改 成功时，重载列表
  loadData()
  //清空列表选中
  onClearSelected()
}

const onClearSelected = () => {
  selectedRowKeys.value = []
  selectionRows.value = []
}

const handleTableChange = (pagination, filters, sorter) => {
  //分页、排序、筛选变化时触发
  if (Object.keys(sorter).length > 0) {
    isorter.column = sorter.field
    isorter.order = "ascend" == sorter.order ? "asc" : "desc"
  }
  Object.assign(ipagination, pagination)
  loadData()
}

const onSelectChange = (selectedKeys, selectionRowsData) => {
  selectedRowKeys.value = selectedKeys
  selectionRows.value = selectionRowsData
}

// Lifecycle
onMounted(() => {
  getSuperFieldList()
  loadData()
})

// Expose
defineExpose({
  tableRef,
  modalFormRef
})
</script>

<style scoped>
</style>
