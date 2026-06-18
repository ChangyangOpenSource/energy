<template>
  <div class="m_contentBox">
    <a-card :bordered="false">
      <div class="m_aCardBox">
        <!-- 查询区域 -->
        <div class="tabBox">
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter="searchQuery">
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="关键词" :labelCol="{ span: 12}" :wrapperCol="{ span: 12 }">
                    <a-input placeholder="请输入" v-model:value="queryParam.name" allow-clear />
                  </a-form-item>
                </a-col>
                <span style="float: right; overflow: hidden" class="table-page-search-submitButtons">
                  <a-col :span="12" style="display: flex">
                    <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery()">查询</a-button>
                    <a-button style="margin-left: 8px" preIcon="ant-design:reload-outlined" @click="searchReset">重置</a-button>
                  </a-col>
                </span>
              </a-row>
            </a-form>
          </div>
        </div>
        <!-- 查询区域-END -->

        <!-- 操作按钮区域 -->
        <div class="cardBox">
          <a-button class="m_mb24" preIcon="ant-design:plus-outlined" @click="handleAdd" type="primary">新增标准</a-button>
          <a-table
            ref="tableRef"
            size="middle"
            :scroll="{ x: true }"
            row-key="id"
            :columns="columns"
            :data-source="dataSource"
            :pagination="ipagination"
            :loading="loading"
            class="j-table-force-nowrap"
            @change="handleTableChange"
          >
            <template #action="{ text, record }">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除?" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                <a>删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>

        <add-modal ref="modalFormRef" @ok="modalFormOk"></add-modal>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import addModal from './modules/addModal.vue'
import { useMessage } from '/@/hooks/web/useMessage'

// 使用 i18n
const { t } = useI18n()
// 使用 useMessage
const { createMessage } = useMessage()

// 数据定义
const queryParam = reactive({
  name: ''
})
const dataSource = ref([])
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const loading = ref(false)

// 表头定义
const columns = computed(() => [
  {
    title: "序号",
    dataIndex: "",
    key: "rowIndex",
    width: 60,
    align: "center",
    customRender: ({ index }) => parseInt(index) + 1
  },
  {
    title: "核算标准1",
    align: "center",
    dataIndex: "mainStandardName"
  },
  {
    title: "核算标准2",
    align: "center",
    dataIndex: "convertStandardName"
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    fixed: "right",
    width: 147,
    slots: { customRender: 'action' }
  }
])

const url = {
  list: "/orgCarbonStandardConversion/getPageList",
  delete: "/orgCarbonStandardConversion/removeFromAdmin",
  deleteBatch: "/emission/factor/cyEmissionFactorData/deleteBatch",
  exportXlsUrl: "/emission/factor/cyEmissionFactorData/exportXls"
}

// 引用模板元素
const tableRef = ref()
const modalFormRef = ref()

// 方法定义
const searchQuery = () => {
  loadData(1)
}

const searchReset = () => {
  queryParam.name = ''
  searchQuery()
}

const handleAdd = () => {
  modalFormRef.value.add()
}

const handleEdit = (record) => {
  modalFormRef.value.edit(record.id)
}

const handleDelete = (record) => {
  defHttp.get({ url: url.delete, params: { id: record.id } }, { isTransformResponse: false,joinParamsToUrl: true}).then(res => {
    if (res.success) {
      createMessage.success('删除成功')
      searchQuery()
    }
  })
}

const modalFormOk = () => {
  searchQuery()
}

const loadData = (arg) => {
  if (arg === 1) {
    ipagination.current = 1
  }

  const params = {
    ...queryParam,
    page: ipagination.current,
    pageSize: ipagination.pageSize
  }

  loading.value = true
  defHttp.get({ url: url.list, params }, { isTransformResponse: false}).then(res => {
    if (res.success) {
      dataSource.value = res.result.records || res.result
      ipagination.total = res.result.total || 0
    }
  }).finally(() => {
    loading.value = false
  })
}

// 生命周期钩子
onMounted(() => {
  loadData()
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
