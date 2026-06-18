<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-工序表单 -->

<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form :model="formObj" layout="vertical">
        <a-form-item :label="t('carbon.message.Process_name')" required>
          <a-input
            v-model:value="formObj.processName"
            :disabled="disabled"
            allowClear
            :placeholder="t('carbon.message.Please_enter')"
          ></a-input>
        </a-form-item>
        <a-collapse v-model:activeKey="activeCollapseKey" :bordered="false">
          <template #expandIcon="{ isActive }">
            <img
              class="collapseIcon"
              src="@/assets/img/img47.png"
              alt=""
              v-if="isActive"
            />
            <img
              class="collapseIcon"
              src="@/assets/img/img46.png"
              alt=""
              v-else
            />
          </template>
          <a-collapse-panel
            :key="String(artifactIndex)"
            :header="
              artifactIndex === 0
                ? t('carbon.message.The_things_produced')
                : t('carbon.message.By_product')
            "
            v-for="(artifactItem, artifactIndex) in formObj.outputList"
            :forceRender="true"
          >
            <template #extra>
              <img
                class="collapseIcon"
                src="@/assets/img/img33.png"
                alt=""
                @click="onDelArtifact(artifactIndex)"
                v-if="artifactIndex > 0"
              />
            </template>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="t('carbon.message.Name')" required>
                  <a-input
                    v-model:value="artifactItem.artifactName"
                    :disabled="disabled"
                    allowClear
                    :placeholder="t('carbon.message.Please_enter')"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  :label="`${t('carbon.message.Proportion')}（%）`"
                  required
                >
                  <a-input-number
                    v-model:value="artifactItem.artifactProportion"
                    :step="0.01"
                    :precision="2"
                    :disabled="true"
                    :max="100"
                    :placeholder="t('carbon.message.Please_enter')"
                    style="width: 100%"
                    v-if="artifactIndex === 0"
                  ></a-input-number>
                  <a-input-number
                    v-model:value="artifactItem.artifactProportion"
                    :step="0.01"
                    :precision="2"
                    :disabled="disabled"
                    :min="0"
                    :max="100"
                    :placeholder="t('carbon.message.Please_enter')"
                    style="width: 100%"
                    v-else
                  ></a-input-number>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="t('carbon.message.Number')" required>
                  <a-input-number
                    v-model:value="artifactItem.artifactNumber"
                    :disabled="disabled"
                    :placeholder="t('carbon.message.Please_enter')"
                    :step="0.01"
                    :precision="2"
                    style="width: 100%"
                  ></a-input-number>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="t('carbon.message.Unit')" required>
                  <UnitCascader
                    :unit-id="artifactItem.artifactUnit"
                    v-model:value="artifactItem.artifactUnit"
                    @change="(value, label) => onChangeArtifactUnit(value, label, artifactItem)"
                  ></UnitCascader>
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
        <div class="addBtn m_hoverCP" @click="onAddArtifact" v-if="!disabled">
          <!-- <img class="addBtn_icon" src="@/assets/img/img30.png" alt="" /> -->
          {{
            t("carbon.message.Add_by_product")
          }}
        </div>
      </a-form>
      <div class="drawerOptionBox">
        <a-button
          type="primary"
          style="margin-left: 8px"
          @click="onSubmit"
          v-if="!disabled"
        >
          {{ t("carbon.message.Next_add_the_emission_sources") }}</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import UnitCascader from '/@/components/common/UnitCascader.vue'
import { cloneObject } from '/@/utils/index'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 emits
const emit = defineEmits(['changeStep'])

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Refs
const visible = ref(false)
const drawerTitle = ref("")
const labelCol = { span: 4 }
const wrapperCol = { span: 14 }
const activeCollapseKey = ref(["0"])
const getAllUnitByGroupData = ref({}) // 单位分组数据
const type = ref(1) //1  新建  2编辑
const CopyIasss = ref(false) //false 不复制

// Reactive 数据
const formObj = reactive({
  // 产出物数据,第一条为主产出物，其他为副产出物
  outputList: [{}],
})

// Watch
watch(
  () => formObj.outputList,
  (val, val2) => {
    console.log("watch formObj.outputList =>", val, val2)
    if (val && val.length > 1) {
      let data = val.slice(1, val.length)
      let artifactProportion = 100
      data.forEach((item) => {
        if (item.artifactProportion && Number(item.artifactProportion)) {
          artifactProportion = artifactProportion - item.artifactProportion
        }
      })
      formObj.outputList[0].artifactProportion = artifactProportion
    } else {
      formObj.outputList[0].artifactProportion = 100
    }
  },
  { deep: true, immediate: true }
)

// Methods
/**
 * 添加副产出物
 */
const onAddArtifact = () => {
  formObj.outputList.push({
    artifactName: "",
    artifactProportion: "",
    artifactNumber: "",
    artifactUnit: "",
  })
  let data1 = formObj.outputList.length - 1
  activeCollapseKey.value.push(String(data1))
  console.log("onAddArtifact", activeCollapseKey.value)
}

/**
 * 删除副产出物
 * @param artifactIndex
 */
const onDelArtifact = (artifactIndex) => {
  formObj.outputList.splice(artifactIndex, 1)
}

/**
 * 修改单位
 */
const onChangeArtifactUnit = (value, label, artifactItem) => {
  console.log("onChangeArtifactUnit", label, getAllUnitByGroupData.value)
  artifactItem.artifactUnitName = label
}

/**
 * 检查工序表单数据
 */
const checkFormData = () => {
  if (!formObj.processName) {
    createMessage.warn(t("carbon.message.please_enter_operation_name"))
    return false
  }
  console.log("检查工序表单数据")
  let errName = null
  let errIndex = null
  for (let i = 0; i < formObj.outputList.length; i++) {
    let obj = formObj.outputList[i]
    console.log("obj", obj)

    if (!obj.artifactName) {
      errIndex = i
      if (errIndex === 0) {
        errName = t("carbon.message.please_enter_name")
      } else {
        errName = t("carbon.message.please_enter_name")
      }
      break
    }
    if (
      !obj.artifactProportion &&
      obj.artifactProportion !== 0 &&
      obj.artifactProportion !== "0"
    ) {
      errIndex = i
      if (errIndex === 0) {
        errName = t("carbon.message.please_enter_proportion")
      } else {
        errName = t("carbon.message.please_enter_proportion")
      }
      break
    }
    if (!obj.artifactNumber) {
      errIndex = i
      if (errIndex === 0) {
        errName = t("carbon.message.please_enter_number")
      } else {
        errName = t("carbon.message.please_enter_number")
      }
      break
    }
    if (!obj.artifactUnit) {
      errIndex = i
      if (errIndex === 0) {
        errName = t("carbon.message.please_select_unit")
      } else {
        errName = t("carbon.message.please_select_unit")
      }
      break
    }
  }
  if (errIndex !== null) {
    createMessage.warn(errName)
    return false
  }
  if (formObj.outputList[0].artifactProportion < 0) {
    createMessage.warn(
      t("carbon.message.output_proportion_cannot_be_less_than_0")
    )
    return false
  }
  return true
}

/**
 * 保存工序数据
 */
const onSave = () => {
  console.log("onSubmit", formObj, CopyIasss.value)
  if (type.value === 1) {
    if (checkFormData()) {
      let reqData = cloneObject(formObj)
      reqData.outputList.forEach((item, index) => {
        item.sort = index + 1
      })
      if (CopyIasss.value) {
        reqData.emissionList = formObj.emissionDetailList
      }
      defHttp.post({
        url: "/CyWorkmanshipLibrary/cyWorkmanshipLibrary/add",
        params: reqData
      }).then((res) => {
        if (res) {
          createMessage.success(t("carbon.message.operation_success"))
          type.value = 2
          formObj.id = res
        } else {
          createMessage.warn(res.message)
        }
      })
    }
  } else {
    if (checkFormData()) {
      let reqData = cloneObject(formObj)
      reqData.outputList.forEach((item, index) => {
        item.sort = index + 1
      })
      defHttp.post({
        url: "CyWorkmanshipLibrary/cyWorkmanshipLibrary/edit",
        params: reqData
      }).then((res) => {
        if (res) {
          createMessage.success(t("carbon.message.operation_success"))
        } else {
          createMessage.warn(res.message)
        }
      })
    }
  }
}

/**
 * 提交工序数据
 */
const onSubmit = () => {
  console.log("onSubmit", formObj)
  if (type.value === 1) {
    if (checkFormData()) {
      let reqData = cloneObject(formObj)
      reqData.outputList.forEach((item, index) => {
        item.sort = index + 1
      })
      if (CopyIasss.value) {
        reqData.emissionList = formObj.emissionDetailList
      }
      defHttp.post({
        url: "/CyWorkmanshipLibrary/cyWorkmanshipLibrary/add",
        params: reqData
      },{ isTransformResponse: false }).then((res) => {
        if (res) {
          createMessage.success(t("carbon.message.operation_success"))
          emit("changeStep", 2, res.result)
          onClose()
        } else {
          createMessage.warn(res.message)
        }
      })
    }
  } else {
    if (checkFormData()) {
      let reqData = cloneObject(formObj)
      reqData.outputList.forEach((item, index) => {
        item.sort = index + 1
      })
      defHttp.post({
        url: "CyWorkmanshipLibrary/cyWorkmanshipLibrary/edit",
        params: reqData
      }).then((res) => {
        if (res) {
          createMessage.success(t("carbon.message.operation_success"))
          emit("changeStep", 2, reqData.id)
          onClose()
        } else {
          createMessage.warn(res.message)
        }
      })
    }
  }
}

const onType = (value) => {
  type.value = value
}

const queryById = (value, typeParam) => {
  console.log(value, typeParam, "queryById")
  defHttp.get({
    url: "/CyWorkmanshipLibrary/cyWorkmanshipLibrary/queryById",
    params: {
      id: value,
    }
  }).then((res) => {
    if (res) {
      if (typeParam) {
        type.value = typeParam
      } else {
        type.value = 1
      }
      console.log(type.value, "queryById")
      console.log("Res是个啥", res)

      Object.assign(formObj, res || {})
      formObj.outputList = res.outPutList
      formObj.outputList.forEach((item, index) => {
        activeCollapseKey.value.push(String(index))
      })
      if(type.value === 1){
        formObj.processName=''
      }
    }
  })
}

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
 * 关闭抽屉，初始化数据
 */
const onClose = () => {
  Object.assign(formObj, {
    outputList: [{}], // 产出物数据,第一条为主产出物，其他为副产出物
  })
  visible.value = false
}

// 暴露给父组件的方法
defineExpose({
  onType,
  queryById,
  onSubmit,
  onSave,
  onClose,
  type,
  CopyIasss,
  formObj
})
</script>

<style lang="less" scoped>
:deep(.ant-collapse-content > .ant-collapse-content-box) {
  padding: 16px 24px 0;
}

:deep(.ant-collapse > .ant-collapse-item) {
  border-bottom: none;
}

:deep(.ant-collapse) {
  background: #fff;
}

:deep(.ant-collapse-item) {
  margin-bottom: 16px;
}

:deep(.ant-collapse-header) {
  background: #f5f7f6;
}

:deep(.ant-collapse-content) {
  background: #f5f7f6;
}

:deep(.ant-collapse-content-box) {
  background: #f5f7f6;
}

.table-page-search-wrapper {
  position: relative;
  padding-bottom: 64px;
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
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid @primary-color;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color;

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
  text-align: center;
  z-index: 1;
}
</style>
