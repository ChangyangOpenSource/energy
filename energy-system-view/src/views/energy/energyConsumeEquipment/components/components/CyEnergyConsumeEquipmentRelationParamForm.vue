<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer>
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyEnergyConsumeEquipmentRelationParamForm" :ruler="validatorRules">
          <a-row>
						<a-col :span="24">
							<a-form-item label="参数名称" v-bind="validateInfos.name" id="CyEnergyConsumeEquipmentRelationParamForm-name" name="name">
								<a-input v-model:value="formData.name" placeholder="请输入参数名称"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="参数类型" v-bind="validateInfos.paramType" id="CyEnergyConsumeEquipmentRelationParamForm-paramType" name="paramType">
                <j-dict-select-tag v-model:value="formData.paramType" dictCode="param_type" placeholder="请选择参数类型"  allow-clear />
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="单位" v-bind="validateInfos.unit" id="CyEnergyConsumeEquipmentRelationParamForm-unit" name="unit">
								<a-input v-model:value="formData.unit" placeholder="请输入单位"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item v-if="formData.paramType =='1'" label="参数值" v-bind="validateInfos.value" id="CyEnergyConsumeEquipmentRelationParamForm-value" name="value">
								<a-input v-model:value="formData.value" placeholder="请输入参数值"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item v-if="formData.paramType !='1'" label="计算公式" v-bind="validateInfos.formula" id="CyEnergyConsumeEquipmentRelationParamForm-formula" name="formula">
								<a-input v-model:value="formData.formula" placeholder="请输入计算公式"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
          </a-row>
          <div v-if="formData.paramType !='1'">
            <a-table :columns="equipmentDatasColumns" :data-source="formData.datas" :pagination="false">
              <template #bodyCell="{ column, record, index}">
                <template v-if="column.key === 'equipmentId'">
                  <a-select
                    style="width: 100%"
                    v-model:value="record.equipmentId"
                    :options="equipments"
                    :field-names="{ label: 'name', value: 'id', options: 'children' }"
                    @change="changeEquipment(record)"
                    placeholder="请选择计量表"
                    allow-clear
                  >
                  </a-select>
                </template>
                <template v-if="column.key === 'dataId'">
                  <a-select
                    style="width: 100%"
                    v-model:value="formData.datas[index].dataId"
                    :options="record.dataList"
                    :field-names="{ label: 'dataName', value: 'id', options: 'children' }"
                    @change="changeData(record)"
                    placeholder="请选择数据点"
                    allow-clear
                  >
                  </a-select>
                </template>
                <template v-if="column.key === 'action'">
                  <span>
                    <a @click="deleteData(record, index)">删除</a>
                  </span>
                </template>
              </template>
            </a-table>
            <a-button @click="addEquipmentData()">添加变量</a-button>
          </div>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineExpose, nextTick } from 'vue';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
  import {detailListByIds} from "@/views/energy/meter/CyEquipment.api";
  const formRef = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = ref({
    id: '',
    energyConsumeEquipmentId: '',
    paramId: '',
    name: '',
    paramType: '',
    unit: '',
    value: '',
    formula: '',
    datajson: '',
    status: '',
    datas: [{
      name: "a1",
      equipmentId: undefined,
      dataId: undefined,
      unit: undefined,
      dataList: [],
    }],
  });
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
  });
  const { resetFields, validate, validateInfos } = useForm( validatorRules, { immediate: false });

  //添加变量的下标
  const index = ref(1);
  const equipments = ref([])
  const equipmentDatasColumns = [
    {
      title: '变量名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '计量表',
      dataIndex: 'equipmentId',
      key: 'equipmentId',
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
      title: '操作',
      key: 'action',
    },
  ];

  /**
   * 编辑
   */
  function edit(record, equipmentIds) {
    nextTick(() => {
      if (Object.keys(record).length > 0) {
        //赋值
        formData.value = JSON.parse(JSON.stringify(record))
        console.log("formData", formData)
        index.value = formData.value.datas.length
      } else {
        formData.value = {
          id: '',
          energyConsumeEquipmentId: '',
          paramId: '',
          name: '',
          paramType: '',
          unit: '',
          value: '',
          formula: '',
          datajson: '',
          status: '',
          datas: [{
            name: "a1",
            equipmentId: undefined,
            dataId: undefined,
            unit: undefined,
            dataList: [],
          }],
        }
        index.value = 1
      }
      initEquipment(equipmentIds);
    });
  }

  /**
   * 添加变量
   */
  function addEquipmentData() {
    index.value = index.value + 1
    formData.value.datas.push({
      name: "a" + index.value,
      equipmentId: undefined,
      dataId: undefined,
      unit: undefined,
      dataList: [],
    })
  }

  /**
   * 获取设备以及设备下数据点
   */
  function initEquipment(equipmentIds) {
    detailListByIds({ids: equipmentIds}).then((res) => {
      Object.assign(equipments.value, res);
      formData.value.datas.forEach(item => {
        var filterElement = equipments.value.filter(item2 => item2.id == item.equipmentId)[0];
        item.dataList = filterElement.dataList;
        item.equipmentName = filterElement.name;
      })
    });

    console.log("formData222", formData)
  }

  /**
   * 更换设备 将dataList放到formData里
   */
  function changeEquipment(record) {
    record.dataList = equipments.value.filter(item => item.id === record.equipmentId)[0].dataList;
    record.equipmentName = equipments.value.filter(item => item.id === record.equipmentId)[0].name;
    record.dataId = undefined
  }

  /**
   * 选择数据点 回显单位
   */
  function changeData(record) {
    record.unit = record.dataList.filter(item => item.id === record.dataId)[0].unit
  }


  /**
   * 提交数据
   */
  async function submitForm() {
    formData.value.equipmentName = undefined
    for (let equipmentData in formData.value.datas) {
      const name = formData.value.datas[equipmentData].equipmentName;

      if (!name) continue; // 跳过空名称

      if (formData.value.equipmentName) {
        // 检查名称是否已存在
        const existingNames = formData.value.equipmentName.split(',');
        if (!existingNames.includes(name)) {
          formData.value.equipmentName = formData.value.equipmentName + "," + name;
        }
      } else {
        formData.value.equipmentName = name;
      }
    }
    console.log("submit", formData)
    emit('ok', formData.value)
  }


  function deleteData(record, index) {
    formData.value.datas.splice(index, 1)
  }

  defineExpose({
    edit,
    submitForm,
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    padding: 14px 20px;
  }
</style>
