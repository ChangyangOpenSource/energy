<template>
  <div class="">
    <div class="cardHeader">
      <img class="cardHeader_icon m_hoverCP" src="../../assets/img/img28.png" alt="" @click="onBack"/>
      <span class="m_hoverCP" @click="onBack">{{ t('carbon.message.Return') }}</span>
    </div>
    <section class="contentBox">
      <div class="content_left">
        <section class="tpyzxxBox">
          <div class="titleBox">{{ t('carbon.message.Carbon_emission_factor_information') }}</div>
          <div class="box1">
            <img class="box1_icon m_hoverCP" src="../../assets/img/img25.png" alt="" @click="onCopy()"/>
            <img class="box1_icon m_hoverCP" src="../../assets/img/img11.png" alt="" @click="onCollect()"
                 v-if="dataSource.collectStatus === '1' && dataSource.emissionFactorObject.emissionFactorDatabase !== 9"/>
            <img class="box1_icon m_hoverCP" src="../../assets/img/img12.png" alt="" @click="onCollect()"
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
            <a-table :columns="columns" :data-source="dataSource.gasList" :pagination="false" :bordered="false" row-key="id"
                     size="middle">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'factorValue'">
                  <div>{{ (Number(record.factorValue)).toFixed(4) }}</div>
                </template>
                <template v-else-if="column.dataIndex === 'theUnit'">
                  <div>{{ record.molecularUnit }}/{{ record.denominatorUnit }}</div>
                </template>
                <template v-else-if="column.dataIndex === 'gwpValue'">
                  <div class="m_ccFlex">
                    {{ t('carbon.message.GWP_value') }}
                    <a-popover placement="bottomRight">
                      <template #content>
                        <div class="popoverBox">
                          <img class="popoverBox_icon m_hoverCP" src="../../assets/img/img32.png" alt=""/>
                          <div class="popoverBox_text">
                            <div class="popoverBox_text_a"> {{ t('carbon.message.description') }}</div>
                            <div class="popoverBox_text_b"> {{ t('carbon.message.tip2') }}</div>
                          </div>
                        </div>
                      </template>
                      <a-icon type="question-circle" style="margin-left: 8px;transform: translateY(1px);"/>
                    </a-popover>
                  </div>
                </template>
              </template>
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
                <j-upload v-model:value="dataSource.emissionFactorObject.attachments" disabled :number="3"></j-upload>
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

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import yzCard from './yzCard.vue';
import { copyTextToClipboard } from '@/hooks/web/useCopyToClipboard';
// 导入API方法
import {
  getEmissionFactorInfo,
  getTopSearchFactor,
  addFactorCollect,
  deleteFactorCollect,
  getCollectFactorInfo
} from './api/tpyzDetail.api';

const { t } = useI18n();
const { createMessage } = useMessage();

// 定义 emits
const emit = defineEmits(['back']);

// 组件数据
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
  },
  {
    title: t('carbon.message.Factor_unit'),
    align: 'center',
    dataIndex: 'theUnit',
  },
  {
    align: 'center',
    dataIndex: 'gwpValue',
  }
];

const dataSource = reactive({
  emissionFactorDataObject: {},
  emissionFactorObject: {},
  gasList: [],
  collectStatus: '',
  emissionFactorDatabaseDict: '',
  productClassificationDict: '',
  categoryDict: '',
  docTypeDict: '',
  sourceTypeDict: '',
});

const topSearchFactorData = ref([]);
const isShouCang = ref(false);
const detailIndex = ref(0); // 当前详情索引
const detailKeys = ref<string[]>([]); // 当前详情所有keys
const fangLianDian = ref(true);

/**
 * 下一级
 */
const onDetail = (item: any) => {
  if (detailKeys.value[detailIndex.value] == item.id) {
    return
  }
  if (fangLianDian.value) {
    detailIndex.value = detailIndex.value + 1
    detailKeys.value.push(item.id)
    getData()
  }
};

/**
 * 返回上一级
 */
const onBack = () => {
  if (fangLianDian.value) {
    if (detailIndex.value == 0) {
      emit('back')
    } else {
      detailIndex.value = detailIndex.value - 1
      detailKeys.value.pop()
      getData()
    }
  }
};

const getData = (ShouCang?: boolean) => {
  let apiMethod;
  if (ShouCang) {
    isShouCang.value = true
    apiMethod = getCollectFactorInfo
  } else {
    apiMethod = getEmissionFactorInfo
  }

  fangLianDian.value = false

  apiMethod({
    id: detailKeys.value[detailIndex.value]
  }).then((res) => {
    if (res.success) {
      Object.assign(dataSource, res.result || {})
      if (ShouCang) {
        dataSource.collectStatus = '1'
      }
    }
  }).finally(() => {
    fangLianDian.value = true
  })

  // 热门搜索因子
  getTopSearchFactor({
    SearchNum: 4,
  }).then((res) => {
    if (res.success) {
      topSearchFactorData.value = res.result || []
    }
  })
};

const { createMessage: $message } = useMessage();

// 复制文本到剪贴板
function copyText(text: string) {
  const success = copyTextToClipboard(text);
  if (success) {
    $message.success('复制成功！');
  } else {
    $message.error('复制失败！');
  }
  return success;
}

/**
 * 复制
 */
const onCopy = () => {
  let copyMsg = `${dataSource.emissionFactorObject.name} ${dataSource.emissionFactorDataObject.factorValue} ${dataSource.emissionFactorDataObject.numeratorUnit}/${dataSource.emissionFactorDataObject.denominatorUnit}`
  copyText(copyMsg)
};

/**
 * 收藏
 */
const onCollect = () => {
  if (fangLianDian.value) {
    if (dataSource.collectStatus === '1') {
      // 取消收藏
      deleteFactorCollect({
        id: dataSource.emissionFactorObject.id,
      }).then((res) => {
        if (res.success) {
          createMessage.success(t('carbon.message.delete_collect_success'))
          if (isShouCang.value) {
            onBack()
          } else {
            getData()
          }
        }
      })
    } else {
      // 收藏
      addFactorCollect({
        id: dataSource.emissionFactorObject.id,
      }).then((res) => {
        if (res.success) {
          createMessage.success(t('carbon.message.collect_success'))
          if (isShouCang.value) {
            onBack()
          } else {
            getData()
          }
        }
      })
    }
  }
};

// 暴露方法给父组件
defineExpose({
  detailIndex,
  detailKeys,
  getData
});
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
    width: 430px;
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
  background: fade(@primary-color, 10%) !important;

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
    color: @primary-color !important;
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
    color: @primary-color !important;
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
    color: @primary-color !important;
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

:deep(.ant-upload) {
  display: none;
}
</style>
