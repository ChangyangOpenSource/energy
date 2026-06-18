<template>
  <div class="">
    <div class="cardHeader">
      <div class="cardHeader_backBox m_hoverCP">
        <img
          class="cardHeader_icon m_hoverCP"
          src="@/assets/img/img28.png"
          alt=""
          @click="onBack"
        />
        <span class="m_hoverCP" @click="onBack">{{
            t("carbon.message.Return")
          }}</span>
      </div>
      <div
        class="cardHeader_numBox_active m_hoverCP"
        @click="() => onChangeStep(1)"
        v-if="step == 1"
      >
        1
      </div>
      <div
        class="cardHeader_numBox_end m_hoverCP"
        @click="() => onChangeStep(1)"
        v-if="step > 1"
      >
        <img class="" src="@/assets/img/img45.png" alt="" />
      </div>
      <div
        class="cardHeader_textBox m_hoverCP"
        v-if="type == 1"
        :class="{ cardHeader_textBox_active: step >= 1 }"
        @click="() => onChangeStep(1, queryParam.id, 2)"
      >
        {{ t("carbon.message.Create_a_process") }}
      </div>
      <div
        class="cardHeader_textBox m_hoverCP"
        v-else
        :class="{ cardHeader_textBox_active: step >= 1 }"
        @click="() => onChangeStep(1, queryParam.id, 2)"
      >
        {{ t("carbon.message.Edit_process") }}
      </div>
      <div
        class="cardHeader_hrBox"
        :class="{ cardHeader_hrBox_active: step >= 2 }"
      ></div>
      <div
        class="cardHeader_numBox m_hoverCP"
        @click="() => onChangeStep(2)"
        v-if="step < 2"
      >
        2
      </div>
      <div
        class="cardHeader_numBox_active m_hoverCP"
        @click="() => onChangeStep(2)"
        v-if="step == 2"
      >
        2
      </div>
      <div
        class="cardHeader_numBox_end m_hoverCP"
        @click="() => onChangeStep(2)"
        v-if="step > 2"
      >
        <img class="" src="@/assets/img/img45.png" alt="" />
      </div>
      <div
        class="cardHeader_textBox m_hoverCP"
        v-if="type == 1"
        :class="{ cardHeader_textBox_active: step >= 2 }"
        @click="() => onChangeStep(2)"
      >
        {{ t("carbon.message.Add_emission_sources") }}
      </div>
      <div
        class="cardHeader_textBox m_hoverCP"
        v-else
        :class="{ cardHeader_textBox_active: step >= 2 }"
        @click="() => onChangeStep(2)"
      >
        {{ t("carbon.message.Edit_emission_sources") }}
      </div>
    </div>
    <!--  基本信息  -->
    <section class="cardBox" v-show="step == 1">
      <inputAndForm ref="inputAndFormRef" @changeStep="onChangeStep" />
    </section>
    <!--  添加排放源  -->
    <section class="topsw" v-show="step == 2">
      <carbonFootprintModelBuild
        ref="carbonFootprintModelBuildRef"
        :queryParam="queryParam"
        @changeStep="onChangeStep"
        @back="onBack"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import carbonFootprintModelBuild from './carbonFootprintModelBuild/carbonFootprintModelBuild.vue'
import inputAndForm from './inputAndForm.vue'

// 使用 Composition API 工具
const { t } = useI18n()

// 定义 emits
const emit = defineEmits(['back', 'changeStep'])

// Refs
const inputAndFormRef = ref(null)
const carbonFootprintModelBuildRef = ref(null)

// Reactive 数据
const step = ref(1) /* 1基本信息 2搭建模型 3碳足迹结果 */
const queryParam = reactive({}) /* 表单数据 */
const unitData = ref([]) /* 单位 */
const generateResultData = reactive({}) /* 工艺流程库-碳足迹结果 */
const spinning = ref(false)
const type = ref(1) //1新建 2编辑
const CopyIasss = ref(false) //false 不复制 true复制

// Computed
const disabled = computed(() => {
  if (queryParam.calculateArchived === "1") {
    return true
  } else {
    return false
  }
})

// Watch
watch(() => queryParam, () => {
  // 监听逻辑可以在这里添加
}, { deep: true })

// Methods
/**
 * 核算归档
 */
const onChangeArchive = () => {
  queryParam.calculateArchived = "1"
  onChangeStep(3, true)
}

const onType = (value) => {
  console.log(value)
  type.value = value
  console.log(type.value, " type.value")
}

/**
 * 切换第几步
 * @param step step基本信息 isFinish--id type类型
 */
const onChangeStep = (stepValue, isFinish, typeParam) => {
  console.log("onChangeStep，是这里嘛", stepValue, isFinish, typeParam, step.value)
  if (stepValue == 1) {
    // 工艺流程库-基本信息
    step.value = stepValue
    // inputAndFormRef.value.getData()
    if (isFinish) {
      if (typeParam) {
        inputAndFormRef.value.queryById(isFinish, 2)
      } else {
        inputAndFormRef.value.queryById(isFinish)
        console.log(type.value, CopyIasss.value, " type.value")
        inputAndFormRef.value.CopyIasss = CopyIasss.value
      }
    }
    console.log(type.value, " type.value")
  }
  if (stepValue == 2 && (step.value == 1 || isFinish)) {
    // 工艺流程库-添加排放源
    if (!isFinish) {
      inputAndFormRef.value.type = type.value
      // inputAndFormRef.value.onSubmit()
    }
    queryParam.id = isFinish
    step.value = stepValue
    nextTick(() => {
      carbonFootprintModelBuildRef.value.getData()
    })
  }

  // 触发 changeStep 事件
  emit('changeStep', stepValue, isFinish, typeParam)
}

const getData = () => {
  console.log("getData", queryParam)
  // 单位
  defHttp.get({
    url: "/emission/factor/cyEmissionUnit/getAllUnitByGroup"
  }).then((res) => {
    if (res) {
      unitData.value = res || {}
      console.log("getData111", unitData.value)
    }
  })
}

// ============================================================== 第二步，搭建模型

// ============================================================== 第三步，碳足迹结果

// ============================================================== 其他

// ==============================================================================
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
 * 返回
 */
const onBack = () => {
  emit("back")
}

// 暴露给父组件的方法
defineExpose({
  onType,
  onChangeStep,
  getData,
  queryParam,
  type,
  CopyIasss
})
</script>

<style lang="less" scoped>
.topsw {
  padding-top: 24px;
  margin-top: 38px;
  width: max-content;
}

:deep(.table-page-search-wrapper .ant-form-inline .ant-form-item) {
  margin-bottom: 44px;
}

:deep(.ant-form-item) {
  margin-bottom: 44px;
}

.cardHeader {
  position: absolute;
  top:0px;
  left: 0;
  z-index: 999;
  border-top: 1px solid #F5F7F6;
  display: flex;
  align-items: center;
  justify-content: center;
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
    background: #148958;
    border: 1px solid #148958;
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
    border: 1px solid #148958;

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
    color: #148958;
  }

  .cardHeader_hrBox {
    width: 344px;
    height: 2px;
    background: #dcdcdc;
  }

  .cardHeader_hrBox_active {
    background: #148958;
  }
}

.cardBox {
  margin: 62px auto 0;
  width: 1400px;
  overflow: hidden;
  padding: 20px 64px;
  background: #ffffff;
  border-radius: 3px;
}

.cardBox2 {
  margin: 24px 300px auto;
  overflow: hidden;
  padding: 24px;
  background: #ffffff;
  border-radius: 3px;
}

.cardBox2_title {
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 16px;
  color: #333333;
}

.lifeCycleTypeBox {
  display: flex;
  justify-content: space-between;
  gap: 30px;

  .lifeCycleTypeBox_item {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    padding: 24px;
    height: 132px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #dcdcdc;

    .lifeCycleTypeBox_item_icon {
      display: none;
    }

    .lifeCycleTypeBox_item_text1 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
    }

    .lifeCycleTypeBox_item_text2 {
      margin-top: 12px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #888888;
      line-height: 22px;
    }

    .lifeCycleTypeBox_item_content {
      margin-top: 12px;
    }
  }

  .lifeCycleTypeBox_item_active {
    position: relative;
    background: #f7fdf8;
    border: 1px solid #148958;

    .lifeCycleTypeBox_item_icon {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 45px;
      height: 39.5px;
    }

    .lifeCycleTypeBox_item_text1 {
      color: #148958;
    }

    .lifeCycleTypeBox_item_text2 {
    }

    .lifeCycleTypeBox_item_content {
      margin-top: 12px;
    }
  }
}

.uploadBox {
  .uploadTitle {
    color: rgba(0, 0, 0, 0.85);
  }

  .uploadContent {
    margin-top: 11px;
  }

  .uploadTip {
    margin-top: 8px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

.optionBox {
  margin-top: 130px;
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
    background: #148958;
    color: rgba(255, 255, 255, 0.9);
  }

  .optionItem_save {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 55px;
    height: 32px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #148958;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #148958;
  }

  .optionItem_next {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 32px;
    background: #148958;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
