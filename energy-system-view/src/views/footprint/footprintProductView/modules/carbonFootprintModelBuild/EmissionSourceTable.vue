<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-工序表单 -->
<template>
  <div>
    <a-drawer
      :title="drawerTitle"
      :width="750"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <div class="table-page-search-wrapper" v-if="visible">
        <div class="flexs">
          <div class="flexbuttons" @click="onProcessForm">
            {{ t("carbon.message.New_emission_sources") }}
          </div>
        </div>
        <div class="tabBox">
          <a-form
            :model="queryParam"
          >
            <a-row :gutter="24">
              <a-col :span="9">
                <a-form-model-item :label="t('carbon.message.Emission_source')">
                  <a-input
                    v-model="queryParam.emissionSourceName"
                    :placeholder="t('carbon.message.Please_select')"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="9">
                <a-form-model-item :label="t('carbon.message.Emission_type')">
                  <a-select
                    v-model="queryParam.emissionSourceType"
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
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
                <a-form-model-item label="" style="">
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
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="dataSource"
          :pagination="ipagination"
          @change="handleTableChange"
        >
          <template v-slot:action="props">
            <div class="m_ccFlex">
              <a @click="onExamine(props.record)">{{ t("carbon.message.Examine") }}</a>
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
    <inputAndOutputForm ref="inputAndOutputFormRef" @back="back" :disabled='disabledTweo'/>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { defHttp } from '@/utils/http/axios'
import { cloneObject } from '/@/utils/index';
import inputAndOutputForm from "./inputAndOutputForm.vue";
import img8 from '@/assets/cptzj/img8.png'

// 使用 i18n
const { t } = useI18n()

// Props定义
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emit定义
const emit = defineEmits(['back']);

// Refs
const inputAndOutputFormRef = ref(null);

// Reactive数据
const visible = ref(false);
const drawerTitle = ref("");
const productTypeData = ref([]);
const queryParam = reactive({
  emissionSourceName: "",
  emissionSourceType: "",
});
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const activeCollapseKey = ref(["0"]);
const getAllUnitByGroupData = ref({}); // 单位分组数据
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
const dataSource = ref([{ name: "1", age: "2" }]);
const disabledTweo = ref(false);

// Form对象
const formObj = ref({
  // 产出物数据,第一条为主产出物，其他为副产出物
  emissionSources: [],
  processId: '',
  emissionSourceIds: []
});

// Columns定义
const columns = [
  {
    title: t("carbon.message.Emission_source"),
    dataIndex: "emissionSourceName",
    align: "center",
  },
  {
    title: t("carbon.message.Emission_type"),
    dataIndex: "emissionSourceTypeName",
    align: "center",
  },
  {
    title: t("carbon.message.Emission_source_unit"),
    dataIndex: "emissionSourceUnitName",
    align: "center",
  },
  {
    title: t("carbon.message.Handle"),
    dataIndex: "age",
    slots: { customRender: "action" },
    align: "center",
  },
];

// Computed properties
const rowSelection = computed(() => {
  return {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      formObj.value.emissionSources = selectedRows;
    },
  };
});

// Methods
const back = () => {
  visible.value = false;
  emit('back');
};


const onExamine = async (value) => {
  console.log("formObj", value);
  let formObjData = {
    processName: '', //
    processId: value.processId, //
    id: value.id, //
    flowType: value.emissionSourceType, //
    flowTypeName: value.emissionSourceTypeName, //
    flowName: value.emissionSourceName,
    flowUnit: value.emissionSourceUnit,
    flowUnitName: value.emissionSourceUnitName,
    flowDataSources: value.dataSources,
    flowDataSourcesName: value.dataSourcesName,
    flowDataDescription: value.dataDescription,
    dataSources: String(value.dataSources), //
    factorRatio: value.factorRatio, //
    emissionFactorId: value.emissionFactorId, //
    factorValue: value.factorValue, //
    transportList: JSON.parse(JSON.stringify(value.cyEmissionSourceTransports)),
    isTransport: value.isTransport,
  };

  // 运输路段-碳排因子
  let activeCollapseKeyData = [];
  if (formObjData.transportList != null && formObjData.transportList.length > 0) {
    formObjData.weight = value.weight;
    formObjData.weightUnit = value.weightUnit;
    formObjData.weightUnitName = value.weightUnitName;
    formObjData.transportList.forEach((item, index) => {
      activeCollapseKeyData.push(String(index));
      defHttp.get({
        url: "/emission/factor/cyEmissionFactor/listInfo",
        params: {
          id: item.emissionFactorId,
        }
      }).then((res) => {
        if (res.success) {
          let selectedRows = {
            id: res.result.emissionFactorObject.id,
            name: res.result.emissionFactorObject.name,
            model: res.result.emissionFactorObject.model,
            factorValue: res.result.emissionFactorDataObject.factorValue,
            numeratorUnit: res.result.emissionFactorDataObject.numeratorUnit,
            denominatorUnit: res.result.emissionFactorDataObject.denominatorUnit,
            industry: res.result.emissionFactorObject.industry,
            releaseOrg: res.result.emissionFactorObject.releaseOrg,
            releaseYear: res.result.emissionFactorObject.releaseYear,
          };
          item.selectedRows = selectedRows;
        }
      });
    });
  }

  console.log("activeCollapseKey", activeCollapseKeyData);
  console.log("activeCollapseKey", formObjData);

  inputAndOutputFormRef.value.activeCollapseKey = activeCollapseKeyData;
  inputAndOutputFormRef.value.formObj = formObjData;

  // 基本信息-碳排因子
  let res = await defHttp.get({
    url: "/emission/factor/cyEmissionFactor/listInfo",
    params: {
      id: value.emissionFactorId,
    }
  });

  let selectedRows = {
    id: res.result.emissionFactorObject.id,
    name: res.result.emissionFactorObject.name,
    model: res.result.emissionFactorObject.model,
    factorValue: res.result.emissionFactorDataObject.factorValue,
    numeratorUnit: res.result.emissionFactorDataObject.numeratorUnit,
    denominatorUnit: res.result.emissionFactorDataObject.denominatorUnit,
    industry: res.result.emissionFactorObject.industry,
    releaseOrg: res.result.emissionFactorObject.releaseOrg,
    releaseYear: res.result.emissionFactorObject.releaseYear,
  };

  inputAndOutputFormRef.value.selectedRows = selectedRows;
  inputAndOutputFormRef.value.type = 2;
  inputAndOutputFormRef.value.formObj.processId = formObj.processId;
  inputAndOutputFormRef.value.type = 3;
  disabledTweo.value = true;
  inputAndOutputFormRef.value.getData();
  inputAndOutputFormRef.value.visible = true;
};

const onSubmit = () => {
  formObj.value.emissionSourceIds = [];
  formObj.value.emissionSources.forEach((res) => {
    formObj.value.emissionSourceIds.push(res.id);
  });

  defHttp.post({
    url: "/footprintProduct/cyFootprintProduct/batchSaveFlow",
    data: formObj.value
  }).then((res) => {
    if (res.success) {
      // this.$message.success(this.$t('message.operation_success'))
      visible.value = false;
      emit('back');
    } else {
      // this.$message.error(res.message)
    }
  });
};

/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
};

/**
 * 关闭抽屉，初始化数据
 */
const onClose = () => {
  Object.assign(formObj.value, {
    artifactList: [{}], // 产出物数据,第一条为主产出物，其他为副产出物
  });
  visible.value = false;
};

/**
 * 查询
 */
const searchQuery = () => {
  console.log("searchQuery");
  ipagination.current = 1;
  getData();
};

/**
 * 重置
 */
const searchReset = () => {
  console.log("searchReset");
  ipagination.current = 1;
  Object.assign(queryParam, { emissionSourceName: "", emissionSourceType: "" });
  getData();
};

const handleTableChange = (e) => {
  ipagination.current = e.current;
  ipagination.pageSize = e.pageSize;
  getData();
  console.log(e);
};

const getData = () => {
  let reqData = cloneObject(queryParam);
  reqData.pageNo = ipagination.current;
  reqData.pageSize = ipagination.pageSize;

  defHttp.get({
    url: "/CyEmissionSourceLibrary/cyEmissionSourceLibrary/selectEmissionSource",
    params: reqData
  }).then((res) => {
    console.log(res)
    if (res) {
      dataSource.value = res.records || [];
      ipagination.total = res.total;
    }
  });

  //类型
  defHttp.get({
    url: "/sys/dict/getDictItems/product_type",
  }).then((res) => {
    productTypeData.value = res || [];
    console.log("getDictItems product_type =>", res);
  });
};

const onProcessForm = () => {
  inputAndOutputFormRef.value.getData();
  disabledTweo.value = false;
  inputAndOutputFormRef.value.type = 1;
  inputAndOutputFormRef.value.formObj.processName = formObj.processName;
  inputAndOutputFormRef.value.formObj.lifeCycleId = formObj.lifeCycleId;
  inputAndOutputFormRef.value.formObj.processType = formObj.processType;
  inputAndOutputFormRef.value.formObj.processId = formObj.processId;
  inputAndOutputFormRef.value.formObj.calculateId = formObj.calculateId;
  inputAndOutputFormRef.value.visible = true;
  inputAndOutputFormRef.value.drawerTitle = t("carbon.message.New_emission_sources");
};


defineExpose({
  getData,
  formObj,
  drawerTitle,
  visible
});


// Lifecycle hooks
onMounted(() => {
  // 初始化逻辑
});
</script>

<style lang="less" scoped>
.tabBox {
  background: #f3f3f3;
  padding: 24px;
  margin-bottom: 16px;
  /deep/.ant-form-item {
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
  color: @primary-color;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid @primary-color;

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
