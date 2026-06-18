<template>
  <div class="">
    <div class="cardHeader">
      <img class="cardHeader_icon m_hoverCP" :src="img28" alt="" @click="onBack"/>
      <span v-if="editFlag == 1" class="m_hoverCP" @click="onBack">编辑碳排因子</span>
      <span v-else class="m_hoverCP" @click="onBack">添加碳排因子</span>
    </div>
    <section class="cardBox">
      <div class="cardBox_title">碳排放因子信息</div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="因子名称" required>
                <a-input v-model:value="queryParam.name" allowClear placeholder="请输入" :max-length="32"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="规格型号" required>
                <a-input v-model:value="queryParam.model" allowClear placeholder="请输入" :max-length="32"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="适用行业" required>
                <a-select v-model:value="queryParam.industryId" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption" @change="onChangeIndustryId">
                  <a-select-option :value="item.id" v-for="(item,index) in industryData" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="因子分类" required>
                <a-select v-model:value="queryParam.productClassification" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in product_typeData" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="适用场景" required>
                <a-input v-model:value="queryParam.scene" allowClear placeholder="请输入" :max-length="256"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="因子说明">
                <a-input v-model:value="queryParam.instruction" allowClear placeholder="请输入" :max-length="512"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="碳排因子数据库" required>
                <a-select v-model:value="queryParam.emissionFactorDatabase" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in emission_factor_database" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="gwp版本" required>
                <a-select v-model:value="queryParam.gwpVersion" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in emission_factor_gwp_version" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="排放系数种类" required>
                <a-select v-model:value="queryParam.category" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in emission_factor_category" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </section>
    <section class="cardBox" style="">
      <div class="cardBox_title">数据详情</div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="因子单位" required>
                <div class="m_cFlex">
                  <a-select v-model:value="queryParam.numeratorUnitId" placeholder="请选择" show-search
                            :filter-option="filterOption" @change="onChangeNumeratorUnitId">
                    <a-select-option :value="item.id" v-for="(item,index) in fzData" :key="index">
                      {{ item.factorUnit }}
                    </a-select-option>
                  </a-select>
                  <span style="margin: 0 10px;">/</span>
                  <a-select v-model:value="queryParam.denominatorUnitId" placeholder="请选择" show-search
                            :filter-option="filterOption" @change="onChangeDenominatorUnitId">
                    <a-select-option :value="item.id" v-for="(item,index) in fmData" :key="index">
                      {{ item.unitCode }}
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="因子值（二氧化碳当量）" required>
                <div class="m_cFlex">
                  <a-input-number v-model:value="queryParam.factorValue" :step="0.0001" :precision="4"
                                  :disabled="queryParam.computerType == 2" allowClear placeholder="请输入"
                                  style="width: 200px"/>
                  <div class="switchBtn m_hoverCP" @click="onChangeComputerType "
                       v-if="queryParam.computerType == 1">
                    <img class="switchBtn_icon " :src="img29" alt=""/>切换配比计算
                  </div>
                  <div class="switchBtn m_hoverCP" @click="queryParam.computerType = 1"
                       v-if="queryParam.computerType == 2">
                    <img class="switchBtn_icon " :src="img29" alt=""/>切换手输
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div style="margin-top: 20px;width: 1300px;" v-if="queryParam.computerType == 2">
        <a-table :columns="columns" :data-source="queryParam.gasList" :pagination="false" :bordered="false"
                 size="middle">
          <template #gasName="{ text, record }">
            <a-select v-model:value="record.gasName" placeholder="请选择" show-search :filter-option="filterOption"
                      @change="onChangeGas($event,record)" style="width: 100%;">
              <a-select-option :value="item.gasName" :disabled="item.disabled" v-for="(item,index) in gasData"
                               :key="item.gasName">
                {{ item.gasName }}
              </a-select-option>
            </a-select>
          </template>
          <template #factorValue="{ text, record }">
            <a-input-number v-model:value="record.factorValue" :step="0.0001" :precision="4" placeholder="请输入"
                            @change="computeFactorValue" style="width: 100%;"/>
          </template>
          <template #gwpValue="{ text, record }">
            <a-input-number v-model:value="record.gwpValue" :step="0.01" :precision="4" placeholder="请输入"
                            @change="computeFactorValue" style="width: 100%;"/>
          </template>
          <template #action="{ text, record, index }">
            <div class="m_ccFlex">
              <a-popconfirm title="确定删除吗?" cancel-text="取消" ok-text="确定" @confirm="() => onDel(index)">
                <a>删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
        <div class="addBtn m_hoverCP" @click="onAdd">
          <img class="addBtn_icon " :src="img30" alt=""/>添加气体
        </div>
      </div>
    </section>
    <section class="cardBox" :style="{'paddingBottom':paddingBottom}">
      <div class="cardBox_title">来源信息</div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="发布机构" required>
                <a-input v-model:value="queryParam.releaseOrg" allowClear placeholder="请输入" :max-length="64"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="发布年份" required>
                <a-select v-model:value="queryParam.releaseYear" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item" v-for="(item,index) in yearData" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="来源类型" required>
                <a-select v-model:value="queryParam.sourceType" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in source_typeData" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="文献类型" required>
                <a-select v-model:value="queryParam.docType" allowClear placeholder="请选择" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in document_typeData" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="适用地区" required>
                <a-input v-model:value="queryParam.ownership" allowClear placeholder="请输入" :max-length="128"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="来源文件" required>
                <a-input v-model:value="queryParam.sourceFile" allowClear placeholder="请输入" :max-length="128"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="来源网址链接">
                <a-input v-model:value="queryParam.sourceUrlLink" allowClear placeholder="请输入" :max-length="128"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="附件">
                <JUpload v-model:value="queryParam.attachments" :number="3"></JUpload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </section>
    <div class="optionBox">
      <div class="optionItem optionItem_cancel m_hoverCP" @click="onBack"> 取消</div>
      <div v-if="editFlag == 1" class="optionItem optionItem_confirm m_hoverCP" @click="onSubmitEdit">保存</div>
      <div v-else class="optionItem optionItem_confirm m_hoverCP" @click="onSubmit"> 保存</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, computed, watch } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import { INDUSTRY } from '@/common/constKey';
import JUpload from "@/components/Form/src/jeecg/components/JUpload/JUpload.vue";


// Import images
import img28 from '@/assets/img/img28.png';
import img29 from '@/assets/img/img29.png';
import img30 from '@/assets/img/img30.png';

export default defineComponent({
  name: 'TpyzForm',
  props: {
    editFlag: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit }) {
    const { createMessage } = useMessage();

    // 表格列定义
    const columns = [
      {
        title: '温室气体',
        align: 'center',
        dataIndex: 'gasName',
        width: 150,
        slots: { customRender: 'gasName' },
      },
      {
        title: '因子数值',
        align: 'center',
        dataIndex: 'factorValue',
        width: 100,
        slots: { customRender: 'factorValue' },
      },
      {
        title: '因子分子单位',
        align: 'center',
        dataIndex: 'molecularUnit',
        width: 100,
      },
      {
        title: '因子分母单位',
        align: 'center',
        dataIndex: 'denominatorUnit',
        width: 100,
      },
      {
        title: 'GWP值',
        align: 'center',
        dataIndex: 'gwpValue',
        width: 100,
        slots: { customRender: 'gwpValue' },
      },
      {
        title: '操作',
        align: 'center',
        width: 100,
        slots: { customRender: 'action' },
      }
    ];

    // 表单数据
    const queryParam = reactive({
      gasList: [],
      computerType: 1, // 类型（1=手动输入，2=配比计算）
      type: '1', // 数据库,默认组织因子库,不可更改（1=碳排因子库，2=组织因子库）
    });

    // 各种数据源
    const fzData = ref([]); // 因子分子数据
    const fmData = ref([]); // 因子分母数据
    const yearData = ref([]); // 年份数据
    const gasData = ref([]); // 气体数据
    const industryData = ref([]); // 行业数据
    const source_typeData = ref([]); // 来源类型
    const product_typeData = ref([]); // 因子分类
    const document_typeData = ref([]); // 文献类型
    const emission_factor_database = ref([]); // 碳排因子数据库
    const emission_factor_gwp_version = ref([]); // gwp版本
    const emission_factor_category = ref([]); // 排放系数种类
    const allGasData = ref([]); // 气体二维数组数据

    // 计算属性
    const paddingBottom = computed(() => {
      if (queryParam.attachments) {
        return queryParam.attachments.split(',').length * 25 + 12 + 'px'
      } else {
        return '12px'
      }
    });

    // 监听器
    watch(
      () => queryParam.gasList,
      (val) => {
        let keyData = []
        val.forEach(item => {
          if (item.gasName) {
            keyData.push(item.gasName)
          }
        })

        gasData.value.forEach(item => {
          if (keyData.includes(item.gasName)) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      },
      { deep: true }
    );

    // 方法定义
    const onChangeIndustryId = (e) => {
      const theIndex = industryData.value.findIndex(ele => ele.id == e)
      if (theIndex > -1) {
        queryParam.industry = industryData.value[theIndex].name
      }
    };

    /**
     * 配比计算-根据气体计算因子值
     */
    const computeFactorValue = () => {
      let data = 0
      queryParam.gasList.forEach(item => {
        let factorValue = item.factorValue ? Number(item.factorValue) : 0
        let gwpValue = item.gwpValue ? Number(item.gwpValue) : 0
        data = data + (factorValue * gwpValue)
      })
      queryParam.factorValue = Number((data).toFixed(4))
    };

    const onChangeComputerType = () => {
      if (queryParam.computerType == 1) {
        // 从手动切换到配比计算
        queryParam.computerType = 2
        onChangeNumeratorUnitId(queryParam.numeratorUnitId)
      } else if (queryParam.computerType == 2) {
        // 从配比计算切换到手动
        queryParam.computerType = 1
      }
      queryParam.gasList = []
      computeFactorValue()
    };

    /**
     * 修改分子单位，同时删除温室气体
     */
    const onChangeNumeratorUnitId = (value) => {
      const theIndex = fzData.value.findIndex(ele => ele.id == value)
      if (theIndex > -1) {
        queryParam.numeratorUnit = fzData.value[theIndex].factorUnit
        gasData.value = allGasData.value[theIndex]
        if (queryParam.gasList && queryParam.gasList.length > 0) {
          queryParam.gasList.forEach((gasItem) => {
            gasData.value.forEach((gasItem2) => {
              if (gasItem.gasName === gasItem2.gasName) {
                gasItem.molecularUnit = gasItem2.gasUnit
              }
            })
          })
        }
        computeFactorValue()
      }
    };

    /**
     * 修改分母单位，同时修改所有温室气体的因子分母单位
     */
    const onChangeDenominatorUnitId = (value) => {
      const theIndex = fmData.value.findIndex(ele => ele.id == value)
      if (theIndex > -1) {
        queryParam.denominatorUnit = fmData.value[theIndex].unitCode
        queryParam.gasList.forEach(item => {
          item.denominatorUnit = fmData.value[theIndex].unitCode
        })
      }
    };

    /**
     * 添加气体
     */
    const onAdd = () => {
      let obj = {}
      if (queryParam.denominatorUnitId) {
        obj.denominatorUnit = queryParam.denominatorUnit
      }
      queryParam.gasList.push(obj)
    };

    /**
     * 删除气体
     */
    const onDel = (index) => {
      queryParam.gasList.splice(index, 1)
      computeFactorValue()
    };

    /**
     * 修改气体
     * @param e
     * @param record
     */
    const onChangeGas = (e, record) => {
      const theIndex = gasData.value.findIndex(ele => ele.gasName == e)
      if (theIndex > -1) {
        record.molecularUnit = gasData.value[theIndex].gasUnit
        record.gwpValue = gasData.value[theIndex].gwpValue
        computeFactorValue()
      }
    };

    /**
     * 检查表单数据
     */
    const checkFormData = () => {
      if (!queryParam.name) {
        createMessage.warn('请输入因子名称')
        return false
      }

      if (!queryParam.model) {
        createMessage.warn('请输入规格型号')
        return false
      }

      if (!queryParam.industry) {
        createMessage.warn('请选择适用行业')
        return false
      }

      if (!queryParam.productClassification) {
        createMessage.warn('请选择因子分类')
        return false
      }

      if (!queryParam.scene) {
        createMessage.warn('请选择适用场景')
        return false
      }

      if (!queryParam.releaseOrg) {
        createMessage.warn('请选择发布机构')
        return false
      }

      if (!queryParam.releaseYear) {
        createMessage.warn('请选择发布年份')
        return false
      }

      if (!queryParam.sourceType) {
        createMessage.warn('请选择来源类型')
        return false
      }

      if (!queryParam.docType) {
        createMessage.warn('请选择文献类型')
        return false
      }

      if (!queryParam.ownership) {
        createMessage.warn('请选择来源归属（适用地区）')
        return false
      }

      if (!queryParam.sourceFile) {
        createMessage.warn('请选择来源文件')
        return false
      }

      if (!queryParam.emissionFactorDatabase){
        createMessage.warn('请选择数据来源数据库')
        return false
      }

      if (!queryParam.numeratorUnitId) {
        createMessage.warn('请选择因子分子单位')
        return false
      }

      if (!queryParam.denominatorUnitId) {
        createMessage.warn('请选择因子分母单位')
        return false
      }

      if (queryParam.computerType == 1) {
        // 手动输入
        if (!queryParam.factorValue || queryParam.factorValue && queryParam.factorValue < 0) {
          createMessage.warn('请输入大于0的因子值（二氧化碳当量）')
          return false
        }
      }

      if (queryParam.computerType == 2) {
        // 配比计算
        if (!queryParam.gasList || queryParam.gasList && queryParam.gasList.length == 0) {
          createMessage.warn('请添加至少一条气体')
          return false
        }

        let errorIndex = null
        let errorType = null
        for (let i = 0; i < queryParam.gasList.length; i++) {
          let theObj = queryParam.gasList[i]
          if (!theObj.gasName) {
            errorIndex = i
            errorType = 'gasName'
            break
          }
          if (!theObj.factorValue || theObj.factorValue && theObj.factorValue < 0) {
            errorIndex = i
            errorType = 'factorValue'
            break
          }
          if (!theObj.gwpValue) {
            errorIndex = i
            errorType = 'gwpValue'
            break
          }
        }

        if (errorType === 'gasName') {
          createMessage.warn('请选择气体')
          return false
        }
        if (errorType === 'factorValue') {
          createMessage.warn('请输入大于0的因子数值')
          return false
        }
        if (errorType === 'gwpValue') {
          createMessage.warn('请输入GWP值')
          return false
        }
      }
      return true
    };

    /**
     * 提交
     */
    const onSubmit = () => {
      if (checkFormData()) {
        defHttp.post({
          url: '/emission/factor/cyEmissionFactor/add',
          params: queryParam
        }, { isTransformResponse: false}).then((res) => {
          if (res.success) {
            createMessage.success(res.message)
            onBack()
          }
        });
      }
    };

    /**
     * 提交修改
     */
    const onSubmitEdit = () => {
      if (checkFormData()) {
        defHttp.post({
          url: '/emission/factor/cyEmissionFactor/edit',
          params: queryParam
        }, { isTransformResponse: false}).then((res) => {
          if (res.success) {
            createMessage.success(res.message)
            onBack()
          }
        });
      }
    };

    /**
     * 获取初始化数据
     */
    const getData = () => {
      // 来源类型
      defHttp.get({
        url: '/sys/api/getDictItems',
        params: {
          dictCode: 'source_type'
        }
      }, { isTransformResponse: false}).then((res) => {
        source_typeData.value = res || []
      });

      // 因子分类
      defHttp.get({
        url: '/sys/api/getDictItems',
        params: {
          dictCode: 'product_type'
        }
      }, { isTransformResponse: false}).then((res) => {
        product_typeData.value = res || []
      });

      // 文献类型
      defHttp.get({
        url: '/sys/api/getDictItems',
        params: {
          dictCode: 'document_type'
        }
      }, { isTransformResponse: false}).then((res) => {
        document_typeData.value = res || []
      });

      // 行业
      defHttp.get({
        url: '/sys/category/childList',
        params: {
          pid: INDUSTRY
        }
      }, { isTransformResponse: false}).then((res) => {
        if (res.success) {
          industryData.value = res.result || []
        }
      });

      // 分子
      defHttp.get({
        url: '/CyFactorUnit/cyFactorUnit/list'
      }, { isTransformResponse: false}).then((res) => {
        if (res.success) {
          fzData.value = res.result.records || []
          allGasData.value = []
          fzData.value.forEach((item, index) => {
            defHttp.get({
              url: '/gas/cyGasStore/listGasName',
              params: {
                factorRealUnit: item.factorRealUnit
              }
            }, { isTransformResponse: false}).then((res) => {
              if (res.success) {
                allGasData.value[index] = res.result || []
              }
            });
          })
        }
      });

      // 分母
      defHttp.get({
        url: '/emission/factor/cyEmissionUnit/getAllUnit'
      }, { isTransformResponse: false}).then((res) => {
        if (res.success) {
          fmData.value = res.result || []
        }
      });

      // 年份
      let years = []
      for (let i = 1950; i < 2100; i++) {
        years.push(String(i))
      }
      yearData.value = years

      // 碳排因子数据库
      defHttp.get({
        url: '/sys/api/getDictItems',
        params: {
          dictCode: 'emission_factor_database'
        }
      }, { isTransformResponse: false}).then((res) => {
        emission_factor_database.value = res || []
      });

      // gwp版本
      defHttp.get({
        url: '/sys/api/getDictItems',
        params: {
          dictCode: 'emission_factor_gwp_version'
        }
      }, { isTransformResponse: false}).then((res) => {
        emission_factor_gwp_version.value = res || []
      });

      // 排放系数种类
      defHttp.get({
        url: '/sys/api/getDictItems',
        params: {
          dictCode: 'emission_factor_category'
        }
      }, { isTransformResponse: false}).then((res) => {
        emission_factor_category.value = res || []
      });
    };

    /**
     * 下拉框数据过滤
     */
    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    };

    /**
     * 返回
     */
    const onBack = () => {
      emit('back')
    };

    // 生命周期钩子
    onMounted(() => {
      getData()
    });

    // 暴露给模板的数据和方法
    return {
      columns,
      queryParam,
      fzData,
      fmData,
      yearData,
      gasData,
      industryData,
      source_typeData,
      product_typeData,
      document_typeData,
      emission_factor_database,
      emission_factor_gwp_version,
      emission_factor_category,
      allGasData,
      paddingBottom,
      onChangeIndustryId,
      computeFactorValue,
      onChangeComputerType,
      onChangeNumeratorUnitId,
      onChangeDenominatorUnitId,
      onAdd,
      onDel,
      onChangeGas,
      checkFormData,
      onSubmit,
      onSubmitEdit,
      filterOption,
      onBack,
      // Images
      img28,
      img29,
      img30
    }
  }
});
</script>

<style lang="less" scoped>

.ant-form-item {
  margin-bottom: 20px !important;
}
.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.cardBox {
  margin-top: 24px;
  overflow: hidden;
  padding: 32px 24px 12px;
  background: #FFFFFF;
  border-radius: 3px;

  .cardBox_title {
    margin-bottom: 24px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    color: #333333;
  }
}

.switchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: 8px;
  padding: 0 16px;
  width: 140px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  white-space: nowrap;

  .switchBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.addBtn {
  margin-top: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 112px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;

  .addBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.optionBox {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  .optionItem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 103px;
    height: 32px;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
  }

  .optionItem_cancel {
    background: #E7E7E7;
    color: rgba(0, 0, 0, 0.9);
  }

  .optionItem_confirm {
    background: #148958;
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
