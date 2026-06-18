<!-- 产品碳足迹-模型搭建-输入输出表单因子卡片 -->
<template>
  <div class="">
    <div v-if="item.emissionFactorType == 2" class="oqnoen">
      <div class="flex marb">
        <div class="widths">
          {{ t("carbon.message.CarbonEmissions") }}：
        </div>
        <a-input
            v-model:value="item.carbonEmissions"
            :disabled="true"
            style="width: 100px; margin-right: 10px; margin-left: 10px"
        ></a-input>
        {{ item.carbonEmissionsUnitId_dictText }}
        &nbsp; &nbsp;
        <a @click="onDetail(item)">{{ t("carbon.message.Detail") }}</a>
      </div>
      <div class="flex marb">
        <div class="widths">
          {{ t("carbon.message.accounting_cycle") }}:
        </div>
        <a-input
            v-model:value="item.calculateBeginTime"
            :disabled="true"
            style="width: 100px; margin-right: 10px; margin-left: 10px"
        ></a-input>
        --
        <a-input
            v-model:value="item.calculateEndTime"
            :disabled="true"
            style="width: 100px; margin-left: 10px"
        ></a-input>
      </div>
      <div class="flex marb">
        <div class="widths">
          {{ t("carbon.message.Form_Label_SupplierName") }}:
        </div>
        <a-input
            v-model:value="item.fillInUserId_dictText"
            :disabled="true"
            style="width: 200px; margin-left: 10px"
        ></a-input>
      </div>
      <div class="flex marb">
        <div class="widths">
          {{ t("carbon.message.Life_cycle_boundary") }}:
        </div>
        {{
          item.lifeCycleType == 1
              ? t("carbon.message.From_cradle_to_gate")
              : item.lifeCycleType == 2
                  ? t("carbon.message.From_cradle_to_grave")
                  : item.lifeCycleType == 3
                      ? t("carbon.message.Custom_life_cycle")
                      : ""
        }}
      </div>
      <div class="flex">
        <div class="widths">
          {{ t("carbon.message.accountingUnit") }}:
        </div>
        <a-input
            v-model:value="item.calculateUnitNumber"
            :disabled="true"
            style="width: 80px; margin-left: 10px"
        ></a-input>
        <div style="margin-left: 10px">
          {{ item.productUnitId_dictText }}
        </div>
      </div>
    </div>
    <div class="list_card_content_item" v-else>
      <div class="list_card_content_item_box1">
        <img
            class="list_card_content_item_box1_icon"
            src="../../assets/img/img6.png"
            alt=""
        />
        <div class="list_card_content_item_box1_text">
          <div
              class="list_card_content_item_box1_text2 m_pass_1line_hidden2"
              :title="item.name"
          >
            {{ item.name }}
          </div>
          <div
              class="list_card_content_item_box1_text3 m_pass_1line_hidden2"
              :title="item.model"
          >
            {{ item.model }}
          </div>
        </div>
      </div>
      <div class="list_card_content_item_box2">
        {{ Number(item.factorValue).toFixed(4) }}
        <span> {{ item.numeratorUnit }}/{{ item.denominatorUnit }}</span>
      </div>

      <div class="list_card_content_item_box3">
        <div
            class="list_card_content_item_box4_text"
            :title="item.productClassification_dictText"
        >
          {{ item.productClassification_dictText || "-" }}
        </div>
        <div class="list_card_content_item_box4_text2" :title="item.scene">
          {{ getContent(item.scene) }}
        </div>
      </div>

      <div class="list_card_content_item_box4">
        <div class="list_card_content_item_box4_text">
          {{ item.releaseOrg || "-" }}
        </div>
        <div class="list_card_content_item_box4_text2">
          {{ item.releaseYear || "-" }}
        </div>
      </div>
    </div>
    <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :title="t('carbon.message.Detail')"
        :visible="isShowDetailPopup"
        :width="1200"
        @close="onClose"
    >
      <CySupplierCarbonDataForm
          ref="cySupplierCarbonDataFormRef"
          :disabled="true"
          @back="back"
      ></CySupplierCarbonDataForm>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import CySupplierCarbonDataForm from './CySupplierCarbonDataForm.vue';
// 导入API方法（如果需要的话）
// import { getSupplierCarbonDataDetail } from './yzCard2.api';

const { t } = useI18n();

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

// Refs
const cySupplierCarbonDataFormRef = ref();
const isShowDetailPopup = ref(false);

/**
 * 获取内容（超长截取）
 * @param content
 * @returns
 */
const getContent = (content: string) => {
  if (!content) {
    return "-";
  }
  // 超过五个字就截取
  if (content.length > 5) {
    return content.substring(0, 5) + "...";
  }
  return content;
};

/**
 * 详情
 */
const onDetail = (item: any) => {
  console.log("onDetail", item);
  isShowDetailPopup.value = true;
  setTimeout(() => {
    if (cySupplierCarbonDataFormRef.value) {
      cySupplierCarbonDataFormRef.value.edit(item);
    }
  }, 0);
};

const onClose = () => {
  isShowDetailPopup.value = false;
};

const back = () => {
  isShowDetailPopup.value = false;
  // getData(1); // 这个方法在当前组件中未定义，如有需要请添加
};
</script>

<style lang="less" scoped>
.widths {
  width: 100px;
}

.marb {
  margin-bottom: 16px;
}

.oqnoen {
  background: #f8f8f8;
  border-radius: 3px 3px 3px 3px;
  padding: 24px 16px;
}

.flex {
  display: flex;
  align-items: center;
}

.list_card_content_item {
  overflow: hidden;
  height: 160px;
  position: relative;
  border-radius: 5px;
  background-image: url("../../assets/img/img1.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.list_card_content_item_box1 {
  margin-top: 12px;
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.list_card_content_item_box1_icon {
  width: 24px;
  height: 24px;
}

.list_card_content_item_box1_text {
  margin-left: 12px;
  display: flex;
  align-items: flex-end;
}

.list_card_content_item_box1_text2 {
  max-width: 200px;
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 18px;
  color: #333333;
  line-height: 20px;
}

.list_card_content_item_box1_text3 {
  margin-left: 8px;
  max-width: 110px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 14px;
}

.list_card_content_item_box2 {
  margin-top: 12px;
  margin-left: 52px;
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 28px;
  color: #148958;

  span {
    font-size: 12px;
  }
}

.list_card_content_item_box3 {
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list_card_content_item_box4 {
  position: absolute;
  z-index: 3;
  left: 0;
  bottom: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 33px;
  background: #148958;
  border-radius: 0px 0px 4px 4px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
}
</style>
