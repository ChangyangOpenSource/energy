<template>
  <a-card :bordered="false">
    <div>
      <a-row style="margin-bottom: 40px;">
        <a-col :span="16">
          <div style="display:flex">
            <img
              class="cardHeader_icon m_hoverCP"
              :src="img28"
              alt=""
              style="transform: translateY(8px);"
            />
            <div style=" font-style: normal; font-size: 15px; color: #000000D8;padding-top:5px" @click="goBackNew">
              {{ t('carbon.message.GoBack') }}
            </div>

            <div style="font-weight: 600; font-style: normal; font-size: 20px; color: #000000D8; margin-left: 25px">
              {{ t('carbon.message.CarbonDataFilling') }}
            </div>
          </div>
        </a-col>
      </a-row>
      <CySupplierCarbonDataDetailForm ref="cyBuyOrderFormRef" @ok="goBackNew" :disabled="disableSubmit" ></CySupplierCarbonDataDetailForm>
      <a-row style="padding-top: 50px;">
        <a-col :span="24" >
          <div style="float: right">
            <a-button v-if="!disableSubmit" type="primary" @click="submitForm(1)" style="margin-right: 20px" >{{ t('carbon.message.Save') }}</a-button>
            <a-button v-if="!disableSubmit" type="primary" @click="submitForm(2)">{{ t('carbon.message.ConfirmSubmit') }}</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import CySupplierCarbonDataDetailForm from './CySupplierCarbonDataDetailForm.vue'
import img28 from '@/assets/img/img28.png'

// 国际化
const { t } = useI18n()

// 引用元素
const cyBuyOrderFormRef = ref(null)

// 响应式数据
const disableSubmit = ref(false)

// 定义事件
const emit = defineEmits(['goBack'])

/**
 * 编辑记录
 */
const edit = (record) => {
  nextTick(() => {
    cyBuyOrderFormRef.value.edit(record)
  })
}

/**
 * 返回列表
 */
const goBackNew = () => {
  emit('goBack')
}

/**
 * 保存或确认提交
 */
const submitForm = (flag) => {
  cyBuyOrderFormRef.value.saveOrConfirmSubmit(flag)
}

// 暴露方法给父组件
defineExpose({
  edit,
  disableSubmit
})
</script>

<style scoped>
.cardHeader_icon {
  width: 16px;
  height: 16px;
}
</style>
