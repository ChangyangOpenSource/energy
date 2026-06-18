<template>
  <a-modal
    :title="title"
    :width="width"
    @cancel="handleCancel"
    :visible="visible"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="padding: 15px">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="22" :lg="9" :md="10" :sm="24">
            <a-form-item :label="t('carbon.message.The_purchase_item_name')" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
              <a-input
                :placeholder="t('carbon.message.Please_enter_the_purchase_item_name')"
                v-model="queryParam.name"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :xl="2" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery">
                {{ t('carbon.message.Button_Search') }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div style="padding: 15px">
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :loading="loading"
        size="middle"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      />
    </div>

    <template #footer>
      <a-button key="back" @click="handleCancel">{{ t('carbon.message.Close') }}</a-button>
      <a-button type="primary" @click="handleOk">{{ t('carbon.message.Confirm') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { defHttp } from '@/utils/http/axios'

// 使用 useI18n 替代 $t
const { t } = useI18n()

// 定义响应式数据
const props = defineProps({
  supplierProductIdList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['ok'])

// 状态变量
const selectedRowKeys = ref([])
const selectionRows = ref([])
const queryParam = reactive({})
const loading = ref(false)
const title = ref(t('carbon.message.Modal_Title_SelectProducts'))
const width = ref(800)
const visible = ref(false)
const disableSubmit = ref(false)
const dataSource = ref([])
const columns = ref([
  {
    title: t('carbon.message.Table_Column_PurchaseItemName'),
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: t('carbon.message.Specifications_and_models'),
    dataIndex: 'specification',
    align: 'center',
  },
  {
    title: t('carbon.message.Unit'),
    dataIndex: 'productUnitId_dictText',
    align: 'center',
  },
  {
    title: t('carbon.message.Table_Column_UnitPrice'),
    dataIndex: 'price',
    align: 'center',
  }
])

const url = {
  list: "/supplierProduct/selectByOrgIdWithName",
}

const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30"],
  showTotal: (total, range) => {
    return range[0] + "-" + range[1] + " 共" + total + "条";
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
})

// 监听 props 变化
watch(() => props.supplierProductIdList, (val) => {
  selectedRowKeys.value = val
})

// 生命周期钩子
onMounted(() => {
  loadData(1)
})

// 方法定义
const open = () => {
  visible.value = true
}

const handleOk = () => {
  const selectedRowKeysValue = selectedRowKeys.value
  const selectionRowsValue = dataSource.value.filter(item => selectedRowKeysValue.includes(item.id))
  emit('ok', selectedRowKeysValue, selectionRowsValue)
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

const searchQuery = () => {
  console.log("searchQuery");
  loadData();
}

const loadData = async (arg) => {
  //加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }
  const params = getQueryParams()
  loading.value = true

  try {
    // 使用 defHttp 替代 getAction
    const res = await defHttp.get({ url: url.list, params }, { isTransformResponse: false})
    if (res.success) {
      dataSource.value = res.result.records || res.result
      if (res.result.total) {
        ipagination.total = res.result.total
      } else {
        ipagination.total = 0
      }
    } else {
      // 这里需要根据实际使用的提示组件进行调整
      console.warn(res.message)
    }
  } finally {
    loading.value = false
  }
}

const getQueryParams = () => {
  let param = { ...queryParam }
  param.pageNo = ipagination.current
  param.pageSize = ipagination.pageSize
  return filterObj(param)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for ( let key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}

const handleTableChange = (pagination) => {
  Object.assign(ipagination, pagination)
  loadData()
}

const onSelectChange = (selectedRowKeysValue, selectionRowsValue) => {
  selectedRowKeys.value = selectedRowKeysValue
  selectionRows.value = selectionRowsValue
}

// 暴露方法给父组件
defineExpose({
  open
})

</script>

<style lang="less" scoped>
</style>
