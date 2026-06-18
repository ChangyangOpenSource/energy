<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form
          ref="formRef"
          :model="model"
          :rules="validatorRules"
      >
        <div style="margin-left: 60px">
          <a-row>
            <a-col :span="24">
              <span class="spanTitle">{{ t('carbon.message.BasicInfoDetail') }}</span>
            </a-col>

            <div style="padding: 40px">
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.FillName')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.fillInName }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.FillInType')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.fillInType == 1 ? t("carbon.message.ProductCarbonFootprint") : t("carbon.message.OrganizationCarbonInventory") }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.Form_Label_SupplierName')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.fillInUserId_dictText }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.FillingProduct')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.supplierProductId_dictText }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.SpecificationModel')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.productSpecification }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.Unit')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.productUnitId_dictText }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.Inviter')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.promoterId_dictText }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.Invitation_time')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.promoteTime }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    :label="t('carbon.message.FillingRequirements')"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  {{ model.fillInRemark }}
                </a-form-item>
              </a-col>
            </div>
          </a-row>

          <!-- 碳排数据填报标题 -->
          <div class="marBotrtom">
            <span class="spanTitle">{{ t('carbon.message.CarbonDataFilling') }}</span>
          </div>

          <div class="marGina marBotrtom flex flexOne">
            <div v-if="model.fillInType == 1">
              <div class="select">
                <a-radio-group
                    :default-value="0"
                    v-model:value="model.standardType"
                    button-style="solid"
                >
                  <a-radio-button value="1"> {{ t('carbon.message.SystemMatching') }} </a-radio-button>
                  <a-radio-button value="2"> {{ t('carbon.message.ManualFilling') }} </a-radio-button>
                </a-radio-group>
              </div>
            </div>
          </div>

          <div class="marps">
            <div v-if="model.fillInType == 1" class="flex">
              <div class="nowarp marright">{{ t('carbon.message.ProductBoundary') }}:</div>
              <a-select
                  style="width: 150px;"
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
            </div>
            <div v-if="model.fillInType == 1" class="flex">
              <div class="marright">{{ t('carbon.message.accounting_cycle') }}:</div>
              <a-range-picker v-model:value="dateRange" @change="onChange" />
            </div>
            <div v-if="model.fillInType == 2" class="flex">
              <div class="marright">{{ t('carbon.message.CalculationYear') }}:</div>
              <a-date-picker
                  :placeholder="t('carbon.message.SelectYear')"
                  v-model:value="model.calculateYear"
                  allowClear
                  :format="yearFormat"
                  :value-format="yearFormat"
                  mode="year"
                  :open="yearOpen"
                  @panelChange="opanelChange"
                  @openChange="onopenelChange"
              />
            </div>
            <div class="flex">
              <div class="marright">{{ t('carbon.message.CarbonEmissions') }}:</div>
              <div style="display: flex; align-items: center">
                <a-input
                    v-model:value="model.carbonEmissions"
                    :placeholder="t('carbon.message.EnterCarbonEmissions')"
                    style="margin-right: 10px"
                ></a-input>
                <a-select
                    v-model:value="model.carbonEmissionsUnitId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
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
            </div>
          </div>

          <!-- 核算标准 -->
          <div class="marGina flex marBotrtom" v-if="model.fillInType == 2">
            <div>{{ t('carbon.message.Accounting_standard') }}：</div>
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
          </div>

          <!-- 组织碳盘查类别 -->
          <div class="marps" v-if="model.fillInType == 2">
            <div
                v-for="item in treeDate"
                :key="item.categoryId"
                class="flex flexOne"
            >
              <div class="text">{{ item.title }}</div>
              <!-- 排放源 -->
              <a-input-number
                  v-model:value="item.carbonEmissions"
                  :placeholder="t('carbon.message.Please_select')"
              ></a-input-number>
              <!-- 排放源单位 -->
              <a-select
                  v-model:value="item.carbonEmissionsUnitId"
                  :placeholder="t('carbon.message.Please_select')"
                  show-search
                  style="width: 200px; margin-left: 5px"
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
          </div>

          <!-- 产品碳足迹类别 -->
          <div class="marps" v-if="model.fillInType == 1">
            <!-- 循环生命周期总数组 -->
            <div v-for="(item,index) in productLifeCycle" :key="item.categoryId">
              <!-- 如果选择了对应的生命周期则渲染，否则不渲染 -->
              <div v-if="model.cacheLifeCycleItem && model.cacheLifeCycleItem.includes(item.categoryId)"
                   class="flex flexOne"
              >
                <div style="width:80px" >{{ item.text }}:</div>
                <!-- 排放源 -->
                <a-input-number
                    v-model:value="item.carbonEmissions"
                    :placeholder="t('carbon.message.Please_select')"
                    :disabled="selectExistCalculateDataDisabled"
                ></a-input-number>
                <!-- 排放源单位 -->
                <a-select
                    v-model:value="item.carbonEmissionsUnitId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    style="width: 200px; margin-left: 5px"
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
            </div>
          </div>

          <!-- 上传 -->
          <div class="marGina">
            <j-upload v-model:value="model.attachment" :number="3"></j-upload>
          </div>
        </div>
      </a-form>

      <!-- 驳回对话框 -->
      <a-modal v-model:visible="rejectModelVisible" :title="t('carbon.message.Reject')" @ok="handleReject">
        <a-textarea v-model:value="model.rejectReason" :placeholder="t('carbon.message.EnterRejectReason')" :rows="4" />
      </a-modal>
    </j-form-container>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import dayjs from "dayjs";
// 导入API方法
import {
  addSupplierCarbonData,
  editSupplierCarbonData,
  saveOrConfirmSubmitCarbonData,
  loadCategoryTreeRoot,
  getFactorUnits
} from './api/CySupplierCarbonDataForm.api';

const { t } = useI18n();
const { createMessage } = useMessage();

// Props
const props = defineProps({
  //表单禁用
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['ok']);

// Refs
const formRef = ref();

// Reactive data
const model = reactive({
  id: '',
  fillInName: '',
  fillInType: 1,
  fillInUserId_dictText: '',
  supplierProductId_dictText: '',
  productSpecification: '',
  productUnitId_dictText: '',
  promoterId_dictText: '',
  promoteTime: '',
  fillInRemark: '',
  standardType: '',
  lifeCycleType: undefined,
  cacheLifeCycleItem: [],
  calculateYear: undefined,
  carbonEmissions: undefined,
  carbonEmissionsUnitId: undefined,
  standardId: 'A01A02',
  attachment: '',
  rejectReason: '',
  saveOrSubmitFlag: '',
  cySupplierCarbonDataItemList: []
});

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 },
};

const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 },
};

const confirmLoading = ref(false);
const rejectModelVisible = ref(false);
const yearFormat = "YYYY";
const yearOpen = ref(false);
const unitList = ref([]);
const treeDate = ref([]);
const selectedKeys = ref([]);
const calculateProductModalVisible = ref(false);
const dateRange = ref([]);

const productBoundaryList = [
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
];

const productLifeCycle = reactive([
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

const validatorRules = {
  calculateYear: [{ required: true, message: t('carbon.message.PleaseSelectCalculationYear') }],
  carbonEmissions: [{ required: true, message: t('carbon.message.PleaseEnterCarbonEmissions') }],
};

// Computed
const formDisabled = computed(() => props.disabled);
const selectExistCalculateDataDisabled = computed(() => false); // 根据实际逻辑调整
const itemUnitDisabled = computed(() => false); // 根据实际逻辑调整

// Methods
// 审核拒绝
const reject = () => {
  rejectModelVisible.value = true;
};

// 审核通过
const examineThrough = () => {
  const modelCopy = Object.assign({}, model);
  modelCopy.fillInStatus = 4;
  editSupplierCarbonData(modelCopy).then((res) => {
    if (res.success) {
      createMessage.success(res.message);
      emit('ok');
    } else {
      createMessage.warning(res.message);
    }
  });
};

// 提交驳回
const handleReject = () => {
  const modelCopy = Object.assign({}, model);
  modelCopy.fillInStatus = 5;
  editSupplierCarbonData(modelCopy).then((res) => {
    if (res.success) {
      createMessage.success(res.message);
      emit('ok');
    } else {
      createMessage.warning(res.message);
    }
  });
};

/**
 * 时间变换
 * @param date
 * @param dateString
 */
const onChange = (date, dateString) => {
  if (date && date.length == 2) {
    model.calculateBeginTime = dayjs(date[0]).format("YYYY-MM-DD");
    model.calculateEndTime = dayjs(date[1]).format("YYYY-MM-DD");
  } else {
    model.calculateBeginTime = undefined;
    model.calculateEndTime = undefined;
  }
};

// 选择已有的核算产品
const selectCalculateProduct = () => {
  calculateProductModalVisible.value = true;
};

// 保存或确认提交
const saveOrConfirmSubmit = (flag) => {
  // 赋值碳数据详情数据
  model.cySupplierCarbonDataItemList = treeDate.value;
  // 设置保存或确认提交的标志
  model.saveOrSubmitFlag = flag;
  // 保存
  saveOrConfirmSubmitCarbonData(model).then((res) => {
    if (res.success) {
      createMessage.success(res.message);
      emit("ok");
    } else {
      createMessage.warning(res.message);
    }
  });
};

//过长省略
const ellipsis = (value) => {
  return value
      .split(" ")
      .map((v) => (v.length > 18 ? v.substr(0, 18) + "..." : v))
      .join(" ");
};

const standardChange = () => {
  model.standardGhgDetailIds = null;
  model.standardIsoDetailIds = null;
  loadTreeRoot(model.standardId);
};

/**
 * 核算标准
 */
const loadTreeRoot = (pcode) => {
  loadCategoryTreeRoot({
    pcode: pcode,
    async: false,
  }).then((res) => {
    if (res.success) {
      // 将对象进行重构
      res.result.forEach((item, index, array) => {
        // 完全替换原对象
        array[index] = {
          supplierCarbonDataId: model.id, // 供应商碳数据id
          fillInType: model.fillInType, // 填报类型
          categoryId: item.key, // 类别id
          title: item.title, // 类别标题
          carbonEmissions: 0, // 排放量
          carbonEmissionsUnitId: undefined, // 排放量单位
        };
        // 查找匹配的索引
        const existingIndex =
            model.cySupplierCarbonDataItemList.findIndex(
                (dataItem) => dataItem.categoryId == item.key
            );
        // 如果找到匹配项,重新赋值排放量和单位
        if (existingIndex !== -1) {
          array[index].carbonEmissions =
              model.cySupplierCarbonDataItemList[
                  existingIndex
                  ].carbonEmissions;
          array[index].carbonEmissionsUnitId =
              model.cySupplierCarbonDataItemList[
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

  if (e.selectedNodes[0]?.dataRef?.leaf) {
    standardDetailIds = selectedKeys[0];
  } else {
    standardDetailIds = e.selectedNodes[0]?.dataRef?.children
        ?.map((item) => item.key)
        ?.join(",") || "";
  }
  if (model.standardId == "A01A01") {
    model.standardGhgDetailIds = standardDetailIds;
  } else {
    model.standardIsoDetailIds = standardDetailIds;
  }
};

// 获取所有单位
const getAllUnit = () => {
  getFactorUnits().then((res) => {
    if (res.success) {
      unitList.value = res.result.records || [];
    }
  });
};

/**
 *时间选择
 */
const onopenelChange = (status) => {
  yearOpen.value = status;
};

const opanelChange = (value, mode) => {
  console.log(value, mode);
  model.calculateYear = dayjs(value).format("YYYY");
  yearOpen.value = false;
};

const add = () => {
  // 备份model原始值
  const modelDefault = JSON.parse(JSON.stringify(model));
  edit(modelDefault);
};

const edit = (record) => {
  Object.assign(model, record);

  // 如果是产品碳足迹类型的，则查询产品边界
  if (model.fillInType == 1) {
    // 将生命周期明细字符串，切割为数组
    if(model.lifeCycleItem && model.lifeCycleItem != ""){
      model.cacheLifeCycleItem = model.lifeCycleItem.split(",")
    }
    // 循环赋值，用于回显生命周期详细
    if(model.cySupplierCarbonDataItemList && model.cySupplierCarbonDataItemList.length > 0){
      for(let i=0; i < model.cySupplierCarbonDataItemList.length; i++){
        for(let j=0; j < productLifeCycle.length; j++){
          if(productLifeCycle[j].categoryId == model.cySupplierCarbonDataItemList[i].categoryId){
            productLifeCycle[j].carbonEmissions = model.cySupplierCarbonDataItemList[i].carbonEmissions
            productLifeCycle[j].carbonEmissionsUnitId = model.cySupplierCarbonDataItemList[i].carbonEmissionsUnitId
          }
        }
      }
    }
    // 如果是组织碳盘查类型的，则查询核算标准
  } else {
    // 如果是查看页面，那么核算标准的id就不为空，就直接查询核算id下的所有分类
    if(model.standardId){
      loadTreeRoot(model.standardId);
    }else{
      // 如果是新增页面，那么核算标准的id为空，则给出一个默认的核算标准值（iso标准）
      model.standardId = "A01A02";
      loadTreeRoot(model.standardId);
    }
  }
};

// 提交表单（保存或确认提交页面数据）
const submitForm = () => {
  // 触发表单验证
  formRef.value?.validate().then(() => {
    confirmLoading.value = true;
    if (!model.id) {
      addSupplierCarbonData(model)
          .then((res) => {
            if (res.success) {
              createMessage.success(res.message);
              emit("ok");
            } else {
              createMessage.warning(res.message);
            }
          })
          .finally(() => {
            confirmLoading.value = false;
          });
    } else {
      editSupplierCarbonData(model)
          .then((res) => {
            if (res.success) {
              createMessage.success(res.message);
              emit("ok");
            } else {
              createMessage.warning(res.message);
            }
          })
          .finally(() => {
            confirmLoading.value = false;
          });
    }
  }).catch(() => {
    console.log('Validation failed');
  });
};


const productBoundaryChange = (value) => {
  console.log('Product boundary changed:', value);
};

// Lifecycle
onMounted(() => {
  getAllUnit();
});

// Expose methods
defineExpose({
  edit,
  add,
  submitForm,
  reject,
  examineThrough
});
</script>

<style lang="less" scoped>
.nowarp{
  white-space: nowrap;
}
.marright {
  margin-right: 8px;
}
.marBotrtom {
  margin-bottom: 24px;
}
.marGina {
  margin-left: 42px;
}
.text {
  width: 350px;
}
.marps {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-left: 42px;
  margin-bottom: 24px;
}

.flex {
  display: flex;
  align-items: center;
}
.flexOne {
  flex: 1;
}
.spanTitle {
  margin: 100px 0 500px 0;
  font-size: 20px;
  font-weight: 900;
}
</style>
