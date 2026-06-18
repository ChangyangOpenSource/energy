<template>
  <div class="outBox">
    <div class="box4_tr1_right">
      <div class="bathCode">
        {{ t('carbon.message.Batch_code') }}:{{ item.batchNumber }}
      </div>
      <!-- 使用导入的图片变量 -->
      <img class="box4_tr1_item_dateIcon" :src="img39" alt="" />
      {{ item.beginTime ? item.beginTime.slice(0, 10) : '' }}
      {{ t('carbon.message.to') }}
      {{ item.endTime ? item.endTime.slice(0, 10) : '' }}
      <div class="box4_tr1_right_copyBtn" @click.stop="onCopy(item)">
        <img class="box4_tr1_right_copyBtn_icon m_hoverCP" :src="img43" alt="" />
      </div>

      <a-popconfirm
        :title="t('carbon.message.Confirm_delete')"
        :cancel-text="t('carbon.message.Cancel')"
        :ok-text="t('carbon.message.Confirm')"
        @confirm="() => onDel(item)">
        <div class="box4_tr1_right_delBtn">
          <img class="box4_tr1_right_delBtn_icon m_hoverCP" :src="img33" alt="" />
        </div>
      </a-popconfirm>
    </div>
    <div class="box4" @click="onDetail(item)">
      <div class="box4_tr1">
        <div class="box4_tr1_left">
          <div class="box4_tr1_tag1" v-if="item.lifeCycleType == 1">
            {{ t('carbon.message.Life_cycle') }}：{{ t('carbon.message.From_cradle_to_gate') }}
          </div>
          <div class="box4_tr1_tag1" v-if="item.lifeCycleType == 2">
            {{ t('carbon.message.Life_cycle') }}：{{ t('carbon.message.From_cradle_to_grave') }}
          </div>
          <div class="box4_tr1_tag1" v-if="item.lifeCycleType == 3">
            {{ t('carbon.message.Life_cycle') }}：{{ t('carbon.message.Customize') }}
          </div>
          <div class="box4_tr1_tag2" v-if="item.calculateStatus == 1">
            {{ t('carbon.message.Accounting_has_been_created') }}
          </div>
          <div class="box4_tr1_tag3" v-if="item.calculateStatus == 2">
            {{ t('carbon.message.Model_creation') }}
          </div>
          <div class="box4_tr1_tag4" v-if="item.calculateStatus == 3 && item.calculateArchived === '0'">
            {{ t('carbon.message.Accounting_completion') }}
          </div>
          <div class="box4_tr1_tag5" v-if="item.calculateStatus == 3 && item.calculateArchived === '1'">
            {{ t('carbon.message.Archived') }}
          </div>
        </div>
      </div>
      <div class="box4_tr2">
        <div class="box4_tr2_text1">{{ t('carbon.message.Total_emission') }}：</div>
        <div class="box4_tr2_text2">{{ item.totalCarbonEmission }}</div>
        <div class="box4_tr2_text3">kgCO₂e</div>
      </div>
      <div class="box4_tr3">
        <div class="box4_tr3_item" v-for="(itemA, indexA) in item.calculateLifeCycle" :key="indexA">
          <img class="box4_tr3_item_icon" :src="img40" alt=""
               v-if="itemA.lifeCycleTypeId == '1'" />
          <img class="box4_tr3_item_icon" :src="img41" alt=""
               v-else-if="itemA.lifeCycleTypeId == '2'" />
          <img class="box4_tr3_item_icon" :src="img42" alt=""
               v-else-if="itemA.lifeCycleTypeId == '3'" />
          <img class="box4_tr3_item_icon" :src="img37" alt=""
               v-else-if="itemA.lifeCycleTypeId == '4'" />
          <img class="box4_tr3_item_icon" :src="img38" alt=""
               v-else-if="itemA.lifeCycleTypeId == '5'" />
          <div class="box4_tr3_item_text1" v-if="itemA.lifeCycleTypeName == '原材料获取'">
            {{ t('carbon.message.Raw_material_acquisition') }}：
          </div>
          <div class="box4_tr3_item_text1" v-else-if="itemA.lifeCycleTypeName == '生产制造'">
            {{ t('carbon.message.Production_manufacturing') }}：
          </div>
          <div class="box4_tr3_item_text1" v-else-if="itemA.lifeCycleTypeName == '分销和储存'">
            {{ t('carbon.message.Distribution_and_storage') }}：
          </div>
          <div class="box4_tr3_item_text1" v-else-if="itemA.lifeCycleTypeName == '产品使用'">
            {{ t('carbon.message.Product_use') }}：
          </div>
          <div class="box4_tr3_item_text1" v-else-if="itemA.lifeCycleTypeName == '废弃处置'">
            {{ t('carbon.message.Abandoned_disposal') }}：
          </div>
          <div class="box4_tr3_item_text2">{{ itemA.carbonEmission }}kgCO₂e</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'

// 导入图片资源
import img39 from '@/assets/img/img39.png'
import img43 from '@/assets/img/img43.png'
import img33 from '@/assets/img/img33.png'
import img37 from '@/assets/img/img37.png'
import img38 from '@/assets/img/img38.png'
import img40 from '@/assets/img/img40.png'
import img41 from '@/assets/img/img41.png'
import img42 from '@/assets/img/img42.png'



// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 props
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 定义 emits
const emit = defineEmits(['detail', 'copy', 'back'])

// 详情事件
function onDetail(item) {
  emit('detail', item)
}

// 复制事件
function onCopy(item) {
  console.log('onCopy', item)
  defHttp.post({
    url: '/footprintProduct/cyFootprintProduct/copyCalculate',
    params: {
      calculateId: item.id,
    }
  }).then((res) => {
    if (res) {
      emit('copy')
    }
  })
}

// 删除事件
function onDel(item) {
  console.log('onDel', item)
  defHttp.post({
    url: '/footprintProduct/cyFootprintProduct/delCalculate',
    params: {
      calculateId: item.id,
    }
  }).then((res) => {
    if (res) {
      emit('back')
    }
  })
}
</script>

<style lang="less" scoped>
.bathCode {
  font-weight: 400;
  font-size: 14px;
  color: #888888;
  margin-right: 40px;
}

.outBox {
  position: relative;
}

.box4_tr1_right {
  position: absolute;
  z-index: 2;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #888888;

  .box4_tr1_item_dateIcon {
    margin-right: 4px;
    width: 20px;
    height: 20px;
  }

  .box4_tr1_right_copyBtn {
    margin-left: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #EEEEEE;
  }

  .box4_tr1_right_copyBtn_icon {
    width: 20px;
    height: 20px;
  }

  .box4_tr1_right_delBtn {
    margin-left: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #EEEEEE;
  }

  .box4_tr1_right_delBtn_icon {
    width: 20px;
    height: 20px;
  }
}

.box4 {
  padding: 24px 24px 12px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #DCDCDC;

  .box4_tr1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .box4_tr1_left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .box4_tr1_tag1 {
    padding: 0 9px 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    background: #ECECEC;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }

  .box4_tr1_tag2 {
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    background: #D5DDFF;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #2c57ff;
  }

  .box4_tr1_tag3 {
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    background: #E3F9E9;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #2BA471;
  }

  .box4_tr1_tag4 {
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    background: #FFF1E9;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #E37318;
  }

  .box4_tr1_tag5 {
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    background: #F3F3F3;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #000000;
  }

  .box4_tr2 {
    margin-top: 16px;
    display: flex;
    align-items: flex-end;
  }

  .box4_tr2_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .box4_tr2_text2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 22px;
    color: @primary-color;
    line-height: 22px;
  }

  .box4_tr2_text3 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    color: @primary-color;
    line-height: 14px;
  }

  .box4_tr3 {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 5px 16px;
    min-height: 60px;
    background: #F9F9F9;
  }

  .box4_tr3_item {
    display: flex;
    align-items: center;
  }

  .box4_tr3_item_icon {
    width: 20px;
    height: 20px;
  }

  .box4_tr3_item_text1 {
    margin-left: 4px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .box4_tr3_item_text2 {
    flex: 1;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    line-break: anywhere;
  }
}
</style>
