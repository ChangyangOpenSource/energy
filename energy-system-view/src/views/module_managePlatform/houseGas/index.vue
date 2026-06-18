<!--  温室气体  -->
<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <!-- 查询区域 -->
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form layout="inline" @keyup.enter="searchQuery">
                <a-row :gutter="24">
                  <a-col :span="12">
                    <a-form-item label="温室气体" :labelCol="{ span: 12}" :wrapperCol="{ span: 12 }" >
                      <a-input placeholder="请输入" v-model:value="queryParam.gasName" allow-clear></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="" style="">
                      <div style="width: 100%;display: flex;justify-content: flex-end;">
                        <a-button type="primary"  preIcon="ant-design:search-outlined" @click="searchQuery">查询</a-button>
                        <a-button @click="searchReset" preIcon="ant-design:reload-outlined" style="margin-left: 8px">重置</a-button>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
          <!-- 查询区域-END -->
          <!-- 操作按钮区域 -->
          <!-- table区域-begin -->
          <div class="cardBox">
            <div class="m_mb24">
              <a-button @click="handleAdd" preIcon="ant-design:plus-outlined" type="primary">新增气体</a-button>
            </div>
            <a-table
              ref="tableRef"
              size="middle"
              :scroll="{x:true}"
              row-key="id"
              :columns="columns"
              :data-source="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              class="j-table-force-nowrap"
              @change="handleTableChange">
              <template #action="{text, record}">
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a @click="handleDelete(record.id)">删除</a>
              </template>
            </a-table>
          </div>
          <cy-gas-store-modal ref="modalFormRef" @ok="modalFormOk"></cy-gas-store-modal>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import '@/assets/less/TableExpand.less'
import CyGasStoreModal from './modules/CyGasStoreModal.vue'
import { defHttp } from '/@/utils/http/axios'

// Refs
const tableRef = ref()
const modalFormRef = ref()
const selectedRowKeys = ref([])
const loading = ref(false)
const ipagination = ref({})

// Reactive data
const description = ref('温室气体库管理页面')
const queryParam = reactive({})
const dataSource = ref([])

const columns = [
  {
    title: '温室气体名称',
    align: "center",
    dataIndex: 'gasName'
  },
  {
    title: 'GWP值',
    align: "center",
    dataIndex: 'gwpValue'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: "center",
    fixed: "right",
    width: 147,
    slots: { customRender: 'action' }
  }
]

const url = {
  list: "/gas/cyGasStore/list",
  add: '/gas/cyGasStore/add',
  edit: '/gas/cyGasStore/edit',
  delete: "/gas/cyGasStore/delete",
  deleteBatch: "/CyGasStore/cyGasStore/deleteBatch",
  exportXlsUrl: "/CyGasStore/cyGasStore/exportXls",
  importExcelUrl: "CyGasStore/cyGasStore/importExcel",
}

const dictOptions = ref({})
const superFieldList = ref([])

// Computed
const importExcelUrl = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`
})

// Methods
const getList = () => {
  defHttp.get({ url: url.list, params: queryParam }, { isTransformResponse: false}).then(res => {
    dataSource.value = res.result.records
  })
}

const initDictConfig = () => {}

const handleDelete = (id) => {
  defHttp.delete({ url: url.delete, params: {id: id } }, { joinParamsToUrl: true,isTransformResponse: false }).then(res => {
    if (res.code == 200) {
      message.success(res.message)
      getList()
    }
  })
}

const getSuperFieldList = () => {
  let fieldList = []
  fieldList.push({ type: 'string', value: 'gasName', text: '温室气体名称', dictCode: '' })
  fieldList.push({ type: 'BigDecimal', value: 'gwpValue', text: 'GWP值', dictCode: '' })
  fieldList.push({ type: 'string', value: 'organizationId', text: '组织ID', dictCode: '' })
  fieldList.push({ type: 'string', value: 'deptId', text: '部门ID', dictCode: '' })
  superFieldList.value = fieldList
}

const handleAdd = () => {
  modalFormRef.value.add()
}

const handleEdit = (record) => {
  modalFormRef.value.edit(record)
  modalFormRef.value.title = "编辑"
}

const searchQuery = () => {
  // 实现查询逻辑
  getList()
}

const searchReset = () => {
  // 实现重置逻辑
  Object.keys(queryParam).forEach(key => {
    queryParam[key] = undefined
  })
  getList()
}

const modalFormOk = () => {
  // 实现模态框确认逻辑
  getList()
}

const handleTableChange = (pagination, filters, sorter) => {
  // 实现表格变化逻辑
}

const onSelectChange = (selectedKeys) => {
  selectedRowKeys.value = selectedKeys
}

// Lifecycle
onMounted(() => {
  getSuperFieldList()
  getList()
})

// Expose methods
defineExpose({
  tableRef,
  modalFormRef
})
</script>

<style lang="less" scoped>

/deep/ .ant-card-body {
  background: #F5F8F7;

  .ant-form-item {
    margin-bottom: 20px !important;
  }
}

.tabBox {
  padding: 24px 24px 0;
  background: #FFFFFF;
  border-radius: 3px;
}

.cardBox {
  margin-top: 24px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 3px;
}
</style>
