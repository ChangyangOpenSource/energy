<template>
  <div class="">
    <section class="cardBox" style="">
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item :label="t('carbon.message.Factor_name')" required>
            <a-input
                v-model:value="queryParam.name"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
                :max-length="32"
            />
          </a-form-item>

          <a-form-item :label="t('carbon.message.Factor_unit')" required>
            <div class="m_cFlex">
              <a-select
                  v-model:value="queryParam.numeratorUnitId"
                  :placeholder="t('carbon.message.Please_select')"
                  show-search
                  :filter-option="filterOption"
                  @change="onChangeNumeratorUnitId"
              >
                <a-select-option
                    :value="item.id"
                    v-for="(item,index) in fzData"
                    :key="index"
                >
                  {{ item.factorUnit }}
                </a-select-option>
              </a-select>
              <span style="margin: 0 10px;">/</span>
              <UnitCascader :unitId="queryParam.denominatorUnitId" v-model:value="queryParam.denominatorUnitId" @change="(value, label) => onChangeDenominatorUnitId(value, label)"  ></UnitCascader>
            </div>
          </a-form-item>

          <a-form-item :label="t('carbon.message.Factor_description')">
            <a-input
                v-model:value="queryParam.instruction"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
                :max-length="512"
            />
          </a-form-item>

          <a-form-item :labelCol="{ span: 6 }" :wrapper-col="{ span: 18 }" :label="`${t('carbon.message.Factor_value')}（${t('carbon.message.Carbon_dioxide_equivalent')}）`" required>
            <a-input-number
                v-model:value="queryParam.factorValue"
                :step="0.0001"
                :precision="4"
                :disabled="queryParam.computerType == 2"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
                style="width: 200px"
            />
          </a-form-item>

          <div
              class="switchBtn m_hoverCP"
              @click="onChangeComputerType"
              v-if="queryParam.computerType == 1"
          >
            <SwapOutlined />
            {{ t('carbon.message.Switch_ratio_calculation') }}
          </div>
          <div
              class="switchBtn m_hoverCP"
              @click="queryParam.computerType = 1"
              v-if="queryParam.computerType == 2"
          >
            <SwapOutlined />
            {{ t('carbon.message.Switch_manual_transmission') }}
          </div>
        </a-form>
      </div>

      <div style="margin-top: 20px;" v-if="queryParam.computerType == 2">
        <a-table
            :columns="columns"
            :data-source="queryParam.gasList"
            :pagination="false"
            :bordered="false"
            size="middle"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'gasName'">
              <a-select
                  v-model:value="record.gasName"
                  :placeholder="t('carbon.message.Please_select')"
                  show-search
                  :filter-option="filterOption"
                  @change="(e) => onChangeGas(e, record)"
                  style="width: 100%;"
              >
                <a-select-option
                    :value="item.gasName"
                    :disabled="item.disabled"
                    v-for="(item) in gasData"
                    :key="item.gasName"
                >
                  {{ item.gasName }}
                </a-select-option>
              </a-select>
            </template>

            <template v-else-if="column.dataIndex === 'factorValue'">
              <a-input-number
                  v-model:value="record.factorValue"
                  :step="0.0001"
                  :precision="4"
                  :placeholder="t('carbon.message.Please_enter')"
                  @change="computeFactorValue"
                  style="width: 100%;"
              />
            </template>

            <template v-else-if="column.dataIndex === 'gwpValue'">
              <a-input-number
                  v-model:value="record.gwpValue"
                  :step="0.01"
                  :precision="4"
                  :placeholder="t('carbon.message.Please_enter')"
                  @change="computeFactorValue"
                  style="width: 100%;"
              />
            </template>

            <template v-else-if="column.dataIndex === 'action'">
              <div class="m_ccFlex">
                <a-popconfirm
                    :title="t('carbon.message.Confirm_delete')"
                    :cancel-text="t('carbon.message.Cancel')"
                    :ok-text="t('carbon.message.Confirm')"
                    @confirm="() => onDel(index)"
                >
                  <a>{{ t('carbon.message.Delete') }}</a>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
        <a-button style="margin-top: 10px" type="primary" preIcon="ant-design:plus-outlined" @click="onAdd">
          {{ t('carbon.message.Add_gas') }}
        </a-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  SwapOutlined
} from '@ant-design/icons-vue';
import { ref, reactive, watch, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
// 导入API方法
import { getFactorUnits, getAllEmissionUnits, getGasListByName, addEmissionFactorCheck } from './api/yzAddView.api';
import UnitCascader from "@/components/common/UnitCascader.vue";

const { t } = useI18n();
const { createMessage } = useMessage();

// 定义 emits
const emit = defineEmits(['back']);

// 表格列定义
const columns = [
  {
    title: t('carbon.message.greenhouse_gas'),
    align: "center",
    dataIndex: "gasName",
    width: 100,
  },
  {
    title: t('carbon.message.Factor_value'),
    align: "center",
    dataIndex: "factorValue",
    width: 100,
  },
  {
    title: t('carbon.message.Factor_molecular_unit'),
    align: "center",
    dataIndex: "molecularUnit",
    width: 100,
  },
  {
    title: t('carbon.message.Factor_denominator_unit'),
    align: "center",
    dataIndex: "denominatorUnit",
    width: 100,
  },
  {
    title: t('carbon.message.GWP_value'),
    align: "center",
    dataIndex: "gwpValue",
    width: 100,
  },
  {
    title: t('carbon.message.Handle'),
    align: "center",
    dataIndex: "action",
    width: 100,
  },
];

// 表单数据
const queryParam = reactive({
  gasList: [],
  computerType: 1, // 类型（1=手动输入，2=配比计算）
  type: "2", // 数据库,默认组织因子库,不可更改（1=碳排因子库，2=组织因子库）
  name: '',
  numeratorUnitId: undefined,
  denominatorUnitId: undefined,
  instruction: '',
  factorValue: undefined,
  numeratorUnit: '',
  denominatorUnit: '',
});

// 数据列表
const fzData = ref([]); // 因子分子数据
const fmData = ref([]); // 因子分母数据
const gasData = ref([]); // 气体数据
const allGasData = ref([]); // 气体二维数组数据

const labelCol = {
  xs: { span: 24 },
  sm: { span: 4 },
  xl: { span: 6 },
  xxl: { span: 4 },
};
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 18 },
};

// 监听气体列表变化
watch(
    () => queryParam.gasList,
    (val) => {
      const keyData: string[] = [];
      val.forEach((item: any) => {
        if (item.gasName) {
          keyData.push(item.gasName);
        }
      });

      gasData.value.forEach((item: any) => {
        if (keyData.includes(item.gasName)) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },
    { deep: true }
);

// 生命周期钩子
onMounted(() => {
  getData();
});

/**
 * 配比计算-根据气体计算因子值
 */
const computeFactorValue = () => {
  let data = 0;
  queryParam.gasList.forEach((item: any) => {
    const factorValue = item.factorValue ? Number(item.factorValue) : 0;
    const gwpValue = item.gwpValue ? Number(item.gwpValue) : 0;
    data = data + factorValue * gwpValue;
  });
  queryParam.factorValue = Number(data.toFixed(4));
};

const onChangeComputerType = () => {
  if (queryParam.computerType == 1) {
    // 从手动切换到配比计算
    queryParam.computerType = 2;
    onChangeNumeratorUnitId(queryParam.numeratorUnitId);
  } else if (queryParam.computerType == 2) {
    // 从配比计算切换到手动
    queryParam.computerType = 1;
  }
  queryParam.gasList = [];
  computeFactorValue();
};

/**
 * 修改分子单位，同时删除温室气体
 */
const onChangeNumeratorUnitId = (value: any) => {
  console.log("onChangeNumeratorUnitId", value);
  const theIndex = fzData.value.findIndex((ele: any) => ele.id == value);
  if (theIndex > -1) {
    queryParam.numeratorUnit = fzData.value[theIndex].factorUnit;
    gasData.value = allGasData.value[theIndex];

    if (queryParam.gasList && queryParam.gasList.length > 0) {
      queryParam.gasList.forEach((gasItem: any) => {
        gasData.value.forEach((gasItem2: any) => {
          if (gasItem.gasName === gasItem2.gasName) {
            gasItem.molecularUnit = gasItem2.gasUnit;
          }
        });
      });
    }
    computeFactorValue();
  }
};

/**
 * 修改分母单位，同时修改所有温室气体的因子分母单位
 */
const onChangeDenominatorUnitId = (value: any) => {
  console.log("onChangeDenominatorUnitId", value);
  const theIndex = fmData.value.findIndex((ele: any) => ele.id == value);
  if (theIndex > -1) {
    queryParam.denominatorUnit = fmData.value[theIndex].unitCode;
    queryParam.gasList.forEach((item: any) => {
      item.denominatorUnit = fmData.value[theIndex].unitCode;
    });
  }
};

/**
 * 添加气体
 */
const onAdd = () => {
  console.log("onAdd");
  const obj: any = {};
  if (queryParam.denominatorUnitId) {
    obj.denominatorUnit = queryParam.denominatorUnit;
  }
  queryParam.gasList.push(obj);
};

/**
 * 删除气体
 */
const onDel = (index: number) => {
  console.log("onDel");
  queryParam.gasList.splice(index, 1);
  computeFactorValue();
};

/**
 * 修改气体
 * @param e
 * @param record
 */
const onChangeGas = (e: any, record: any) => {
  console.log("onChangeGas", e, record);
  const theIndex = gasData.value.findIndex((ele: any) => ele.gasName == e);
  if (theIndex > -1) {
    record.molecularUnit = gasData.value[theIndex].gasUnit;
    record.gwpValue = gasData.value[theIndex].gwpValue;
    computeFactorValue();
  }
};

/**
 * 检查表单数据
 */
const checkFormData = () => {
  if (!queryParam.name) {
    createMessage.warn(t('carbon.message.please_enter_factor_name'));
    return false;
  }

  if (!queryParam.numeratorUnitId) {
    createMessage.warn(t('carbon.message.please_select_the_factor_molecular_unit'));
    return false;
  }

  if (!queryParam.denominatorUnitId) {
    createMessage.warn(t('carbon.message.please_select_factor_denominator_unit'));
    return false;
  }

  if (queryParam.computerType == 1) {
    // 手动输入
    if (!queryParam.factorValue || (queryParam.factorValue && queryParam.factorValue < 0)) {
      createMessage.warn(t('carbon.message.please_enter_a_factor_value_co2_equivalent_greater_than_0'));
      return false;
    }
  }

  if (queryParam.computerType == 2) {
    // 配比计算
    if (!queryParam.gasList || (queryParam.gasList && queryParam.gasList.length == 0)) {
      createMessage.warn(t('carbon.message.please_add_at_least_one_gas'));
      return false;
    }

    let errorIndex = null;
    let errorType = null;

    for (let i = 0; i < queryParam.gasList.length; i++) {
      const theObj = queryParam.gasList[i];
      if (!theObj.gasName) {
        errorIndex = i;
        errorType = "gasName";
        break;
      }
      if (!theObj.factorValue || (theObj.factorValue && theObj.factorValue < 0)) {
        errorIndex = i;
        errorType = "factorValue";
        break;
      }
      if (!theObj.gwpValue) {
        errorIndex = i;
        errorType = "gwpValue";
        break;
      }
    }

    if (errorType === "gasName") {
      createMessage.warn(t('carbon.message.please_select_gas'));
      return false;
    }
    if (errorType === "factorValue") {
      createMessage.warn(t('carbon.message.please_enter_a_factor_value_greater_than_0'));
      return false;
    }
    if (errorType === "gwpValue") {
      createMessage.warn(t('carbon.message.please_enter_gwp_value'));
      return false;
    }
  }

  return true;
};

/**
 * 获取数据
 */
const getData = () => {
  // 分子
  getFactorUnits().then((res) => {
    if (res.success) {
      fzData.value = res.result.records || [];
      allGasData.value = [];

      fzData.value.forEach((item: any, index: number) => {
        getGasListByName({
          factorRealUnit: item.factorRealUnit
        }).then((res) => {
          if (res.success) {
            allGasData.value[index] = res.result || [];
          }
        });
      });
    }
  });

  // 分母
  getAllEmissionUnits().then((res) => {
    if (res.success) {
      fmData.value = res.result || [];
    }
  });
};

/**
 * 下拉框数据过滤
 */
const filterOption = (input: string, option: any) => {
  return (
      option.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
};

/**
 * 提交数据
 */
const onSubmit = () => {
  console.log("queryParam", queryParam);
  if (checkFormData()) {
    addEmissionFactorCheck(queryParam).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.operation_success'));
        onBack();
      }
    });
  }
};

/**
 * 返回
 */
const onBack = () => {
  emit('back');
};

// 暴露方法给父组件
defineExpose({
  checkFormData,
  queryParam,
  onBack,
  onSubmit
});
</script>

<style lang="less" scoped>
.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.cardBox {
  overflow: hidden;
  padding: 32px 24px 12px;
  background: #ffffff;
  border-radius: 3px;

  .cardBox_title {
    margin-bottom: 24px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    color: #333333;
  }
}

.switchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: 8px;
  padding: 0 16px;
  height: 32px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid @primary-color !important;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color !important;
  white-space: nowrap;

  .switchBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.addBtn {
  margin-top: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 112px;
  height: 32px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid @primary-color !important;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color !important;

  .addBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.uploadBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 112px;
  height: 32px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color !important;

  .uploadBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.optionBox {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  .optionItem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 103px;
    height: 32px;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
  }

  .optionItem_cancel {
    background: #e7e7e7;
    color: rgba(0, 0, 0, 0.9);
  }

  .optionItem_confirm {
    background: @primary-color !important;
    color: rgba(255, 255, 255, 0.9);
  }
}
.m_cFlex {
  display: flex;
  align-items: center;
  gap: 10px; // 控制两个选择器之间的间距
}

</style>
