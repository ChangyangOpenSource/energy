<!-- src/views/ledger/carbonAssent/modules/CyCarbonAssetLogModal.vue -->
<template>
  <a-modal
      :title="t('carbon.message.Type')"
      width="1000px"
      :visible="visible"
      @ok="close"
      @cancel="close">
    <a-table
        ref="tableRef"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        class="custom-table">
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getLogDetail } from '../carbonAssent.api';

const { t } = useI18n();

// props
const props = defineProps({
  types: {
    type: Array,
    default: () => []
  }
});

// emits
const emit = defineEmits(['back']);

// refs
const tableRef = ref();
const visible = ref<boolean>(false);
const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
const dataSource = ref<any>({});
const queryParam = reactive({
  assetCode: undefined,
});

const loading = ref<boolean>(false);
/* 分页参数 */
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total: number, range: number[]) => {
    return range[0] + "-" + range[1] + " 共" + total + "条"
  },
  total: 0
});

// 表头
const columns = ref([
  {
    title: t('carbon.message.FlowTime'),
    align: 'center',
    dataIndex: 'flowTime',
    customRender: function (text: string) {
      return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
    }
  },
  {
    title: t('carbon.message.Type'),
    align: 'center',
    dataIndex: 'typeId_dictText',
    customRender:(text: string)=> {
      const colorMap: Record<string, string> = {
        '增持': '#148958',
        '减少': '#E37318',
      };
      return {
        style: { color: colorMap[text] || 'black' },
        children: text
      }
    }
  },
  {
    title: t('carbon.message.CarbonAmount') + "(tCO₂e)",
    align: 'center',
    dataIndex: 'totalCarbonAsset'
  },
]);

async function loadData(arg: number, record: any) {
  //加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }
  console.log(queryParam);
  console.log(record);
  if(record) {
    queryParam.assetCode = record.assetCode
  }

  queryParam.pageNo = ipagination.current;
  queryParam.pageSize = ipagination.pageSize;

  try {
    const res = await getLogDetail(queryParam);
    if (res.success) {
      dataSource.value = res.result.records||res.result;
      if(res.result.total){
        ipagination.total = res.result.total;
      }else{
        ipagination.total = 0;
      }
      visible.value = true
    }else{
      // this.$message.warning(res.message)
      console.warn(res.message)
    }
  } catch (error) {
    console.error('加载日志详情失败', error);
  }
}

/**
 * 关闭
 */
function close() {
  emit('back')
  visible.value = false
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  //分页、排序、筛选变化时触发
  //TODO 筛选
  console.log(pagination)
  Object.assign(ipagination, pagination);
  loadData(1, null);
}

// expose methods
defineExpose({
  loadData
});
</script>

<style scoped>
.custom-table{
  border: 0.5px solid #E7E7E7;
  border-radius: 3px;
}
</style>
