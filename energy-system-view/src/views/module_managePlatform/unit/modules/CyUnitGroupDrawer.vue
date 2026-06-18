<template>
  <a-card :bordered="false">
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="tableRef"
        size="middle"
        :scroll="{x:true}"
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template #groupNameSlot="{text, record}">
          <span>
            <a-input v-model:value="record.groupName" />
          </span>
        </template>

        <template #action="{text, record}">
          <a v-if="record.id != null" @click="handleEdit(record)">保存</a>
          <a v-if="record.id == null" @click="handleSave(record)">保存</a>

          <a-divider type="vertical" />

          <a-popconfirm v-if="record.id != null" title="确定删除吗?" @confirm="() => DeleteRow(record)">
            <a>删除</a>
          </a-popconfirm>

          <a v-if="record.id == null" @click="CancelAdd(record)">取消</a>
        </template>
      </a-table>

      <div style="color:blue;cursor: pointer;" @click="addRow()">
        +添加分组
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import '@/assets/less/TableExpand.less'
import { defHttp } from '@/utils/http/axios'

// 定义组件名称
defineOptions({
  name: 'CyEmissionUnitList'
})

// Refs
const tableRef = ref()

// 响应式数据
const description = ref('碳排因子单位管理页面')
const dataSource = ref([])
const show = ref(false)
const doing = ref(false)
const selectedRowKeys = ref([])
const queryParam = reactive({})

// 表头
const columns = [
  {
    title: '分组名称',
    align: "center",
    dataIndex: 'groupName',
    key: 'groupName',
    slots: { customRender: 'groupNameSlot' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: "center",
    fixed: "right",
    width: 147,
    slots: { customRender: 'action' }
  }
]

const url = {
  list: "/CyFactorUnitGroup/cyFactorUnitGroup/list",
  add: "/CyFactorUnitGroup/cyFactorUnitGroup/add",
  delete: "/CyFactorUnitGroup/cyFactorUnitGroup/delete",
  deleteBatch: "/CyEmissionUnit/cyEmissionUnit/deleteBatch",
  exportXlsUrl: "/CyEmissionUnit/cyEmissionUnit/exportXls",
  importExcelUrl: "CyEmissionUnit/cyEmissionUnit/importExcel",
  edit: "/CyFactorUnitGroup/cyFactorUnitGroup/edit"
}

const dictOptions = reactive({})
const superFieldList = reactive([])
//单位分组集合
const unitGroupList = ref([])

const ipagination = reactive({
  current: 1,       //当前页码
  pageSize: 10,    //当前页面查询数
  pageSizeOptions: ['10', '20', '30', '40'],
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0  //   记录总数
})

const loading = ref(false)

// 计算属性
const importExcelUrl = computed(function () {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`;
})

// 方法定义
function initDictConfig() {
}

function getSuperFieldList() {
  let fieldList = [];
  fieldList.push({ type: 'string', value: 'unitName', text: '单位名称', dictCode: '' })
  fieldList.push({ type: 'string', value: 'unitCode', text: '单位', dictCode: '' })
  fieldList.push({ type: 'string', value: 'parentId', text: '父类ID', dictCode: '' })
  superFieldList.splice(0, superFieldList.length, ...fieldList)
}

async function searchQuery() {
  try {
    const res = await defHttp.get({ url: url.list, params: queryParam }, { isTransformResponse: false})
    dataSource.value = res.result?.records || []
    ipagination.total = res.result?.total || 0
    console.log(res);
  } catch (error) {
    console.error(error)
  }
}

async function searchGroup() {
  try {
    const res = await defHttp.get({ url: url.unitGroup }, { isTransformResponse: false})
    unitGroupList.value = res.result?.records || []
  } catch (error) {
    console.error(error)
  }
}

function addRow() {
  dataSource.value.push({})
}

async function DeleteRow(record) {
  try {
    const res = await defHttp.delete({
      url: url.delete,
      params: { id: record.id }
    }, { isTransformResponse: false, joinParamsToUrl: true})
    if (res.code == 200) {
      message.success(res.message)
      ipagination.total = res.result?.total || 0
    } else {
      message.warning(res.message)
    }
    searchQuery()
  } catch (error) {
    console.error(error)
  }
}

function CancelAdd(record) {
  const index = dataSource.value.indexOf(record)
  if (index > -1) {
    dataSource.value.splice(index, 1)
  }
}

async function handleSave(record) {
  if (record.groupName == null || record.groupName == "") {
    message.warning("分组名称不能为空")
  } else {
    //防止连续点击
    if (doing.value) {
      alert("上一个操作未完成");
    } else {
      doing.value = true
      try {
        const res = await defHttp.post({
          url: url.add,
          data: record
        }, { isTransformResponse: false})
        doing.value = false
        if (res.success) {
          message.success(res.message)
          ipagination.total = res.result?.total || 0
          searchQuery()
        }
      } catch (error) {
        doing.value = false
        console.error(error)
      }
    }
  }
}

async function handleEdit(record) {
  try {
    const res = await defHttp.post({
      url: url.edit,
      data: record
    }, { isTransformResponse: false})
    if (res.code == 200) {
      message.success(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

function onSelectChange(selectedKeys) {
  selectedRowKeys.value = selectedKeys
}

function handleTableChange(pagination, filters, sorter) {
  // 更新分页信息
  ipagination.current = pagination.current
  ipagination.pageSize = pagination.pageSize
  ipagination.total = pagination.total
  queryParam.pageNo = ipagination.current
  queryParam.pageSize = ipagination.pageSize
  searchQuery()
}

// 生命周期钩子
onMounted(() => {
     defHttp.get({ url: "/CyFactorUnitGroup/cyFactorUnitGroup/list" }, { isTransformResponse: false}).then(res => {
       console.log("res",res)
       dataSource.value = res.result.records
       ipagination.pageNo =  res.result.pages
       ipagination.size = res.result.pageSize
       ipagination.total = res.result.total
    })
})
</script>

<style scoped>
</style>
