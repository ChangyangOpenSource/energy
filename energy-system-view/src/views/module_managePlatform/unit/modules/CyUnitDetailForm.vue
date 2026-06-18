<template>
  <a-spin :spinning="confirmLoading">
    <h2>编辑单位</h2>

    <j-form-container :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="分组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unitCode">
              <div v-if="detailFlag == 0">
                <a-select style="width: 180px; margin-left:20px" placeholder="请选择" @change="setGroupIdAndName"
                          v-model:value="detailDataSource.cyEmissionUnit.parentName" :optionFilterProp="'label'" show-search
                          allow-clear>
                  <a-select-option v-for="item in unitGroupList" :key="item.id" :label="item.unitCode" :value="item.id">
                    {{ item.groupName }}
                  </a-select-option>
                </a-select>
              </div>
              <div v-else>
                <a-input style="width: 180px; margin-left:20px"
                         v-model:value="detailDataSource.cyEmissionUnit.parentName" placeholder="请输入单位名称"></a-input>
              </div>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unitName">
              <a-input @change="setUnitCode" style="width: 180px; margin-left:20px"
                       v-model:value="detailDataSource.cyEmissionUnit.unitCode" placeholder="请输入单位名称"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="parentId">
              <div style="margin-top:20px;margin-bottom: 20px; font-weight: bold; font-size: 20px">
                单位换算
              </div>

              <!-- 展示出对象中包含的所有的正向转换对象 -->
              <div v-for="(item, SourceIndex) in forwardList" :key="SourceIndex"
                   style="background-color: #ffffff;margin-bottom: 20px;">
                <div style="display:flex">
                  <div v-if="detailFlag == 1 && (item.sourceUnit == null || item.sourceUnit == '')" style="min-width: 40px;">
                    1 - =
                  </div>

                  <div v-if="detailFlag == 0 && (detailDataSource.cyEmissionUnit.unitCode == null || detailDataSource.cyEmissionUnit.unitCode == '')"
                       style="min-width: 40px;">
                    1 - =
                  </div>

                  <div v-if="detailFlag == 1 && item.sourceUnit != null && item.sourceUnit != ''" style="min-width: 70px;">
                    1 {{ item.sourceUnit }} =
                  </div>

                  <div v-if="detailFlag == 0 && detailDataSource.cyEmissionUnit.unitCode != null && detailDataSource.cyEmissionUnit.unitCode != ''"
                       style="min-width: 70px;">
                    1 {{ item.sourceUnit }} =
                  </div>

                  <a-input v-model:value="item.value" placeholder="转换值" style="width: 180px; margin-left:10px;margin-top:4px"
                           @change="setConvertValue(item, SourceIndex)"></a-input>

                  <div v-if="detailFlag == 0">
                    <a-select style="width: 180px; margin-left:20px" placeholder="请选择"
                              @change="(value) => setTargetUnitAndId(value, item, SourceIndex)"
                              v-model:value="item.targetUnit" :optionFilterProp="'label'" show-search allow-clear>
                      <a-select-option v-for="UnitItem in unitList" :key="UnitItem.id" :label="UnitItem.unitCode"
                                       :value="UnitItem.id">{{ UnitItem.unitCode }}
                      </a-select-option>
                    </a-select>
                  </div>

                  <div v-else>
                    <a-input style="width: 180px; margin-left:20px" v-model:value="item.targetUnit"
                             placeholder="请输入单位名称"></a-input>
                  </div>

                  <!-- 删除转换对象（同时删除正向和对应的反向转换对象） -->
                  <a-button v-show="detailFlag == 0" style="margin-left:20px;margin-top:4px" type="primary"
                            @click="deleteConvertItem(SourceIndex)">删除</a-button>
                </div>

                <!-- 转换对象一组一组展示的效果 -->
                <!-- 由于正向转换对象和反向转换对象下标是对应的，所有可以通过相同下标来进行成组展示的效果 -->
                <!-- 展示出对象中包含的所有的反向转换对象 -->
                <div style="margin-bottom:20px">
                  <span style="min-width: 40px;"
                        v-if="contraryList[SourceIndex].sourceUnit == null || contraryList[SourceIndex].sourceUnit == ''">
                    1 - =
                  </span>

                  <span v-else style="width:200px; min-width: 40px;">
                    1 {{ contraryList[SourceIndex].sourceUnit }} =
                  </span>

                  <a-input v-model:value="contraryList[SourceIndex].value" placeholder="转换值"
                           style="width: 180px; margin-left:15px"></a-input>

                  <span v-if="contraryList[SourceIndex].targetUnit == null || contraryList[SourceIndex].targetUnit == ''"
                        style="margin-left:20px">
                    1 -
                  </span>

                  <span v-else style="margin-left:20px">
                    {{ contraryList[SourceIndex].targetUnit }}
                  </span>
                </div>
              </div>

              <div v-show="detailFlag == 0" style="color:blue;cursor: pointer;" @click="addRow()">
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { defHttp } from '@/utils/http/axios'

// 定义组件名称
defineOptions({
  name: 'CyEmissionUnitForm'
})

// Props定义
const props = defineProps({
  // 被编辑对象的数据源（由父组件传递过来）
  detailDataSource: {},
  // 编辑与详情的区分标致
  detailFlag: null,
  // 正向单位转换数组
  forwardList: Array,
  // 反向单位转换数组
  contraryList: Array,
  //表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// 定义事件发射器
const emit = defineEmits(['getAllConvert', 'ok'])

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

// 单位分组数组
const unitGroupList = ref([])
// 单位数组
const unitList = ref([])

// 计算属性
const formDisabled = computed(() => {
  return props.disabled
})

// 方法定义
function submitqqqq() {
  emit('getAllConvert', props.forwardList, props.contraryList)
}

// 分组改变时，同时改变分组名称和分组id
function setGroupIdAndName(selectedObj) {
  let theIndex = unitGroupList.value.findIndex(ele => ele.id == selectedObj)
  let theObj = unitGroupList.value[theIndex];

  // 更新分组名称和分组id
  props.detailDataSource.cyEmissionUnit.parentName = theObj.groupName
  props.detailDataSource.cyEmissionUnit.parentId = theObj.id
}

// 正向单位转化对象的 目标单位改变时，同时改变目标单位名称和 目标单位id
function setTargetUnitAndId(selectedObj, item, SourceIndex) {
  let theIndex = unitList.value.findIndex(ele => ele.id == selectedObj)
  let theObj = unitList.value[theIndex];

  // 将主体对象的单位赋值给正向转换对象的来源单位名称
  item.sourceUnit = props.detailDataSource.cyEmissionUnit.unitCode;
  item.targetUnit = theObj.unitCode;
  item.targetUnitId = theObj.id;

  console.log(item);

  // 正向单位转换对象属性赋值后，同步给对应的反向转换对象属性赋值
  props.contraryList[SourceIndex].sourceUnit = item.targetUnit;
  props.contraryList[SourceIndex].unitId = item.targetUnitId;
  props.contraryList[SourceIndex].targetUnit = item.sourceUnit;
}

// 正向单位转换对象中的转换值改变时，同时改变反向转换对象中的转换值（自动设置为正向的倒数）
function setConvertValue(item, SourceIndex) {
  console.log(item.value)
  if (item.value != null && item.value != undefined && item.value != 0) {
    props.contraryList[SourceIndex].value = (1 / item.value).toFixed(6)
  }
}

// 增加单位换算对象
function addRow() {
  // 增加时同步增加正向和反向的
  props.forwardList.push({
    sourceUnit: props.detailDataSource.cyEmissionUnit.unitCode,
    sourceUnitId: '',
    value: '',
    targetUnit: '',
    targetUnitId: '',
    type: "1"
  });
  props.contraryList.push({
    sourceUnit: '',
    unitId: '',
    value: '',
    targetUnit: props.detailDataSource.cyEmissionUnit.unitCode,
    targetUnitId: '',
    type: "2"
  })
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
    const res = await defHttp.get({ url: url.unitList, params: { pageSize: -1 } }, { isTransformResponse: false})
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

// 确认正反向转换数组
function distinguishList() {
  // 对数组进行初始化操作
  // 因为返回的转换数组为混合数组cyEmissionUnitConvert，所以区分好正向反向转换对象
  if (props.detailDataSource.cyEmissionUnitConvert != null && props.detailDataSource.cyEmissionUnitConvert.length > 0) {
    for (let i = 0; i < props.detailDataSource.cyEmissionUnitConvert.length; i++) {
      if (props.detailDataSource.cyEmissionUnitConvert[i].type == "1") {
        props.forwardList.push(props.detailDataSource.cyEmissionUnitConvert[i])
      } else {
        props.contraryList.push(props.detailDataSource.cyEmissionUnitConvert[i])
      }
    }
  } else {
    // 如果源转换对象数组为空，则将正向和反向数组都设置为空
    props.forwardList.length = 0;
    props.contraryList.length = 0;
  }
}

// 删除转换对象
function deleteConvertItem(index) {
  props.forwardList.splice(index, 1)
  props.contraryList.splice(index, 1)
}

// 当单位名称改变时，改变所有正向和反向单位转换对象中关联的单位名称
function setUnitCode() {
  for (let i = 0; i < props.forwardList.length; i++) {
    props.forwardList[i].sourceUnit = props.detailDataSource.cyEmissionUnit.unitCode
    //同时将目标单位清空，因为可能会造成数据不一致，所以情况需要重新选
    props.forwardList[i].targetUnit = null;
  }

  for (let i = 0; i < props.forwardList.length; i++) {
    props.contraryList[i].targetUnit = props.detailDataSource.cyEmissionUnit.unitCode
    //同时将目标单位清空，因为可能会造成数据不一致，所以情况需要重新选
    props.contraryList[i].sourceUnit = null;
  }
}

async function submitForm() {
  if (model.unitConvertList == undefined) {
    model.unitConvertList = [];
  }

  for (let i = 0; i < props.contraryList.length; i++) {
    model.unitConvertList.push(props.contraryList[i]);
  }

  for (let i = 0; i < props.forwardList.length; i++) {
    model.unitConvertList.push(props.forwardList[i]);
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

// 生命周期钩子
onMounted(() => {
  // 查询单位分组
  searchGroup();
  // 查询单位
  searchUnit();
  // 区分数据源对象中的正反向数组方法
  distinguishList();
})

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  submitForm,
  submitqqqq // 添加此行
})
</script>
