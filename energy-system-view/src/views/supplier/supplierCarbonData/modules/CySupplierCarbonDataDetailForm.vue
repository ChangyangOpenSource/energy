<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="formDisabled">
      <a-form
        ref="formRef"
        :model="model"
        :rules="validatorRules"
      >
        <!-- 基本信息 -->
        <a-row>
          <a-col :span="24">
            <div class="form-title">{{ t('carbon.message.BasicInfoDetail') }}</div>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.FillName')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.fillInName }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.FillInType')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.fillInType == 1 ? t('carbon.message.ProductCarbonFootprint') : t('carbon.message.OrganizationCarbonInventory') }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Form_Label_SupplierName')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.fillInUserId_dictText }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.FillingProduct')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.supplierProductId_dictText }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Specifications_and_models')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.productSpecification }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Unit')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.productUnitId_dictText }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Inviter')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.promoterId_dictText }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Invitation_time')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.promoteTime }}
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.FillingRequirements')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              {{ model.fillInRemark }}
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 碳排数据填报标题 -->
        <a-row>
          <a-col :span="24">
            <div class="form-title marTop">{{ t('carbon.message.CarbonDataFilling') }}</div>
          </a-col>
        </a-row>

        <!-- 填报类型选择 -->
        <a-row v-if="model.fillInType == 1">
          <a-col :span="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div class="select">
                <a-radio-group
                  :default-value="0"
                  v-model:value="model.standardType"
                  button-style="solid"
                >
                  <a-radio-button :value="'1'"> {{ t('carbon.message.SystemMatching') }} </a-radio-button>
                  <a-radio-button :value="'2'"> {{ t('carbon.message.ManualFilling') }} </a-radio-button>
                </a-radio-group>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 产品碳足迹填写项 -->
        <a-row :gutter="24" v-if="model.fillInType == 1">
          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.ProductBoundary')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                style="width: 200px"
                v-model:value="model.lifeCycleType"
                :placeholder="t('carbon.message.Please_select')"
                show-search
                @change="productBoundaryChange"
              >
                <a-select-option
                  v-for="item in productBoundaryList"
                  :key="item.lifeCycleType"
                  :value="item.lifeCycleType"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.accounting_cycle')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-range-picker
                v-model:value="dateRange"
                style="width: 240px"
                @change="onChange"
              />
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.accountingUnit')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div style="display: flex; align-items: center">
                <a-input
                  v-model:value="model.calculateUnitNumber"
                  :placeholder="t('carbon.message.EnterCarbonEmissions')"
                  style="margin-right: 10px; width: 200px"
                ></a-input>
                <div style="margin-left:10px">
                  {{model.productUnitId_dictText}}
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 组织碳盘查填写项 -->
        <a-row :gutter="24" v-if="model.fillInType == 2">
          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Accounting_standard')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div class="select">
                <a-radio-group
                  :default-value="0"
                  v-model:value="model.standardId"
                  button-style="solid"
                  @change="standardChange"
                >
                  <a-radio-button value="A01A02"> ISO </a-radio-button>
                  <a-radio-button value="A01A01"> GHG </a-radio-button>
                </a-radio-group>
              </div>
            </a-form-item>
          </a-col>

          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.CalculationYear')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-date-picker
                style="width: 200px"
                :placeholder="t('carbon.message.SelectYear')"
                v-model:value="model.calculateYear"
                allowClear
                :format="yearFormat"
                :valueFormat="yearFormat"
                mode="year"
                :open="yearOpen"
                @panelChange="opanelChange"
                @openChange="onopenelChange"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 碳排放总量 -->
        <a-row :gutter="24">
          <a-col :xl="16" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.CarbonEmissions')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div style="display: flex; align-items: center">
                <a-input
                  v-model:value="model.carbonEmissions"
                  :placeholder="t('carbon.message.EnterCarbonEmissions')"
                  style="margin-right: 10px; width: 200px"
                ></a-input>
                <a-select
                  v-model:value="model.carbonEmissionsUnitId"
                  :placeholder="t('carbon.message.Please_select')"
                  show-search
                  style="width: 200px"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in unitList"
                    :key="index"
                  >
                    {{ item.factorUnit }}
                  </a-select-option>
                </a-select>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 组织碳盘查类别 -->
        <a-row :gutter="24" v-if="model.fillInType == 2">
          <a-col :xl="22" :lg="12" :md="12" :sm="24">
            <div
              v-for="item in treeDate"
              :key="item.categoryId"
              class="category-item"
            >
              <a-form-item
                :label="item.title"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <div style="display: flex; align-items: center">
                  <!-- 排放源 -->
                  <a-input-number
                    v-model:value="item.carbonEmissions"
                    :placeholder="t('carbon.message.Please_select')"
                    style="margin-right: 10px;width: 200px"
                  ></a-input-number>
                  <!-- 排放源单位 -->
                  <a-select
                    v-model:value="item.carbonEmissionsUnitId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    style="width: 200px"
                  >
                    <a-select-option
                      :value="unitItem.id"
                      v-for="(unitItem, index) in unitList"
                      :key="index"
                    >
                      {{ unitItem.factorUnit }}
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-item>
            </div>
          </a-col>
        </a-row>

        <!-- 产品碳足迹类别 -->
        <a-row :gutter="24" v-if="model.fillInType == 1">
          <a-col :xl="16" :lg="12" :md="12" :sm="24">
            <div
              v-for="(item,index) in productLifeCycle"
              :key="item.categoryId"
            >
              <!-- 如果选择了对应的生命周期则渲染，否则不渲染 -->
              <div v-if="model.cacheLifeCycleItem && model.cacheLifeCycleItem.includes(item.categoryId)">
                <a-form-item
                  :label="item.text"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <div style="display: flex; align-items: center">
                    <!-- 排放源 -->
                    <a-input-number
                      v-model:value="item.carbonEmissions"
                      :placeholder="t('carbon.message.Please_select')"
                      :disabled="selectExistCalculateDataDisabled"
                      style="margin-right: 10px; flex: 1"
                    ></a-input-number>
                    <!-- 排放源单位 -->
                    <a-select
                      v-model:value="item.carbonEmissionsUnitId"
                      :placeholder="t('carbon.message.Please_select')"
                      show-search
                      style="width: 150px"
                      :disabled="itemUnitDisabled"
                    >
                      <a-select-option
                        :value="unitItem.id"
                        v-for="(unitItem, index) in unitList"
                        :key="index"
                      >
                        {{ unitItem.factorUnit }}
                      </a-select-option>
                    </a-select>
                  </div>
                </a-form-item>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- 数据证书上传 -->
        <a-row :gutter="24">
          <a-col :xl="8" :lg="12" :md="12" :sm="24">
            <a-form-item
              :label="t('carbon.message.Data_certificate')"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <JUpload v-model:value="model.attachment" :number="3"></JUpload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!-- 驳回对话框 -->
      <a-modal v-model:visible="rejectModelVisible"  :title="t('carbon.message.Reject')"  @ok="handleReject">
        <a-textarea v-model:value="model.rejectReason"  :placeholder="t('carbon.message.EnterRejectReason')"  :rows="4" />
      </a-modal>
    </JFormContainer>
  </a-spin>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps, defineEmits } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import dayjs from "dayjs";
import JUpload from "@/components/Form/src/jeecg/components/JUpload/JUpload.vue";
import JFormContainer from "@/components/Form/src/jeecg/components/JFormContainer.vue";

// 使用i18n
const { t } = useI18n()

// 定义props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

// 定义emits
const emit = defineEmits(['ok']);

// 响应式数据
const model = ref({});
const labelCol = { xs: { span: 24 }, sm: { span: 6 } };
const wrapperCol = { xs: { span: 24 }, sm: { span: 18 } };
const confirmLoading = ref(false);
const validatorRules = {
  calculateYear: [{ required: true, message: t('carbon.message.SelectCalculationYear') }],
  carbonEmissions: [{ required: true, message: t('carbon.message.EnterCarbonEmissions')  }]
};
const url = {
  add: "/cySupplierCarbonData/add",
  edit: "/cySupplierCarbonData/edit",
  queryById: "/cySupplierCarbonData/queryById",
  saveOrConfirmSubmit: "/cySupplierCarbonDataItem/saveOrConfirmSubmit"
};
const yearFormat = "YYYY";
const yearOpen = ref(false);
const unitList = ref([]);
const treeDate = ref([]);
const selectedKeys = ref([]);
const calculateProductModalVisible = ref(false);
const dateRange = ref([]);
const productBoundaryList = ref([
  {
    "lifeCycleType": "1",
    "text": t('carbon.message.From_cradle_to_gate'),
  },
  {
    "lifeCycleType": "2",
    "text": t('carbon.message.From_cradle_to_grave'),
  },
  {
    "lifeCycleType": "3",
    "text": t('carbon.message.Custom_life_cycle'),
  }
]);
const rejectModelVisible = ref(false);
const productLifeCycle = ref([
  {
    "categoryId": "1",
    "text": t('carbon.message.RawMaterialAcquisition'),
    "carbonEmissions": undefined,
    "carbonEmissionsUnitId": undefined,
  },
  {
    "categoryId": "2",
    "text": t('carbon.message.ProductionManufacturing'),
    "carbonEmissions": undefined,
    "carbonEmissionsUnitId": undefined,
  },
  {
    "categoryId": "3",
    "text": t('carbon.message.DistributionStorage'),
    "carbonEmissions": undefined,
    "carbonEmissionsUnitId": undefined,
  },
  {
    "categoryId": "4",
    "text": t('carbon.message.ProductUsage'),
    "carbonEmissions": undefined,
    "carbonEmissionsUnitId": undefined,
  },
  {
    "categoryId": "5",
    "text": t('carbon.message.WasteDisposal'),
    "carbonEmissions": undefined,
    "carbonEmissionsUnitId": undefined,
  }
]);

// 计算属性
const formDisabled = computed(() => props.disabled);

// refs
const formRef = ref(null);

// 备份model原始值
let modelDefault = {};

// 生命周期钩子
onMounted(() => {
  modelDefault = JSON.parse(JSON.stringify(model.value));
  getAllUnit();
});

// 方法定义
const reject = () => {
  rejectModelVisible.value = true;
};

const examineThrough = () => {
  let tempModel = Object.assign({}, model.value);
  tempModel.fillInStatus = 4;
  defHttp.post({url: url.edit, params: tempModel}, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // 消息提示需要相应调整
      emit('ok');
    } else {
      // 消息提示需要相应调整
    }
  });
};

const handleReject = () => {
  let tempModel = Object.assign({}, model.value);
  tempModel.fillInStatus = 5;
  defHttp.post({url: url.edit, params: tempModel}, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // 消息提示需要相应调整
      emit('ok');
    } else {
      // 消息提示需要相应调整
    }
  });
};

const onChange = (date, dateString) => {
  if (date.length == 2) {
    model.value.calculateBeginTime = dayjs(date[0].toDate()).format('YYYY-MM-DD')
    model.value.calculateEndTime = dayjs(date[1].toDate()).format('YYYY-MM-DD')
  } else {
    // 注意：这里可能需要调整，因为queryParam未定义
    // this.queryParam.startTime = undefined;
    // this.queryParam.endTime = undefined;
  }
};

const selectCalculateProduct = () => {
  calculateProductModalVisible.value = true;
};

const saveOrConfirmSubmit = (flag) => {
  model.value.cySupplierCarbonDataItemList = treeDate.value;
  model.value.saveOrSubmitFlag = flag;
  defHttp.post({url: url.saveOrConfirmSubmit, params: model.value}, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // 消息提示需要相应调整
      emit("ok");
    } else {
      // 消息提示需要相应调整
    }
  });
};

const ellipsis = (value) => {
  return value
    .split(" ")
    .map((v) => (v.length > 18 ? v.substr(0, 18) + "..." : v))
    .join(" ");
};

const standardChange = () => {
  model.value.standardGhgDetailIds = null;
  model.value.standardIsoDetailIds = null;
  loadTreeRoot(model.value.standardId);
};

const loadTreeRoot = (pcode) => {
  defHttp.get({url: "/sys/category/loadTreeRoot", params: {
      pcode: pcode,
      async: false,
    }}, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      res.result.forEach((item, index, array) => {
        array[index] = {
          supplierCarbonDataId: model.value.id,
          fillInType: model.value.fillInType,
          categoryId: item.key,
          title: item.title,
          carbonEmissions: 0,
          carbonEmissionsUnitId: undefined,
        };
        const existingIndex =
          model.value.cySupplierCarbonDataItemList?.findIndex(
            (dataItem) => dataItem.categoryId == item.key
          );
        if (existingIndex !== -1) {
          array[index].carbonEmissions =
            model.value.cySupplierCarbonDataItemList[
              existingIndex
              ].carbonEmissions;
          array[index].carbonEmissionsUnitId =
            model.value.cySupplierCarbonDataItemList[
              existingIndex
              ].carbonEmissionsUnitId;
        }
      });
      treeDate.value = res.result;
    }
  });
};

const onSelect = (selectedKeys, e) => {
  selectedKeys.value = selectedKeys;
  let standardDetailIds = "";

  if (e.selectedNodes[0].data.props.dataRef.leaf) {
    standardDetailIds = selectedKeys[0];
  } else {
    standardDetailIds = e.selectedNodes[0].data.props.dataRef.children
      .map((item) => item.key)
      .join(",");
  }
  if (model.value.standardId == "A01A01") {
    // 注意：这里的form未定义，可能需要调整
    // this.form.standardGhgDetailIds = standardDetailIds;
  } else {
    // this.form.standardIsoDetailIds = standardDetailIds;
  }
  // getData(1); // 注意：getData未定义
};

const getAllUnit = () => {
  defHttp.get({url: "/CyFactorUnit/cyFactorUnit/list"}, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      unitList.value = res.result.records || [];
    }
  });
};

const onopenelChange = (status) => {
  yearOpen.value = status;
};

const opanelChange = (value, mode) => {
  console.log(value, mode);
  model.value.calculateYear = dayjs(value).format("YYYY");
  yearOpen.value = false;
};

const add = () => {
  edit(modelDefault);
};

const edit = (record) => {
  model.value = Object.assign({}, record);
  // visible = true; // 注意：visible未定义

  if (model.value.fillInType == 1) {
    if(model.value.lifeCycleItem && model.value.lifeCycleItem != ""){
      model.value.cacheLifeCycleItem = model.value.lifeCycleItem.split(",")
    }
    if(model.value.cySupplierCarbonDataItemList && model.value.cySupplierCarbonDataItemList.length > 0){
      for(let i=0; i < model.value.cySupplierCarbonDataItemList.length; i++){
        for(let j=0; j < productLifeCycle.value.length; j++){
          if(productLifeCycle.value[j].categoryId == model.value.cySupplierCarbonDataItemList[i].categoryId){
            productLifeCycle.value[j].carbonEmissions = model.value.cySupplierCarbonDataItemList[i].carbonEmissions
            productLifeCycle.value[j].carbonEmissionsUnitId = model.value.cySupplierCarbonDataItemList[i].carbonEmissionsUnitId
          }
        }
      }
    }
    dateRange.value[0] = dayjs(model.value.calculateBeginTime)
    dateRange.value[1] = dayjs(model.value.calculateEndTime)
  } else {
    if(model.value.standardId){
      loadTreeRoot(model.value.standardId);
    }else{
      model.value.standardId = "A01A02";
      loadTreeRoot(model.value.standardId);
    }
  }
};

const submitForm = () => {
  formRef.value.validate().then(() => {
    if (valid) {
      confirmLoading.value = true;
      let httpurl = "";
      if (!model.value.id) {
        httpurl += url.add;
      } else {
        httpurl += url.edit;
      }

      // 根据请求类型选择不同的方法
      const requestMethod = !model.value.id ? 'post' : 'put';

      defHttp[requestMethod]({url: httpurl, params: model.value}, { isTransformResponse: false})
        .then((res) => {
          if (res.success) {
            // 消息提示需要相应调整
            emit("ok");
          } else {
            // 消息提示需要相应调整
          }
        })
        .finally(() => {
          confirmLoading.value = false;
        });
    }
  });
};

defineExpose({
  add,
  edit,
  examineThrough,
  reject
})

</script>

<style lang="less" scoped>
.form-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.marTop {
  margin-top: 30px;
}

.category-item {
  margin-bottom: 10px;
}

.select {
  width: 100%;
}
</style>
