<template>
  <div class="">
    <div class="cardHeader">
      <img class="cardHeader_icon m_hoverCP" :src="img28" alt="" @click="onBack"/>
      <span class="m_hoverCP" @click="onBack">{{ t('carbon.message.Return') }}</span>
    </div>
    <section class="contentBox">
      <div class="content_left">
        <section class="tpyzxxBox">
          <div class="titleBox">{{ t('carbon.message.Carbon_emission_factor_information') }}</div>
          <div class="box1">
            <img class="box1_icon m_hoverCP" :src="img25" alt="" @click="onCopy()"/>
            <img class="box1_icon m_hoverCP" :src="img11" alt="" @click="onCollect()"
                 v-if="dataSource.collectStatus === '1' && dataSource.emissionFactorObject.emissionFactorDatabase !== 9"/>
            <img class="box1_icon m_hoverCP" :src="img12" alt="" @click="onCollect()"
                 v-if="dataSource.collectStatus === '0' && dataSource.emissionFactorObject.emissionFactorDatabase !== 9"/>
          </div>
          <section class="box2">
            <div class="box2_tr1">
              <div class="box2_tr1_text1"> {{ dataSource.emissionFactorObject.name }}</div>
            </div>
            <div class="box2_tr2">
              <div class="box2_tr2_text1">
                <div class="box2_tr2_text1_a"> {{
                    (Number(dataSource.emissionFactorDataObject.factorValue)).toFixed(4)
                  }}
                </div>
                <div class="box2_tr2_text1_b">
                  {{
                    dataSource.emissionFactorDataObject.numeratorUnit
                  }}/{{ dataSource.emissionFactorDataObject.denominatorUnit }}
                </div>
              </div>
              <div class="box2_tr2_text2" v-if="dataSource.emissionFactorObject.type == 1">
                {{ t('carbon.message.Carbon_emission_factor_library') }}/{{ dataSource.emissionFactorDatabaseDict }}
              </div>
              <div class="box2_tr2_text2" v-if="dataSource.emissionFactorObject.type == 2">
                {{ t('carbon.message.Tissue_factor_library') }}/{{ dataSource.emissionFactorDatabaseDict }}
              </div>
            </div>
          </section>
          <section class="box3">
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Specifications_and_models') }}:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.model || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Applicable_industries') }}:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.industry || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Product_classification') }}:</div>
              <div class="box3_item_content">{{ dataSource.productClassificationDict || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Applicable_scenario') }}:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.scene || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.GWP_version') }}:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.gwpVersionDict || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Emission_factor_category') }}:</div>
              <div class="box3_item_content">{{ dataSource.categoryDict || '-' }}</div>
            </div>
          </section>

          <div class="gas_table">
            <a-table :columns="columns" :dataSource="dataSource.gasList" :pagination="false" :bordered="false" rowKey="id"
                     size="middle">
              <div slot="factorValue" slot-scope="text, record">{{ (Number(record.factorValue)).toFixed(4) }}</div>
              <div slot="theUnit" slot-scope="text, record">
                {{ record.molecularUnit }}/{{ record.denominatorUnit }}
              </div>
              <div slot="gwpValue">
                <div class="m_ccFlex">
                  {{ t('carbon.message.GWP_value') }}
                  <a-popover placement="bottomRight">
                    <template slot="content">
                      <div class="popoverBox">
                        <img class="popoverBox_icon m_hoverCP" :src="img32" alt=""/>
                        <div class="popoverBox_text">
                          <div class="popoverBox_text_a"> {{ t('carbon.message.description') }}</div>
                          <div class="popoverBox_text_b"> {{ t('carbon.message.tip2') }}</div>
                        </div>
                      </div>
                    </template>
                    <a-icon type="question-circle" style="margin-left: 8px;transform: translateY(1px);"/>
                  </a-popover>
                </div>
              </div>
            </a-table>
          </div>
        </section>

        <section class="lyxxBox">
          <div class="titleBox2">{{ t('carbon.message.Source_information') }}:</div>
          <section class="box3">
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Publishing_agency') }}</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.releaseOrg || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Release_year') }}</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.releaseYear || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Document_type') }}</div>
              <div class="box3_item_content">{{ dataSource.docTypeDict || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Source_type') }}</div>
              <div class="box3_item_content">{{ dataSource.sourceTypeDict || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Country_organization') }}</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.ownership || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Source_file') }}</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.sourceFile || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Source_URL_link') }}</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.sourceUrlLink || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">{{ t('carbon.message.Attachment') }}</div>
              <div class="box3_item_content">
                <j-upload v-model="dataSource.emissionFactorObject.attachments" disabled :number="3"></j-upload>
              </div>
            </div>
          </section>
        </section>
      </div>
      <section class="xgtjBox">
        <div class="titleBox">{{ t('carbon.message.Related_recommendation') }}</div>
        <div class="box5">
          <div class="box5_item" v-for="(item, index) in topSearchFactorData" :key="index" @click="onDetail(item)">
            <yzCard :item="item" @change="getData" :isSame="dataSource.emissionFactorObject.id == item.id"></yzCard>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import yzCard from "/@/components/common/yzCard.vue"
import img28 from '@/assets/img/img28.png'
import img11 from '@/assets/img/img11.png'
import img12 from '@/assets/img/img12.png'
import img25 from '@/assets/img/img25.png'
import img32 from '@/assets/img/img32.png'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义响应式数据
const visible = ref(false)
const dataSource = reactive({
  emissionFactorDataObject: {},
  emissionFactorObject: {},
  gasList: [],
  collectStatus: '0'
})
const topSearchFactorData = ref([])
const isShouCang = ref(false)
const detailIndex = ref(0) // 当前详情索引
const detailKeys = ref([]) // 当前详情所有keys
const fangLianDian = ref(true)

// 表格列定义
const columns = [
  {
    title: t('carbon.message.Greenhouse_gas_type'),
    align: 'center',
    dataIndex: 'gasName',
  },
  {
    title: t('carbon.message.Factor_value'),
    align: 'center',
    dataIndex: 'factorValue',
    scopedSlots: { customRender: 'factorValue' },
  },
  {
    title: t('carbon.message.Factor_unit'),
    align: 'center',
    scopedSlots: { customRender: 'theUnit' },
  },
  {
    align: 'center',
    dataIndex: 'gwpValue',
    slots: { title: 'gwpValue' },
  }
]

// 定义 emits
const emit = defineEmits(['back'])

/**
 * 下一级
 */
function onDetail(item) {
  if (detailKeys.value[detailIndex.value] == item.id) {
    return
  }
  if (fangLianDian.value) {
    detailIndex.value = detailIndex.value + 1
    detailKeys.value.push(item.id)
    getData()
  }
}

/**
 * 返回上一级
 */
function onBack() {
  if (fangLianDian.value) {
    if (detailIndex.value == 0) {
      emit('back')
    } else {
      detailIndex.value = detailIndex.value - 1
      detailKeys.value.pop()
      getData()
    }
  }
}

function showModal() {
  visible.value = true
}

function handleOk(e) {
  console.log(e)
  visible.value = false
}

async function getData(ShouCang) {
  let url = ''
  if (ShouCang) {
    isShouCang.value = true
    url = '/CyEmissionFactorCollect/cyEmissionFactorCollect/queryById'
  } else {
    url = '/emission/factor/cyEmissionFactor/listInfo'
  }

  fangLianDian.value = false

  try {
    const res = await defHttp.get({
      url: url,
      params: {
        id: detailKeys.value[detailIndex.value]
      }
    }, { isTransformResponse: false})

    if (res.success) {
      Object.assign(dataSource, res.result || {})
      if (ShouCang) {
        dataSource.collectStatus = '1'
      }
    }
  } finally {
    fangLianDian.value = true
  }

  // 热门搜索因子
  try {
    const res = await defHttp.get({
      url: '/emission/factor/cyEmissionFactor/topSearchFactor',
      params: {
        SearchNum: 4,
        token: localStorage.getItem(ACCESS_TOKEN),
      }
    },{ isTransformResponse: false})

    if (res.success) {
      topSearchFactorData.value = res.result || []
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 复制
 */
function onCopy(item, index) {
  let copyMsg = `${dataSource.emissionFactorObject.name} ${dataSource.emissionFactorDataObject.factorValue} ${dataSource.emissionFactorDataObject.numeratorUnit}/${dataSource.emissionFactorDataObject.denominatorUnit}`
  copyText(copyMsg)
}

/**
 * 复制到剪切板
 */
function copyText(text, tipMsg) {
  // 复制文本
  const element = createElement(text);
  element.select();
  element.setSelectionRange(0, element.value.length);
  document.execCommand('copy');
  element.remove();

  // 使用Vue 3的方式显示成功消息
  createMessage.success(tipMsg || t('carbon.message.copied_to_clipboard'));

  // 创建临时的输入框元素
  function createElement(text) {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const element = document.createElement('textarea');
    // 防止在ios中产生缩放效果
    element.style.fontSize = '12pt';
    // 重置盒模型
    element.style.border = '0';
    element.style.padding = '0';
    element.style.margin = '0';
    // 将元素移到屏幕外
    element.style.position = 'absolute';
    element.style[isRTL ? 'right' : 'left'] = '-9999px';
    // 移动元素到页面底部
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    element.style.top = `${yPosition}px`;
    // 设置元素只读
    element.setAttribute('readonly', '');
    element.value = text;
    document.body.appendChild(element);
    return element;
  }
}



/**
 * 收藏
 */
async function onCollect() {
  if (fangLianDian.value) {
    if (dataSource.collectStatus === '1') {
      // 取消收藏
      try {
        const res = await defHttp.delete({
          url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',
          params: {
            id: dataSource.emissionFactorObject.id,
          }
        },{ isTransformResponse: false})

        if (res.success) {
          createMessage.success(t('carbon.message.delete_collect_success'))
          if (isShouCang.value) {
            onBack()
          } else {
            getData()
          }
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      // 收藏
      try {
        const res = await defHttp.get({
          url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/add',
          params: {
            id: dataSource.emissionFactorObject.id,
          }
        },{ isTransformResponse: false})

        if (res.success) {
          createMessage.success(t('carbon.message.collect_success'))
          if (isShouCang.value) {
            onBack()
          } else {
            getData()
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}

// 生命周期钩子
onMounted(() => {
  // 如果需要初始化数据可以在这里调用 getData()
})

defineExpose({
  getData,
  detailKeys,
  detailIndex
})

</script>

<style lang="less" scoped>
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

.contentBox {
  margin-top: 24px;
  display: flex;
  gap: 24px;

  .content_left {
    flex: 1;
  }

  .tpyzxxBox {
    padding: 32px 24px;
    background: #FFFFFF;
    border-radius: 3px;
  }

  .lyxxBox {
    margin-top: 24px;
    padding: 24px;
    background: #FFFFFF;
    border-radius: 3px;
  }

  .xgtjBox {
    //box-sizing: border-box;
    width: 430px;
    //height: fit-content;
    padding: 32px 24px;
    background: #FFFFFF;
    border-radius: 3px;
  }

  .titleBox {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    color: #333333;
  }

  .titleBox2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #888888;
  }

  .titleBox3 {
    margin-top: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
  }

  .box1 {
    margin-top: 3px;
    margin-bottom: 3px;
    display: flex;
    justify-content: flex-end;
    gap: 7px;
  }

  .box1_icon {
    width: 18px;
    height: 18px;
  }
}

.box2 {
  padding: 20px;
  background: rgba(43, 164, 113, 0.1);

  .box2_tr1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .box2_tr1_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
  }

  .box2_tr1_text2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #148958;
  }

  .box2_tr2 {
    margin-top: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .box2_tr2_text1 {
    display: flex;
    align-items: flex-end;
  }

  .box2_tr2_text1_a {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 36px;
    color: #148958;
    line-height: 36px;
  }

  .box2_tr2_text1_b {
    margin-left: 13px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .box2_tr2_text2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }
}

.box3 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .box3_item {
    display: flex;
    align-items: center;

    margin-top: 24px;
    width: 49%;
  }

  .box3_item_label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .box3_item_content {
    margin-left: 12px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.gas_table {
  margin-top: 24px;
}

.box4 {
  .box4_item {
    display: flex;
    align-items: flex-start;
    margin-top: 16px;
  }

  .box4_item_label {
    width: 200px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .box4_item_content {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.box5 {
  .box5_item {
    margin-top: 24px;
  }
}

.box6 {
  margin-bottom: 27px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 34px;
  background: rgba(43, 164, 113, 0.1);

  .box6_left {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
  }

  .box6_right {
    display: flex;
    align-items: flex-end;
  }

  .box6_right_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 36px;
    color: #148958;
    line-height: 36px;
  }

  .box6_right_text2 {
    margin-left: 13px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.popoverBox {
  display: flex;
  align-items: flex-start;
}

.popoverBox_icon {
  width: 20px;
  height: 20px;
}

.popoverBox_text {
  margin-left: 8px;
}

.popoverBox_text_a {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
}

.popoverBox_text_b {
  margin-top: 8px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

/deep/ .ant-upload {
  display: none;
}
</style>
