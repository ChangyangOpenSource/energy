<template>
  <div class="">
    <a-spin :spinning="spinning">
      <section class="patho-tab " ref="pathoChartContainerRef">
        <section class="headerBox">
          <div class="headerBox_box2">
            <div class="headerBox_box2_text1">{{ t("carbon.message.Input") }}</div>
            <div class="headerBox_box2_text2">
              {{ t("carbon.message.Raw_materials_consumables_energy_resources") }}
            </div>
          </div>
          <div class="headerBox_box3">
            <div class="headerBox_box2_text1">
              {{ t("carbon.message.Working_procedure") }}
            </div>
            <div class="headerBox_box2_text2">
              {{ t("carbon.message.The_things_produced") }}
            </div>
          </div>
          <div class="headerBox_box2">
            <div class="headerBox_box2_text1">{{ t("carbon.message.Output") }}</div>
            <div class="headerBox_box2_text2">
              {{ t("carbon.message.Waste_gas_wastewater") }}
            </div>
          </div>
        </section>
        <!-- 当前生命周期所有工序 -->
        <section class="patho-tab__zoom_right">
          <div class="patho-tab__zoom_right_item">
            <div class="patho-chart">
              <!-- 输入 -->
              <section
                class="patho-chart__section m_hoverCP"
                :class="{
                  'patho-chart__section_left': sortLeftList.length > 0,
                }"
              >
                <pathNodeLeft
                  v-for="(processFlowItem, processFlowIndex) in sortLeftList"
                  :key="processFlowIndex"
                  :calculate-process-item="sortLeftList"
                  :node="processFlowItem"
                  @editInput=" editInputOrOutput(sortLeftList, processFlowItem, 'INPUT')"
                  @delInput="delInputOrOutput(processFlowItem, 'INPUT')"
                  @onUpData="onUpData(processFlowItem)"
                  @edEmiss='edEmiss'
                />
              </section>
              <!-- 工序 -->
              <section class="borsw" v-if="lifeCycleList.outPutList">
                <section
                  class="patho-chart__section patho-chart__section_center root-node boxItem_center m_hoverCP"
                >
                  <div class="flex">
                    <div class="boxItem_center_tr1">
                      {{ lifeCycleList.processName }}
                    </div>
                    <div class="boxItem_center_tr1">
                      {{ lifeCycleList.totalUseNumber }}kgCO₂e
                    </div>
                  </div>

                  <div class="boxItem_center_tr2">
                    <div
                      class="boxItem_center_tr2_text1"
                      v-if="lifeCycleList.outPutList.length > 0"
                    >
                      <!-- 产出物 -->
                      {{ t("carbon.message.The_things_produced") }}-
                      {{ lifeCycleList.outPutList[0].artifactName }}:{{
                        lifeCycleList.outPutList[0].artifactNumber
                      }}{{ lifeCycleList.outPutList[0].artifactUnitName }}
                    </div>
                  </div>
                  <div class="m_cbFlex" style="margin-top: 16px">
                    <a-button
                      size="small"
                      @click="addInputOrOutput({}, 'INPUT')"
                    ><a-icon type="plus" />{{ t("carbon.message.Input") }}
                    </a-button>
                    <a-button
                      size="small"
                      @click="addInputOrOutput({}, 'OUTPUT')"
                    ><a-icon type="plus" />{{ t("carbon.message.Output") }}
                    </a-button>
                  </div>
                </section>
              </section>
              <!-- 输出 -->
              <section
                class="patho-chart__section m_hoverCP"
                :class="{
                  'patho-chart__section_right': sortRightList.length > 0,
                }"
              >
                <pathNodeRight
                  v-for="(processFlowItem, processFlowIndex) in sortRightList"
                  :key="processFlowIndex"
                  :calculate-process-item="sortRightList"
                  :node="processFlowItem"
                  @editInput="
                    editInputOrOutput(sortLeftList, processFlowItem, 'OUTPUT')
                  "
                  @delInput="delInputOrOutput(processFlowItem, 'OUTPUT')"
                  @onUpData="onUpData(processFlowItem)"
                  @edEmiss='edEmiss'
                />
              </section>
            </div>
          </div>
        </section>
      </section>
    </a-spin>
    <div class="drawerOptionBox">
      <a-button type="primary" @click="onSubmit" v-if="!disabled">
        {{ t("carbon.message.The_previous_step") }}</a-button
      >
      <a-button style="margin-left: 8px" @click="onClose">{{
          t("carbon.message.Complete")
        }}</a-button>
    </div>
    <!-- 添加排放源 -->
    <emissionTable ref="emissionTableRef" :disabled="disabled" @back="back" />
    <!-- 工序表单弹窗 -->
    <tableForm ref="tableFormRef" :disabled="disabled" @back="back" />
    <inputAndOutputForm ref="inputAndOutputFormRef" @back="back" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { cloneObject } from '/@/utils/index'
import pathNodeLeft from './pathNodeLeft.vue'
import pathNodeRight from './pathNodeRight.vue'
import inputAndOutputForm from './inputAndOutputForm.vue'
import tableForm from './tableForm.vue'
import emissionTable from './EmissionTable.vue'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 emits
const emit = defineEmits(['back', 'changeStep'])

// Props
const props = defineProps({
  queryParam: {
    type: Object,
    default() {
      return {};
    },
  },
})

// Refs
const pathoChartContainerRef = ref(null)
const emissionTableRef = ref(null)
const tableFormRef = ref(null)
const inputAndOutputFormRef = ref(null)

// Reactive 数据
const lifeCycleList = ref({ emissionDetailList: [],outPutList:[] })
const sortLeftList = ref([])
const sortRightList = ref([])
const spinning = ref(false)
const disabled = ref(false) // 表单禁用状态

// Methods
const back = () => {
  getData()
}

/**
 * 搭建模型-上一步
 */
const onSubmit = () => {
  emit("changeStep", 1, props.queryParam.id, 2)
}

/**
 * 搭建模型-完成
 */
const onClose = () => {
  var list = lifeCycleList.emissionDetailList.findIndex((item) => item.emissionSourceNumber == null)
  if(list != -1){
    createMessage.warn(t("carbon.message.Please_enter_the_consumption_volume"))
    return
  }

  for(let i = 0; i < lifeCycleList.emissionDetailList.length; i++){
    let obj = lifeCycleList.emissionDetailList[i]
    if(obj.cyEmissionSourceTransports != null && obj.cyEmissionSourceTransports.length > 0){
      var objLIst = obj.cyEmissionSourceTransports.findIndex((item) => item.distance == null)
      if(objLIst != -1){
        createMessage.warn(t("carbon.message.Please_enter_the_transportation_information"))
        return
      }
    }
  }
  emit("back")
}

/**
 * 获取搭建模型数据
 */
const getData = () => {
  spinning.value = true
  defHttp.get({
    url: "/CyWorkmanshipLibrary/cyWorkmanshipLibrary/queryById",
    params: {
      id: props.queryParam.id,
    }
  })
    .then((res) => {
      if (res) {
        console.log(res, "获取搭建模型数据")
        sortLeftList.value = []
        sortRightList.value = []
        if (res.emissionDetailList.length > 0) {
          res.emissionDetailList.forEach((item) => {
            if (item.type == 1) {
              console.log(item, "获取搭建模型数据1")
              sortLeftList.value.push(item)
            } else {
              console.log(item, "获取搭建模型数据2")
              sortRightList.value.push(item)
            }
          })
        }
        Object.assign(lifeCycleList, res.result)
      }
    })
    .finally(() => {
      spinning.value = false
    })
}

/**
 * 添加输入或者输出
 * @param calculateProcessItem
 * @param type
 */
const addInputOrOutput = (calculateProcessItem, type) => {
  console.log("addInputOrOutput", calculateProcessItem, type)
  if (type == "INPUT") {
    // 添加输入
    emissionTableRef.value.formObj.processType = "in"
  }
  if (type == "OUTPUT") {
    // 添加输出
    emissionTableRef.value.formObj.processType = "out"
  }

  emissionTableRef.value.formObj.processId = props.queryParam.id
  emissionTableRef.value.getData()
  emissionTableRef.value.visible = true
}

/**
 * 编辑单个排放源
 * @param reqData
 */
const onUpData = (reqData) => {
  console.log(lifeCycleList)
  console.log(sortLeftList.value)
  console.log(reqData, "value")
  defHttp.post({
    url: "/CyWorkmanshipEmissionSource/cyWorkmanshipEmissionSource/edit",
    params: reqData
  }).then((res) => {
    if (res) {
      createMessage.success(res.message)
      getData()
    }
  })
}

const edEmiss = (value) => {
  console.log(value)
  if(value == 1){
    inputAndOutputFormRef.value.activeKey = '1'
  }else{
    inputAndOutputFormRef.value.activeKey = '2'
  }
}

/**
 * 编辑输入或者输出
 * @param calculateProcessItem
 * @param processFlowItem
 * @param type
 */
const editInputOrOutput = async (calculateProcessItem, processFlowItem, type) => {
  console.log(
    "editInputOrOutput",
    calculateProcessItem,
    processFlowItem,
    type
  )
  let processType = ""
  if (type == "INPUT") {
    //  编辑输入
    processType = "in"
    inputAndOutputFormRef.value.drawerTitle = t("carbon.message.Edit_input")
  }
  if (type == "OUTPUT") {
    // 编辑输出
    processType = "out"
    inputAndOutputFormRef.value.drawerTitle = t("carbon.message.Edit_output")
  }

  let formObj = {
    processType: processType,
    processName: processFlowItem.processName,
    processId: processFlowItem.processId,
    id: processFlowItem.id,
    flowType: processFlowItem.flowType,
    flowTypeName: processFlowItem.flowTypeName,
    emissionSourceName: processFlowItem.emissionSourceName,
    emissionSourceNumber: processFlowItem.emissionSourceNumber,
    emissionSourceUnit: processFlowItem.emissionSourceUnit,
    emissionSourceUnitName: processFlowItem.emissionSourceUnitName,
    emissionSourceType: processFlowItem.emissionSourceType,
    emissionSourceTypeName: processFlowItem.emissionSourceTypeName,
    attachment: processFlowItem.attachment,
    dataSources: String(processFlowItem.dataSources),
    factorRatio: processFlowItem.factorRatio,
    emissionFactorId: processFlowItem.emissionFactorId,
    factorValue: processFlowItem.factorValue,
    cyEmissionSourceTransports: JSON.parse(JSON.stringify(processFlowItem.cyEmissionSourceTransports)),
    isTransport: processFlowItem.isTransport,
  }

  if (processFlowItem.cyEmissionSourceTransports != null && processFlowItem.cyEmissionSourceTransports.length > 0) {
    formObj.weight = processFlowItem.weight == 0 ? null : processFlowItem.weight
    formObj.weightUnit = processFlowItem.weightUnit
    formObj.weightUnitName = processFlowItem.weightUnitName

    // 运输路段-碳排因子
    let activeCollapseKey = []
    for (let i = 0; i < formObj.cyEmissionSourceTransports.length; i++) {
      const item = formObj.cyEmissionSourceTransports[i]
      activeCollapseKey.push(String(i))
      try {
        const res = await defHttp.get({
          url: "/emission/factor/cyEmissionFactor/listInfo",
          params: {
            id: item.emissionFactorId,
          }
        })
        if (res) {
          let selectedRows = {
            id: res.emissionFactorObject.id,
            name: res.emissionFactorObject.name,
            model: res.emissionFactorObject.model,
            factorValue: res.emissionFactorDataObject.factorValue,
            numeratorUnit: res.emissionFactorDataObject.numeratorUnit,
            denominatorUnit: res.emissionFactorDataObject.denominatorUnit,
            industry: res.emissionFactorObject.industry,
            releaseOrg: res.emissionFactorObject.releaseOrg,
            releaseYear: res.emissionFactorObject.releaseYear,
          }
          item.selectedRows = selectedRows
        }
      } catch (error) {
        console.error(error)
      }
    }

    console.log("activeCollapseKey", activeCollapseKey)
    inputAndOutputFormRef.value.activeCollapseKey = activeCollapseKey
  }

  inputAndOutputFormRef.value.formObj = formObj
  console.log("formObj", formObj)

  // 基本信息-碳排因子
  try {
    const res = await defHttp.get({
      url: "/emission/factor/cyEmissionFactor/listInfo",
      params: {
        id: formObj.emissionFactorId,
      }
    })

    let selectedRows = {
      id: res.emissionFactorObject.id,
      name: res.emissionFactorObject.name,
      model: res.emissionFactorObject.model,
      factorValue: res.emissionFactorDataObject.factorValue,
      numeratorUnit: res.emissionFactorDataObject.numeratorUnit,
      denominatorUnit: res.emissionFactorDataObject.denominatorUnit,
      industry: res.emissionFactorObject.industry,
      releaseOrg: res.emissionFactorObject.releaseOrg,
      releaseYear: res.emissionFactorObject.releaseYear,
    }

    inputAndOutputFormRef.value.selectedRows = selectedRows
    inputAndOutputFormRef.value.type = 2
    inputAndOutputFormRef.value.getData()
    inputAndOutputFormRef.value.visible = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * 删除输入或输出
 * @param processFlowItem
 * @param type
 */
const delInputOrOutput = (processFlowItem, type) => {
  console.log("delInput", processFlowItem, type)
  if (disabled.value) {
    // 禁用状态
    return
  }

  defHttp.delete({
    url: "/CyWorkmanshipEmissionSource/cyWorkmanshipEmissionSource/delete",
    params: {
      id: processFlowItem.id,
    }
  }).then((res) => {
    if (res) {
      createMessage.success(res.message)
      getData()
    }
  })
}

const onTableForm = () => {
  tableFormRef.value.visible = true
}

const onInpit = () => {
  defHttp.post({
    url: "CyWorkmanshipLibrary/cyWorkmanshipLibrary/edit",
    params: lifeCycleList
  }).then((res) => {
    if (res) {
      createMessage.success(t("carbon.message.operation_success"))
      getData()
    } else {
      createMessage.error(res.message)
    }
  })
}

const getNowDate = () => {
  var date = new Date()
  var seperator1 = "-"
  var seperator2 = ":"
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = "0" + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate
  }
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds()
  return currentdate
}

// 暴露给父组件的方法
defineExpose({
  getData
})
</script>

<style lang="less" scoped>
.img7 {
  width: 14px;
  height: 14px;
  margin-left: 12px;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawerOptionBox {
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: center;
  z-index: 999;
}

.fkeTest {
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 19px;
}

.m_cbFlex {
  :deep(.ant-btn) {
    color: @primary-color;
  }
}

.img8 {
  width: 16px;
  height: 16px;
  margin-left: 6px;
}

.img7 {
  width: 14px;
  height: 14px;
  margin-left: 12px;
}

.nbrods {
  border: 1px solid #d9d9d9;
}

.borsw {
  padding: 15px 31px;
  width: 442px;
}

.postAb {
  position: absolute;
  bottom: -10px;
  z-index: 99;
}

.patho-tab {
  background: #fff;
}

.patho-tab__body {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  overflow: hidden;
  flex-grow: 1;
}

.patho-tab .patho-chart {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: -moz-max-content;
  width: max-content;
  border: 1.5px solid #d9d9d9;
  border-top: none;
  cursor: grab;
}

.patho-tab .patho-chart .patho-chart__section {
  width: 710px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-basis: auto;
}

.patho-tab .patho-chart .patho-chart__section.patho-chart__section_right {
  position: relative;
}

.patho-tab
.patho-chart
.patho-chart__section.patho-chart__section_right::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -30px;
  width: 30px;
  border-top: 1px dashed #1573eb;
}

.patho-tab .patho-chart .patho-chart__section.patho-chart__section_left {
  position: relative;
  text-align: left;
  justify-content: flex-end;
}

.patho-tab
.patho-chart
.patho-chart__section.patho-chart__section_left::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 30px;
  border-top: 1px dashed #1573eb;
  left: auto;
  right: -30px;
}

.patho-tab .patho-chart .root-node {
  margin: 6px 0;
  width: 100%;
}

::v-deep .el-scrollbar__view {
  min-height: 100%;
}

.patho-tab__zoom {
  box-sizing: border-box;
  min-height: 143px;
  background: #f9f9f9;
  display: grid;
  grid-template-columns: 76px 1fr;
  border: 1px solid #ccc;
  border-top: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.patho-tab__zoom .patho-tab__zoom_left {
  box-sizing: border-box;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .patho-tab__zoom_left_btn {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2px 7px;
    border-radius: 4px;
    color: #fff;
    background: #148958;
  }

  .patho-tab__zoom_left_btn_text {
  }
}

.patho-tab__zoom .patho-tab__zoom_left_item {
  text-align: center;
  font-weight: bold;
}

.patho-tab__zoom .patho-tab__zoom_right {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
}

.patho-tab__zoom .patho-chart {
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  transform-origin: 0 0;
  border-top: 1px solid #ccc;
}

.patho-tab__zoom
.patho-tab__zoom_right
.patho-tab__zoom_right_item:first-child
.patho-chart {
  border-top: none;
}

.patho-tab__no-datas {
  margin-top: 20%;
  text-align: center;
}

.patho-tab__no-datas_icon {
  width: 200px;
}

.patho-chart-enter-active,
.patho-chart-leave-active {
  transition: opacity 0.5s;
}

.patho-chart-enter,
.patho-chart-leave-to {
  opacity: 0;
}

.patho-chart-enter-to,
.patho-chart-leave {
  opacity: 1;
}

.headerBox {
  box-sizing: border-box;
  display: flex;
  height: 68px;
  background: #f9f9f9;
  border: 1px solid #ccc;

  .headerBox_box1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 50px;
  }

  .headerBox_box2 {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 711px;
    border-left: 1px solid #ccc;
  }

  .headerBox_box3 {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 441px;
    border-left: 1px solid #ccc;
  }

  .headerBox_box2_text1 {
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
  }

  .headerBox_box2_text2 {
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }
}

.boxItem_center2 {
  box-sizing: border-box;
  padding: 14px 16px;
  background: transparent;
  border-radius: 3px;
  border: 1px dashed #148958;
  color: #999;
  line-height: 22px;
}

.boxItem_center {
  box-sizing: border-box;
  padding: 10px 16px;
  background: #eaf3ff;
  border-radius: 3px;
  border: 1px solid #1573eb;
  color: #1573eb;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;

  .boxItem_center_tr1 {
    line-break: anywhere;
    display: flex;
    align-items: center;
  }

  .boxItem_center_tr2 {
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }

  .boxItem_center_tr2_text1 {
    flex: 1;
    line-break: anywhere;
  }

  .boxItem_center_tr2_text2 {
    white-space: nowrap;
    text-align: right;
    flex: 1;
    line-break: anywhere;
    display: flex;
    align-items: center;

    :deep(.ant-input-affix-wrapper) {
      .ant-input {
        font-size: 12px;
        padding-right: 20px !important;
      }

      span {
        font-weight: 400;
        font-size: 12px;
        color: #333333;
      }

      .ant-input-affix-wrapper .ant-input:not(:last-child) {
        padding-right: 20px !important;
      }

      .ant-input-suffix {
        right: 5px !important;
      }
    }
  }
}

.productLifeCycle_color1 {
  background: #f1fff9;
  border: 1px solid #148958;
  color: #148958;
}

.productLifeCycle_color2 {
  background: #eaf3ff;
  border: 1px solid #1573eb;
  color: #1573eb;
}

.productLifeCycle_color3 {
  background: #fff9ee;
  border: 1px solid #ffbe49;
  color: #ffbe49;
}

.productLifeCycle_color4 {
  background: #fff4eb;
  border: 1px solid #e37318;
  color: #e37318;
}

.productLifeCycle_color5 {
  background: #fae4e3;
  border: 1px solid #d54941;
  color: #d54941;
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
