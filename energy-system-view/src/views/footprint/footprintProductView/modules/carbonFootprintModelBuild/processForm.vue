<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-工序表单 -->
<template>
  <div>
    <a-drawer :title="drawerTitle" :width="600" :visible="visible" :body-style="{ paddingBottom: '80px' }"
              @close="onClose">
      <div class="table-page-search-wrapper" v-if="visible">
        <a-form-model :model="formObj" layout="vertical">
          <a-form-model-item :label="t('carbon.message.Process_name')" required>
            <a-input v-model:value="formObj.processName" :disabled="disabled" allowClear :placeholder="t('carbon.message.Please_enter')"></a-input>
          </a-form-model-item>
          <a-collapse v-model:activeKey="activeCollapseKey" :bordered="false">
            <template #expandIcon="{ isActive }">
              <img class="collapseIcon" :src="img47" alt="" v-if="isActive"/>
              <img class="collapseIcon" :src="img46" alt="" v-else/>
            </template>
            <a-collapse-panel
              :header="artifactIndex === 0 ? t('carbon.message.The_things_produced') : t('carbon.message.By_product')"
              v-for="(artifactItem, artifactIndex) in formObj.outPutList"
              :key="artifactIndex">
              <template #extra>
                <img class="collapseIcon" :src="img33" alt=""
                     @click="onDelArtifact(artifactIndex)" v-if="artifactIndex > 0"/>
              </template>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-model-item :label="t('carbon.message.Name')" required>
                    <a-input v-model:value="artifactItem.artifactName" :disabled="disabled" allowClear
                             :placeholder="t('carbon.message.Please_enter')"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item :label="`${t('carbon.message.Proportion')}（%）`" required>
                    <a-input-number v-model:value="artifactItem.artifactProportion" :step="0.01" :precision="2"
                                    :disabled="disabled" :max="100" :placeholder="t('carbon.message.Please_enter')" style="width: 100%"
                    ></a-input-number>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-model-item :label="t('carbon.message.Number')" required>
                    <a-input-number v-model:value="artifactItem.artifactNumber" :disabled="disabled" :placeholder="t('carbon.message.Please_enter')"
                                    :step="0.01" :precision="2" style="width: 100%"></a-input-number>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item :label="t('carbon.message.Unit')" required>
                    <UnitCascader v-if="visible" :unitId="artifactItem.artifactUnit" v-model:value="artifactItem.artifactUnit" @change="(value, label) => onChangeArtifactUnit(value, label, artifactItem)"></UnitCascader>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24" v-if="!disabled">
                <a-col :span="24">
                  <div class="theaLflex">
                    <a-form-model-item :label="t('carbon.message.Actual_usage_volume')" required>
                      <a-input-number v-model:value="artifactItem.actualUsage" :disabled="disabled" :placeholder="t('carbon.message.Please_enter')"
                                      :step="0.01" :precision="2" style="width: 140px"></a-input-number>{{  artifactItem.actualUsageUnitName}}
                      <div class="theActual">
                        {{t('carbon.message.The_actual_amount_of_this_output_actually_put_into_the_next_process')}}
                      </div>
                    </a-form-model-item>
                  </div>
                </a-col>
              </a-row>
              <div class="" v-if="!disabled">
                <a-form-model-item :label="t('carbon.message.Data_certificate')" >
                  <j-image-upload class="avatar-uploader" :text="t('carbon.message.Upload_voucher')" v-model="artifactItem.attachment"></j-image-upload>
                  <div class="theActual">
                    {{t('carbon.message.Only_pdf_png_jpg_and_peg_formats_are_supported_for_upload_with_a_maximum_of_one_file_The_size_of_each_file_should_not_exceed_5M')}}
                  </div>
                </a-form-model-item>
              </div>
            </a-collapse-panel>
          </a-collapse>
          <div class="addBtn m_hoverCP" @click="onAddArtifact" v-if="!disabled">
            <img class="addBtn_icon " :src="img30" alt=""/>{{t('carbon.message.Add_by_product')}}
          </div>
        </a-form-model>
      </div>
      <div class="drawerOptionBox">
        <a-button @click="onClose">{{t('carbon.message.Cancel')}}</a-button>
        <a-button type="primary" style="margin-left: 8px;" @click="onSubmit" v-if="!disabled"> {{t('carbon.message.Confirm')}}</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { cloneObject } from '/@/utils/index';
import UnitCascader from "/@/components/common/UnitCascader.vue"

// 导入图片资源
import img47 from '@/assets/img/img47.png'
import img46 from '@/assets/img/img46.png'
import img33 from '@/assets/img/img33.png'
import img30 from '@/assets/img/img30.png'

// i18n 和消息提示
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 props 和 emits
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['back'])

// 数据状态
const visible = ref(false)
const drawerTitle = ref('')
const formObj = reactive({
  lifeCycleId: '',
  // 产出物数据,第一条为主产出物，其他为副产出物
  outPutList: [{}],
})
const activeCollapseKey = ref(['0'])
const getAllUnitByGroupData = ref({}) // 单位分组数据

// 监听器
watch(
  () => formObj.outPutList,
  (val, val2) => {
    console.log('watch formObj.outPutList =>', val, val2)
    if (val && val.length > 1) {
      let data = val.slice(1, val.length)
      let artifactProportion = 100
      data.forEach(item => {
        if (item.artifactProportion && Number(item.artifactProportion)) {
          artifactProportion = artifactProportion - item.artifactProportion
        }
      })
      formObj.outPutList[0].artifactProportion = artifactProportion
    } else {
      formObj.outPutList[0].artifactProportion = 100
    }
  },
  { deep: true, immediate: true }
)

/**
 * 添加副产出物
 */
const onAddArtifact = () => {
  formObj.outPutList.push({})
  let data1 = formObj.outPutList.length - 1
  activeCollapseKey.value.push(String(data1))
  console.log('onAddArtifact', activeCollapseKey.value)
}

/**
 * 删除副产出物
 * @param artifactIndex
 */
const onDelArtifact = (artifactIndex) => {
  if(props.disabled){
    return
  }
  formObj.outPutList.splice(artifactIndex, 1)
}

/**
 * 修改单位
 */
const onChangeArtifactUnit = (value, label, artifactItem) => {
  console.log('onChangeArtifactUnit', value, getAllUnitByGroupData.value)
  artifactItem.artifactUnitName = label
  artifactItem.actualUsageUnitName = label
  artifactItem.actualUsageUnit = artifactItem.artifactUnit
}

/**
 * 检查工序表单数据
 */
const checkFormData = () => {
  if (!formObj.processName) {
    createMessage.warn(t('carbon.message.please_enter_operation_name'))
    return false
  }
  let errName = null
  let errIndex = null
  for (let i = 0; i < formObj.outPutList.length; i++) {
    let obj = formObj.outPutList[i]
    if (!obj.artifactName) {
      errIndex = i
      if (errIndex === 0) {
        errName = t('carbon.message.please_enter_name')
      } else {
        errName = t('carbon.message.please_enter_name')
      }
      break
    }
    if (!obj.artifactProportion && obj.artifactProportion !== 0 && obj.artifactProportion !== '0') {
      errIndex = i
      if (errIndex === 0) {
        errName = t('carbon.message.please_enter_proportion')
      } else {
        errName = t('carbon.message.please_enter_proportion')
      }
      break
    }
    if (!obj.artifactNumber) {
      errIndex = i
      if (errIndex === 0) {
        errName = t('carbon.message.please_enter_number')
      } else {
        errName = t('carbon.message.please_enter_number')
      }
      break
    }
    if (!obj.artifactUnit) {
      errIndex = i
      if (errIndex === 0) {
        errName = t('carbon.message.please_select_unit')
      } else {
        errName = t('carbon.message.please_select_unit')
      }
      break
    }
  }
  if (errIndex !== null) {
    createMessage.warn(errName)
    return false
  }
  if (formObj.outPutList[0].artifactProportion < 0) {
    createMessage.warn(t('carbon.message.output_proportion_cannot_be_less_than_0'))
    return false
  }
  return true
}

/**
 * 提交工序数据
 */
const onSubmit = () => {
  console.log('onSubmit', formObj)
  if (checkFormData()) {
    let reqData = cloneObject(formObj)
    reqData.outPutList.forEach((item, index) => {
      item.sort = index + 1
    })
    reqData.artifactList = reqData.outPutList
    defHttp.post({
      url: '/footprintProduct/cyFootprintProduct/saveProcess',
      data: reqData
    }).then((res) => {
      if (res.success) {
        emit('back')
        onClose()
      }
    });
  }
}

const getData = () => {
  // 单位
  defHttp.get({
    url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup'
  }).then((res) => {
    if (res.success) {
      getAllUnitByGroupData.value = res.result || {}
    }
  });
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
 * 关闭抽屉，初始化数据
 */
const onClose = () => {
  formObj.outPutList = [{}] // 产出物数据,第一条为主产出物，其他为副产出物
  visible.value = false;
}

// 暴露方法给父组件
defineExpose({
  visible,
  drawerTitle,
  formObj,
  activeCollapseKey,
  getData
})
</script>

<style lang="less" scoped>
/deep/ .ant-collapse-content > .ant-collapse-content-box {
  padding: 16px 24px 0;
}

/deep/ .ant-collapse > .ant-collapse-item {
  border-bottom: none;
}

/deep/ .ant-collapse {
  background: #fff;
}

/deep/ .ant-collapse-item {
  margin-bottom: 16px;
}

/deep/ .ant-collapse-header {
  background: #F5F7F6;
}

/deep/ .ant-collapse-content {
  background: #F5F7F6;
}

/deep/ .ant-collapse-content-box {
  background: #F5F7F6;
}

.avatar-uploader {
  display: block;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  /deep/.ant-upload {
    width: 120px;
    height: 120px;
  }

  /deep/.ant-upload-text {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

.theaLflex{
  /deep/.ant-form-item-children{
    display: flex;
    align-items: center;
    gap:10px;
  }
  /deep/.ant-form-vertical {
    padding: 0 !important;
    margin-bottom: 26px!important;
  }
  /deep/.ant-form-item{
    margin-bottom: 26px !important;
  }
  /deep/.ant-select{
    width: 25% !important;
  }
}

.theActual{
  font-weight: 400;
  font-size: 12px;
  color: #888888;
}

.collapseIcon {
  width: 16px;
  height: 16px;
}

.delIcon {
  width: 22px;
  height: 22px;
}

.addBtn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 5px 16px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;

  .addBtn_icon {
    width: 16px;
    height: 16px;
  }
}

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
</style>
