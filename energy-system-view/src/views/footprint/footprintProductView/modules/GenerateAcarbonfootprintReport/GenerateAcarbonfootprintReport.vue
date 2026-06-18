<template>
  <div class="centers">
    <div class="cardHeader" v-if="type === 2">
      <div class="cardHeader_backBox m_hoverCP">
        <img
          class="cardHeader_icon m_hoverCP"
          :src="img28"
          alt=""
          @click="onBack"
        />
        <span class="m_hoverCP" @click="onBack">{{
            t("carbon.message.Return")
          }}</span>
      </div>
      <div class="flex amar">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="table"
          :class="{ border: type === item.value }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="conters">
      <!-- 概况 -->
      <div class="gaikuao marBottom">
        <div class="title">{{ t('carbon.message.Overview') }}</div>
        <div class="marBottom" style="display: flex; gap: 24px" v-if="type === 2">
          <div class="flexOne">
            <div class="text marBom"><span class="red">*</span>{{ t('carbon.message.Product_image') }}</div>
            <div class="flex">
              <div class="image fily">
                <img class="img" :src="img" alt="" />
                <div>{{ t('carbon.message.Please_upload_pictures') }}</div>
              </div>
            </div>
          </div>
          <div class="flexOne">
            <div class="text marBom"><span class="red">*</span>{{ t('carbon.message.Process_flow_chart') }}</div>
            <div class="flex">
              <div class="image fily">
                <img class="img" :src="img" alt="" />
                <div>{{ t('carbon.message.Please_upload_pictures') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="marBottom" v-if="type === 2">
          <div class="text marBom">{{ t('carbon.message.Product_Introduction') }}</div>
          <div style="display: flex">
            <textarea
              class="textarea flexOne"
              disabled="true"
              name=""
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
        <div class="flex marBottom" style="gap: 24px" v-if="type === 2">
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Company_Profile') }}</div>
            <textarea
              class="textarea flexOne"
              disabled="true"
              name=""
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Company_Address') }}</div>
            <textarea
              class="textarea flexOne"
              disabled="true"
              name=""
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
        <div class="marBottom">
          <div class="text marBom"><span class="red">*</span>{{ t('carbon.message.The_purpose_of_report_production') }}</div>
          <div style="display: flex">
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="text marBom">
            <span class="red">*</span>{{ t('carbon.message.Normative_references') }}
          </div>
          <div class="warp">
            <div class="flex widrhts">
              <input class="input" type="text" :placeholder="t('carbon.message.Please_enter')"/>
              <img class="img2" :src="img2" alt="" />
            </div>
            <div class="flex widrhts">
              <input class="input" type="text" :placeholder="t('carbon.message.Please_enter')"/>
              <img class="img2" :src="img2" alt="" />
            </div>
            <div class="flex widrhts">
              <input class="input" type="text" :placeholder="t('carbon.message.Please_enter')"/>
              <img class="img2" :src="img2" alt="" />
              <img class="img2" :src="img2" alt="" />
            </div>
          </div>
        </div>
      </div>

      <!-- 报告范围 -->
      <div class="gaikuao marBottom">
        <div class="title">{{ t('carbon.message.Report_scope') }}</div>
        <div class="flex marBottom" style="gap: 24px">
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.The_greenhouse_gases_contained') }}</div>
            <textarea
              class="textarea1 flexOne"
              :placeholder="t('carbon.message.Please_enter')"
              name=""
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Evaluation_methods_and_databases') }}</div>
            <textarea
              class="textarea1 flexOne"
              :placeholder="t('carbon.message.Please_enter')"
              name=""
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
        <div class="marBottom">
          <div class="text marBom">{{ t('carbon.message.Data_selection_principles_and_stage_items') }}</div>
          <div style="display: flex">
            <textarea
              class="textarea1 flexOne"
              :placeholder="t('carbon.message.Please_enter')"
              name=""
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 模型描述 -->
      <div class="gaikuao marBottom">
        <div class="title">{{ t('carbon.message.Model_description') }}</div>
        <div class="">
          <div class="text marBom">{{ t('carbon.message.Model_description') }}</div>
          <div style="display: flex">
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据质量评价与管理 -->
      <div class="gaikuao marBottom">
        <div class="title"> {{ t('carbon.message.Data_quality_evaluation_and_management') }}</div>
        <div class="flex marBottom" style="gap: 24px">
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Data_quality_evaluation') }}</div>
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Data_quality_requirements') }}</div>
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
        </div>
        <div class="marBottom">
          <div class="text marBom">{{ t('carbon.message.Data_Quality_management') }}</div>
          <div style="display: flex">
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 碳足迹评价结果分析 -->
      <div class="gaikuao marBottom">
        <div class="title">{{ t('carbon.message.Analysis_of_Carbon_footprint_Evaluation_results') }}</div>
        <div class="flex marBottom" style="gap: 24px">
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Integrity_and_consistency_check') }}</div>
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Uncertainty_analysis') }}</div>
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 碳足迹结论与建议 -->
      <div class="gaikuao marBottom">
        <div class="title">{{ t('carbon.message.Conclusions_and_Suggestions_on_Carbon_Footprint') }}</div>
        <div class="flex marBottom" style="gap: 24px">
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Conclusion_of_carbon_footprint_assessment') }}</div>
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
          <div class="flexOne">
            <div class="text marBom">{{ t('carbon.message.Suggestions_for_carbon_footprint_assessment') }}</div>
            <div style="position: relative" class="flexOne">
              <textarea
                class="textarea2 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div class="length">0/500</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button">
      <div class="boots">{{ t('carbon.message.Determine_and_generate_the_report') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import img28 from '@/assets/img/img28.png';
import img from '@/assets/cptzj/img.png';
import img2 from '@/assets/cptzj/img2.png';


// 多语言支持
const { t } = useI18n();

const emit = defineEmits(['back']);

const type = ref(1);
const list = ref([
  {
    name: "概述",
    value: 1,
  },
  {
    name: "报告范围",
    value: 2,
  },
  {
    name: "模型描述",
    value: 3,
  },
  {
    name: "数据质量评价与管理",
    value: 4,
  },
  {
    name: "碳足迹评价结果分析",
    value: 5,
  },
  {
    name: "碳足迹结论与建议",
    value: 6,
  },
]);

/**
 * 返回
 */
function onBack() {
  emit("back");
}
</script>

<style lang="less" scoped>
.button {
  width: 100%;
  height: 80px;
  margin-top: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFf;
  .boots {
    background: @primary-color;
    border-radius: 3px 3px 3px 3px;
    font-weight: 400;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    padding: 9px 29px;
  }
}
.widrhts {
  width: 50%;
  margin-bottom: 16px;
}
.warp {
  display: flex;
  flex-wrap: wrap;
}
.input {
  width: 100%;
  height: 32px;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #dcdcdc;
  padding-left: 8px;
}
.img2 {
  width: 18px;
  height: 18px;
  margin-left: 12px;
}

&:focus-visible {
  outline: 0px;
}

.length {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
  position: absolute;
  right: 8px;
  bottom: 10px;
}
.textarea {
  width: 100%;
  height: 119px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
}
.textarea1 {
  width: 100%;
  height: 54px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
}

.textarea2 {
  width: 100%;
  height: 64px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
}
.fily {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.marBottom {
  margin-bottom: 24px;
}
.marBottom1 {
}
.image {
  width: 120px;
  height: 120px;
  background: #f3f3f3;
  border-radius: 0px 0px 0px 0px;
  .img {
    width: 24px;
    height: 24px;
    margin-bottom: 10px;
  }
  div {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}
.flexOne {
  flex: 1;
}
.conters {
  padding: 24px 339px;
  .red {
    color: red;
  }
  .marBom {
    margin-bottom: 11px;
  }
  .text {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
  .gaikuao {
    background: #ffffff;
    padding: 25px 24px;
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    margin-bottom: 16px;
  }
}
.flex {
  display: flex;
  align-items: center;
}
.border {
  font-weight: 400;
  font-size: 14px;
  color: @primary-color !important;
  border-bottom: 3px solid @primary-color;
}
.amar {
  margin-left: 315px;
}
.table {
  width: 207px;
  padding: 20px 0;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  justify-content: center;
  color: rgba(0, 0, 0, 0.6);
}
.cardHeader {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 64px;
  background: #ffffff;

  .cardHeader_backBox {
    position: absolute;
    top: 50%;
    left: 24px;
    transform: translateY(-50%);
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #000000;
  }

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }

  .cardHeader_numBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.4);
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  .cardHeader_numBox_active {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: @primary-color;
    border: 1px solid @primary-color;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }

  .cardHeader_numBox_end {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid @primary-color;

    img {
      width: 16px;
      height: 16px;
    }
  }

  .cardHeader_textBox {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  .cardHeader_textBox_active {
    color: @primary-color;
  }

  .cardHeader_hrBox {
    width: 344px;
    height: 2px;
    background: #dcdcdc;
  }

  .cardHeader_hrBox_active {
    background: @primary-color;
  }
}
</style>
