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
                    <a-form-item :label="t('carbon.message.Name_of_emission_source')">
                      <a-input
                        v-model:value="queryParam.emissionSourceName"
                        allowClear
                        :placeholder="t('carbon.message.Please_enter')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="t('carbon.message.Type_selection')">
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
                  <a-col :span="6">
                    <a-form-item label="" style="">
                      <div
                        style="
                          width: 100%;
                          display: flex;
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
              <img class="img3" :src="img3" alt="" />
              <div class="twsr">
                {{ t("carbon.message.New_emission_sources") }}
              </div>
            </div>
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
                  <template v-if="column.dataIndex === 'SerialNumber'">
                    {{ index + 1 }}
                  </template>

                  <template v-if="column.dataIndex === 'action'">
                    <div class="m_cbFlex" style="padding: 0 5px">
                      <a @click="onEdit(record)">{{ t("carbon.message.Edit") }}</a>
                      <a @click="onCopy(record)">{{ t("carbon.message.Copy") }}</a>
                      <a @click="onDelete(record)">{{ t("carbon.message.Delete") }}</a>
                    </div>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 输入输出表单弹窗 -->
    <inputAndForm ref="inputAndFormRef" :disabled="disabled" @back="back" />

    <!-- 删除弹框 -->
    <a-modal
      :title="t('carbon.message.Tip')"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>
        {{
          t(
            "carbon.message.Is_it_confirmed_to_delete_this_emission_source_After_deletion_it_cannot_be_recovered_This_operation_does_not_affect_the_previously_referenced_models"
          )
        }}
      </p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { cloneObject } from '/@/utils/index';
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import inputAndForm from "./inputAndForm.vue";

// 导入图片资源
import img3 from '@/assets/cptzj/img3.png'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

const inputAndFormRef = ref();


// 定义响应式数据
const loading = ref(false);
const queryParam = ref({});
const columns = ref([
  {
    title: t("carbon.message.Serial_number"),
    align: "center",
    dataIndex: "SerialNumber",
    scopedSlots: { customRender: "SerialNumber" },
    width: 150,
  },
  {
    title: t("carbon.message.Name_of_emission_source"),
    align: "center",
    dataIndex: "emissionSourceName",
    width: 150,
  },
  {
    title: t("carbon.message.Type"),
    align: "center",
    dataIndex: "emissionSourceTypeName",
    width: 150,
  },
  {
    title: t("carbon.message.Unit"),
    align: "center",
    dataIndex: "emissionSourceUnitName",
    width: 150,
  },
  {
    title: t("carbon.message.Update_person"),
    align: "center",
    dataIndex: "updateBy_dictText",
    width: 70,
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
    scopedSlots: { customRender: "action" },
  },
]);
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
const dataSource = ref([]); // 数据
const disabled = ref(false);
const visible = ref(false);
const productTypeData = ref([]);
const listObj = ref({});
const delteId = ref("");

// 页面创建时获取数据
onMounted(() => {
  getData();
  getDictItems();
});

// 方法定义
function onDRawer() {
  inputAndFormRef.value.isAss = 1;
  inputAndFormRef.value.activeKey = '1';
  inputAndFormRef.value.getData();
  inputAndFormRef.value.visible = true;
}

function back() {
  getData();
}

function handleCancel() {
  visible.value = false;
}

/**
 * 删除
 */
function onDelete(value) {
  delteId.value = value.id;
  visible.value = true;
}

function handleOk() {
  defHttp.delete({
    url: "/CyEmissionSourceLibrary/cyEmissionSourceLibrary/delete",
    params: {
      id: delteId.value,
    }
  }, {joinParamsToUrl: true}).then((res) => {
    if (res) {
      getData();
      visible.value = false;
    }
  });
}

/**
 * 复制
 */
async function onCopy(value) {
  await inputAndFormRef.value.getData();
  defHttp.get({
    url: "/CyEmissionSourceLibrary/cyEmissionSourceLibrary/queryById",
    params: {
      id: value.id,
    }
  }).then((res) => {
    if (res) {
      listObj.value = res;
      inputAndFormRef.value.isAss = 1;
      inputAndFormRef.value.activeKey = '1';
      Object.assign(inputAndFormRef.value.formObj, listObj.value)
      inputAndFormRef.value.formObj.id = '';
      inputAndFormRef.value.listInfo(1);
      inputAndFormRef.value.listObjUpdate();
    }
  });
}

/**
 * 编辑
 */
async function onEdit(value) {
  await inputAndFormRef.value.getData();
  defHttp.get({
    url: "/CyEmissionSourceLibrary/cyEmissionSourceLibrary/queryById",
    params: {
      id: value.id,
    }
  }).then((res) => {
    if (res) {
      listObj.value = res;
      inputAndFormRef.value.isAss = 2;
      inputAndFormRef.value.activeKey = '1';
      Object.assign(inputAndFormRef.value.formObj, listObj.value)
      inputAndFormRef.value.listInfo(1);
      inputAndFormRef.value.listObjUpdate();
    }
  });
}

/**
 * 下拉框数据过滤
 */
function filterOption(input, option) {
  return (
    option.componentOptions.children[0].text
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
  );
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

function getData() {
  let reqData = cloneObject(queryParam.value);
  reqData.pageNo = ipagination.current;
  reqData.pageSize = ipagination.pageSize;
  defHttp.get({
    url: "/CyEmissionSourceLibrary/cyEmissionSourceLibrary/list",
    params: reqData
  }).then((res) => {
    if (res) {
      dataSource.value = res.records || [];
      ipagination.total = res.total;
    }
  });
}

//类型
function getDictItems() {
  defHttp.get({
    url: `/sys/dict/getDictItems/product_type`
  }).then((res) => {
    productTypeData.value = res || [];
    console.log("getDictItems product_type =>", res);
  });
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
