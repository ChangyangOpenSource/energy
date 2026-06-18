<!-- src/views/ledger/carbonAssent/trend/index.vue -->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form  @keyup.enter="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" preIcon="ant-design:plus-outlined">{{ t('carbon.message.Add') }}</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// refs
const description = ref<string>('碳资产流水管理页面');

// 表头
const columns = ref([
  {
    title: t('carbon.message.RegistrationDate'),
    align: 'center',
    dataIndex: 'createTime'
  },
  {
    title: t('carbon.message.TypesOfCarbonAssets'),
    align: 'center',
    dataIndex: 'carbonAssentTypeId'
  },
  {
    title: t('carbon.message.FlowType'),
    align: 'center',
    dataIndex: 'type'
  },
  {
    title: t('carbon.message.FlowMethod'),
    align: 'center',
    dataIndex: 'flowType'
  },
  {
    title: t('carbon.message.CarbonAmount') + '(tCO₂e)',
    align: 'center',
    dataIndex: 'totalCarbonAssent'
  },
  {
    title: t('carbon.message.AssetCode'),
    align: 'center',
    dataIndex: 'assentCode'
  },
  {
    title: t('carbon.message.FlowTime'),
    align: 'center',
    dataIndex: 'flowTime',
    customRender: function (text: string) {
      return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
    }
  },
  {
    title: t('carbon.message.Counterparty'),
    align: 'center',
    dataIndex: 'counterparty'
  },
  {
    title: t('carbon.message.Voucher'),
    align: 'center',
    dataIndex: 'flowImg'
  },
  {
    title: t('carbon.message.Registrant'),
    align: 'center',
    dataIndex: 'createBy'
  },
  {
    title: t('carbon.message.Action'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 147,
    slots: { customRender: 'action' }
  }
]);

const url = reactive({
  list: '/carbonAssetFlow/list',
  delete: '/carbonAssetFlow/delete',
});

function handleEdit(record: any) {
  // getAction(this.url.queryById, { id: record.id }).then(res => {
  //   if (res.success) {
  //     this.$refs.modalForm.edit(res.result)
  //     this.$refs.modalForm.title = this.$t('carbon.message.Edit')
  //     this.$refs.modalForm.disableSubmit = false
  //   } else {
  //     this.$message.error(res.message)
  //   }
  // })
}

function handleAdd() {
  // this.$refs.modalForm.add()
  // this.$refs.modalForm.title = this.$t('carbon.message.Add')
  // this.$refs.modalForm.disableSubmit = false
}

/**
 * 返回
 */
function onBack() {
  // this.loadData(1)
}

function searchQuery() {
  // 查询逻辑
}
</script>

<style scoped>
@import '@/assets/less/common.less';
</style>
