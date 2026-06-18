<template>
  <div class="centeet">
    <div class="cardHeader">
      <img class="cardHeader_icon m_hoverCP" src="../../assets/img/img28.png" alt="" @click="onBack"/>
      <span class="m_hoverCP" @click="onBack">{{ t('carbon.message.Return') }}</span>
    </div>
    <div class="top">
      <a-spin :spinning="loading">
        <a-tabs v-model:activeKey="activeKey" @tabClick="callback">
          <a-tab-pane key="1" forceRender>
            <template #tab>{{ t('carbon.message.by_year') }}</template>
          </a-tab-pane>
          <a-tab-pane key="2" forceRender>
            <template #tab>{{ t('carbon.message.by_quarterly') }}</template>
          </a-tab-pane>
          <a-tab-pane key="3" forceRender>
            <template #tab>
              {{ t('carbon.message.by_month') }}
              <a-tooltip placement="topLeft">
                <template #title>
                  <span>{{ t('carbon.message.fill_in_the_annual_data') }}</span>
                </template>
                <a-icon type="question-circle"/>
              </a-tooltip>
            </template>
          </a-tab-pane>
        </a-tabs>

        <a-table size="middle" :columns="columns" :data-source="dataSource" :pagination="false">
          <template #yearData="{ record }">
            <div class="editable-row-operations">
              <a-input-number
                  :step="0.0001"
                  :precision="4"
                  v-model:value="record.yearData"
                  style="width: 100%;"
                  @change="onInputChange(record, 1)"
              />
            </div>
          </template>

          <template #quarter="{ column, text, record  }">
           <div class="editable-row-operations">
              <a-input-number
                  :step="0.0001"
                  :precision="4"
                  v-model:value="record.quarterData[column.ide]"
                  style="width: 100%;"
                  @change="onInputChange(record, 2)"
              />
            </div>
          </template>

          <template #month="{ column, text, record  }">
            <div class="editable-row-operations">
              <a-input-number
                  :step="0.0001"
                  :precision="4"
                  v-model:value="record.monthData[column.ide]"
                  style="width: 100%;"
                  @change="onInputChange(record, 3)"
              />
            </div>
          </template>

        </a-table>

        <div class="flex">
          <a-button type="primary" @click="handleAdd">{{ t('carbon.message.Save') }}</a-button>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getDetailAll, updateBatchDetailData } from './api/rapidFilling.api';

// 国际化
const { t } = useI18n();

// Props
const props = defineProps({
  examineId: {
    type: String,
    default: "",
  },
});

// Refs
const activeKey = ref('1');

// Reactive data
const checkId = ref("");
const loading = ref(false);
const dataSource = ref<any[]>([]);

const yearcolumns = [
  {
    title: t('carbon.message.Name_of_emission_source'),
    dataIndex: "emissionSourceName",
    align: "center",
  },
  {
    title: t('carbon.message.Active_data_unit'),
    align: "center",
    dataIndex: "dataUnitText",
  },
  {
    title: t('carbon.message.annual_value'),
    dataIndex: "yearData",
    align: "center",
    width: "25%",
    slots: { customRender: "yearData" },
  },
];

const quarterColumns = [
  {
    title: t('carbon.message.Name_of_emission_source'),
    dataIndex: "emissionSourceName",
    align: "center",
  },
  {
    title: t('carbon.message.Active_data_unit'),
    dataIndex: "dataUnitText",
    align: "center",
  },
  {
    title: `${t('carbon.message.quarter')} 1`,
    dataIndex: 'quarter',
    align: "center",
    slots: { customRender: "quarter" },
    ide:0
  },
  {
    title: `${t('carbon.message.quarter')} 2`,
    dataIndex: 'quarter',
    align: "center",
    slots: { customRender: "quarter" },
    ide:1
  },
  {
    title: `${t('carbon.message.quarter')} 3`,
    dataIndex: 'quarter',
    slots: { customRender: "quarter" },
    align: "center",
    ide:2
  },
  {
    title: `${t('carbon.message.quarter')} 4`,
    dataIndex: 'quarter',
    slots: { customRender: "quarter" },
    align: "center",
    ide:3
  },
];

const monthColumns = [
  {
    title: t('carbon.message.Name_of_emission_source'),
    dataIndex: "emissionSourceName",
    align: "center",
  },
  {
    title: t('carbon.message.Active_data_unit'),
    dataIndex: "dataUnitText",
    align: "center",
  },
  {
    title: '1' + t('carbon.message.month'),
    dataIndex: "month",
    slots: { customRender: "month" },
    align: "center",
    ide:0
  },
  {
    title: '2' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:1
  },
  {
    title: '3' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:2
  },
  {
    title: '4' + t('carbon.message.month'),
    dataIndex: "month",
    slots: { customRender: "month" },
    align: "center",
    ide:3
  },
  {
    title: '5' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:4
  },
  {
    title: '6' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:5
  },
  {
    title: '7' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:6
  },
  {
    title: '8' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:7
  },
  {
    title: '9' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:8
  },
  {
    title: '10' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:9
  },
  {
    title: '11' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:10
  },
  {
    title: '12' + t('carbon.message.month'),
    slots: { customRender: "month" },
    dataIndex: "month",
    align: "center",
    ide:11
  }
];

const columns = ref<any[]>(yearcolumns);

// Methods
const onBack = () => {
  emit("onRapoidBack");
};

const callback = (e: string) => {
  if (e == '1') {
    columns.value = yearcolumns;
  } else if (e == '2') {
    columns.value = quarterColumns;
  } else if (e == '3') {
    columns.value = monthColumns;
  }
};

/**
 * 数据计算
 */
const onInputChange = (value: any, type: number) => {
  if (type == 1) {
    // 年度数据变化，同步更新季度和月度数据
    let yearValue = parseFloat(value.yearData) || 0;
    let quarter = (yearValue / 4).toFixed(4);
    let month = (yearValue / 12).toFixed(4);

    for (let i = 0; i < 4; i++) {
      value.quarterData[i] = quarter;
    }
    for (let i = 0; i < 12; i++) {
      value.monthData[i] = month;
    }
  } else if (type == 2) {
    // 季度数据变化，同步更新年度和月度数据
    let quarterAll = 0;
    let flag = 0;

    for (let i = 0; i < value.quarterData.length; i++) {
      // 修复：确保进行数值计算而非字符串拼接
      quarterAll += parseFloat(value.quarterData[i]) || 0;

      let monthNumber = ((parseFloat(value.quarterData[i]) || 0) / 3).toFixed(4);
      for (let j = flag; j < flag + 3; j++) {
        value.monthData[j] = monthNumber;
      }
      flag += 3;
    }

    value.yearData = quarterAll.toFixed(4);
  } else {
    // 月度数据变化，同步更新年度和季度数据
    let monthAll = 0;
    let flag = 0;
    let quarterData: number[] = [];

    for (let i = 0; i < value.monthData.length; i++) {
      // 修复：确保进行数值计算而非字符串拼接
      monthAll += parseFloat(value.monthData[i]) || 0;

      // 判断是否是3的倍数，计算季度数据
      if ((i + 1) % 3 == 0) {
        let quarterNumber = (parseFloat(value.monthData[i]) || 0) +
            (parseFloat(value.monthData[i-1]) || 0) +
            (parseFloat(value.monthData[i-2]) || 0);
        quarterData[flag] = parseFloat(quarterNumber.toFixed(4));
        flag++;
      }
    }

    value.yearData = parseFloat(monthAll.toFixed(4));
    value.quarterData = quarterData;
  }

  // 同步更新data字段
  value.data = value.yearData;
};


/**
 * 获取数据
 */
const changeCheckTemplateId = (id: string) => {
  checkId.value = id;
  columns.value = yearcolumns;
  loading.value = true;

  getDetailAll({
    checkId: id,
  }).then((res) => {
    if (res.success) {
      dataSource.value = res.result;
    }
  }).finally(() => {
    loading.value = false;
  });
};

//打开抽屉
const handleAdd = () => {
  loading.value = true;

  updateBatchDetailData({
    checkId: checkId.value,
    emissionSourceList: dataSource.value
  }).then((res) => {
    if (res.success) {
      emit("onRapoidBack");
    }
  }).finally(() => {
    loading.value = false;
  });
};

// Lifecycle
onMounted(() => {
  // 初始化默认选中年份标签
  columns.value = yearcolumns;
});

// Emits
const emit = defineEmits(['onRapoidBack']);

// Expose methods
defineExpose({
  changeCheckTemplateId
});
</script>

<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

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

.flex {
  margin-top: 10px;
  float: right;
}

.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.centeet {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.color1 {
  color: #888888;
}

.inpts {
  width: 80px !important;
}

.tianjia {
  width: 380px;
  height: 156px;
  background: #f8f8f8;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .color {
    color: #888888;
  }

  .marRight {
    margin-left: 16px;
  }
}

.tables {
  padding: 24px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #eeeeee;
  margin-top: 24px;
}

.top {
  background: #ffffff;
  border-radius: 3px;
  padding: 24px;
  flex: 1;
}

.marbton {
  margin-bottom: 24px;
}

</style>
