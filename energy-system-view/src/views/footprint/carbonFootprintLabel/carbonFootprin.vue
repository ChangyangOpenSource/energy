<!-- 产品碳足迹-碳足迹报告 -->

<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form >
                <a-row :gutter="24">
                  <a-col :span="5">
                    <a-form-item :label="t('carbon.message.Product_name')">
                      <a-input
                        v-model:value="queryParam.productName"
                        allowClear
                        :placeholder="t('carbon.message.Please_enter')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="5">
                    <a-form-item
                      :label="t('carbon.message.Life_cycle_boundary')"
                    >
                      <a-select
                        v-model:value="queryParam.lifeCycleType"
                        :placeholder="t('carbon.message.Please_select')"
                        show-search
                        :filter-option="filterOption"
                        style="width: 100%"
                      >
                        <a-select-option
                          :value="item.value"
                          v-for="(item, index) in productData"
                          :key="index"
                        >
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="5">
                    <a-form-item :label="t('carbon.message.State')">
                      <a-select
                        v-model:value="queryParam.state"
                        :placeholder="t('carbon.message.Please_select')"
                        show-search
                        :filter-option="filterOption"
                        style="width: 100%"
                      >
                        <a-select-option
                          :value="item.value"
                          v-for="(item, index) in stateList"
                          :key="index"
                        >
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="5">
                    <a-form-item :label="t('carbon.message.accounting_cycle')">
                      <a-range-picker
                        :format="dateFormat"
                        value-format="YYYY/MM/DD"
                        v-model:value="queryParam.times"
                        @change="handleChange"
                      />
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
                        <a-button preIcon="ant-design:search-outlined" type="primary" @click="searchQuery">{{
                            t("carbon.message.Search")
                          }}</a-button>
                        <a-button
                          style="margin-left: 8px"
                          @click="searchReset"
                          preIcon="ant-design:reload-outlined"
                        >{{ t("carbon.message.Reset") }}</a-button
                        >
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
          <!-- 表格 -->
          <div class="cardBox">
            <div class="butons" @click="onDRawer">
              <div class="twsr">
                {{ t("carbon.message.Apply_for_a_carbon_footprint_label") }}
              </div>
            </div>
            <div class="m_mt24">
              <a-table
                ref="table"
                :columns="columns"
                :data-source="dataSource"
                :loading="loading"
                :pagination="ipagination"
                :scroll="{ x: true }"
                :bordered="false"
                class=""
                row-key="id"
                size="middle"
                @change="handleTableChange"
              >
                <template #lifeCycleType="{ text, record }">
                  {{
                    record.lifeCycleType == 1
                      ? "从摇篮到大门"
                      : record.lifeCycleType == 2
                        ? "从摇篮到坟墓"
                        : record.lifeCycleType == 3
                          ? "自定义"
                          : ""
                  }}
                </template>
                <template #times="{ text, record }">
                  {{ record.beginTime }}--{{ record.endTime }}
                </template>
                <template #State="{ text, record }">
                  <a-switch
                    :checked="record.state"
                    @change="(checked) => onChange(checked, record)"
                  />
                </template>
                <template #action="{ text, record }">
                  <div class="m_cbFlex" style="padding: 0 5px">
                    <a @click="onEdit(record)">{{ t("carbon.message.Edit") }}</a>
                    <a @click="onPreview(record)">{{ t("carbon.message.Preview") }}</a>
                    <a-popconfirm
                      :title="t('carbon.message.Confirm_delete')"
                      :cancel-text="t('carbon.message.Cancel')"
                      :ok-text="t('carbon.message.Confirm')"
                      @confirm="() => onDelete(record)"
                    >
                      <a>{{ t("carbon.message.Delete") }}</a>
                    </a-popconfirm>
                  </div>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <!-- 申请 -->
    <section class="m_popupBox" v-if="isAss">
      <moduleIndex ref="moduleIndexRef" @back="onBack" />
    </section>
    <!--  碳足迹标签弹窗  -->
    <a-modal
      :title="t('carbon.message.Check_the_carbon_footprint_label')"
      okText="下载"
      :visible="isGenerateAssIng"
      @ok="closeReportModal"
      @cancel="closeReportCancel"
    >
      <a-spin :spinning="createReportIng">
        <div class="flecCenter">
          <img :src="theCarbonImg" class="theCarbonImg" alt="" />
          <div class="flwMondes">
            {{ t("carbon.message.Generation_time") }}:{{ createTime }}
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { cloneObject } from '/@/utils/index'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import moduleIndex from './module/index.vue'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// Refs
const table = ref(null)
const moduleIndexRef = ref(null)

// Reactive 数据
const isAss = ref(false)
const loading = ref(false)
const queryParam = reactive({})
const dateFormat = ref("YYYY/MM/DD")
const isGenerateAssIng = ref(false)
const createReportIng = ref(false)
const theCarbonImg = ref("")
const createTime = ref("")

const columns = computed(() => [
  {
    title: t("carbon.message.Product_name"),
    align: "center",
    dataIndex: "productName",
    width: 150,
  },
  {
    title: t("carbon.message.Accounting_quantity"),
    align: "center",
    dataIndex: "calculateNumber",
    width: 150,
  },
  {
    title: t("carbon.message.Unit"),
    align: "center",
    dataIndex: "productWeightUnit",
    width: 150,
  },
  {
    title: t("carbon.message.Product_carbon_footprint") + "(kgCO₂e)",
    align: "center",
    dataIndex: "carbonEmissionTotal",
    width: 150,
  },
  {
    title: t("carbon.message.Life_cycle_boundary"),
    align: "center",
    dataIndex: "lifeCycleType",
    slots: { customRender: "lifeCycleType" },
    width: 150,
  },
  {
    title: t("carbon.message.Data_cycle"),
    align: "center",
    dataIndex: "productWeight",
    slots: { customRender: "times" },
    width: 150,
  },
  {
    title: t("carbon.message.State"),
    align: "center",
    dataIndex: "State",
    slots: { customRender: "State" },
    width: 150,
  },
  {
    title: t("carbon.message.View_times"),
    align: "center",
    dataIndex: "watchNumber",
    width: 150,
  },
  {
    title: t("carbon.message.Update_person"),
    align: "center",
    dataIndex: "updateBy_dictText",
    width: 150,
  },
  {
    title: t("carbon.message.Update_date"),
    align: "center",
    dataIndex: "updateTime",
    width: 150,
  },
  {
    title: t("carbon.message.Handle"),
    dataIndex: "action",
    align: "center",
    fixed: "right",
    width: 150,
    slots: { customRender: "action" },
  },
])

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

const stateList = ref([
  {
    name: "启用",
    value: true,
  },
  {
    name: "关闭",
    value: false,
  },
])

const productData = ref([
  {
    name: "从摇篮到大门",
    value: 1,
  },
  {
    name: "从摇篮到坟墓",
    value: 2,
  },
  {
    name: "自定义",
    value: 3,
  },
])

const dataSource = ref([])

// 生命周期钩子
onMounted(() => {
  getData()
})

// Methods
const closeReportCancel = () => {
  isGenerateAssIng.value = false
}

const closeReportModal = () => {
  console.log('exportXlsTemplate', theCarbonImg.value)
  window.open(theCarbonImg.value, '_blank')
}

const handleChange = (dates) => {
  console.log(dates)
  if (dates && dates.length === 2) {
    queryParam.beginTime = dates[0]
    queryParam.endTime = dates[1]
  } else {
    delete queryParam.beginTime
    delete queryParam.endTime
  }
}

const onBack = () => {
  isAss.value = false
  getData()
}

const onChange = (checked, code) => {
  console.log(checked, code)
  const updatedCode = { ...code, state: checked }
  defHttp.post({
    url: "/footprintProduct/cyFootprintProductCalculateLabel/editLabel",
    params: updatedCode
  }).then((res) => {
    if (res) {
      createMessage.success(t("carbon.message.operation_success"))
      getData()
    }
  })
}

const onDelete = (value) => {
  defHttp.delete({
    url: "/footprintProduct/cyFootprintProductCalculateLabel/removeById",
    params: {
      id: value.id,
    }
  }, {joinParamsToUrl: true}).then((res) => {
    if (res) {
      getData()
    }
  })
}

/**
 * 新建
 */
const onDRawer = () => {
  isAss.value = true
  nextTick(() => {
    moduleIndexRef.value.type = 1
    moduleIndexRef.value.getProductList()
  })
}

/**
 * 编辑
 */
const onEdit = (value) => {
  console.log(value)
  isAss.value = true
  nextTick(() => {
    moduleIndexRef.value.disable = true
    moduleIndexRef.value.type = 2
    Object.assign(moduleIndexRef.value.queryParam, value)
    moduleIndexRef.value.getUpdate()
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
 * 下载碳足迹报告
 */
const onPreview = (item) => {
  isGenerateAssIng.value = true
  theCarbonImg.value = window._CONFIG['staticDomainURL'] + "/" + item.qrcode
  createTime.value = item.createTime
}

/**
 * 查询
 */
const searchQuery = () => {
  console.log("searchQuery")
  ipagination.current = 1
  getData()
}

/**
 * 重置
 */
const searchReset = () => {
  console.log("searchReset")
  Object.keys(queryParam).forEach(key => {
    delete queryParam[key]
  })
  ipagination.current = 1
  getData()
}

const handleTableChange = (pagination) => {
  console.log(pagination)
  Object.assign(ipagination, pagination)
  getData()
}

const getData = () => {
  let reqData = cloneObject(queryParam)
  reqData.pageNo = ipagination.current
  reqData.pageSize = ipagination.pageSize
  defHttp.get({
    url: "/footprintProduct/cyFootprintProductCalculateLabel/list",
    params: reqData
  }).then((res) => {
    if (res) {
      dataSource.value = res.records || []
      ipagination.total = res.total
    }
  })
}
</script>

<style lang="less" scoped>
.colorse{
  color: @primary-color !important;
}
.flwMondes {
  font-weight: 400;
  font-size: 14px;
  color: #888888;
  margin-top: 24px;
}
.flecCenter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.theCarbonImg {
  width: 279px;
  height: 375px;
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
.butons {
  background: @primary-color;
  border-radius: 3px 3px 3px 3px;
  padding: 5px 12px;
  display: inline-flex;
  align-items: center;
}
.twsr {
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}
.img3 {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
/deep/ .ant-card-body {
  background: #f5f8f7;
}

.tabBox {
  padding: 24px 24px 0;
  background: #ffffff;
  border-radius: 3px;
}

.cardBox {
  margin-top: 24px;
  padding: 24px;
  background: #ffffff;
  border-radius: 3px;
}
</style>
