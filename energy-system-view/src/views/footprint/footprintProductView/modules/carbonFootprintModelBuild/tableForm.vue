<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-工序库 -->
<template>
  <div>
    <a-drawer
      :title="t('carbon.message.New_process')"
      :width="750"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <div class="table-page-search-wrapper" v-if="visible">
        <div class="flexs">
          <a-input-search
            :placeholder="t('carbon.message.Search_for_emission_sources')"
            style="width: 200px"
            v-model="queryParam.processName"
            @search="onSearch"
          />
          <div class="flexbuttons" @click="onProcessForm">
            <img :src="img8" alt="" />
            {{ t("carbon.message.Add_new_processes_procedures") }}
          </div>
        </div>
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="dataSource"
          :pagination="ipagination"
          @change="handleTableChange"
        >
          <template #action="text, record, index">
            <div class="m_ccFlex">
              <a @click="onEdits(record)">{{ t("carbon.message.Examine") }}</a>
            </div>
          </template>
        </a-table>
      </div>
      <div class="drawerOptionBox">
        <a-button @click="onClose">{{ t("carbon.message.Cancel") }}</a-button>
        <a-button
          type="primary"
          style="margin-left: 8px"
          @click="onSubmit"
          v-if="!disabled"
        >
          {{ t("carbon.message.Confirm") }}
        </a-button>
      </div>
    </a-drawer>
    <processForm ref="processForm" :disabled="disableds" @back="back" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { defHttp } from '@/utils/http/axios'
import { cloneObject } from '/@/utils/index';
import processForm from "./processForm.vue";
import img8 from '@/assets/cptzj/img8.png'

// 国际化
const { t } = useI18n()

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['back'])

// Refs
const processFormRef = ref(null)

// Reactive 数据
const visible = ref(false)
const queryParam = reactive({
  processName: '',
})
const formObj = ref({
  artifactList: [{}],
  processAndFlowList: [],
  processIds: [],
  lifeCycleId: '',
  calculateId: '',
})
const dataSource = ref([])
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => `${range[0]}-${range[1]} 共${total}条`,
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
})
const disableds = ref(false)

// Columns
const columns = [
  {
    title: t('carbon.message.Process_name'),
    dataIndex: 'processName',
    align: 'center',
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'age',
    slots: { customRender: 'action' },
    align: 'center',
  },
]

// Row Selection
const rowSelection = computed(() => ({
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows:', selectedRows)
    formObj.processAndFlowList = selectedRows
  },
}))

// Methods
const back = () => {
  emit('back')
  visible.value = false
}

const handleTableChange = (e) => {
  ipagination.current = e.current
  ipagination.pageSize = e.pageSize
  getData()
}

const onEdits = (value) => {
  processFormRef.value.getData()
  disableds.value = true
  processFormRef.value.visible = true
  processFormRef.value.formObj = value
  processFormRef.value.activeCollapseKey = ['0']
  processFormRef.value.drawerTitle = t('carbon.message.Examine')
}

const onSubmit = () => {
  formObj.processIds = []
  formObj.processAndFlowList.forEach((res) => {
    formObj.processIds.push(res.id)
  })

  defHttp.post({
    url: '/footprintProduct/cyFootprintProduct/batchSaveProcess',
    data: {
      calculateId: formObj.calculateId,
      lifeCycleId: formObj.lifeCycleId,
      processIds: formObj.processIds,
    },
  }).then((res) => {
    if (res.success) {
      emit('back')
      visible.value = false
    }
  }).finally(() => {
    // this.spinning = false;
  })
}

const onClose = () => {
  visible.value = false
  emit('back')
}

const getData = () => {
  const reqData = cloneObject(queryParam)
  reqData.pageNo = ipagination.current
  reqData.pageSize = ipagination.pageSize

  defHttp.get({
    url: '/CyWorkmanshipLibrary/cyWorkmanshipLibrary/selectWorkmanshipLibrary',
    params: reqData,
  }).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records || []
      ipagination.total = res.result.total
      visible.value = true
    }
  }).finally(() => {
    // this.spinning = false;
  })
}

const onSearch = () => {
  getData()
}

const onProcessForm = () => {
  processFormRef.value.getData()
  disableds.value = false
  processFormRef.value.visible = true
  processFormRef.value.formObj.lifeCycleId = formObj.lifeCycleId
  processFormRef.value.formObj.calculateId = formObj.calculateId
  processFormRef.value.drawerTitle = t('carbon.message.Add_new_processes_procedures')
}

defineExpose({
  getData,
  visible,
  formObj,
});

// Lifecycle
onMounted(() => {
  // 初始化逻辑
})
</script>

<style lang="less" scoped>
.flexs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.flexbuttons {
  display: flex;
  align-items: center;
  padding: 5px 16px;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #148958;
  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}

.addBtn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 5px 16px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;

  .addBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.drawerOptionBox {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
