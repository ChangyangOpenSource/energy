<!-- src/views/neutrality/carbonEmissionPlan/CyCarbonEmissionPlanList.vue -->
<template>
  <div class="m_aCardBox">
    <a-card :bordered="false">
      <div v-if="!switchShow">
        <!-- 查询区域 -->
        <div class="tabBox">
          <div class="table-page-search-wrapper">
            <a-form  @keyup.enter="searchQuery">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="t('carbon.message.Target_name')">
                    <a-input
                        class="input"
                        type="text"
                        :placeholder="t('carbon.message.Please_enter_target_name')"
                        v-model:value="queryParam.planName"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="" style="">
                    <div style="width: 100%; display: flex; justify-content: flex-end;">
                      <a-button type="primary" @click="searchQuery">{{ t("carbon.message.Search") }}</a-button>
                      <a-button style="margin-left: 8px" @click="searchReset">{{ t("carbon.message.Reset") }}</a-button>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <div style="float: right;">
                    <a-button
                        style="margin-left: 8px"
                        @click="handleAdd"
                        type="primary"
                        preIcon="ant-design:plus-outlined"
                    >
                      {{ t("carbon.message.Add_carbon_plan") }}
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
        <!-- 查询区域-END -->

        <!-- table区域-begin -->
        <div class="content">
          <div v-for="(plan, index) in dataSource" :key="index" class="plan-item">
            <div style="width: 70%;">
              <div class="content-item">
                <div><span>{{ t("carbon.message.Target_name") }}：</span>{{ plan.planName }}</div>
                <div><span>{{ t("carbon.message.Related_organizations") }}：</span>{{ plan.planDeptId_dictText }}</div>
              </div>
              <div class="content-item">
                <div><span>{{ t("carbon.message.Base_year") }}：</span>{{ plan.baseYear }}</div>
                <div><span>{{ t("carbon.message.Carbon_neutral_year") }}：</span>{{ plan.carbonNeutralYear }}</div>
              </div>
              <div class="content-item">
                <div v-for="(stage, stageIndex) in plan.stageList" :key="stageIndex">
                  <span>{{ t("carbon.message.Stage") }}{{ stageIndex + 1 }}：</span>
                  {{ stage.stageYear }} |
                  <span>{{ t("carbon.message.carbon_emissions") }}：</span>
                  {{ stage.targetYearCarbonEmissions }}tCO₂e
                </div>
              </div>
            </div>
            <div class="right-info">
              <a-divider type="vertical" style="height: 90%; background-color: #7cb305" />
              <div class="creator-info">
                <div><span>{{ t("carbon.message.Founder") }}：</span>{{ plan.createBy_dictText }}</div>
                <div><span>{{ t("carbon.message.Create_date") }}：</span>{{ plan.createTime }}</div>
              </div>
              <a-divider type="vertical" style="height: 90%; background-color: #7cb305" />
              <div class="actions">
                <a @click="handleEdit(plan)" class="colorse">{{ t("carbon.message.Edit") }}</a>
                <a-popconfirm
                    :title="t('carbon.message.Confirm_delete')"
                    @confirm="() => handleDelete(plan.id)"
                >
                  <a class="colorse" style=" margin-left: 8px; margin-right: 8px;">
                    {{ t("carbon.message.Delete") }}
                  </a>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <CyCarbonEmissionPlanForm
          v-if="switchShow"
          ref="modalForm"
          @back="handleBack"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import CyCarbonEmissionPlanForm from './modules/CyCarbonEmissionPlanForm.vue';
import { listPlans, deleteOne, queryById } from './CyCarbonEmissionPlan.api';

const { t } = useI18n();
const { createMessage } = useMessage();

// refs
const modalForm = ref();

// reactive data
const switchShow = ref(false);
const dataSource = ref<any[]>([]);
const queryParam = reactive({
  planName: ''
});

// lifecycle
onMounted(() => {
  loadData();

  // 处理路由跳转到指定详情
  // 注意：这里需要根据实际路由实现方式进行调整
  // if (route.query && route.query.id) {
  //   nextTick(() => {
  //     handleEdit({ id: route.query.id });
  //   });
  // }
});

/**
 * 加载数据
 */
async function loadData() {
  try {
    const res = await listPlans(queryParam);
    if (res.success) {
      dataSource.value = res.result?.records || [];
    } else {
      createMessage.error(res.message);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

/**
 * 查询
 */
function searchQuery() {
  loadData();
}

/**
 * 重置
 */
function searchReset() {
  queryParam.planName = '';
  loadData();
}

/**
 * 新增
 */
function handleAdd() {
  switchShow.value = true;
  setTimeout(() => {
    if (modalForm.value) {
      modalForm.value.add();
    }
  }, 0);
}

/**
 * 编辑
 */
async function handleEdit(record) {
  try {
    const res = await queryById({ id: record.id });
    console.log(res,'res');
    if (res.success) {
      switchShow.value = true;
      // 等待组件渲染完成后执行编辑操作
      setTimeout(() => {
        if (modalForm.value) {
          modalForm.value.edit(res.result);
        }
      }, 0);
    } else {
      createMessage.error(res.message);
    }
  } catch (error) {
    console.error('Failed to edit record:', error);
  }
}

/**
 * 删除
 */
async function handleDelete(id) {
  try {
    const res = await deleteOne({ id });
    if (res.success) {
      createMessage.success(res.message);
      loadData();
    } else {
      createMessage.error(res.message);
    }
  } catch (error) {
    console.error('Failed to delete record:', error);
  }
}

/**
 * 返回
 */
function handleBack() {
  switchShow.value = false;
  loadData();
}
</script>

<style scoped lang="less">
@import '@/assets/less/common.less';
.colorse{
  color: @primary-color;
}
.ant-card {
  background: #F5F8F7;
}

.tabBox {
  padding: 24px 24px 0;
  background: #FFFFFF;
  border-radius: 3px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
  border-radius: 5px;
  height: auto;
}

.plan-item {
  display: flex;
  width: 100%;
  padding: 12px;
  justify-content: space-between;
  background-color: #fff;
  font-size: 15px;
  letter-spacing: 0.1em; /* 基于当前字体大小的10% */
}

.content-item {
  flex-wrap: wrap;
  display: flex;
  width: 100%;
  margin-top: 3px;
}

.content-item div {
  color: #333333;
  margin-top: 3px;
  flex: 0 0 33%;
  box-sizing: border-box;
}

.content-item div span {
  color: #888888;
}

.right-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.creator-info {
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.creator-info div {
  color: #333333;
}

.creator-info div span {
  color: #888888;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
