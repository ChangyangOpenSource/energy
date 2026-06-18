<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form
                :model="queryParam"
                @keyup.enter.native="searchQuery"
              >
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-item :label="t('carbon.message.Product_name')">
                      <a-input
                        v-model:value="queryParam.productName"
                        allowClear
                        :placeholder="t('carbon.message.Please_enter')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="" style="">
                      <div
                        style="
                          width: 100%;
                          display: flex;
                        "
                      >
                        <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">{{
                            t("carbon.message.Search")
                          }}</a-button>
                        <a-button
                          style="margin-left: 8px"
                          @click="searchReset"
                          preIcon="ant-design:search-outlined"
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
            <div class="m_mt24">
              <a-table
                ref="table"
                :columns="columns"
                :dataSource="dataSource"
                :loading="loading"
                :pagination="ipagination"
                :scroll="{ x: true }"
                :bordered="false"
                class=""
                rowKey="id"
                size="middle"
                @change="handleTableChange"
              >

                <template v-slot:bodyCell="{ column, record, index, text }">
                  <template v-if="column.dataIndex === 'Unit'">
                    {{ record.numeratorUnit }}/{{ record.denominatorUnit }}
                  </template>

                  <template v-if="column.dataIndex === 'productWeight'">
                    {{ record.productWeight }}{{ record.productWeightUnit }}
                  </template>

                  <template v-if="column.dataIndex === 'dateRange'">
                    <div class="">
                      {{ record.beginTime ? record.beginTime.slice(0, 10) : "" }}
                    </div>
                    <div>{{ t("carbon.message.to") }}</div>
                    <div class="">
                      {{ record.endTime ? record.endTime.slice(0, 10) : "" }}
                    </div>
                  </template>

                  <template v-if="column.dataIndex === 'lifeCycleType'">
                    <div class="" v-if="text == 1">
                      {{ t("carbon.message.From_cradle_to_gate") }}
                    </div>
                    <div class="" v-else-if="text == 2">
                      {{ t("carbon.message.From_cradle_to_grave") }}
                    </div>
                    <div class="" v-else-if="text == 3">
                      {{ t("carbon.message.Customize") }}
                    </div>
                  </template>

                  <template v-if="column.dataIndex === 'calculateNumber'">
                    {{ record.calculateNumber }}{{ record.productUnitName }}
                  </template>

                  <template v-if="column.dataIndex === 'action'">
                    <div class="m_cbFlex" style="padding: 0 5px">
                      <a @click="onUpData(record)">{{ t("carbon.message.Edit") }}</a>

                      <a @click="onPreview(record)">{{ t("carbon.message.Preview") }}</a>

                      <a @click="onDownload(record)">{{
                          t("carbon.message.Download")
                        }}</a>
                      <a-popconfirm
                        :title="t('carbon.message.Confirm_delete')"
                        :cancelText="t('carbon.message.Cancel')"
                        :okText="t('carbon.message.Confirm')"
                        @confirm="() => onDelete(record)"
                      >
                        <a>{{ t("carbon.message.Delete") }}</a>
                      </a-popconfirm>
                    </div>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <a-modal
      :footer="null"
      :visible="isShowDetailPopup"
      @cancel="handleCancel"
      :width='850'
    >
      <vue-office-docx :src="docUrl"></vue-office-docx>
    </a-modal>
    <!--  碳足迹报告弹窗  -->

    <section class="m_popupBox" style="overflow: hidden" v-if="GenerateAcar">
      <GenerateAcarbonfoot ref="generateRef" @back="onBack" />
    </section>
  </div>
</template>

<script setup>
import { cloneObject } from '/@/utils/index';
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
// import VueOfficeDocx from '@vue-office/docx'
import GenerateAcarbonfoot from "../../module_managePlatform/GenerateAcarbonfoot/index.vue";
import {nextTick, ref,reactive,onMounted} from "vue";

// 使用 i18n
const { t } = useI18n();
const { createMessage } = useMessage()

// 定义响应式数据
const loading = ref(false);
const queryParam = ref({});
const isShowDetailPopup = ref(false);
const docUrl = ref("");
const GenerateAcar = ref(false);
// 定义 ref
const generateRef = ref();


// 表格列配置
const columns = [
  {
    title: t("carbon.message.Product_name"),
    align: "center",
    dataIndex: "productName",
    width: 150,
  },
  {
    title: t("carbon.message.Product_NO"),
    align: "center",
    dataIndex: "productCode",
    width: 150,
  },
  {
    title: t("carbon.message.Carbon_emissions"),
    align: "center",
    dataIndex: "carbonEmissionTotal",
    width: 150,
  },
  {
    title: t("carbon.message.Specifications_and_models"),
    align: "center",
    dataIndex: "productSpecification",
    width: 150,
  },
  {
    title: t("carbon.message.Unit"),
    align: "center",
    dataIndex: "productUnitName",
    width: 70,
  },
  {
    title: t("carbon.message.Product_weight"),
    align: "center",
    dataIndex: "productWeight",
    scopedSlots: { customRender: "productWeight" },
    width: 150,
  },
  {
    title: t("carbon.message.Accounting_quantity"),
    align: "center",
    dataIndex: "calculateNumber",
    width: 70,
  },
  {
    title: t("carbon.message.Life_cycle_boundary"),
    align: "center",
    dataIndex: "lifeCycleType",
    scopedSlots: { customRender: "lifeCycleType" },
    width: 150,
  },
  {
    title: t("carbon.message.Data_cycle"),
    align: "center",
    dataIndex: "dateRange",
    scopedSlots: { customRender: "dateRange" },
    width: 150,
  },
  {
    title: t("carbon.message.Founder"),
    align: "center",
    dataIndex: "createBy",
    width: 70,
  },
  {
    title: t("carbon.message.Create_date"),
    align: "center",
    dataIndex: "createTime",
    width: 150,
  },
  {
    title: t("carbon.message.Handle"),
    dataIndex: "action",
    align: "center",
    fixed: "right",
    width: 160,
    scopedSlots: { customRender: "action" },
  },
];

// 分页配置
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
});

// 数据源
const dataSource = ref([]);

// 获取数据
function getData() {
  let reqData = cloneObject(queryParam.value);
  reqData.pageNo = ipagination.current;
  reqData.pageSize = ipagination.pageSize;
  defHttp.get({
    url: "/footprintProduct/cyFootprintProduct/getReport",
    params: reqData
  }).then((res) => {
    if (res) {
      dataSource.value = res.records || [];
      ipagination.total = res.total;
    }
  });
}

// 页面创建时获取数据
onMounted(() => {
  getData();
});

// 方法定义
function onBack() {
  GenerateAcar.value = false;
  getData();
}

function handleCancel() {
  isShowDetailPopup.value = false;
}

/**
 * 编辑
 */
function onUpData(item) {
  console.log(item);
  GenerateAcar.value = true;
  nextTick(() => {
    generateRef.value.type = 2;
    generateRef.value.formObj.calculateId = item.id;
    generateRef.value.getReportParams();
  });
}

/**
 * 预览
 */
function onPreview(item) {
  isShowDetailPopup.value = true;
  docUrl.value = window._CONFIG["staticDomainURL"] + "/" + item.reportAddress;
}

/**
 * 下载碳足迹报告
 */
function onDownload(item) {
  let url = window._CONFIG["staticDomainURL"] + "/" + item.reportAddress;
  console.log("onDownloadReport", url);
  window.open(url, "_blank");
}

/**
 * 删除碳足迹报告
 */
function onDelete(item) {
  defHttp.post({
    url: "/footprintProduct/cyFootprintProduct/delReport",
    params: {
      calculateId: item.id,
    }
  }).then((res) => {
    if (res) {
      createMessage.success(t("carbon.message.delete_success"));
      getData();
    }
  });
}

/**
 * 查询
 */
function searchQuery() {
  console.log("searchQuery");
  ipagination.current = 1;
  getData();
}

/**
 * 重置
 */
function searchReset() {
  console.log("searchReset");
  queryParam.value = {};
  ipagination.current = 1;
  getData();
}

function handleTableChange(pagination) {
  console.log(pagination);
  Object.assign(ipagination, pagination);
  getData();
}
</script>

<style lang="less" scoped>
/deep/.ant-modal {
  padding: 0 !important;
  /deep/.docx-wrapper {
    background: #ffffff;
  }
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
