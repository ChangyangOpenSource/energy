<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="分组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unitCode">
              <a-select style="width: 180px; margin-left:20px" placeholder="请选择" @change="setGroupIdAndName"
                        :optionFilterProp="'label'" show-search allow-clear>
                <a-select-option v-for="item in unitGroupList" :key="item.id" :label="item.unitCode" :value="item.id">{{
                    item.groupName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unitName">
              <a-input style="width: 180px; margin-left:20px" v-model:value="model.unitCode" placeholder="请输入单位名称"
                       @change="unitCodeChange"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="parentId">
              <div style="margin-top:20px;margin-bottom: 20px; font-weight: bold; font-size: 20px">
                单位换算
              </div>

              <div v-for="(item, SourceIndex) in forwardList" :key="SourceIndex" style="width: 500px; background-color: #ffffff; margin-bottom: 20px; padding: 10px; border: 1px solid #e8e8e8; border-radius: 4px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span>1 {{ model.unitCode }} =</span>
                  <a-input v-model:value="item.value" placeholder="转换值" style="width: 120px;" @change="setConvertValue(item, SourceIndex)" />
                  <a-select style="width: 120px;" placeholder="请选择" @change="(value) => setTargetUnitAndId(value, item, SourceIndex)">
                    <a-select-option v-for="UnitItem in unitList" :key="UnitItem.id" :value="UnitItem.id">{{ UnitItem.unitCode }}</a-select-option>
                  </a-select>
                  <a-button type="primary" size="small" @click="handleDelete(SourceIndex)">删除</a-button>
                </div>

                <!-- 反向转换 -->
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                  <span>1 {{ contraryList[SourceIndex].sourceUnit }} =</span>
                  <a-input v-model:value="contraryList[SourceIndex].value" placeholder="转换值" style="width: 120px;" />
                  <span>{{ contraryList[SourceIndex].targetUnit }}</span>
                </div>
              </div>

              <div style="color:blue;cursor: pointer;" @click="addRow()">
                添加单位换算
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { defHttp } from '@/utils/http/axios'

// 定义组件名称
defineOptions({
  name: 'CyEmissionUnitForm'
})

// Props定义
const props = defineProps({
  //表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// 定义事件发射器
const emit = defineEmits(['ok'])

// Refs
const formRef = ref()

// 响应式数据
const model = reactive({
  parentName: '',
  parentId: '',
  unitConvertList: [],
})

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 },
}

const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 },
}

const confirmLoading = ref(false)
const validatorRules = reactive({})

const url = {
  add: "/emission/factor/cyEmissionUnit/add",
  edit: "/emission/factor/cyEmissionUnit/edit",
  queryById: "/CyEmissionUnit/cyEmissionUnit/queryById",
  unitGroup: "/CyFactorUnitGroup/cyFactorUnitGroup/list",
  unitList: "/emission/factor/cyEmissionUnit/list",
}

const contraryList = ref([])
const forwardList = ref([])
const unitGroupList = ref([])
const unitList = ref([])

// 计算属性
const formDisabled = computed(() => {
  return props.disabled
})

// 方法定义
function setGroupIdAndName(selectedObj) {
  let theIndex = unitGroupList.value.findIndex(ele => ele.id == selectedObj)
  let theObj = unitGroupList.value[theIndex];
  model.parentName = theObj.groupName
  model.parentId = theObj.id
  console.log(model)
}

function setTargetUnitAndId(selectedObj, item, SourceIndex) {
  let theIndex = unitList.value.findIndex(ele => ele.id == selectedObj)
  let theObj = unitList.value[theIndex];

  item.sourceUnit = model.unitCode;
  item.targetUnit = theObj.unitCode;
  item.targetUnitId = theObj.id;

  console.log(item);

  contraryList.value[SourceIndex].sourceUnit = item.targetUnit;
  contraryList.value[SourceIndex].unitId = item.targetUnitId;
  contraryList.value[SourceIndex].targetUnit = item.sourceUnit;
}

// 正向单位转换对象中的转换值改变时，同时改变反向转换对象中的转换值（自动设置为正向的倒数）
function setConvertValue(item, SourceIndex) {
  console.log(item.value)
  if (item.value != null && item.value != undefined && item.value != 0) {
    contraryList.value[SourceIndex].value = (1 / item.value).toFixed(6)
  }
}

// 主体中的单位值改变时，同时改变反向转换对象中的目标单位
function unitCodeChange(e) {
  console.log(model.unitCode)
  if (contraryList.value != null && contraryList.value.length > 0) {
    for (let i = 0; i < contraryList.value.length; i++) {
      contraryList.value[i].targetUnit = model.unitCode
    }
  }
}

function addRow() {
  forwardList.value.push({ sourceUnit: '', sourceUnitId: '', value: '', targetUnit: '', targetUnitId: '', type: "1" });
  contraryList.value.push({ sourceUnit: '', unitId: '', value: '', targetUnit: '', targetUnitId: '', type: "2" })
}

// 删除转换对象
function handleDelete(SourceIndex) {
  forwardList.value.splice(SourceIndex, 1)
  contraryList.value.splice(SourceIndex, 1)
}

// 单位分组分页列表查询
async function searchGroup() {
  try {
    const res = await defHttp.get({ url: url.unitGroup }, { isTransformResponse: false})
    unitGroupList.value = res.result?.records || []
  } catch (error) {
    console.error(error)
  }
}

// 查询单位
async function searchUnit() {
  try {
    const res = await defHttp.get({ url: url.unitList }, { isTransformResponse: false})
    unitList.value = res.result?.records || []
  } catch (error) {
    console.error(error)
  }
}

function add() {
  // 备份model原始值
  const modelDefault = JSON.parse(JSON.stringify(model));
  edit(modelDefault);
}

function edit(record) {
  Object.assign(model, record);
}

async function submitForm() {
  if (model.parentName == null || model.parentName == '' || model.parentName == undefined) {
    message.warn('请选择单位分组')
  } else {
    if (model.unitCode == null || model.unitCode == '' || model.unitCode == undefined) {
      message.warn('请输入单位')
    } else {
      if (model.unitConvertList == undefined) {
        model.unitConvertList = [];
      }

      for (let i = 0; i < contraryList.value.length; i++) {
        model.unitConvertList.push(contraryList.value[i]);
      }

      for (let i = 0; i < forwardList.value.length; i++) {
        model.unitConvertList.push(forwardList.value[i]);
      }
      console.log(model);

      // 触发表单验证
      try {
        confirmLoading.value = true;
        let httpurl = '';
        let method = '';
        if (!model.id) {
          httpurl += url.add;
          method = 'post';
        } else {
          httpurl += url.edit;
          method = 'put';
        }

        const res = await defHttp.request({
          url: httpurl,
          method: method,
          data: model
        }, { isTransformResponse: false});

        if (res.success) {
          message.success(res.message);
          emit('ok');
        } else {
          message.warning(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        confirmLoading.value = false;
      }
    }
  }
}

// 生命周期钩子
onMounted(() => {
  // 查询单位分组
  searchGroup();
  // 查询单位
  searchUnit();
})

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  submitForm
})
</script>
