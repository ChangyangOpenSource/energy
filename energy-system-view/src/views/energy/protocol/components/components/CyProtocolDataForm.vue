<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer>
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyDataForm" :ruler="validatorRules">
          <a-row>
						<a-col :span="24">
							<a-form-item label="数据点名称" v-bind="validateInfos.dataId" id="CyDataForm-dataId" name="dataId">
                <a-select
                  v-model:value="formData.dataId"
                  placeholder="请选择数据点"
                  style="width: 300px"
                  :options="datas"
                  :field-names="{ label: 'name', value: 'id', options: 'children' }"
                  @change="changeBaseData"
                >
                  <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <a-space style="padding: 4px 8px">
                      <a-input ref="inputRef" v-model:value="name" placeholder="添加数据点" />
                      <a-button type="text" @click="addItemName">
                        <template #icon>
                          <plus-outlined />
                        </template>
                        添加数据点
                      </a-button>
                    </a-space>
                  </template>
                </a-select>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="数据点类型" v-bind="validateInfos.dataType" id="CyDataForm-dataType" name="dataType">
                <j-dict-select-tag type="radio" v-model:value="formData.dataType" dictCode="data_type" placeholder="请选择数据点类型" :disabled="true"/>
              </a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="单位" v-bind="validateInfos.unit" id="CyDataForm-unit" name="unit">
								<a-input v-model:value="formData.unit" placeholder="请输入单位"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item v-bind="validateInfos.formula" id="CyDataForm-formula" name="formula">
                <template #label>
                  <span style="display: inline-flex; align-items: center;">
                    计算公式
                    <a-tooltip v-if="formData.dataType == 1" title="通过计算公式可调整设备测量值的倍率 例如,实际值为测量值的3倍,则计算公式喂 a x 3">
                      <ExclamationCircleOutlined style="margin-left: 4px; font-size: 14px;"/>
                    </a-tooltip>
                  </span>
                </template>
								<a-input v-model:value="formData.formula" placeholder="请输入计算公式"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
          </a-row>
          <a-table :columns="protocolDataColumns" :data-source="formData.datas" :pagination="false">
            <template #bodyCell="{ column, record, index}">
              <template v-if="column.key === 'dataId'">
                <a-select
                  style="width: 100%"
                  v-model:value="record.dataId"
                  :options="protocolTypeOneDatas"
                  :field-names="{ label: 'dataName', value: 'id', options: 'children' }"
                  @change="changeData(record)"
                  placeholder="请选择数据点"
                  allow-clear
                >
                </a-select>
              </template>
              <template v-if="column.key === 'action'">
                  <span>
                    <a @click="deleteProtocolData(record, index)">删除</a>
                  </span>
              </template>
            </template>
          </a-table>
          <a-button @click="addProtocolData()" style="margin-top: 10px">添加变量</a-button>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
  import {defineComponent, ref, reactive, defineExpose, nextTick, defineProps } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {addData, getDatas, list, saveOrUpdate} from '../CyProtocolData.api';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    protocolId: String,
    equipmentTypeId: String,
  });
  const formRef = ref();
  const datas = ref([]);
  const name = ref();
  const inputRef = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    dataId: undefined,
    dataName: '',
    dataType: '2',
    type: undefined,
    unit: '',
    formula: '',
    protocolId: '',
    datas: [{
      name: "a1",
      dataId: undefined,
      unit: undefined,
      type: undefined
    }],
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = {
    dataId:[{required: true, message: '请选择数据点'}],
    dataType:[{required: true, message: '请选择数据点类型'}],
    unit:[{required: true, message: '请输入单位'}],
    formula:[{required: true, message: '请输入计算公式'}]
  }
  const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });


  const protocolTypeOneDatas = ref([]);
  //添加变量的下标
  const index = ref(1);
  const protocolDataColumns = [
    {
      title: '变量名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据点',
      dataIndex: 'dataId',
      key: 'dataId',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      customRender: ({ text }) => {
       if (text == 1) {
         return '瞬时'
       } else if (text == 2) {
         return '累计'
       }
      },
    },
    {
      title: '操作',
      key: 'action',
    },
  ];
  /**
   * 选择数据点 回显名称
   */
  function changeBaseData() {
    formData.dataName = datas.value.filter(item => item.id === formData.dataId)[0].name
  }

  const VNodes = defineComponent({
    props: {
      vnodes: {
        type: Object,
        required: true,
      },
    },
    render() {
      return this.vnodes;
    },
  });


  /**
   * 获取数据点
   */
  function initBaseDatas() {
    getDatas({equipmentTypeId: props.equipmentTypeId, pageSize: -1}).then((res) => {
      Object.assign(datas.value, res.records);
    });
  }

  /**
   * 点击添加数据点
   * @param e
   */
  const addItemName = e => {
    e.preventDefault();
    let param = {
      name: name.value,
      equipmentTypeId: props.equipmentTypeId
    }
    addData(param).then((res) => {
      name.value = undefined
      initBaseDatas()
      setTimeout(() => {
        inputRef.value?.focus();
      }, 0);
    })
  };

  /**
   * 添加变量
   */
  function addProtocolData() {
    index.value = index.value + 1
    formData.datas.push({
      name: "a" + index.value,
    })
  }
  /**
   * 添加变量
   */
  function deleteProtocolData(record, index) {
    formData.datas.splice(index, 1);
  }

  /**
   * 选择数据点 回显单位
   */
  function changeData(record) {
    var filter = protocolTypeOneDatas.value.filter(item => item.id === record.dataId);
    record.unit = filter[0].unit
    record.enumKey = filter[0].enumKey
    record.type = filter[0].type
  }

  /**
   * 新增
   */
  function add() {
    edit({});
  }

  /**
   * 编辑
   */
  function edit(record) {
    nextTick(() => {
      record.protocolId = props.protocolId
      if (record.datas) {
        index.value = record.datas.length
      } else {
        index.value = 1
      }
      initBaseDatas()
      getDataTypeOneDatas()
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
   * 获取直采数据点
   */
  function getDataTypeOneDatas() {
    list({protocolId: props.protocolId, dataType: 1}).then((res) => {
      protocolTypeOneDatas.value = res
    })
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

    // 编辑是String 新增是number 这里统一转换为String 检查 type 是否一致
    const types = formData.datas.map(item => String(item.type));
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length > 1) {
      createMessage.error('数据点类型必须相同！');
      return
    }
    formData.type = uniqueTypes[0]

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
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    padding: 14px 20px;
  }
</style>
