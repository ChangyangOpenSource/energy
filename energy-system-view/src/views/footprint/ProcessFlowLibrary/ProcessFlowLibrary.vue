<!-- 产品碳足迹-碳足迹报告 -->

<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form
                :model="queryParam"
                @keyup.enter="searchQuery"
              >
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-item
                      :label="t('carbon.message.Name_of_technological_process')"
                    >
                      <j-input
                        v-model:value="queryParam.processName"
                        allowClear
                        :placeholder="t('carbon.message.Please_enter')"
                      ></j-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6"> </a-col>
                  <a-col :span="6"> </a-col>
                  <a-col :span="6">
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
              <img class="img3" src="@/assets/cptzj/img3.png" alt="" />
              <div class="twsr">
                {{ t("carbon.message.New_technological_process") }}
              </div>
            </div>
            <div class="m_mt24">
              <a-table
                ref="tableRef"
                :columns="columns"
                :data-source="dataSource"
                :loading="loading"
                :pagination="ipagination"
                :bordered="false"
                class=""
                row-key="id"
                size="middle"
                @change="handleTableChange"
              >
                <template #serialNumber="{ text, record, index }">
                  {{ index + 1 }}
                </template>
                <template #action="{ text, record }">
                  <div class="m_cbFlex" style="padding: 0 5px">
                    <a @click="onEdit(record)">{{ t("carbon.message.Edit") }}</a>
                    <a @click="onCopy(record)">{{ t("carbon.message.Copy") }}</a>
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

    <section class="m_popupBox" v-if="isAss">
      <footprintProductForm ref="footprintProductFormRef" @back="back" />
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import footprintProductForm from './footprintProductForm.vue'
import { cloneObject } from '/@/utils/index'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import JInput from '/@/components/Form/src/jeecg/components/JInput.vue'




// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// Refs
const tableRef = ref(null)
const footprintProductFormRef = ref()

// Reactive 数据
const loading = ref(false)
const queryParam = reactive({})
const isAss = ref(false)

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

const dataSource = ref([])

const columns = computed(() => [
  {
    title: t("carbon.message.Serial_number"),
    align: "center",
    dataIndex: "productName",
    slots: { customRender: "serialNumber" },
    width: 150,
  },
  {
    title: t("carbon.message.Name_of_technological_process"),
    align: "center",
    dataIndex: "processName",
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
    width: 220,
    slots: { customRender: "action" },
  },
])

// 生命周期
onMounted(() => {
  getData()
})

// Methods
const back = () => {
  isAss.value = false
  getData()
}

const onClose = () => {}

/**
 * 复制
 */
const onCopy = (e) => {
  console.log(e)
  isAss.value = true
  nextTick(() => {
    footprintProductFormRef.value.onType(1)
    footprintProductFormRef.value.CopyIasss = true
    footprintProductFormRef.value.onChangeStep(1, e.id)
  })
}

/**
 * 新建
 */
const onDRawer = () => {
  isAss.value = true
  nextTick(() => {
    footprintProductFormRef.value.onType(1)
    footprintProductFormRef.value.onChangeStep(1)
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
 * 编辑
 */
const onEdit = (e) => {
  isAss.value = true
  nextTick(() => {
    footprintProductFormRef.value.onChangeStep(1, e.id, 2)
    footprintProductFormRef.value.onType(2)
  })
}

/**
 * 删除工艺流程
 */
const onDelete = (item) => {
  defHttp.delete({
    url: "/CyWorkmanshipLibrary/cyWorkmanshipLibrary/delete",
    params: {
      id: item.id,
    }
  }).then((res) => {
    if (res) {
      createMessage.success(t('carbon.message.delete_success'))
      getData()
    } else {
      createMessage.error(t('carbon.message.delete_error'))
    }
  })
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
    url: "/CyWorkmanshipLibrary/cyWorkmanshipLibrary/list",
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
