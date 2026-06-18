<!-- 碳排放因子库-组织因子库 -->

<template>
  <div class="">
    <div class="emptyBox">
      <img class="emptyBox_img" :src="img26" alt="" />
      <div class="emptyBox_text1" v-if="text1">{{ text1 }}</div>
      <div class="emptyBox_text2" v-if="text2">{{ text2 }}</div>
      <div class="emptyBox_btn m_hoverCP" @click="onChange" v-if="btnText">{{ btnText }}</div>
    </div>
  </div>
</template>

<script setup>
import img26 from '@/assets/img/img26.png';

// 定义props
const props = defineProps({
  text1: {
    type: String,
    default: '',
  },
  text2: {
    type: String,
    default: '',
  },
  btnText: {
    type: String,
    default: '',
  }
});

// 定义emits
const emit = defineEmits(['change']);

// 方法定义
function onChange() {
  emit('change');
}
</script>

<style lang="less" scoped>
.emptyBox {
  display: flex;
  flex-direction: column;
  align-items: center;

  .emptyBox_img {
    width: 154px;
    height: 154px;
  }

  .emptyBox_text1 {
    margin-top: 23px;
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.9);
  }

  .emptyBox_text2 {
    margin-top: 8px;
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }

  .emptyBox_btn {
    margin-top: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
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
