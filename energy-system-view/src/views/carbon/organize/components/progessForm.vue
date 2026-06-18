<!-- progessForm.vue -->
<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-table
          ref="tableRef"
          size="middle"
          :scroll="{x:true}"
          rowKey="id"
          :columns="columns"
          :data-source="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">

        <template #htmlSlot="{ text }">
          <div v-html="text"></div>
        </template>

        <template #imgSlot="{ text, record }">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>

        <template #fileSlot="{ text }">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
              v-else
              :ghost="true"
              type="primary"
              icon="download"
              size="small"
              @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <template #carbonData="{ record }">
          {{ record.carbonData }}  {{ record.carbonMolecule }}/{{ record.carbonDenomintor }}
        </template>

        <template #targetName="{ record }">
          {{ record.targetName }} | {{ record.year }}
        </template>

        <template #statusSlot="{ record }">
          <div style="background-color: #00A0FF; color: white; border-radius: 12px;" v-if="record.status == 1">
            {{ $t('message.Pending_processing') }}
          </div>
          <div style="background-color: #008F4D; color: white; border-radius: 12px" v-else>
            {{ $t('message.Already_filled_in') }}
          </div>
        </template>

        <template #dataSlot="{ record }">
          <div v-if="record.status == 1">
            <a-input v-model:value="record.data" style="width: 60px; text-align: center"></a-input> {{ record.dataUnitText }}
          </div>
          <div v-else>
            <a-input v-model:value="record.data" style="width: 60px; text-align: center" disabled></a-input> {{ record.dataUnitText }}
          </div>
        </template>

        <template #datavoucherSlot="{ record }">
          <j-upload v-model:value="record.dataVoucher" :number="3" style="max-width: 100px" :disabled="true"></j-upload>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <div style="display: flex; align-items: center; justify-content: center">
              <j-upload
                  v-if="record.status == 1"
                  v-model:value="record.dataVoucher"
                  :buttonVisible="false"
                  :showUploadList="false"
                  :number="1"
                  style="max-width: 100px">
              </j-upload>
              <a-divider v-if="record.status == 1" type="vertical" />
              <a v-if="record.status == 1" @click="toEdit(record)">{{ $t('message.submit') }}</a>
              <a v-else @click="openEditModel(record)">{{ $t('message.modify') }}</a>
            </div>
          </template>
        </template>
      </a-table>
    </j-form-container>
  </a-spin>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
// 导入API方法
import { getProcessList, addProcessData, editProcessData } from './progessForm.api';

const { t } = useI18n();
const { createMessage } = useMessage();

// Props
const props = defineProps({
  // 表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
});

// Refs
const tableRef = ref();
const emit = defineEmits(['ok']);

// Reactive data
const model = reactive({});
const confirmLoading = ref(false);
const loading = ref(false);
const dataSource = ref([]);


const columns = [
  {
    title: t('carbon.message.Scope_classification'),
    align: "center",
    dataIndex: 'standardId_dictText'
  },
  {
    title: t('carbon.message.Emission_source'),
    align: "center",
    dataIndex: 'emissionSourceName'
  },
  {
    title: t('carbon.message.Emission_factor_values'),
    align: "center",
    dataIndex: 'carbonData',
  },
  {
    title: t('carbon.message.activity/facilities'),
    align: "center",
    dataIndex: 'activitieId_dictText'
  },
  {
    title: t('carbon.message.Inviter'),
    align: "center",
    dataIndex: 'inviteUserId_dictText'
  },
  {
    title: t('carbon.message.Invitation_time'),
    align: "center",
    dataIndex: 'inviteTime'
  },
  {
    title: t('carbon.message.Invitee'),
    align: "center",
    dataIndex: 'username'
  },
  {
    title: t('carbon.message.State'),
    align: "center",
    dataIndex: 'status',
  },
];

const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return range[0] + "-" + range[1] + " 共" + total + "条";
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
});

// Computed
const formDisabled = computed(() => props.disabled);

// Methods
function getImgView(text) {
  // 实现图片查看逻辑
  return text;
}

function downloadFile(text) {
  // 实现文件下载逻辑
}

function handleTableChange(pagination, filters, sorter) {
  // 处理表格变化
}

function toEdit(record) {
  // 处理编辑逻辑
}

function openEditModel(record) {
  // 打开编辑模型
}

function add() {
  edit(JSON.parse(JSON.stringify(model)));
}

function edit(record) {
  Object.assign(model, record);

  // 查询出核算的所有填报进度
  getProcessList({
    checkId: model.id
  }).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records;
      if (res.result.total) {
        ipagination.total = res.result.total;
      } else {
        ipagination.total = 0;
      }
    }
  });
}

function submitForm() {
  // 触发表单验证
  // 这里需要根据实际情况实现表单验证逻辑
  confirmLoading.value = true;

  let requestPromise;

  if (!model.id) {
    // 添加操作
    requestPromise = addProcessData(model);
  } else {
    // 编辑操作
    requestPromise = editProcessData(model);
  }

  requestPromise.then((res) => {
    if (res.success) {
      createMessage.success(res.message);
      emit('ok');
    } else {
      createMessage.warning(res.message);
    }
  }).finally(() => {
    confirmLoading.value = false;
  });
}

// Expose methods
defineExpose({
  add,
  edit,
  submitForm
});

// Lifecycle
onMounted(() => {
  // 备份model原始值
  // modelDefault 已经在 reactive 中处理
});
</script>
