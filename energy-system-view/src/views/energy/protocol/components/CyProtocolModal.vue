<template>
  <a-drawer
    :title="title"
    :width="800"
    :visible="visible"
    :footer-style="{ textAlign: 'right' }"
    @close="handleCancel">
    <a-steps :current="current" :items="items" size="small"></a-steps>
    <div v-show="current == 0">
      <CyProtocolFormOne ref="registerOneForm" @ok="queryProtocolData" :formDisabled="disableSubmit" :formBpm="false"></CyProtocolFormOne>
    </div>
    <div v-show="current == 1">
      <CyProtocolFormTwo ref="registerTwoForm"></CyProtocolFormTwo>
    </div>
    <!--    <CyProtocolForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false"></CyProtocolForm>-->
   <template #footer>
     <a-button @click="handleCancel">取消</a-button>
     <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
     <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
     <a-button v-if="current == steps.length - 1" type="primary" @click="handleCancel">完成</a-button>
   </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { ref, nextTick, defineExpose } from 'vue';
  import CyProtocolFormOne from './CyProtocolFormOne.vue'
  import CyProtocolFormTwo from './CyProtocolFormTwo.vue'
  const title = ref<string>('');
  const visible = ref<boolean>(false);
  const disableSubmit = ref<boolean>(false);
  const registerOneForm = ref();
  const registerTwoForm = ref();
  const emit = defineEmits(['register', 'success']);
  const current = ref<number>(0);
  const steps = [{title: '基础信息',}, {title: '数据点配置',}];
  const items = steps.map(item => ({ key: item.title, title: item.title }));

  /**
   * 新增
   */
  function add() {
    current.value = 0
    title.value = '新增';
    visible.value = true;
    nextTick(() => {
      registerOneForm.value.add();
    });
  }

  /**
   * 编辑
   * @param record
   */
  function edit(record) {
    current.value = 0
    title.value = disableSubmit.value ? '详情' : '编辑';
    visible.value = true;
    nextTick(() => {
      registerOneForm.value.edit(record);
    });
  }

  /**
   * 确定按钮点击事件
   */
  function next() {
    registerOneForm.value.submitForm();
  }

  /**
   * 上一步
   */
  function prev(){
    current.value--;
  }

  /**
   * 协议基础信息添加成功回调
   */
  function queryProtocolData(record) {
    registerTwoForm.value.initFormData(record)
    current.value++;
  }

  /**
   * 取消按钮回调事件
   */
  function handleCancel() {
    visible.value = false;
    emit('success');
  }

  defineExpose({
    add,
    edit,
    disableSubmit,
  });
</script>

<style lang="less">
  /**隐藏样式-modal确定按钮 */
  .jee-hidden {
    display: none !important;
  }
</style>
<style lang="less" scoped></style>
