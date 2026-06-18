<template>
  <div class="" :class="{'weid': step == 2}">
    <div class="cardHeader">
      <div class="cardHeader_backBox m_hoverCP">
        <img class="cardHeader_icon m_hoverCP" :src="img28" alt="" @click="onBack"/>
        <span class="m_hoverCP" @click="onBack">{{ t('carbon.message.Return') }}</span>
      </div>
      <div class="cardHeader_numBox_active m_hoverCP" @click="onChangeStep(1)" v-if="step == 1">1</div>
      <div class="cardHeader_numBox_end m_hoverCP" @click="onChangeStep(1)" v-if="step > 1">
        <img class="" :src="img45" alt=""/></div>
      <div class="cardHeader_textBox m_hoverCP" :class="{'cardHeader_textBox_active': step >= 1}"
           @click="onChangeStep(1)">{{ t('carbon.message.Basic_information') }}
      </div>
      <div class="cardHeader_hrBox" :class="{'cardHeader_hrBox_active': step >= 2}"></div>
      <div class="cardHeader_numBox m_hoverCP" @click="onChangeStep(2)" v-if="step < 2">2</div>
      <div class="cardHeader_numBox_active m_hoverCP" @click="onChangeStep(2)" v-if="step == 2">2</div>
      <div class="cardHeader_numBox_end m_hoverCP" @click="onChangeStep(2)" v-if="step > 2">
        <img class="" :src="img45" alt=""/></div>
      <div class="cardHeader_textBox m_hoverCP" :class="{'cardHeader_textBox_active': step >= 2}"
           @click="onChangeStep(2)">{{ t('carbon.message.Build_model') }}
      </div>
      <div class="cardHeader_hrBox" :class="{'cardHeader_hrBox_active': step >= 3}"></div>
      <div class="cardHeader_numBox m_hoverCP" @click="onChangeStep(3,false)" v-if="step < 3">3</div>
      <div class="cardHeader_numBox_active m_hoverCP" @click="onChangeStep(3,false)" v-if="step == 3">3</div>
      <div class="cardHeader_textBox m_hoverCP" :class="{'cardHeader_textBox_active': step == 3}"
           @click="onChangeStep(3,false)">{{ t('carbon.message.Carbon_footprint_results') }}
      </div>
    </div>
    <!--  基本信息  -->
    <section class="cardBox" v-show="step == 1">
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item :label="t('carbon.message.Product_name')" required>
                <a-input v-model:value="queryParam.productName" disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="t('carbon.message.Batch_number')" required>
                <a-input v-model:value="queryParam.batchNumber" ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item :label="t('carbon.message.Accounting_quantity')" required>
                <div style="display:flex;align-items:center;">
                <a-input-number v-model:value="queryParam.calculateNumber" @change="onIpitNumbeiPFUlnoiasn" :disabled="disabled" allow-clear
                                :placeholder="t('carbon.message.Please_enter')" :step="0.01" :precision="2" :min="0" style="width: 49%">
                </a-input-number>
                <div style="width: 2%;display: inline-block"></div>
                <a-select v-model:value="queryParam.productUnitId" disabled style="width: 49%">
                  <a-select-opt-group :key="key" :value="key" :label="key" v-for="(value, key) in unitData">
                    <a-select-option :key="itemA.id" :value="itemA.id" v-for="(itemA,indexA) in value">
                      {{ itemA.unitCode }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </div>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="t('carbon.message.Functional_unit')" required>
                <a-input v-model:value="queryParam.functionalUnit" ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item :label="t('carbon.message.Data_cycle')" required>
                <a-range-picker
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    :disabled="disabled"
                    v-model:value="queryParam.dataRange" 
                    @change="onChangeDateRange"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-form :model="queryParam" layout="horizontal">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.Life_cycle_boundary')" required>
                <div class="lifeCycleTypeBox">
                  <div class="lifeCycleTypeBox_item"
                       :class="{'lifeCycleTypeBox_item_active': queryParam.lifeCycleType == 1 ,'m_hoverCP': !disabled}"
                       @click="onChangeLifeCycleType(1)">
                    <img class="lifeCycleTypeBox_item_icon" :src="img44" alt=""/>
                    <div class="lifeCycleTypeBox_item_text1">{{ t('carbon.message.From_cradle_to_gate') }}</div>
                    <div class="lifeCycleTypeBox_item_text2">{{ t('carbon.message.From_the_acquisition_of_raw_materials_to_the_delivery_of_products') }}</div>
                  </div>
                  <div class="lifeCycleTypeBox_item"
                       :class="{'lifeCycleTypeBox_item_active': queryParam.lifeCycleType == 2,'m_hoverCP': !disabled}"
                       @click="onChangeLifeCycleType(2)">
                    <img class="lifeCycleTypeBox_item_icon" :src="img44" alt=""/>
                    <div class="lifeCycleTypeBox_item_text1">{{ t('carbon.message.From_cradle_to_grave') }}</div>
                    <div class="lifeCycleTypeBox_item_text2">{{ t('carbon.message.From_raw_material_acquisition_to_product_abandonment') }}</div>
                  </div>
                  <div class="lifeCycleTypeBox_item"
                       :class="{'lifeCycleTypeBox_item_active': queryParam.lifeCycleType == 3,'m_hoverCP': !disabled}">
                    <img class="lifeCycleTypeBox_item_icon" :src="img44" alt=""/>
                    <div class="lifeCycleTypeBox_item_text1">{{ t('carbon.message.Custom_life_cycle') }}</div>
                    <div class="lifeCycleTypeBox_item_content">
                      <a-checkbox-group v-model:value="queryParam.cacheLifeCycleItem" :disabled="disabled"
                                        @change="onChangeLifeCycleItem">
                        <a-row :gutter="[0,8]">
                          <a-col :span="8">
                            <a-checkbox value="1">{{ t('carbon.message.Raw_material_acquisition') }}</a-checkbox>
                          </a-col>
                          <a-col :span="8">
                            <a-checkbox value="2">{{ t('carbon.message.Production_manufacturing') }}</a-checkbox>
                          </a-col>
                          <a-col :span="8">
                            <a-checkbox value="3">{{ t('carbon.message.Distribution_and_storage') }}</a-checkbox>
                          </a-col>
                          <a-col :span="8">
                            <a-checkbox value="4">{{ t('carbon.message.Product_use') }}</a-checkbox>
                          </a-col>
                          <a-col :span="8">
                            <a-checkbox value="5">{{ t('carbon.message.Abandoned_disposal') }}</a-checkbox>
                          </a-col>
                        </a-row>
                      </a-checkbox-group>
                    </div>
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="uploadBox">
          <div class="uploadTitle">{{ t('carbon.message.System_boundary_process_flow_chart') }}</div>
          <div class="uploadContent">
            <j-image-upload class="avatar-uploader" v-model:value="queryParam.flowChart" :disabled="disabled"
                            is-multiple :fileMax="3"></j-image-upload>
          </div>
          <div class="uploadTip">{{ t('carbon.message.Upload_up_to_3_photos') }}</div>
        </div>
      </div>
      <div class="optionBox">
        <div class="optionItem_save m_hoverCP" @click="onSave1()"> {{ t('carbon.message.Save') }}</div>
        <div class="optionItem_next m_hoverCP" @click="onSave1('next')"> {{ t('carbon.message.Next_life_cycle_model_build') }}</div>
      </div>
    </section>
    <!--  搭建模型  -->
    <section class="topsw" v-show="step == 2">
      <carbonFootprintModelBuild ref="carbonFootprintModelBuildRef" :query-param="queryParam" @change-step="onChangeStep"
                                    @back="onBack"/>
    </section>
    <!--  碳足迹结果  -->
    <section v-show="step == 3">
      <a-spin :spinning="spinning">
        <carbonFootprintResults ref="carbonFootprintResultsRef" :query-param="queryParam"
                                  :generate-result-data="generateResultData" @archive="onChangeArchive"
                                  @change-step="onChangeStep"/>
      </a-spin>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { cloneObject } from '/@/utils/index';
import carbonFootprintModelBuild from '../modules/carbonFootprintModelBuild/carbonFootprintModelBuild.vue'
import carbonFootprintResults from '../modules/carbonFootprintResults.vue'
import img28 from '@/assets/img/img28.png'
import img44 from '@/assets/img/img44.png'
import img45 from '@/assets/img/img45.png'
import JImageUpload from "@/components/Form/src/jeecg/components/JImageUpload.vue";

// 使用 i18n 和消息提示
const { t } = useI18n()
const { createMessage } = useMessage()



// 定义响应式数据
const step = ref(1)
const queryParam = ref({
  dataRange:[]
})
const unitData = ref([])
const generateResultData = ref({})
const carbonFootprintModelBuildRef = ref()
const carbonFootprintResultsRef = ref()
const spinning = ref(false)

// 计算属性
const disabled = computed(() => {
  return queryParam.value.calculateArchived === '1'
})

// 方法定义
const onIpitNumbeiPFUlnoiasn = () => {
  queryParam.value.functionalUnit = queryParam.value.calculateNumber +
  queryParam.value.productUnitName +
  queryParam.value.productName
}

/**
 * 核算归档
 */
const onChangeArchive = () => {
  queryParam.value.calculateArchived = '1'
  onChangeStep(3, true)
}

/**
 * 切换第几步
 * @param step 1基本信息 2搭建模型 3碳足迹结果
 */
const onChangeStep = (newStep, isFinish, flag) => {
  console.log('onChangeStep', newStep)
  if (newStep == 1) {
    // 产品碳足迹-基本信息
    step.value = newStep
  }
  if (newStep == 2) {
    // 产品碳足迹-搭建模型
    if (!queryParam.value.id) {
      createMessage.warn(t('carbon.message.Please_save_the_basic_information_before_viewing'))
      return
    }
    step.value = newStep
    nextTick(() => {
      carbonFootprintModelBuildRef.value.getData()
    })
  }
  if (newStep == 3) {
    // 产品碳足迹-碳足迹结果
    if (!queryParam.value.id) {
      createMessage.warn(t('carbon.message.Please_save_the_basic_information_before_viewing'))
      return
    }
    spinning.value = true

    let url = undefined
    // 如果是搭建模型页面的生产结果，需要保存数据再生成结果
    if(flag){
      url = '/footprintProduct/cyFootprintProduct/beforeGenerateResultSaveData'
    }else{
      // 其他情况下只生成结果不需要保存数据
      url = '/footprintProduct/cyFootprintProduct/generateResult'
    }

    defHttp.get({
      url: url,
      params: {
        calculateId: queryParam.value.id,
        isFinish: isFinish
      }
    }).then((res) => {
      if (res) {
        if(flag){
          carbonFootprintModelBuildRef.value.spinning=false
        }
        let resData = res || {}
        let cptzjValue = 0 // 总碳排
        let activeCollapseKey = [] // 默认展开第一层折叠面板
        if (resData.detailList && resData.detailList.length > 0) {
          resData.detailList.forEach((item, index) => {
            cptzjValue = cptzjValue + item.total
            activeCollapseKey.push(String(index))
            let activeCollapseKey2 = []  // 默认展开第二层折叠面板
            if (item.childList && item.childList.length > 0) {
              item.childList.forEach((item2, index2) => {
                if (item2.total > 0) {
                  activeCollapseKey2.push(String(index2))
                }
              })
            }
            item.activeCollapseKey = activeCollapseKey2
          })
          resData.cptzjValue = cptzjValue.toFixed(4)
          resData.detailList.forEach(item => {
            item.proportion = Number(((item.total / resData.cptzjValue) * 100).toFixed(2))
          })
        }
        resData.cptzjValue = cptzjValue.toFixed(4)
        generateResultData.value = resData
        step.value = newStep
        nextTick(() => {
          console.log('carbonFootprintResultsRef', carbonFootprintResultsRef.value, resData)
          carbonFootprintResultsRef.value.activeCollapseKey = activeCollapseKey
          carbonFootprintResultsRef.value.drawCharts(generateResultData.value)
        })
      } else {
        createMessage.warning(res.message)
      }
    }).finally(() => {
      spinning.value = false
    })
  }
}

const getData = () => {
  console.log('getData', queryParam.value)
  // 单位
  defHttp.get({
    url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup'
  }).then((res) => {
    if (res) {
      unitData.value = res || {}
      console.log('getData111', unitData.value)
    }
  });
}

/**
 * 基本信息-选择数据周期
 */
const onChangeDateRange = (date, dateString) => {
  console.log('onChangeDateRange', date, dateString)
  if (dateString[0]) {
    queryParam.value.beginTime = dateString[0] + ' 00:00:00'
    queryParam.value.endTime = dateString[1] + ' 23:59:59'
  } else {
    queryParam.value.beginTime = dateString[0]
    queryParam.value.endTime = dateString[1]
  }
}

/**
 * 基本信息-生命周期边界
 * @param e
 */
const onChangeLifeCycleItem = (e) => {
  console.log('onChangeLifeCycleItem', e);
  queryParam.value.lifeCycleType = 3
}

/**
 * 基本信息-生命周期边界
 * @param e
 */
const onChangeLifeCycleType = (e) => {
  console.log('onChangeLifeCycleType', e);
  queryParam.value.lifeCycleType = e
  queryParam.value.cacheLifeCycleItem = undefined
}

/**
 * 基本信息-检查表单数据
 */
const checkFormData1 = () => {
  if (!queryParam.value.calculateNumber &&
    queryParam.value.calculateNumber !== 0 &&
    queryParam.value.calculateNumber !== '0') {
    createMessage.warn(t('carbon.message.please_enter_accounting_quantity'))
    return false
  }
  if (!queryParam.value.beginTime || !queryParam.value.endTime) {
    createMessage.warn(t('carbon.message.please_select_data_period'))
    return false
  }
  if (!queryParam.value.lifeCycleType) {
    createMessage.warn(t('carbon.message.please_select_life_cycle_boundary'))
    return false
  }
  if (queryParam.value.lifeCycleType == 3 &&
    (!queryParam.value.cacheLifeCycleItem ||
      queryParam.value.cacheLifeCycleItem &&
      queryParam.value.cacheLifeCycleItem.length == 0)) {
    createMessage.warn(t('carbon.message.Please_select_at_least_one_custom_life_cycle'))
    return false
  }
  return true
}

/**
 * 基本信息-保存
 */
const onSave1 = (next) => {
  console.log('onSave1', queryParam.value)
  if (checkFormData1()) {
    let reqData = cloneObject(queryParam.value)
    if (reqData.lifeCycleType == 1) {
      // 从摇篮到大门
      reqData.lifeCycleItem = '1,2,3'
    } else if (reqData.lifeCycleType == 2) {
      // 从摇篮到坟墓
      reqData.lifeCycleItem = '1,2,3,4,5'
    } else if (reqData.lifeCycleType == 3) {
      // 自定义
      reqData.cacheLifeCycleItem.forEach(item => {
        item = Number(item)
      })
      reqData.cacheLifeCycleItem = reqData.cacheLifeCycleItem.sort((a, b) => {
        return a - b
      })
      reqData.lifeCycleItem = reqData.cacheLifeCycleItem.join(',')
    }
    reqData.calculateStatus = !next ? 1 : 2

    defHttp.post({
      url: '/footprintProduct/cyFootprintProduct/saveCalculate',
      params: reqData
    }).then((res) => {
      if (res) {
        createMessage.success('保存基本信息成功')
        queryParam.value.id = res.id
        if (next) {
          onChangeStep(2)
        } else {
          onBack()
        }
      } else {
        createMessage.error(res.message)
      }
    });
  }
}

/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

/**
 * 返回
 */
function onBack (){
  emit('back')
}

// 定义事件发射器
const emit = defineEmits(['back'])

// 定义组件名称和暴露的组件
defineOptions({
  name: 'footprintProductForm'
})

// 暴露组件给父组件使用
defineExpose({
  getData,
  onChangeStep,
  queryParam
})
</script>

<style lang="less" scoped>
.weid{
  width: fit-content;
}
.topsw{
  padding: 24px ;
  background: #FFFFFF;
  margin-top: 24px;
  width: max-content;
}

/deep/ .table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 44px;
}

/deep/ .ant-form-item {
  margin-bottom: 44px;
}

.cardHeader {
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 64px;
  background: #FFFFFF;

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
    background: #DCDCDC;
  }

  .cardHeader_hrBox_active {
    background: #148958;
  }


}

.cardBox {
  margin: 24px auto 0;
  width: 1400px;
  overflow: hidden;
  padding: 20px 64px;
  background: #FFFFFF;
  border-radius: 3px;
}


.cardBox2 {
  margin: 24px 300px auto;
  overflow: hidden;
  padding: 24px;
  background: #FFFFFF;
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
    background: #FFFFFF;
    border-radius: 3px;
    border: 1px solid #DCDCDC;

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
    background: #F7FDF8;
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
    background: #E7E7E7;
    color: rgba(0, 0, 0, 0.9);
  }

  .optionItem_confirm {
    background: @primary-color;
    color: rgba(255, 255, 255, 0.9);
  }

  .optionItem_save {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 55px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 3px;
    border: 1px solid @primary-color;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: @primary-color;
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
  }
}
</style>
