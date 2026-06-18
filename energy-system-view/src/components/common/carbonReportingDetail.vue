<template>
  <div class="centers">
    <div class="cardHeader">
      <div>
        <img
            @click="onBack"
            class="cardHeader_icon m_hoverCP"
            src="../../assets/img/img28.png"
            alt=""
        />
        &nbsp;
        <span v-if="!isTemplate">
          <span style="color: #888888;">
            {{ t('carbon.message.Accounting_entity') + ':' }}
          </span>
          &nbsp;
          <span style="color: #333333">
            {{ newForm.targetName }}
          </span>
          &nbsp;
          &nbsp;
          <span style="color: #888888;">
            {{ t('carbon.message.Accounting_date') + ':' }}
          </span>
          &nbsp;
          <span style="color: #333333">
            {{ newForm.year }}
          </span>
        </span>
        <span v-else>
          <span>
            <span style="color: #888888;">
              {{ t('carbon.message.Template_name') + ':' }}
            </span>
            &nbsp;
            <span style="color: #333333">
              {{ newForm.name }}
            </span>
            &nbsp;
            &nbsp;
            <span style="color: #888888;">
              {{ t('carbon.message.Industry') + ':' }}
            </span>
            &nbsp;
            <span style="color: #333333">
              {{ newForm.profession_dictText }}
            </span>
          </span>
        </span>
      </div>

      <div v-if="emissionSourceRowKeys.length > 0">
        {{ t('carbon.message.Selected') }} <a style="font-weight: 600">{{ emissionSourceRowKeys.length }}</a>
        <a style="margin-left: 18px" @click="onClearEmissionSourceRowKeys">{{ t('carbon.message.clear') }}</a>
        <a style="margin-left: 18px" @click="deleteBatch">{{ t('carbon.message.Delete') }}</a>
        <a style="margin-left: 18px" @click="onInviteUserVisible(emissionSourceRowKeys)" v-if="!isTemplate">
          {{ t('carbon.message.Inviter_to_fill_in') }}
        </a>
      </div>
      <div
          v-if="!isTemplate"
          style="float: right">
        <a-button
            @click="saveAstemplate"
            type="primary"
            style="margin-right: 5px">
          {{ t('carbon.message.save_as_template') }}
        </a-button>
        <a-button
            @click="onRapidFilling"
            type="primary"
            :disabled="newForm.status == 1">
          {{ t('carbon.message.fill_in_quickly') }}
        </a-button>
      </div>
    </div>
    <div class="contentBox" :class="{ paddings: !isTemplate }">
      <!-- 左侧树形 -->
      <div class="leftTree" v-show="isAss">
        <div class="select">
          <a-select
              style="width: 240px"
              v-model:value="form.codesName"
              :disabled="queryId != '' || newForm.status == 1"
              @change="updateProvinceHandler"
          >
            <a-select-option
                v-for="(province, index) in provinceData"
                :key="index"
            >
              {{ province.title }}
            </a-select-option>
          </a-select>
        </div>
        <div class="tree-container">
          <a-anchor
              v-if="treeData && treeData.length > 0"
              :getContainer="getContainer"
              :affix="false"
          >
            <a-tree :tree-data="treeData" :selectedKeys="selectedKeys"
                    :expandedKeys="iExpandedKeys"
                    @expand="onExpand"
                    @select="handleSelect">
              <template #title="{ title, key, leaf }">
                <a-tooltip v-if="title.length > 14" :title="title" :class="{ treeParent: !leaf }">
                  <a-anchor-link :href="key">
                    {{ getContent(title, 14) }}
                  </a-anchor-link>
                </a-tooltip>
                <a-anchor-link v-else :href="key" :title="title" :class="{ treeParent: !leaf }">{{title}}</a-anchor-link>
              </template>
            </a-tree>
          </a-anchor>
        </div>
        <!-- 展开 -->
        <div class="sizeStyle m_hoverCP" @click="onSizeLeft(false)">
          <img src="../../assets/carbon/img4.png" alt=""/>
        </div>
      </div>
      <div id="risgtUd" class="rightTree">
        <a-spin :spinning="spinning">
          <div class="collapse-tpyz">
            <a-collapse v-model:activeKey="activeKey">
              <a-collapse-panel
                  style="margin-bottom: 20px"
                  v-for="(item, idex) in collapseData"
                  :key="item.id"
                  :header="item.name"
                  :id="item.id"
              >
                <div
                    class="collaose-center"
                    v-for="(value, idese) in item.children"
                    :key="idese"
                    :id="value.id"
                >
                  <div class="collaose-title">
                    <div>
                      <img src="../../assets/carbon/img1.png" alt=""/>
                      {{ value.name }}
                    </div>
                    <div>
                      <a-button
                          type="primary"
                          preIcon="ant-design:plus-outlined"
                          @click="onVsisible(idex, idese, value.emissionSourceList)"
                          :disabled="newForm.status == 1"
                      >
                        {{ t('carbon.message.Add_emission_sources') }}
                      </a-button>
                    </div>
                  </div>
                  <div class="collapse-table">
                    <a-table
                        :scroll="{ x: true }"
                        :columns="!isTemplate ? columns : templateColumns"
                        :data-source="value.emissionSourceList"
                        rowKey="id"
                        :row-selection="{ selectedRowKeys: emissionSourceRowKeys, onChange: emissionSourceSelected }"
                        :pagination="false"
                        :rowClassName="getRowClassName"
                    >
                      <template #type="{ text }">
                        {{ t(text == 2 ? 'carbon.message.reduce_harmful_emissions' : "carbon.message.Emission") }}
                      </template>

                      <template #carbonMolecule="{ record }">
                        <div class="editable-row-operations">
                          {{ record.carbonMolecule }}/{{ record.carbonDenomintor }}
                        </div>
                      </template>

                      <template #dataVoucher="{ text, record }">
                        <span v-if="!text" style="font-size: 12px;font-style: italic;">{{ t('No files') }}</span>
                        <a-button
                            v-else
                            class="collapse-tian"
                            @click="downloadFile(text)">
                          {{ t('carbon.message.Download') }}
                        </a-button>
                      </template>

                      <template #operation="{ record }">
                        <div style="display: flex; align-items: center;justify-content: center">
                          <a  class="collapse-tian" @click="() => onBasicCheckDetailEditVisible(record)"
                             :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine">
                            {{ t("carbon.message.Edit") }}
                          </a>
                          <a-divider type="vertical"/>
                          <a-popconfirm
                              :title="t('carbon.message.Confirm_delete')"
                              :cancelText="t('carbon.message.Cancel')"
                              :okText="t('carbon.message.Confirm')"
                              :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine"
                              @confirm="() => saveDelte(valueIndex, idese, record)"
                          >
                            <a class="collapse-tian" :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine">
                              {{ t('carbon.message.Delete') }}
                            </a>
                          </a-popconfirm>

                          <a-divider type="vertical" v-if="!isTemplate"/>
                          <j-upload
                              v-if="!record.dataVoucher && !isTemplate"
                              @change="loadTreeRootTree()"
                              :text="t('carbon.message.upload_attachment')"
                              :action="uploadAction + '?id=' + record.id + '&checkId=' + newForm.checkId"
                              :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine"
                              :buttonVisible="false"
                              :showUploadList="false"
                              :number="1"></j-upload>
                          <a class="collapse-tian" v-else-if="!isTemplate" @click="onCancelDataVoucher(record.id, null)"
                             :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine">
                            {{ t('carbon.message.delete_attachment') }}
                          </a>
                        </div>
                      </template>

                      <template #data="{ record }">
                        <a-input-number
                            :id="record.id"
                            v-model:value="record.data"
                            :min="0"
                            :precision="2"
                            :placeholder="t('carbon.message.Please_enter')"
                            :disabled="newForm.status == 1 || record.informantUserId != null"
                            @blur="() => saveChange(record)"
                        />
                        <a-tooltip>
                          <template #title>
                            {{ record.dataUnitText }}
                          </template>
                          <span :title="record.dataUnitText">{{ getContent(record.dataUnitText, 4) }}</span>
                        </a-tooltip>
                      </template>

                      <template #informant="{ record }">
                        <a class="collapse-tian" :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine"
                           v-if="!record.informantUserId" @click="onInviteUserVisible([record.id])">
                          {{ t("carbon.message.Inviter_to_fill_in") }}
                        </a>
                        <span v-else>
                          <div class="information">
                            <span>
                              {{ record.informantUserName }}
                            </span>
                            <CloseOutlined @click="onCancelInvite(record.id)"
                                           :disabled="(newForm.status == 1 || record.informantUserId != null) ? true : undefine"/>
                          </div>
                        </span>
                      </template>
                    </a-table>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-spin>
      </div>
      <div class="sizeStyle1 m_hoverCP" @click="onSizeLeft(true)" v-if="!isAss">
        <img src="../../assets/carbon/img5.png" alt=""/>
      </div>
    </div>
    <!-- 底部数据 -->
    <div class="bottom m_contentBox" v-if="!isTemplate">
      <div class="flex2">
        <div class="bottom-flex">
          <div class="text">{{ t('carbon.message.total_release') }}：</div>
          <div class="text1">{{ totalData }}</div>
          <div class="text2">tCO₂e</div>
        </div>
        <div class="bottom-flex">
          <div class="text3">{{ t('carbon.message.total_energy_carbon_emission') }}：</div>
          <div class="text4">{{ increaseTotalData }}</div>
          <div class="text5">tCO₂e</div>
        </div>
        <div class="bottom-flex">
          <div class="text3">{{ t('carbon.message.reduce_harmful_emissions') }}：</div>
          <div class="text4">{{ decreaseTotalData }}</div>
          <div class="text5">tCO₂e</div>
        </div>
      </div>

      <div class="flex1">
        <a-button type="dashed" @click="onDetails" class="wigthsP">
          {{ t('carbon.message.details_preview') }}
        </a-button>
        <a-button
            type="primary"
            @click="onAccounting"
            class="wigthsP"
            :disabled="newForm.status == 1"
        >
          {{ t('carbon.message.data_accounting') }}
        </a-button>
      </div>
    </div>

    <select-org-emission-source :isTemplate="isTemplate" ref="selectOrgEmissionSourceRef" @ok="addFromLibraryHandler"
                                @close="onCloseBasicCheckDetailEditVisible"></select-org-emission-source>

    <section class="m_popupBox" v-if="kanbanIsAss">
      <componentsKanban
          ref="kanban"
          :examineId="newForm.checkId"
          :twoType="twoType"
          @onKanbanBack="onKanbanBack"
      ></componentsKanban>
    </section>

    <section class="m_popupBox" v-if="isShowDetailPopup">
      <rapidFilling
          ref="rapidFillingRef"
          :examineId="newForm.checkId"
          @onRapoidBack="onRapoidBack"
      ></rapidFilling>
    </section>
    <templateModel ref="templateModelRef"></templateModel>

    <basicCheckDetailEditDrawer
        :isTemplate="isTemplate"
        ref="basicCheckDetailEditDrawerRef"
        @onCloseBasicCheckDetailEditVisible="onCloseBasicCheckDetailEditVisible"
    />

    <UserSelectByDepModal :isRadioSelection="true" labelKey="realname" @register="regModal" @getSelectResult="selectedUserOk"></UserSelectByDepModal>

<!--    <JSelectUserByDept
        ref="userSelectModal"
        :selectOne="true"
        @ok="selectedUserOk"
        :modal-width="1250"/>-->
  </div>
</template>

<script setup lang="ts">
import { CloseOutlined } from '@ant-design/icons-vue';
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';
import {
  getDetailTree,
  loadTreeRoot,
  updateProvince,
  deleteCheckDetail,
  submitCheck,
  queryCheckById,
  addFromLibrary,
  updateDetailData,
  updateInformant,
  uploadDataVoucher,
  getFileAccessHttpUrl,
  getUploadAction
} from './api/carbonReportingDetail.api';
import SelectOrgEmissionSource from './SelectOrgEmissionSource.vue'
import templateModel from './templateModel.vue'
import rapidFilling from './rapidFilling.vue';
import componentsKanban from './componentsKanban.vue';
import JUpload from '@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
import basicCheckDetailEditDrawer from './basicCheckDetailEditDrawer.vue';
import UserSelectByDepModal from "@/components/Form/src/jeecg/components/modal/UserSelectByDepModal.vue";
import {useModal} from "@/components/Modal";


// Props
const props = defineProps({
  queryId: {
    type: String,
    default: ''
  },
  newForm: {
    type: Object as () => any,
    default: () => ({})
  },
  isTemplate: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['back']);

// Hooks
const { createMessage } = useMessage();
const { t } = useI18n();
const userStore = useUserStore();

const [regModal, { openModal }] = useModal();
// refs
const selectOrgEmissionSourceRef = ref<any>(null);
const basicCheckDetailEditDrawerRef = ref<any>(null);
const userSelectModal = ref<any>(null);
const rapidFillingRef = ref<any>(null);
const kanban = ref<any>(null);
const templateModelRef = ref<any>(null);

// reactive data - 直接定义各个属性而不是包装在state对象中
const isAss = ref(true);
const uploadAction = ref(getUploadAction());
const detailIds = ref([] as string[]);
const spinning = ref(false);
const activeKey = ref([] as string[]);
const twoType = ref(0);
const kanbanIsAss = ref(false);
const monthFormat = ref('YYYY');
const isShowDetailPopup = ref(false);
const collapseData = ref([] as any[]);
const valueChildrenIndex = ref(0);
const valueIndex = ref(0);
const treeData = ref([] as any[]);
const selectedRowKeys = ref([] as string[]);
const provinceData = ref([] as any[]);

const form = reactive({
  name: '',
  targetId: undefined,
  codes: undefined,
  codesName: undefined,
  profession: undefined,
  codeId: undefined,
  year: undefined
});

const FromCheck = reactive({
  standardName: '',
  profession: undefined
});

const emissionSourceRowKeys = ref([] as string[]);
//排放map
const increaseDataMap = ref(new Map<string, string>());
//减排map
const decreaseDataMap = ref(new Map<string, string>());
//排放值
const increaseTotalData = ref(0);
//减排值
const decreaseTotalData = ref(0);
//排放值
const totalData = ref(0);
const selectedKeys = ref([] as string[]);
const iExpandedKeys = ref([] as string[]);

// computed properties
const userInfo = computed(() => userStore.getUserInfo || {});

const columns = computed(() => [
  {
    title: t('carbon.message.Emission_source'),
    dataIndex: 'emissionSourceName',
    align: 'center'
  },
  {
    title: t('carbon.message.facilities_activities'),
    dataIndex: 'activitieName',
    align: 'center'
  },
  {
    title: t('carbon.message.Emission_type'),
    dataIndex: 'type',
    align: 'center',
    slots: { customRender: 'type' }
  },
  {
    title: `CO₂e${t('carbon.message.Emission_factor_value')}`,
    dataIndex: 'carbonData',
    align: 'center',
    customRender: ({ record }: { record: any }) => {
      return `${record.carbonData}/${record.carbonMolecule}`;
    }
  },
  {
    title: t('carbon.message.Active_data'),
    dataIndex: 'data',
    align: 'center',
    slots: { customRender: 'data' }
  },
  {
    title: t('carbon.message.Attachment'),
    align: 'center',
    dataIndex: 'dataVoucher',
    slots: { customRender: 'dataVoucher' }
  },
  {
    title: t('carbon.message.Informant'),
    align: 'center',
    slots: { customRender: 'informant' }
  },
  {
    title: t('carbon.message.Handle'),
    align: 'center',
    fixed: 'right',
    width: 200,
    slots: { customRender: 'operation' }
  },
]);

const templateColumns = computed(() => [
  {
    title: t('carbon.message.Emission_source'),
    dataIndex: 'emissionSourceName',
    align: 'center'
  },
  {
    title: t('carbon.message.facilities_activities'),
    dataIndex: 'activitieName',
    align: 'center'
  },
  {
    title: t('carbon.message.Emission_type'),
    dataIndex: 'type',
    align: 'center',
    slots: { customRender: 'type' }
  },
  {
    title: `CO₂e${t('carbon.message.Emission_factor_value')}`,
    dataIndex: 'carbonData',
    align: 'center',
    customRender: ({ record }: { record: any }) => {
      return `${record.carbonData}/${record.carbonMolecule}`;
    }
  },
  {
    title: t('carbon.message.Handle'),
    align: 'center',
    fixed: 'right',
    width: 200,
    slots: { customRender: 'operation' }
  },
]);

// methods
const onSizeLeft = (value: boolean) => {
  isAss.value = value;
};

const getContent = (content: string, size: number) => {
  //超过指定字数就截取
  if (content.length > size) {
    return content.substring(0, size) + "...";
  }
  return content;
};

const getContainer = () => {
  return document.getElementById('risgtUd');
};

const onRapoidBack = () => {
  isShowDetailPopup.value = false;
  getDetailTreeData();
};

const onKanbanBack = () => {
  queryCheckById({ id: props.newForm.checkId }).then((res) => {
    if (res.success) {
      props.newForm.status = res.result.status;
    }
  });

  kanbanIsAss.value = false;
};

// 数据核算
const onAccounting = () => {
  let hasEmptyData = false;

  collapseData.value.forEach((item) => {
    item.children.forEach((child: any) => {
      if (child.emissionSourceList) {
        child.emissionSourceList.forEach((emissionSource: any) => {
          if (emissionSource.data == null) {
            hasEmptyData = true;
            emissionSource.isRed = true;

            if (!activeKey.value.includes(emissionSource.parentStandardId)) {
              activeKey.value.push(emissionSource.parentStandardId);
            }

            nextTick(() => {
              const element = document.getElementById(emissionSource.id);
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            });
          }
        });
      }
    });
  });

  if (hasEmptyData) {
    createMessage.error('请填写数据！');
    return;
  }

  submitCheck({ id: props.newForm.checkId }).then((res) => {
    if (res.success) {
      twoType.value = 2;
      kanbanIsAss.value = true;
    } else {
      createMessage.error(res.message);
    }
  });
};

// 详情浏览
const onDetails = () => {
  kanbanIsAss.value = true;
  twoType.value = 1;
};

// 打开编辑弹窗
const onBasicCheckDetailEditVisible = (value: any) => {
  basicCheckDetailEditDrawerRef.value?.edit(value);
};

const onCloseBasicCheckDetailEditVisible = () => {
  getDetailTreeData();
};

/**
 * 删除
 */
const saveDelte = (index: number, isxw: number, value: any) => {
  deleteCheckDetail({
    checkId: props.newForm.checkId,
    ids: value.id
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.delete_success'));
      getDetailTreeData();
    }
  });
};

/**
 * 批量删除
 */
const deleteBatch = () => {
  deleteCheckDetail({
    checkId: props.newForm.checkId,
    ids: emissionSourceRowKeys.value.join(',')
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.delete_success'));
      emissionSourceRowKeys.value = [];
      getDetailTreeData();
    }
  });
};

/**
 * 首次创建只获取分类详情-----填报
 */
const getDetailTreeData = (e?: any) => {
  getDetailTree({
    checkId: props.newForm.checkId,
    standardId: e ? e.key : form.codeId
  }).then((res) => {
    if (res.success) {
      initCalculateData();
      collapseData.value = res.result || [];

      collapseData.value.forEach((item: any) => {
        activeKey.value.push(item.id);

        if (item.children) {
          item.children.forEach((child: any) => {
            if (child.emissionSourceList) {
              child.emissionSourceList.forEach((emissionSource: any) => {
                calculateData(emissionSource);
              });
            }
          });
        }
      });

      calculateTotal();
    }
  }).finally(() => {
    spinning.value = false;
  });
};

/**
 * 核算标准树形结构
 */
const loadTreeRootTree = (e?: number) => {
  loadTreeRoot({
    pcode: e !== undefined && provinceData.value[e] ? provinceData.value[e].code : form.codes,
    async: false
  }).then((res) => {
    if (res.success) {
      treeData.value = res.result || [];
      iExpandedKeys.value = treeData.value.map((item: any) => item.key);
      getDetailTreeData();
    }
  });
};

// 切换标准
const updateProvinceHandler = (e: number) => {
  updateProvince(props.isTemplate, {
    id: props.newForm.checkId,
    checkTargetId: form.targetId,
    standardId: provinceData.value[e].key,
    year: form.year,
  }).then((res) => {
    if (res.success) {
      props.newForm.codesName = provinceData.value[e].title;
      form.codes = provinceData.value[e].code;
      form.codeId = provinceData.value[e].key;
      form.codesName = provinceData.value[e].title;
      loadTreeRootTree(e);
    } else {
      form.codesName = props.newForm.codesName;
      createMessage.error(res.message);
    }
  });
};

/**
 * 核算标准
 */
const loadTreeRootData = (e: number) => {
  loadTreeRoot({
    pcode: 'A01',
    async: true
  }).then((res) => {
    if (res.success) {
      provinceData.value = res.result || [];
      if (e == 1) {
        provinceData.value.forEach((item, index) => {
          if (item.key == form.codeId) {
            form.codes = item.code;
            form.codeId = item.key;
            form.codesName = item.title;
            loadTreeRootTree();
          }
        });
      } else {
        form.codes = provinceData.value[0]?.code;
        form.codeId = provinceData.value[0]?.key;
        form.codesName = provinceData.value[0]?.title;
        loadTreeRootTree();
      }
    }
  });
};

/**
 * 保存设备
 */
const addFromLibraryHandler = (emissionSourceIdList: string[], emissionSourceList: any[]) => {
  const params = [];

  if (emissionSourceList && emissionSourceList.length > 0) {
    params.push(...emissionSourceList.map((item) => ({
      checkId: props.newForm.checkId,
      standardId: collapseData.value[valueIndex.value].children[valueChildrenIndex.value].id,
      parentStandardId: collapseData.value[valueIndex.value].id,
      emissionSourceId: item.id,
      emissionSourceName: item.name,
      activitieId: item.activitieId,
      activitieName: item.activitieId_dictText,
      ratio: item.ratio,
      carbonDataId: item.carbonDataId,
      carbonData: item.carbonData,
      type: item.type,
      dataUnit: item.dataUnit,
      dataUnitText: item.dataUnitText,
      carbonMolecule: item.carbonMolecule,
      carbonDenomintor: item.carbonDenomintor
    })));
  }

  addFromLibrary({
    checkId: props.newForm.checkId,
    standardId: collapseData.value[valueIndex.value].children[valueChildrenIndex.value].id,
    emissionSourceList: params,
    emissionSourceIdList: emissionSourceIdList,
    standardDetailId: collapseData.value[valueIndex.value].children[valueChildrenIndex.value].id
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      getDetailTreeData();
    } else {
      createMessage.error(res.message);
    }
  });
};

/**
 * 活动数据添加
 */
const saveChange = (value: any) => {
  if (value.data != null) {
    value.isRed = false;
  } else {
    value.isRed = true;
  }
  calculateData(value);
  calculateTotal();

  updateDetailData({
    data: value.data,
    checkId: props.newForm.checkId,
    id: value.id
  });
};

const initCalculateData = () => {
  increaseDataMap.value = new Map();
  decreaseDataMap.value = new Map();
};

const calculateData = (value: any) => {
  let cost = 0;
  try {
    cost = value.data * value.carbonData * value.ratio;
    if (value.carbonMolecule == 'gCO2') {
      cost = cost / 1000000;
    } else if (value.carbonMolecule == 'kgCO2') {
      cost = cost / 1000;
    }
    cost = parseFloat(cost.toFixed(4));
  } catch (e) {
    console.error(e);
  }

  if (value.type == 1) {
    increaseDataMap.value.set(value.id, cost.toString());
  } else {
    decreaseDataMap.value.set(value.id, cost.toString());
  }
};

const calculateTotal = () => {
  let increaseTotalDataValue = 0;
  let decreaseTotalDataValue = 0;

  increaseDataMap.value.forEach((value) => {
    increaseTotalDataValue += parseFloat(value);
  });

  decreaseDataMap.value.forEach((value) => {
    decreaseTotalDataValue += parseFloat(value);
  });

  increaseTotalData.value = parseFloat(increaseTotalDataValue.toFixed(4));
  decreaseTotalData.value = parseFloat(decreaseTotalDataValue.toFixed(4));
  totalData.value = parseFloat((increaseTotalDataValue - decreaseTotalDataValue).toFixed(4));
};

const onVsisible = (index: number, idexs: number, children: any[]) => {
  valueIndex.value = index;
  valueChildrenIndex.value = idexs;

  const values = children && children.length > 0
      ? children.map(item => item.emissionSourceId)
      : [];

  if (selectOrgEmissionSourceRef.value) {
    selectOrgEmissionSourceRef.value.selectedRowKeys = values;
    const from = {
      checkId: props.newForm.checkId,
      standardId: collapseData.value[valueIndex.value].children[valueChildrenIndex.value].id,
      parentStandardId: collapseData.value[valueIndex.value].id
    };
    selectOrgEmissionSourceRef.value.show(from);
  }
};

const onBack = () => {
  emit('back');
};

// 快速填表
const onRapidFilling = () => {
  isShowDetailPopup.value = true;
  nextTick(() => {
    if (rapidFillingRef.value) {
      rapidFillingRef.value.changeCheckTemplateId(props.newForm.checkId);
    }
  });
};

const saveAstemplate = () => {
  if (templateModelRef.value) {
    templateModelRef.value.title = t('carbon.message.save_as_template');
    const from = {
      checkId: props.newForm.checkId,
      standardId: props.newForm.standardId,
    };
    templateModelRef.value.edit(from);
  }
};

const onInviteUserVisible = (detailId: string[]) => {
  detailIds.value = detailId;
  openModal(true, {
    isUpdate: false,
  });
};

const selectedUserOk = (options, values) => {
  if (options.length>0){
    console.log("options:", options)
    console.log("values:", values)
    // 邀请填报
    updateInformant({
      checkId: props.newForm.checkId,
      detailIds: detailIds.value,
      informantUserId: options[0].value,
      informantUserName: options[0].label
    }).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.operation_success'));
        getDetailTreeData();
      } else {
        createMessage.error(res.message);
      }
    });
  }
};

const onCancelInvite = (informantDetailId: string) => {
  updateInformant({
    checkId: props.newForm.checkId,
    detailIds: [informantDetailId],
    informantUserId: null,
    informantUserName: null
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      getDetailTreeData();
    } else {
      createMessage.error(res.message);
    }
  });
};

const onCancelDataVoucher = (detailId: string, savePath: string | null) => {
  uploadDataVoucher({
    checkId: props.newForm.checkId,
    id: detailId,
    savePath: savePath
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      getDetailTreeData();
    } else {
      createMessage.error(res.message);
    }
  });
};

/* 文件下载 */
const downloadFile = (text: string) => {
  if (!text) {
    createMessage.warning('未知的文件');
    return;
  }

  let fileName = text;
  if (text.indexOf(',') > 0) {
    fileName = text.substring(0, text.indexOf(','));
  }

  const url = getFileAccessHttpUrl(fileName);
  window.open(url);
};

const emissionSourceSelected = (selectedRowKeys: string[]) => {
  emissionSourceRowKeys.value = selectedRowKeys;
};

const onClearEmissionSourceRowKeys = () => {
  emissionSourceRowKeys.value = [];
};

const getRowClassName = (record: any) => {
  if (record.isRed) {
    return "active-row";
  }
  return "";
};

// 处理部门选择事件
const handleSelect = (selectedKeys: string[]) => {
  if (selectedKeys.length > 0) {
    treeData.value.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach((child: any) => {
          if (child.key === selectedKeys[0]) {
            if (!activeKey.value.includes(parent.key)) {
              activeKey.value.push(parent.key);
            }
          }
        });
      }

      const element = document.getElementById(selectedKeys[0]);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }

  selectedKeys.value = selectedKeys;
};

const onExpand = (expandedKeys: string[]) => {
  iExpandedKeys.value = expandedKeys;
};

// lifecycle
onMounted(() => {
  spinning.value = true;
  form.codeId = props.newForm.standardId;
  loadTreeRootData(1);
});

// Expose methods to template
defineExpose({
  selectOrgEmissionSourceRef,
  basicCheckDetailEditDrawerRef,
  userSelectModal,
  rapidFillingRef,
  kanban,
  templateModelRef,
  updateProvince: updateProvinceHandler,
  loadTreeRoot: loadTreeRootData,
  getDetailTree: getDetailTreeData,
  loadTreeRootTree,
  addFromLibrary: addFromLibraryHandler,
  saveDelte
});
</script>

<style lang="less">
.table-page-tpyzd {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }

      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }
}

.collapse-tpyz {
  .ant-collapse {
    border: none !important;
    border-radius: 0 !important;
  }

  .ant-collapse-item {
    border: none !important;
  }

  .ant-collapse-content {
    background: #f5f7f6 !important;
  }

  .ant-collapse-content-box {
    padding: 24px 0 24px 48px !important;
  }
}
</style>

<style lang="less" scoped>
.posts {
  position: absolute;
  left: 300px;
  top: 0;
  z-index: 9;
  width: calc(100% - 300px);
}

.wigthsP {
  width: 94px;
  height: 40px;
}

.bottom {
  padding: 0px 24px;
  width: 100%;
  background-color: #FFFFFF;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e7e7e7;

  .bottom-flex {
    display: flex;
    align-items: baseline;
  }

  .text {
    font-weight: 400;
    font-size: 18px;
    color: #333333;
  }

  .text1 {
    font-weight: 500;
    font-size: 32px;
    color: @primary-color !important;
    margin-right: 14px;
  }

  .text2 {
    font-weight: 400;
    font-size: 22px;
    color: @primary-color !important;
  }

  .text3 {
    font-weight: 400;
    font-size: 16px;
    color: #333333;
  }

  .text4 {
    font-weight: 500;
    margin-right: 14px;
    font-size: 18px;
    color: #333333;
  }

  .text5 {
    font-weight: 400;
    font-size: 16px;
    color: #333333;
  }
}

/deep/ .ant-drawer-wrapper-body {
  padding: 24px 0 56px 0 !important;
}

.flex1 {
  display: flex;
  align-items: center;
  gap: 24px;
}

.flex2 {
  display: flex;
  align-items: baseline;
  gap: 54px;
}

.marbot {
  margin-bottom: 24px;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.centers {
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.contentBox {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;

  &.paddings {
    //padding-bottom: 104px; // 原来的80px + 底部高度24px
  }
}

.collaose-center {
  margin-bottom: 24px;

  .collaose-title {
    padding: 0px 10px;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 14px;

    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }

  .collapse-table {
    margin-bottom: 14px;
  }

  .collapse-tian {
    border-radius: 3px 3px 3px 3px;
    color: @primary-color !important;
    padding: 2px 8px;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 14px;
    }
  }
}

.xinzeng {
  border-radius: 3px 3px 3px 3px;
  border: 1px solid @primary-color !important;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color !important;
  padding: 5px 16px;
  display: flex;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
  }
}

.img {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.top {
  border-radius: 3px 3px 3px 3px;
  padding: 12px 24px;
}

.rightTree {
  overflow-y: auto;
  position: relative;
  flex: 1;
  padding: 0 24px;
}

.leftTree {
  position: relative;
  border-right: 1px solid #e7e7e7;
  width: 21%;
  background: #fff;
  padding: 0px 25px;
  display: flex;
  flex-direction: column;

  .select {
    margin-bottom: 24px;
    flex-shrink: 0;
  }

  .tree-container {
    flex: 1;
    overflow-y: auto;
  }

  /deep/ .ant-dropdown-trigger {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
}

.cardHeader {
  width: 100%;
  height: 8%;
  background-color: #FFFFFF;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.information {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    transform: translateY(2px);
  }
}

/deep/ .ant-table table {
  width: 100%;
  text-align: left;
  border-radius: 4px 4px 0 0;
  border-collapse: collapse;
  border-spacing: 0;
}

::v-deep .active-row {
  border: 2px solid red !important;
}

::v-deep .ant-anchor-wrapper {
  max-height: 85% !important;
}

/deep/ .ant-input-number-handler-wrap {
  display: none;
}

/deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  font-weight: bolder;
  font-size: 16px;
}

/deep/ .ant-collapse-content-box {
  background: #FFFFFF;
}

// 或者完全隐藏所有连接线
/deep/ .ant-anchor-ink {
  &::before,
  &::after {
    display: none;
  }
}

/deep/ .ant-anchor-link {
  padding: 7px 0 7px 0px;
}

/deep/ .ant-tree li ul {
  padding: 0 0 0 0px;
}

.treeParent {
  font-weight: bold;
}

.sizeStyle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: -16px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
  }
}

.sizeStyle1 {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 0px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
  }
}
</style>
