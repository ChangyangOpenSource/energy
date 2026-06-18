<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-工序表单 -->

<template>
  <div>
    <a-drawer
      :title="t('carbon.message.Select_the_emission_source')"
      :width="750"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <div class="table-page-search-wrapper">
        <div class="flexs">
          <div class="flexbuttons" @click="onProcessForm">
            <img src="@/assets/cptzj/img8.png" alt="" />
            {{ t("carbon.message.New_emission_sources") }}
          </div>
        </div>
        <div class="tabBox">
          <a-form
            :model="queryParam"
            layout="inline"
            @keyup.enter="searchQuery"
          >
            <a-row :gutter="24">
              <a-col :span="9">
                <a-form-item :label="t('carbon.message.Emission_source')">
                  <a-input
                    v-model:value="queryParam.emissionSourceName"
                    allowClear
                    :placeholder="t('carbon.message.Please_select')"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item :label="t('carbon.message.Emission_type')">
                  <a-select
                    v-model:value="queryParam.emissionSourceType"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    :filter-option="filterOption"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.value"
                      v-for="(item, index) in productTypeData"
                      :key="index"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="" style="">
                  <div
                    style="
                      width: 100%;
                      display: flex;
                      justify-content: flex-end;
                    "
                  >
                    <a-button type="primary" @click="searchQuery">{{
                        t("carbon.message.Search")
                      }}</a-button>
                    <a-button style="margin-left: 8px" @click="searchReset">{{
                        t("carbon.message.Reset")
                      }}</a-button>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          v-if="visible"
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="dataSource"
          :pagination="ipagination"
          @change="handleTableChange"
        >
          <template #action="{ text, record, index }">
            <div class="m_ccFlex">
              <a @click="onExamine(record)">{{ t("carbon.message.Examine") }}</a>
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
          {{ t("carbon.message.Confirm") }}</a-button
        >
      </div>
    </a-drawer>
    <inputAndOutputForm ref="inputAndOutputFormRef" :disabled="disabledTweo" @back="back" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { cloneObject } from '/@/utils/index'
import inputAndOutputForm from './inputAndOutputForm.vue'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 emits
const emit = defineEmits(['back'])

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Refs
const inputAndOutputFormRef = ref(null)
const visible = ref(false)
const drawerTitle = ref('')
const productTypeData = ref([])
const labelCol = { span: 4 }
const wrapperCol = { span: 14 }
const activeCollapseKey = ref(['0'])
const getAllUnitByGroupData = ref({}) // 单位分组数据
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条'
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
})
const dataSource = ref([{ name: '1', age: '2' }])
const disabledTweo = ref(false)

// Reactive 数据
const formObj = reactive({
  // 产出物数据,第一条为主产出物，其他为副产出物
  emissionSources: [],
  processId: '',
  emissionSourceIds: [],
})

const queryParam = reactive({
  emissionSourceName: '',
  emissionSourceType: '',
})

const columns = computed(() => [
  {
    title: t('carbon.message.Emission_source'),
    dataIndex: 'emissionSourceName',
    align: 'center',
  },
  {
    title: t('carbon.message.Emission_type'),
    dataIndex: 'emissionSourceTypeName',
    align: 'center',
  },
  {
    title: t('carbon.message.Emission_source_unit'),
    dataIndex: 'emissionSourceUnitName',
    align: 'center',
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'age',
    slots: { customRender: 'action' },
    align: 'center',
  },
])

const rowSelection = reactive({
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
    formObj.emissionSources = selectedRows
  },
})

// Methods
const back = () => {
  visible.value = false
  emit('back')
}

const onExamine = async (value) => {
  console.log('formObj', value)
  // 运输路段-碳排因子
  let activeCollapseKeyData = []
  if (value.cyEmissionSourceTransports != null && value.cyEmissionSourceTransports.length > 0) {
    for (let i = 0; i < value.cyEmissionSourceTransports.length; i++) {
      const item = value.cyEmissionSourceTransports[i]
      activeCollapseKeyData.push(String(i))
      try {
        const res = await defHttp.get({
          url: '/emission/factor/cyEmissionFactor/listInfo',
          params: {
            id: item.emissionFactorId,
          }
        })
        if (res) {
          let selectedRows = {
            id: res.emissionFactorObject.id,
            name: res.emissionFactorObject.name,
            model: res.emissionFactorObject.model,
            factorValue: res.emissionFactorDataObject.factorValue,
            numeratorUnit: res.emissionFactorDataObject.numeratorUnit,
            denominatorUnit: res.emissionFactorDataObject.denominatorUnit,
            industry: res.emissionFactorObject.industry,
            releaseOrg: res.emissionFactorObject.releaseOrg,
            releaseYear: res.emissionFactorObject.releaseYear,
          }
          item.selectedRows = selectedRows
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  console.log('activeCollapseKey', activeCollapseKeyData)

  if (inputAndOutputFormRef.value) {
    inputAndOutputFormRef.value.activeCollapseKey = activeCollapseKeyData
    inputAndOutputFormRef.value.formObj = value

    // 基本信息-碳排因子
    try {
      const res = await defHttp.get({
        url: '/emission/factor/cyEmissionFactor/listInfo',
        params: {
          id: value.emissionFactorId,
        }
      })

      let selectedRows = {
        id: res.emissionFactorObject.id,
        name: res.emissionFactorObject.name,
        model: res.emissionFactorObject.model,
        factorValue: res.emissionFactorDataObject.factorValue,
        numeratorUnit: res.emissionFactorDataObject.numeratorUnit,
        denominatorUnit: res.emissionFactorDataObject.denominatorUnit,
        industry: res.emissionFactorObject.industry,
        releaseOrg: res.emissionFactorObject.releaseOrg,
        releaseYear: res.emissionFactorObject.releaseYear,
      }

      inputAndOutputFormRef.value.selectedRows = selectedRows
      inputAndOutputFormRef.value.type = 2
      inputAndOutputFormRef.value.formObj.processId = formObj.processId
      inputAndOutputFormRef.value.type = 3
      disabledTweo.value = true
      inputAndOutputFormRef.value.getData()
      inputAndOutputFormRef.value.visible = true
    } catch (error) {
      console.error(error)
    }
  }
}

const onSubmit = () => {
  formObj.emissionSourceIds = []
  formObj.emissionSources.forEach((res) => {
    formObj.emissionSourceIds.push(res.id)
  })

  defHttp.post({
    url: '/CyWorkmanshipEmissionSource/cyWorkmanshipEmissionSource/batchSaveWorkmanshipEmissionSource',
    params: formObj
  }).then((res) => {
    if (res) {
      createMessage.success(t('carbon.message.operation_success'))
      visible.value = false
      emit('back')
    } else {
      createMessage.error(res.message)
    }
  })
}

/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
  )
}

/**
 * 关闭抽屉，初始化数据
 */
const onClose = () => {
  Object.assign(formObj, {
    artifactList: [{}], // 产出物数据,第一条为主产出物，其他为副产出物
  })
  visible.value = false
}

/**
 * 查询
 */
const searchQuery = () => {
  console.log('searchQuery')
  ipagination.current = 1
  getData()
}

/**
 * 重置
 */
const searchReset = () => {
  console.log('searchReset')
  ipagination.current = 1
  Object.assign(queryParam, { emissionSourceName: '', emissionSourceType: '' })
  getData()
}

const handleTableChange = (e) => {
  console.log(e)
  ipagination.current = e.current
  ipagination.pageSize = e.pageSize
  getData()
}

const getData = () => {
  let reqData = cloneObject(queryParam)
  reqData.pageNo = ipagination.current
  reqData.pageSize = ipagination.pageSize

  defHttp.get({
    url: '/CyEmissionSourceLibrary/cyEmissionSourceLibrary/selectEmissionSource',
    params: reqData
  }).then((res) => {
    if (res) {
      dataSource.value = res.records || []
      ipagination.total = res.total
    }
  })

//类型
  defHttp.get({
    url: '/sys/dict/getDictItems/product_type',
  }).then((res) => {
    productTypeData.value = res || []
    console.log('getDictItems product_type =>', res)
  })
}

const onProcessForm = () => {
  disabledTweo.value = false
  if (inputAndOutputFormRef.value) {
    inputAndOutputFormRef.value.getData()
    inputAndOutputFormRef.value.type = 1
    inputAndOutputFormRef.value.formObj.processId = formObj.processId
    if (formObj.processType == 'in') {
      // 添加输入
      inputAndOutputFormRef.value.formObj.type = 1
    }
    if (formObj.processType == 'out') {
      // 添加输出
      inputAndOutputFormRef.value.formObj.type = 2
    }
    inputAndOutputFormRef.value.visible = true
    inputAndOutputFormRef.value.drawerTitle = t('carbon.message.New_emission_sources')
  }
}

// 暴露给父组件的方法
defineExpose({
  getData,
  visible,
  formObj,
  drawerTitle
})
</script>

<style lang="less" scoped>
.tabBox {
  background: #f3f3f3;
  padding: 24px;
  margin-bottom: 16px;

  :deep(.ant-form-item) {
    margin: 0;
  }
}

.flexs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.flexbuttons {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
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
