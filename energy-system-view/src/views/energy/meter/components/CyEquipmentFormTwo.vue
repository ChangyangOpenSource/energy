<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyEquipmentForm">
          <a-button type="primary" @click="addData" preIcon="ant-design:plus-outlined">
            添加数据点
          </a-button>
          <a-table :columns="protocolDataColumns" :data-source="formData.dataList" style="margin-top: 8px">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'action'">
                <span>
                  <a @click="editData(record)">编辑</a>
                  <a-divider type="vertical" v-if="record.dataType != 1"/>
                  <a @click="deleteData(record)" v-if="record.dataType != 1">删除</a>
                </span>
              </template>
            </template>
          </a-table>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>

  <CyEquipmentDataOneModal ref="registerOneModal" :protocolId="formData.protocolId" :equipmentTypeId="formData.equipmentTypeId" @success="addDataSuccess"></CyEquipmentDataOneModal>
  <CyEquipmentDataTwoModal ref="registerTwoModal" :equipmentTypeId="formData.equipmentTypeId" @success="addDataSuccess"></CyEquipmentDataTwoModal>
  <CyEquipmentDataThreeModal ref="registerThreeModal" :equipmentTypeId="formData.equipmentTypeId" @success="addDataSuccess"></CyEquipmentDataThreeModal>
</template>

<script lang="ts" setup>
import {ref, reactive, defineExpose, nextTick, computed, defineProps} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import CyEquipmentDataOneModal from "@/views/energy/meter/components/components/CyEquipmentDataOneModal.vue";
  import CyEquipmentDataTwoModal from "@/views/energy/meter/components/components/CyEquipmentDataTwoModal.vue";
  import CyEquipmentDataThreeModal from "@/views/energy/meter/components/components/CyEquipmentDataThreeModal.vue";
import {queryById} from "@/views/energy/meter/CyEquipment.api";
import {deleteOne, saveOrUpdate} from "@/views/energy/meter/components/CyEquipmentData.api";

  const props = defineProps({
    formDisabled: { type: Boolean, default: false },
    formBpm: { type: Boolean, default: true }
  });

  const formRef = ref();
  const registerOneModal = ref();
  const registerTwoModal = ref();
  const registerThreeModal = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    name: '',
    meterType: '',
    dataAccess: undefined,
    equipmentCode: '',
    modelId: undefined,
    equipmentTypeId: undefined,
    energyType: '',
    stationId: undefined,
    parentId: undefined,
    position: '',
    diagram: '',
    protocolId: undefined,
    status: 0,
    type: 1,
    dataList: [],
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);

  const protocolDataColumns = [
    {
      title: '数据点名称',
      dataIndex: 'dataName',
      key: 'dataName',
    },
    {
      title: '数据点类型',
      dataIndex: 'dataTypeName',
      key: 'dataTypeName',
    },
    {
      title: '表达式',
      dataIndex: 'formula',
      key: 'formula',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  // 表单禁用
  const disabled = computed(()=>{
    if(props.formBpm === true){
      if(props.formData.disabled === false){
        return false;
      }else{
        return true;
      }
    }
    return props.formDisabled;
  });

  /**
   * 初始化formData
   * @param id
   */
  function initFormData(id) {
    queryById({id: id}).then((res) => {
      Object.assign(formData, res);
      console.log("formData", formData)
    })
  }
  /**
   * 添加数据点弹窗
   */
  function addData() {
    if (formData.meterType == 1 && !formData.protocolId) {
      createMessage.error("请选择协议")
      return
    }
    if (formData.meterType === '1') {
      //计量表只能选择自己设备下的数据点
      registerTwoModal.value.add(formData);
    }
    if (formData.meterType === '2') {
      registerTwoModal.value.add(formData);
    }
    if (formData.meterType === '3') {
      registerThreeModal.value.add(formData);
    }
  }

  /**
   * 编辑数据点
   */
  function editData(record) {
    if (record.dataType == '1') {
      registerOneModal.value.edit(record, formData);
    }
    if (record.dataType == '2') {
      registerTwoModal.value.edit(record, formData);
    }
    if (record.dataType == '3') {
      registerThreeModal.value.edit(record, formData);
    }
  }

  /**
   * 删除数据点
   */
  function deleteData(record){
    // formData.dataList.splice(index, 1)
    deleteOne({id: record.id}).then((res) => {
      initFormData(formData.id)
    })
  }

  /**
   * 添加数据点回调
   */
  function addDataSuccess() {
    initFormData(formData.id)
  }

  /**
   * 新增
   */
  function add() {
    formData.dataList = []
    edit({});
  }

  /**
   * 编辑
   */
  function edit(record) {
    nextTick(() => {
      getModels();
      initAllSn();
      getEquipmentTypes();
      resetFields();
      const tmpData = {};
      Object.keys(formData).forEach((key) => {
        if(record.hasOwnProperty(key)){
          tmpData[key] = record[key]
        }
      })
      //赋值
      Object.assign(formData, tmpData);
    });
  }

  /**
   * 提交数据
   */
  async function submitForm() {
    try {
      // 触发表单验证
      await validate();
    } catch ({ errorFields }) {
      if (errorFields) {
        const firstField = errorFields[0];
        if (firstField) {
          formRef.value.scrollToField(firstField.name, { behavior: 'smooth', block: 'center' });
        }
      }
      return Promise.reject(errorFields);
    }
    confirmLoading.value = true;
    const isUpdate = ref<boolean>(false);
    //时间格式化
    let model = formData;
    if (model.id) {
      isUpdate.value = true;
    }
    await saveOrUpdate(model, isUpdate.value)
      .then((res) => {
        if (res.success) {
          createMessage.success(res.message);
          emit('ok');
        } else {
          createMessage.warning(res.message);
        }
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  }


  defineExpose({
    add,
    edit,
    submitForm,
    initFormData,
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    padding: 14px 20px;
  }
</style>
