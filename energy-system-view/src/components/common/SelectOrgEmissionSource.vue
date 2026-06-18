<template>
  <div class="centeet">
    <!-- 添加 -->
    <a-drawer
        :visible="visible"
        :title="t('carbon.message.New_emission_source')"
        placement="right"
        :width="800"
        @close="onClose"
    >
      <div>
        <div class="marbot">
          <a-input-search
              :placeholder="t('carbon.message.please_enter_a_keyword_such_as_electricity')"
              style="width: 240px"
              v-model:value="queryParam.name"
              allowClear
              @search="searchQuery()"
          />
          <a-button type="primary" preIcon="ant-design:plus-outlined" @click="add">
            {{ t('carbon.message.New_emission_source') }}
          </a-button>
        </div>
        <div>
          <a-table
              rowKey="id"
              :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
              @change="handleTableChange"
              :columns="columns"
              :data-source="dataSource"
              :pagination="ipagination"
          >
            <template #carbonMolecule="{ record }">
              <div class="editable-row-operations">
                {{ record.carbonMolecule }}/{{ record.carbonDenomintor }}
              </div>
            </template>
            <template #operation="{ record }">
              <div class="editable-row-operations">
                <a style="margin-right: 8px" @click="() => edit(record)">{{ t('carbon.message.Detail') }}</a>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <div
          :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="margin-right: 8px" @click="onClose"> {{ t('carbon.message.Cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit"> {{ t('carbon.message.Confirm') }}</a-button>
      </div>
    </a-drawer>

    <basicCheckDetailEditDrawer
        :isTemplate="isTemplate"
        ref="basicCheckDetailEditDrawerRef"
        @onCloseBasicCheckDetailEditVisible="onCloseBasicCheckDetailEditVisible"
    />

    <!--添加的新增详情弹框 -->
    <basicDrawer
        ref="basicDrawerRef"
        :formDisabled="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getEmissionSourceList } from './api/SelectOrgEmissionSource.api.ts';
import basicDrawer from './basicDrawer.vue';
import basicCheckDetailEditDrawer from "./basicCheckDetailEditDrawer.vue";
import { filterObj } from '/@/utils/common/compUtils';

// Props
const props = defineProps({
  isTemplate: {
    type: Boolean,
    default: false
  },
});

// Emits
const emit = defineEmits(['ok', 'close']);

// 国际化
const { t } = useI18n();

// Refs
const basicCheckDetailEditDrawerRef = ref<any>(null);
const basicDrawerRef = ref<any>(null);

// Reactive data
const visible = ref(false);
const from = ref<any>({});
const queryParam = reactive<Record<string, any>>({});
const dataSource = ref<any[]>([]);
const selectedRowKeys = ref<string[]>([]);
const selectionRows = ref<any[]>([]);

const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total: number, range: number[]) => {
    return range[0] + "-" + range[1] + " 共" + total + "条";
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
});

const columns = computed(() => [
  {
    title: t('carbon.message.Emission_source'),
    dataIndex: "name",
    align: "center",
  },
  {
    title: t('carbon.message.facilities_activities'),
    dataIndex: "activitieId_dictText",
    align: "center",
  },
  {
    title: t('carbon.message.Emission_type'),
    dataIndex: "type_dictText",
    align: "center",
  },
  {
    title: `CO₂e${t('carbon.message.Emission_factor_value')}`,
    dataIndex: "carbonData",
    align: "center",
  },
  {
    title: t('carbon.message.Emission_factor_unit'),
    dataIndex: "carbonMolecule",
    slots: { customRender: "carbonMolecule" },
    align: "center",
  },
  {
    title: t('carbon.message.Handle'),
    align: "center",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
]);

// Methods
const show = (data: any) => {
  from.value = data;
  visible.value = true;
  loadData();
};

const searchQuery = () => {
  loadData(1);
};

const loadData = (arg?: number) => {
  //加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }

  const params = getQueryParams();
  params.standardDetailId = from.value.standardId;

  getEmissionSourceList(params).then((res) => {
    if (res.success) {
      // 适配不分页的数据列表
      dataSource.value = res.result.records || res.result;
      if (res.result.total) {
        ipagination.total = res.result.total;
      } else {
        ipagination.total = 0;
      }
    } else {
      // 注意：这里需要替换为合适的提示方式
      console.warn(res.message);
    }
  });
};

const onSelectChange = (selectedRowKeys1: string[], selectionRows1: any[]) => {

  selectedRowKeys.value = selectedRowKeys1;
  selectionRows.value = selectionRows1;
  console.log('onSelectChange', selectedRowKeys, selectionRows)
};

const handleTableChange = (pagination: any) => {
  Object.assign(ipagination, pagination);
  loadData();
};

const getQueryParams = () => {
  const param = Object.assign({}, queryParam);
  param.pageNo = ipagination.current;
  param.pageSize = ipagination.pageSize;
  return filterObj(param);
};

/**
 * 关闭弹窗
 */
const onClose = () => {
  visible.value = false;
};

/**
 * 提交保存
 */
const handleSubmit = () => {
  emit("ok", selectedRowKeys.value, selectionRows.value);
  visible.value = false;
};

/**
 * 新增设备
 */
const add = () => {
  basicCheckDetailEditDrawerRef.value?.add(from.value);
};

/**
 * 编辑设备
 */
const edit = (value: any) => {
  basicDrawerRef.value?.edit(value.id);
};

/**
 * 新增设备
 */
const onCloseBasicCheckDetailEditVisible = () => {
  visible.value = false;
  emit('close');
};

// Expose methods
defineExpose({
  show,
  selectedRowKeys
});
</script>

<style lang="less" scoped>
.marbot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.xinzeng {
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #148958;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  padding: 5px 16px;
  background: #ffffff;
  display: flex;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
  }
}
</style>
