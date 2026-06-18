<template>
  <div class="">
    <a-spin :spinning="spinning">
      <section class="patho-tab" ref="pathoChartContainer">
        <section class="headerBox">
          <div class="headerBox_box1"></div>
          <div class="headerBox_box2">
            <div class="headerBox_box2_text1">{{ t('carbon.message.Input') }}</div>
            <div class="headerBox_box2_text2">
              {{ t('carbon.message.Raw_materials_consumables_energy_resources') }}
            </div>
          </div>
          <div class="headerBox_box3">
            <div class="headerBox_box2_text1">
              {{ t('carbon.message.Working_procedure') }}
            </div>
            <div class="headerBox_box2_text2">
              {{ t('carbon.message.The_things_produced') }}
            </div>
          </div>
          <div class="headerBox_box2">
            <div class="headerBox_box2_text1">{{ t('carbon.message.Output') }}</div>
            <div class="headerBox_box2_text2">
              {{ t('carbon.message.Waste_gas_wastewater') }}
            </div>
          </div>
        </section>
        <section class="patho-tab__zoom" v-for="(lifeCycleItem, lifeCycleIndex) in lifeCycleList" :key="lifeCycleIndex">
          <!-- 当前生命周期名称 -->
          <section class="patho-tab__zoom_left">
            <div class="patho-tab__zoom_left_item" v-for="(textItem, textIndex) in lifeCycleItem.lifeCycleTypeName" :key="textIndex">
              {{ textItem }}
            </div>
          </section>
          <!-- 当前生命周期所有工序 -->
          <section class="patho-tab__zoom_right" v-if="isAss">
            <div
              class="patho-tab__zoom_right_item"
              style="position: relative"
              :class="{
                dragging: calculateProcessItem.draggingIndex === calculateProcessIndex,
              }"
              v-for="(calculateProcessItem, calculateProcessIndex) in lifeCycleItem.calculateProcessList"
              :key="calculateProcessIndex"
              v-sortable="calculateProcessIndex"
              :draggableDisabled="disabled"
              @dragstart="setDraggingIndex(lifeCycleItem.calculateProcessList, calculateProcessItem, calculateProcessIndex)"
              @dragend="clearDraggingIndex(lifeCycleItem.calculateProcessList, calculateProcessItem)"
            >
              <div class="patho-chart">
                <!-- 输入 -->
                <section class="patho-chart__section m_hoverCP" :class="getBorder_color(calculateProcessItem)">
                  <pathNodeLeft
                    v-for="(processFlowItem, processFlowIndex) in calculateProcessItem.processFlowListIn"
                    :key="processFlowIndex"
                    :calculateProcessItem="calculateProcessItem"
                    :node="processFlowItem"
                    :disabled="disabled"
                    @editInput="editInputOrOutput(calculateProcessItem, processFlowItem, 'INPUT')"
                    @delInput="delInputOrOutput(calculateProcessItem, processFlowItem, 'INPUT')"
                    @onUpData="onUpData(processFlowItem, calculateProcessItem)"
                    @edEmiss="edEmiss"
                  />
                </section>
                <!-- 工序 -->
                <section class="borsw">
                  <section
                    class="patho-chart__section_center root-node boxItem_center m_hoverCP"
                    :class="getProductLifeCycle_color(calculateProcessItem)"
                    v-if="calculateProcessItem.id"
                  >
                    <div class="flex">
                      <div class="boxItem_center_tr1" @click="editWorkingProcedure(lifeCycleItem, calculateProcessItem)">
                        {{ calculateProcessItem.processName ? calculateProcessItem.processName : '空工序' }}
                        <img :src="img7" class="img7" alt="" />
                      </div>
                      <div class="boxItem_center_tr1 titles"> {{ calculateProcessItem.totalUseNumber }}kgCO₂e </div>
                    </div>
                    <div
                      class="boxItem_center_tr2"
                      v-if="
                        calculateProcessItem.processArtifactList &&
                        calculateProcessItem.processArtifactList[0] &&
                        calculateProcessItem.processArtifactList[0]
                      "
                    >
                      <div class="boxItem_center_tr2_text1">
                        {{ t('carbon.message.The_things_produced') }}-
                        {{ calculateProcessItem.processArtifactList[0].artifactName }}
                      </div>
                      <div class="boxItem_center_tr2_text2">
                        {{ t('carbon.message.Actual_dosage') }}：
                        <a-input
                          :placeholder="t('carbon.message.Please_enter')"
                          @blur="onInpit(calculateProcessItem)"
                          v-model:value="calculateProcessItem.processArtifactList[0].actualUsage"
                          :suffix="calculateProcessItem.processArtifactList[0].artifactUnitName"
                        />
                        <!-- {{ calculateProcessItem.processArtifactList[0].artifactNumber }} -->
                      </div>
                    </div>
                    <div class="m_cbFlex" style="margin-top: 5px">
                      <a-button size="small" @click="addInputOrOutput(calculateProcessItem, 'INPUT', lifeCycleItem)" v-if="!disabled"
                        ><a-icon type="plus" />{{ t('carbon.message.Input') }}
                      </a-button>
                      <a-popconfirm
                        :title="t('carbon.message.Confirm_delete')"
                        :cancel-text="t('carbon.message.Cancel')"
                        :ok-text="t('carbon.message.Confirm')"
                        @confirm="() => delWorkingProcedure(calculateProcessItem)"
                        v-if="!disabled"
                      >
                        <img class="m_hoverCP" style="width: 22px; height: 22px" :src="img50" alt="" />
                      </a-popconfirm>
                      <a-button size="small" @click="addInputOrOutput(calculateProcessItem, 'OUTPUT', lifeCycleItem)" v-if="!disabled"
                        ><a-icon type="plus" />{{ t('carbon.message.Output') }}
                      </a-button>
                    </div>
                  </section>
                  <section
                    class="patho-chart__section_center root-node boxItem_center2 m_hoverCP"
                    :class="getProductLifeCycle_color(calculateProcessItem)"
                    v-else
                  >
                    <div class="fkeTest" @click="onTableForm(lifeCycleItem)">
                      <img :src="img8" class="img8" alt="" />
                      <div class="boxItem_center_tr1">
                        {{ t('carbon.message.New_process') }}
                      </div>
                    </div>
                    <div class="m_cbFlex" style="margin-top: 5px">
                      <a-button type="primary" @click="addInputOrOutput(calculateProcessItem, 'INPUT', lifeCycleItem)" v-if="!disabled">
                        <a-icon type="plus" /> {{ t('carbon.message.Input') }}
                      </a-button>
                      <a-button size="small" @click="addInputOrOutput(calculateProcessItem, 'OUTPUT', lifeCycleItem)" v-if="!disabled"
                        ><a-icon type="plus" />{{ t('carbon.message.Output') }}
                      </a-button>
                    </div>
                  </section>
                </section>
                <!-- 输出 -->
                <section class="patho-chart__section m_hoverCP" :class="getBorderRIght_color(calculateProcessItem)">
                  <pathNodeRight
                    v-for="(processFlowItem, processFlowIndex) in calculateProcessItem.processFlowListOut"
                    :key="processFlowIndex"
                    :calculateProcessItem="calculateProcessItem"
                    :node="processFlowItem"
                    :disabled="disabled"
                    @editInput="editInputOrOutput(calculateProcessItem, processFlowItem, 'OUTPUT')"
                    @delInput="delInputOrOutput(calculateProcessItem, processFlowItem, 'OUTPUT')"
                    @onUpData="onUpData(processFlowItem, calculateProcessItem)"
                    @edEmiss="edEmiss"
                  />
                </section>
              </div>
              <div class="postAb" v-if="calculateProcessIndex == lifeCycleItem.calculateProcessList.length - 1">
                <a-popover>
                  <template #content>
                    <div class="aButtons marBos" @click="addInputOrOutput('', 'INPUT', lifeCycleItem)">
                      {{ t('carbon.message.New_input') }}
                    </div>
                    <div class="aButtons marBos" @click="addInputOrOutput('', 'OUTPUT', lifeCycleItem)">
                      {{ t('carbon.message.ew_output') }}
                    </div>
                    <div class="aButtons" @click="onTableForm(lifeCycleItem)">
                      {{ t('carbon.message.New_process') }}
                    </div>
                  </template>
                  <a-button type="primary" size="small" v-if="!disabled"> <a-icon type="plus" />新增 </a-button>
                </a-popover>
              </div>
            </div>
            <div class="postAb1" v-if="lifeCycleItem.calculateProcessList.length == 0">
              <a-popover>
                <template #content>
                  <div class="aButtons marBos" @click="addInputOrOutput('', 'INPUT', lifeCycleItem)">
                    {{ t('carbon.message.New_input') }}
                  </div>
                  <div class="aButtons marBos" @click="addInputOrOutput('', 'OUTPUT', lifeCycleItem)">
                    {{ t('carbon.message.ew_output') }}
                  </div>
                  <div class="aButtons" @click="onTableForm(lifeCycleItem)">
                    {{ t('carbon.message.New_process') }}
                  </div>
                </template>
                <a-button type="primary" size="small" v-if="!disabled"> <a-icon type="plus" />新增 </a-button>
              </a-popover>
            </div>
          </section>
        </section>
      </section>
      <div class="optionBox">
        <div class="optionItem_next m_hoverCP" @click="onSave2('next')">
          {{ t('carbon.message.Generate_carbon_footprint_results') }}
        </div>
      </div>
    </a-spin>
    <!-- 输入输出表单弹窗 -->
    <inputAndOutputForm ref="inputAndOutputFormRef" :disabled="disabled" @back="back" />
    <emissionSourceTable ref="emissionSourceTableRef" :disabled="disabled" @back="back" />
    <!-- 工序表单弹窗 -->
    <tableForm ref="tableFormRef" :disabled="disabled" @back="back" />
    <processForm ref="processFormRef" :disabled="disabled" @back="back" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import pathNodeLeft from './pathNodeLeft.vue';
import pathNodeRight from './pathNodeRight.vue';
import inputAndOutputForm from './inputAndOutputForm.vue';
import tableForm from './tableForm.vue';
import emissionSourceTable from './EmissionSourceTable.vue';
import processForm from './processForm.vue';

// 导入图片资源
import img7 from '@/assets/cptzj/img7.png';
import img8 from '@/assets/cptzj/img8.png';
import img50 from '@/assets/img/img50.png';
import { truncate } from 'lodash-es';

// i18n 和消息提示
const { t } = useI18n();
const { createMessage } = useMessage();

// 定义 props 和 emits
const props = defineProps({
  queryParam: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emit = defineEmits(['changeStep']);

// refs
const inputAndOutputFormRef = ref(null);
const emissionSourceTableRef = ref(null);
const tableFormRef = ref(null);
const processFormRef = ref(null);
const pathoChartContainer = ref(null);

// 数据状态
const lifeCycleList = ref([]);
const sortCalculateProcessList = ref([]);
const spinning = ref(false);
const disabled = ref(false); // 表单禁用状态
const isAss = ref(true);

const emissionSourceTableRefVisible = ref(false);

// 回调函数
const back = () => {
  getData();
};

/**
 * 搭建模型-保存
 */
const onSave2 = () => {
  spinning.value = true;
  isAss.value = false;
  let notIndex = 0;
  console.log('onSave2', props.queryParam, lifeCycleList.value);
  lifeCycleList.value.forEach((item) => {
    if (item.calculateProcessList.length > 0) {
      item.calculateProcessList.forEach((process) => {
        if (process.processFlowListIn.length > 0) {
          process.processFlowListIn.forEach((flow) => {
            if (!flow.flowNumber || (!flow.weight && flow.processTransportList.length > 0)) {
              flow.className = 'CF0D66';
              notIndex++;
              flow.className = 'CF0D66';
            } else if (flow.processTransportList.length > 0) {
              flow.processTransportList.forEach((portils) => {
                if (!portils.distance) {
                  flow.className = 'CF0D66';
                  notIndex++;
                  flow.className = 'CF0D66';
                }
              });
            }
          });
        }
        if (process.processFlowListOut.length > 0) {
          process.processFlowListOut.forEach((flow) => {
            if (!flow.flowNumber || (!flow.weight && flow.processTransportList.length > 0)) {
              flow.className = 'CF0D66';
              flow.className = 'CF0D66';
              notIndex++;
            } else if (flow.processTransportList.length > 0) {
              flow.processTransportList.forEach((portils) => {
                if (!portils.distance) {
                  flow.className = 'CF0D66';
                  notIndex++;
                  flow.className = 'CF0D66';
                }
              });
            }
          });
        }
      });
    }
  });
  setTimeout(() => {
    isAss.value = true;
    if (notIndex != 0) {
      spinning.value = false;
      createMessage.error('请补充信息');
      return;
    } else {
      console.log('onSave2', props.queryParam, lifeCycleList.value);
      emit('changeStep', 3, true, true);
    }
  }, 500);
};

/**
 * 获取搭建模型数据
 */
const getData = () => {
  spinning.value = true;
  defHttp
    .get({
      url: '/footprintProduct/cyFootprintProduct/getCalculateModel',
      params: {
        calculateId: props.queryParam.id,
      },
    })
    .then((res) => {
      if (res) {
        if (res.calculateArchived === '1') {
          disabled.value = true;
        } else {
          disabled.value = false;
        }
        let lifeCycleListData = res.lifeCycleList;
        //生命周期
        lifeCycleListData.forEach((res) => {
          console.log(res, 'calculateProcessList');
          console.log(typeof res.calculateProcessList);
          console.log(res.calculateProcessList.length);
          if (res.calculateProcessList.length > 0) {
            //工序
            res.calculateProcessList.forEach((process) => {
              //输入
              if (process.processFlowListIn.length > 0) {
                process.processFlowListIn.forEach((flow) => {
                  console.log(flow, 'flow');
                  let numbers = 0;
                  if (flow.emissionFactorUnit.charAt(0) == 't') {
                    flow.totalEmissionNumber = (
                      (flow.flowNumber ? flow.flowNumber : 0) *
                      (flow.factorValue ? flow.factorValue : 0) *
                      (flow.factorRatio ? flow.factorRatio : 0) *
                      1000
                    ).toFixed(4);
                  } else if (flow.emissionFactorUnit.charAt(0) == 'g') {
                    flow.totalEmissionNumber = (
                      ((flow.flowNumber ? flow.flowNumber : 0) *
                        (flow.factorValue ? flow.factorValue : 0) *
                        (flow.factorRatio ? flow.factorRatio : 0)) /
                      1000
                    ).toFixed(4);
                  } else {
                    flow.totalEmissionNumber = (
                      (flow.flowNumber ? flow.flowNumber : 0) *
                      (flow.factorValue ? flow.factorValue : 0) *
                      (flow.factorRatio ? flow.factorRatio : 0)
                    ).toFixed(4);
                    console.log(flow.totalEmissionNumber, 'flow.totalEmissionNumber');
                  }
                  //运输
                  if (flow.processTransportList != null && flow.processTransportList.length > 0) {
                    flow.processTransportList.forEach((portils) => {
                      if (portils.emissionFactorUnit.charAt(0) == 't') {
                        numbers += (
                          (flow.weight ? flow.weight : 0) *
                          (portils.distance ? portils.distance : 0) *
                          (portils.factorValue ? portils.factorValue : 0) *
                          (portils.factorRatio ? portils.factorRatio : 0) *
                          1000
                        ).toFixed(4);
                      } else if (portils.emissionFactorUnit.charAt(0) == 'g') {
                        numbers += (
                          ((flow.weight ? flow.weight : 0) *
                            (portils.distance ? portils.distance : 0) *
                            (portils.factorValue ? portils.factorValue : 0) *
                            (portils.factorRatio ? portils.factorRatio : 0)) /
                          1000
                        ).toFixed(4);
                      } else {
                        numbers += (
                          (flow.weight ? flow.weight : 0) *
                          (portils.distance ? portils.distance : 0) *
                          (portils.factorValue ? portils.factorValue : 0) *
                          (portils.factorRatio ? portils.factorRatio : 0)
                        ).toFixed(4);
                      }
                    });
                  }
                  console.log(flow.totalEmissionNumber, numbers * 1, 'numbers');
                  flow.totalEmissionNumber = (flow.totalEmissionNumber * 1 + numbers * 1).toFixed(4);
                });
              }

              //输出
              if (process.processFlowListOut.length > 0) {
                process.processFlowListOut.forEach((flow) => {
                  console.log(flow, 'flow');
                  let numbers = 0;
                  if (flow.emissionFactorUnit.charAt(0) == 't') {
                    flow.totalEmissionNumber = (
                      (flow.flowNumber ? flow.flowNumber : 0) *
                      (flow.factorValue ? flow.factorValue : 0) *
                      (flow.factorRatio ? flow.factorRatio : 0) *
                      1000
                    ).toFixed(4);
                  } else if (flow.emissionFactorUnit.charAt(0) == 'g') {
                    flow.totalEmissionNumber = (
                      ((flow.flowNumber ? flow.flowNumber : 0) *
                        (flow.factorValue ? flow.factorValue : 0) *
                        (flow.factorRatio ? flow.factorRatio : 0)) /
                      1000
                    ).toFixed(4);
                  } else {
                    flow.totalEmissionNumber = (
                      (flow.flowNumber ? flow.flowNumber : 0) *
                      (flow.factorValue ? flow.factorValue : 0) *
                      (flow.factorRatio ? flow.factorRatio : 0)
                    ).toFixed(4);
                    console.log(flow.totalEmissionNumber, 'flow.totalEmissionNumber');
                  }
                  //运输
                  if (flow.processTransportList != null && flow.processTransportList.length > 0) {
                    flow.processTransportList.forEach((portils) => {
                      if (portils.emissionFactorUnit.charAt(0) == 't') {
                        numbers += (
                          (flow.weight ? flow.weight : 0) *
                          (portils.distance ? portils.distance : 0) *
                          (portils.factorValue ? portils.factorValue : 0) *
                          (portils.factorRatio ? portils.factorRatio : 0) *
                          1000
                        ).toFixed(4);
                      } else if (portils.emissionFactorUnit.charAt(0) == 'g') {
                        numbers += (
                          ((flow.weight ? flow.weight : 0) *
                            (portils.distance ? portils.distance : 0) *
                            (portils.factorValue ? portils.factorValue : 0) *
                            (portils.factorRatio ? portils.factorRatio : 0)) /
                          1000
                        ).toFixed(4);
                      } else {
                        numbers += (
                          (flow.weight ? flow.weight : 0) *
                          (portils.distance ? portils.distance : 0) *
                          (portils.factorValue ? portils.factorValue : 0) *
                          (portils.factorRatio ? portils.factorRatio : 0)
                        ).toFixed(4);
                      }
                    });
                  }
                  console.log(flow.totalEmissionNumber, numbers * 1, 'numbers');
                  flow.totalEmissionNumber = (flow.totalEmissionNumber * 1 + numbers * 1).toFixed(4);
                });
              }
              let lsengs = 0;
              if (process.processFlowListIn.length > 0) {
                process.processFlowListIn.forEach((res) => {
                  lsengs += res.totalEmissionNumber * 1;
                });
              }
              if (process.processFlowListOut.length > 0) {
                process.processFlowListOut.forEach((res) => {
                  lsengs += res.totalEmissionNumber * 1;
                });
              }
              process.totalUseNumber = (lsengs * 1).toFixed(4);
            });
          }
        });
        lifeCycleList.value = lifeCycleListData;
      }
    })
    .finally(() => {
      spinning.value = false;
    });
};

/**
 * 根据类型获取样式类名
 */
const getProductLifeCycle_color = (calculateProcessItem) => {
  return {
    productLifeCycle_color1: calculateProcessItem.lifeCycleTypeId * 1 == 1,
    productLifeCycle_color2: calculateProcessItem.lifeCycleTypeId * 1 == 2,
    productLifeCycle_color3: calculateProcessItem.lifeCycleTypeId * 1 == 3,
    productLifeCycle_color4: calculateProcessItem.lifeCycleTypeId * 1 == 4,
    productLifeCycle_color5: calculateProcessItem.lifeCycleTypeId * 1 == 5,
  };
};

/**
 * brfour上颜色
 */
const getBorder_color = (calculateProcessItem) => {
  return {
    patho_chart__section_left: calculateProcessItem.processFlowListIn && calculateProcessItem.processFlowListIn.length > 0,
    productLifeCycle_colorbefore1: calculateProcessItem.lifeCycleTypeId * 1 == 1,
    productLifeCycle_colorbefore2: calculateProcessItem.lifeCycleTypeId * 1 == 2,
    productLifeCycle_colorbefore3: calculateProcessItem.lifeCycleTypeId * 1 == 3,
    productLifeCycle_colorbefore4: calculateProcessItem.lifeCycleTypeId * 1 == 4,
    productLifeCycle_colorbefore5: calculateProcessItem.lifeCycleTypeId * 1 == 5,
  };
};

const getBorderRIght_color = (calculateProcessItem) => {
  return {
    patho_chart__section_right: calculateProcessItem.processFlowListOut && calculateProcessItem.processFlowListOut.length > 0,
    productLifeCycle_colorbefore1: calculateProcessItem.lifeCycleTypeId * 1 == 1,
    productLifeCycle_colorbefore2: calculateProcessItem.lifeCycleTypeId * 1 == 2,
    productLifeCycle_colorbefore3: calculateProcessItem.lifeCycleTypeId * 1 == 3,
    productLifeCycle_colorbefore4: calculateProcessItem.lifeCycleTypeId * 1 == 4,
    productLifeCycle_colorbefore5: calculateProcessItem.lifeCycleTypeId * 1 == 5,
  };
};

const edEmiss = (value) => {
  console.log(value);
  if (value == 1) {
    if (inputAndOutputFormRef.value) {
      inputAndOutputFormRef.value.activeKey = '1';
    }
  } else {
    if (inputAndOutputFormRef.value) {
      inputAndOutputFormRef.value.activeKey = '2';
    }
  }
};

/**
 * 拖拽完成改变顺序
 */
const handleDrop = ({ draggedIndex, droppedIndex }) => {
  console.log('handleDrop', { draggedIndex, droppedIndex }, sortCalculateProcessList.value);
  const draggedItem = sortCalculateProcessList.value[draggedIndex];
  sortCalculateProcessList.value.splice(draggedIndex, 1);
  sortCalculateProcessList.value.splice(droppedIndex, 0, draggedItem);
  // 拼接数据
  let processSortList = [];
  sortCalculateProcessList.value.forEach((item, index) => {
    processSortList.push({
      processId: item.id,
      sort: index + 1,
    });
  });
  // 调接口保存顺序
  defHttp
    .post({
      url: '/footprintProduct/cyFootprintProduct/updateProcessSort',
      data: processSortList,
    })
    .then((res) => {
      if (res) {
        createMessage.success('排序成功');
        getData();
      }
    });
};

/**
 * 拖拽开始
 */
const setDraggingIndex = (calculateProcessList, calculateProcessItem, calculateProcessIndex) => {
  console.log('setDraggingIndex', calculateProcessList, calculateProcessItem, calculateProcessIndex);
  sortCalculateProcessList.value = calculateProcessList;
  calculateProcessItem.draggingIndex = calculateProcessIndex;
};

/**
 * 拖拽结束
 */
const clearDraggingIndex = (calculateProcessList, calculateProcessItem) => {
  console.log('clearDraggingIndex', calculateProcessList, calculateProcessItem);
  calculateProcessItem.draggingIndex = null;
};

/**
 * 添加输入或者输出
 * @param calculateProcessItem
 * @param type
 */
const addInputOrOutput = (calculateProcessItem, type, lifeCycleItem) => {
  console.log('addInputOrOutput', calculateProcessItem, type);
  if (disabled.value) {
    // 禁用
    return;
  }
  console.log('emissionSourceTableRef', emissionSourceTableRef.value.formObj);

  if (type == 'INPUT') {
    // 添加输入
    if (emissionSourceTableRef.value) {
      emissionSourceTableRef.value.formObj.processType = 'in';
      emissionSourceTableRef.value.drawerTitle = t('carbon.message.Add_input');
    }
  }
  if (type == 'OUTPUT') {
    // 添加输出
    if (emissionSourceTableRef.value) {
      emissionSourceTableRef.value.formObj.processType = 'out';
      emissionSourceTableRef.value.drawerTitle = t('carbon.message.Add_output');
    }
  }
  if (emissionSourceTableRef.value) {
    emissionSourceTableRef.value.formObj.lifeCycleId = lifeCycleItem.id;
    if (calculateProcessItem) {
      emissionSourceTableRef.value.formObj.processName = calculateProcessItem.processName;
      emissionSourceTableRef.value.formObj.processId = calculateProcessItem.id;
      emissionSourceTableRef.value.formObj.calculateId = calculateProcessItem.calculateId;
      emissionSourceTableRef.value.getData();
      emissionSourceTableRef.value.visible = true;
    } else {
      emissionSourceTableRef.value.formObj.processName = '';
      emissionSourceTableRef.value.formObj.processId = '';
      emissionSourceTableRef.value.formObj.calculateId = calculateProcessItem.calculateId;
      emissionSourceTableRef.value.getData();
      emissionSourceTableRef.value.visible = true;
    }
  }
};

/**
 * 编辑输入或者输出
 * @param calculateProcessItem
 * @param processFlowItem
 * @param type
 */
const editInputOrOutput = async (calculateProcessItem, processFlowItem, type) => {
  console.log('editInputOrOutput', calculateProcessItem, processFlowItem, type);
  let processType = '';
  if (type == 'INPUT') {
    //  编辑输入
    processType = 'in';
    if (emissionSourceTableRef.value) {
      emissionSourceTableRef.value.drawerTitle = t('carbon.message.Edit_input');
    }
  }
  if (type == 'OUTPUT') {
    // 编辑输出
    processType = 'out';
    if (emissionSourceTableRef.value) {
      emissionSourceTableRef.value.drawerTitle = t('carbon.message.Edit_output');
    }
  }

  let formObj = {
    processType: processType, //
    emissionFactorType: processFlowItem.emissionFactorType,
    processName: calculateProcessItem.processName, //
    processId: calculateProcessItem.id, //
    id: processFlowItem.id, //
    flowType: processFlowItem.flowType, //
    flowTypeName: processFlowItem.flowTypeName, //
    flowName: processFlowItem.flowName, //
    flowNumber: processFlowItem.flowNumber, //
    flowUnit: processFlowItem.flowUnit, //
    flowUnitName: processFlowItem.flowUnitName, //
    flowDataSources: String(processFlowItem.flowDataSources), //
    flowDataDescription: processFlowItem.flowDataDescription, //
    factorRatio: processFlowItem.factorRatio, //
    emissionFactorId: processFlowItem.emissionFactorId, //
    factorValue: processFlowItem.factorValue, //
    attachment: processFlowItem.attachment,
    calculateId: props.queryParam.id,
    lifeCycleId: calculateProcessItem.lifeCycleId,
  };

  if (processFlowItem.processTransportList.length > 0) {
    formObj.isTransport = true;
    formObj.weight = processFlowItem.weight;
    formObj.weightUnit = processFlowItem.weightUnit;
    formObj.weightUnitName = processFlowItem.weightUnitName;
    // 运输路段-碳排因子
    let activeCollapseKey = [];
    formObj.transportList = processFlowItem.processTransportList;
    processFlowItem.processTransportList.forEach((item, index) => {
      activeCollapseKey.push(String(index));
      defHttp
        .get({
          url: '/emission/factor/cyEmissionFactor/listInfo',
          params: {
            id: item.emissionFactorId,
          },
        })
        .then((res) => {
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
            };
            item.selectedRows = selectedRows;
          }
        });
    });

    if (emissionSourceTableRef.value) {
      emissionSourceTableRef.value.activeCollapseKey = activeCollapseKey;
    }
  } else {
    formObj.isTransport = false;
    formObj.transportList = [{}];
  }

  if (inputAndOutputFormRef.value) {
    inputAndOutputFormRef.value.formObj = formObj;
  }

  console.log('formObj', formObj);
  if (processFlowItem.emissionFactorType == 2) {
    // 基本信息-碳排因子(查询供应商碳数据详情)
    let res = await defHttp.get({
      url: '/footprintProduct/cyFootprintProduct/getSupplierCarbonDataById',
      params: {
        supplierCarbonDataId: processFlowItem.emissionFactorId,
      },
    });
    let selectedRows = res;

    if (inputAndOutputFormRef.value) {
      inputAndOutputFormRef.value.formObj.emissionFactorUnit = selectedRows.carbonEmissionsUnitId_dictText;
      selectedRows.emissionFactorType = processFlowItem.emissionFactorType;
      inputAndOutputFormRef.value.selectedRows = selectedRows;
      inputAndOutputFormRef.value.getData();
      inputAndOutputFormRef.value.visible = true;
    }
  } else {
    // 基本信息-碳排因子
    let res = await defHttp.get({
      url: '/emission/factor/cyEmissionFactor/listInfo',
      params: {
        id: formObj.emissionFactorId,
      },
    });
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
    };

    if (inputAndOutputFormRef.value) {
      inputAndOutputFormRef.value.formObj.emissionFactorUnit = selectedRows.numeratorUnit;
      inputAndOutputFormRef.value.selectedRows = selectedRows;
      inputAndOutputFormRef.value.getData();
      inputAndOutputFormRef.value.visible = true;
    }
  }
};

/**
 * 编辑单个工序
 * @param calculateProcessItem
 * @param processFlowItem
 * @param type
 */
const onInpit = (value) => {
  console.log(value);
  value.artifactList = value.processArtifactList;
  defHttp
    .post({
      url: '/footprintProduct/cyFootprintProduct/saveProcess',
      data: value,
    })
    .then((res) => {
      if (res) {
        createMessage.success(res.message);
        getData();
      }
    });
};

/**
 * 编辑单个排放源
 * @param calculateProcessItem
 * @param processFlowItem
 * @param type
 */
const onUpData = (reqData, calculateProcessItem) => {
  console.log(sortCalculateProcessList.value, calculateProcessItem, 'calculateProcessItem');
  console.log(reqData, 'value');
  reqData.transportList = reqData.processTransportList;
  reqData.calculateId = props.queryParam.id;
  reqData.lifeCycleId = calculateProcessItem.lifeCycleId;
  defHttp
    .post({
      url: '/footprintProduct/cyFootprintProduct/saveFlow',
      data: reqData,
    })
    .then((res) => {
      if (res) {
        // createMessage.success(res.message);
        getData();
      }
    });
};

/**
 * 删除输入或输出
 * @param processFlowItem
 * @param type
 */
const delInputOrOutput = (calculateProcessItem, processFlowItem, type) => {
  console.log('need', calculateProcessItem);
  console.log('delInput', processFlowItem, type);
  if (disabled.value) {
    // 禁用
    return;
  }
  defHttp
    .post({
      url: '/footprintProduct/cyFootprintProduct/delFlow',
      data: {
        flowId: processFlowItem.id,
        calculateId: calculateProcessItem.calculateId,
        lifeCycleId: calculateProcessItem.lifeCycleId,
        processId: processFlowItem.processId,
        type: type,
      },
    })
    .then((res) => {
      if (res) {
        createMessage.success(res.message);
        getData();
      }
    });
};

/**
 * 添加工序
 */
const addWorkingProcedure = (lifeCycleItem) => {
  console.log('addWorkingProcedure', lifeCycleItem);

  // if (disabled.value) {
  //   // 禁用
  //   return;
  // }
  // if (processFormRef.value) {
  //   processFormRef.value.formObj.lifeCycleId = lifeCycleItem.id;
  //   processFormRef.value.getData();
  //   processFormRef.value.visible = true;
  //   processFormRef.value.drawerTitle = t("carbon.message.Add_process");
  // }
};
function onTableForm(lifeCycleItem) {
  console.log(tableFormRef.value);
  console.log(inputAndOutputFormRef.value);
  
  if (tableFormRef.value) {
    tableFormRef.value.formObj.lifeCycleId = lifeCycleItem.id;
    tableFormRef.value.formObj.calculateId = lifeCycleItem.calculateId;
    tableFormRef.value.formObj.processAndFlowList = lifeCycleItem.calculateProcessList;
    tableFormRef.value.getData();
    tableFormRef.value.visible = true;
  }
}

/**
 * 编辑工序
 */
const editWorkingProcedure = (lifeCycleItem, calculateProcessItem) => {
  console.log('editWorkingProcedure', lifeCycleItem, calculateProcessItem);
  let theCalculateProcessItem = JSON.parse(JSON.stringify(calculateProcessItem));
  let activeCollapseKey = [];
  theCalculateProcessItem.processArtifactList.forEach((item, index) => {
    activeCollapseKey.push(String(index));
  });

  if (processFormRef.value) {
    processFormRef.value.activeCollapseKey = activeCollapseKey;
  }

  let formObj = {
    calculateId: calculateProcessItem.calculateId,
    lifeCycleId: calculateProcessItem.lifeCycleId,
    id: theCalculateProcessItem.id,
    processName: theCalculateProcessItem.processName,
    artifactList: theCalculateProcessItem.processArtifactList,
    outPutList: theCalculateProcessItem.processArtifactList.length <= 0 ? [{}] : theCalculateProcessItem.processArtifactList,
  };

  if (processFormRef.value) {
    processFormRef.value.formObj = formObj;
    processFormRef.value.getData();
    processFormRef.value.visible = true;
    processFormRef.value.drawerTitle = t('carbon.message.Edit_process');
  }
};

/**
 * 删除工序
 * @param calculateProcessItem
 */
const delWorkingProcedure = (calculateProcessItem) => {
  console.log('delWorkingProcedure', calculateProcessItem);
  if (disabled.value) {
    // 禁用
    return;
  }
  defHttp
    .post({
      url: '/footprintProduct/cyFootprintProduct/delProcess',
      data: {
        calculateId: calculateProcessItem.calculateId,
        lifeCycleId: calculateProcessItem.lifeCycleId,
        processId: calculateProcessItem.id,
      },
    })
    .then((res) => {
      if (res) {
        createMessage.success(res.message);
        getData();
      }
    });
};

const getNowDate = () => {
  var date = new Date();
  var seperator1 = '-';
  var seperator2 = ':';
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    ' ' +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
};

// 暴露方法给父组件
defineExpose({
  getData,
});
</script>

<style lang="less" scoped>
.titles {
  font-weight: 500;
  font-size: 14px;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.aButtons {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  padding: 3px 8px;
  cursor: pointer;
}
.aButtons:hover {
  color: #148958 !important;
  white-space: nowrap;
  background: #ecfff7 !important;
  padding: 3px 8px;
}
.marBos {
  margin-bottom: 16px;
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
  /deep/.ant-btn {
    color: #148958;
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
.borsw {
  padding: 15px 31px;
  // border-right: 1px solid #D9D9D9;
  // border-left: 1px solid #D9D9D9;
  width: 366px;
}
.postAb {
  position: absolute;
  left: 50%;
  bottom: -25px;
  transform: translateX(-45%);
  z-index: 99;
}
.postAb1 {
  position: absolute;
  left: 50%;
  bottom: 25px;
  transform: translateX(-50%);
  z-index: 99;
}
.patho-tab {
  background: #fff;
  // margin: 0px auto;
  // width: 1624px;
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
  // padding: 14px 0;
  width: -moz-max-content;
  width: max-content;
  cursor: grab;
}

.patho-tab .patho-chart .patho-chart__section {
  width: 678px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-basis: auto;
}

.pSections {
  width: 678px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-basis: auto;
}

.patho-tab .patho-chart .patho-chart__section.patho_chart__section_right {
  position: relative;
}

.patho-tab .patho-chart .patho-chart__section.patho_chart__section_right::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -31px;
  width: 30px;
  // border-top: 1px dashed #1573EB;
}
.patho-tab .patho-chart .patho-chart__section.patho_chart__section_left::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -31px;
  width: 30px;
  // border-top: 1px dashed #1573EB;
}

.patho-tab .patho-chart .patho-chart__section.patho_chart__section_left {
  position: relative;
  text-align: left;
  justify-content: flex-end;
  // padding: 0 49px;
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
  padding-bottom: 50px;
}

.patho-tab__zoom .patho-chart {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  transform-origin: 0 0;
  // border-top: 1px solid #ccc;
}

.patho-tab__zoom .patho-tab__zoom_right .patho-tab__zoom_right_item:first-child .patho-chart {
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

// =================================================================================

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
    min-width: 76px;
    height: 50px;
  }

  .headerBox_box2 {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-width: 678px;
    border-left: 1px solid #ccc;
  }

  .headerBox_box3 {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-width: 366px;
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
  background: #f5f7f6;
  border-radius: 3px;
  border: 1px solid #999;
  color: #999;
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
    text-align: right;
    flex: 1;
    line-break: anywhere;
    display: flex;
    align-items: center;
    white-space: nowrap;
    /deep/.ant-input-affix-wrapper {
      width: 68px;
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
.productLifeCycle_colorbefore1::before {
  border-top: 1px dashed #148958;
}

.productLifeCycle_color2 {
  background: #eaf3ff;
  border: 1px solid #1573eb;
  color: #1573eb;
}
.productLifeCycle_colorbefore2::before {
  border-top: 1px dashed #1573eb;
}

.productLifeCycle_color3 {
  background: #fff9ee;
  border: 1px solid #ffbe49;
  color: #ffbe49;
}
.productLifeCycle_colorbefore3::before {
  border-top: 1px dashed #ffbe49;
}

.productLifeCycle_color4 {
  background: #fff4eb;
  border: 1px solid #e37318;
  color: #e37318;
}
.productLifeCycle_colorbefore4::before {
  border-top: 1px dashed #e37318;
}

.productLifeCycle_color5 {
  background: #fae4e3;
  border: 1px solid #d54941;
  color: #d54941;
}
.productLifeCycle_colorbefore5::before {
  border-top: 1px dashed #d54941;
}

.optionBox {
  margin-top: 42px;
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
    background: @primary-color;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-left: 80px;
  }
}
</style>
