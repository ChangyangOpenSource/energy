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

  <CyEquipmentDataModal ref="registerModal" :equipmentTypeId="formData.equipmentTypeId" @success="addDataSuccess"></CyEquipmentDataModal>
</template>

<script lang="ts" setup>
import {ref, reactive, defineExpose, nextTick, computed, defineProps} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {queryById} from "@/views/energy/meter/CyEquipment.api";
import {deleteOne, saveOrUpdate} from "@/views/energy/meter/components/CyEquipmentData.api";
import CyEquipmentDataModal from "@/views/energy/sensor/components/components/CyEquipmentDataModal.vue";

  const props = defineProps({
    formDisabled: { type: Boolean, default: false },
    formBpm: { type: Boolean, default: true }
  });

  const formRef = ref();
  const registerModal = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: undefined,
    name: '',
    meterType: undefined,
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
    registerModal.value.add(formData)
  }

  /**
   * 编辑数据点
   */
  function editData(record) {
    registerModal.value.edit(record, formData);
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
  function addDataSuccess(data) {
    console.log("addDataSuccess", data, "formData.dataList", formData.dataList)
    // if (index.value) {
    //   formData.dataList[index.value] = data
    // } else {
    //   formData.dataList.push(data)
    // }
    let param = {
      id: formData.id,
      equipmentCode: formData.equipmentCode,
      type: formData.type,
      dataList: [data]
    }
    saveOrUpdate(param).then((res) => {
      initFormData(formData.id)
    })
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
