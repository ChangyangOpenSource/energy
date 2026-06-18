<template>
  <div class="content-area">
    <div class="leftVBs">
      <div class="pporops marBottom1">
        <div class="title">能流图配置</div>
        <a-input-search v-model:value="searchValue" style="margin-top: 10px; margin-bottom: 10px" @search="onSearch" placeholder="输入关键词搜索" />
        <div class="text">
          能流图列表
          <a-button @click="handleAdd" preIcon="ant-design:plus-outlined"> </a-button>
        </div>
      </div>
      <div>
        <div v-for="(item, index) in listArr" :key="index" class="tonts" :class="{ selected: item.id === selectedId }" @click="onselectedId(item)">
          <div>
            {{ item.name }}
          </div>
          <a-popover>
            <template #content>
              <div class="aButtons marBos" @click="onNodeUpdata(item)"> 编辑 </div>
              <a-popconfirm title="确认删除嘛？" ok-text="确定" cancel-text="取消" @confirm="onNodeDelte(item)" @cancel="cancel">
                <div class="aButtons marBos"> 删除 </div>
              </a-popconfirm>
              <div class="aButtons marBos" @click="onMoveUpwards(item, index)"> 上移 </div>
              <div class="aButtons" @click="onLowerDown(item, index)"> 下移 </div>
            </template>
            <Icon class="foniswICon" icon="ant-design:bars-outlined" />
          </a-popover>
        </div>
      </div>
    </div>
    <div class="felxOne">
      <EnergyFlowChart ref="gyFlowChart" @clearConneSaveSuccess="clearConneSaveSuccess" :selectedId="selectedId" />
    </div>
    <!-- 新建 -->
    <a-modal title="新建能流图" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <div class="padings">
        <a-form
          :model="listObj"
          name="basic"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item label="名称" required>
            <a-input v-model:value="listObj.name" />
          </a-form-item>
          <a-form-item label="说明" required>
            <a-input v-model:value="listObj.remark" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
  
<script setup>
import EnergyFlowChart from './EnergyFlowChart.vue';
import { defHttp } from '/@/utils/http/axios';
import { onMounted, reactive, ref, nextTick } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();
// 搜索关键词
const searchValue = ref('');
const listArr = ref([]);
const listObj = ref({});
const selectedId = ref(null);
const gyFlowChart = ref(null);
const visible = ref(false);

function onselectedId(item) {
  selectedId.value = item.id;
  //切换1浏览还是  2可操作
  gyFlowChart.value.ontypeCanstay(1);
  setTimeout(() => {
    gyFlowChart.value.getDetailsById();
    gyFlowChart.value.onSankeyDiagers();
  }, 200);
}

//上移
function onMoveUpwards(item, index) {
  console.log(item, index);
  if (index === 0) {
    createMessage.warn('已经是最上面了');
    return;
  }
  defHttp
    .get({
      url: '/cyEnergyFlowDiagram/adjustTheOrder',
      params: {
        sourceId: item.id,
        targetId: listArr.value[index - 1].id,
      },
    })
    .then((res) => {
      keyWords();
    });
}

//下移
function onLowerDown(item, index) {
  console.log(item, index);

  if (index === listArr.value.length - 1) {
    createMessage.warn('已经是最下面了');
    return;
  }
  defHttp
    .get({
      url: '/cyEnergyFlowDiagram/adjustTheOrder',
      params: {
        sourceId: item.id,
        targetId: listArr.value[index + 1].id,
      },
    })
    .then((res) => {
      keyWords();
    });
}

function keyWords(value) {
  defHttp
    .get({
      url: '/cyEnergyFlowDiagram/queryByKeywords',
      params: {
        keywords: searchValue.value,
      },
    })
    .then((res) => {
      console.log(res);
      if (res) {
        listArr.value = res;
        if (value == 1) {
          if (res.length > 0) {
            selectedId.value = res[0].id;
            gyFlowChart.value.ontypeCanstay(1);
            setTimeout(() => {
              gyFlowChart.value.getDetailsById();
              gyFlowChart.value.onSankeyDiagers();
            }, 200);
          } else {
            selectedId.value = '';
            gyFlowChart.value.ontypeCanstay(1);
          }
        } else if (value == 2) {
          selectedId.value = res[0].id;
          gyFlowChart.value.ontypeCanstay(2); //切换状态
          gyFlowChart.value.onIsAssCanstay(true); //切换状态
          gyFlowChart.value.onRemove(); ////选择新建清空数据
          setTimeout(() => {
            gyFlowChart.value.getDetailsById();
          }, 200);
        }
      }
    });
}
const handleCancel = () => {
  listObj.value.name = '';
  listObj.value.remark = '';
  visible.value = false;
};
//保存新建模版
const handleOk = () => {
  if (!listObj.value.name) {
    createMessage.warn('请输入名称');
    return;
  }
  if (!listObj.value.remark) {
    createMessage.warn('请输入说明');
    return;
  }
  defHttp
    .post({
      url: '/cyEnergyFlowDiagram/add',
      data: {
        name: listObj.value.name,
        remark: listObj.value.remark,
      },
    })
    .then((res) => {
      if (res) {
        keyWords(2);
        listObj.value.name = '';
        listObj.value.remark = '';
        visible.value = false;
      }
    });
};

//新建
function handleAdd() {
  console.log(gyFlowChart.value);
  selectedId.value = '';
  visible.value = true;
  // //切换1浏览还是  2可操作
  // gyFlowChart.value.ontypeCanstay(2);
  // gyFlowChart.value.onIsAssCanstay(false);
  // gyFlowChart.value.onRemove();
}

// 编辑
function onNodeUpdata(item) {
  console.log(selectedId.value);
  selectedId.value = item.id;
  console.log(gyFlowChart.value, selectedId.value);
  gyFlowChart.value.onIsAssCanstay(true);
  //切换1浏览还是  2可操作
  gyFlowChart.value.ontypeCanstay(2);
  setTimeout(() => {
    gyFlowChart.value.getDetailsById();
  }, 200);
}

// 删除
function onNodeDelte(item) {
  console.log(selectedId.value);
  defHttp
    .delete({
      url: `/cyEnergyFlowDiagram/delete?id=${item.id}`,
    })
    .then((res) => {
      console.log(res);
      if (res) {
        selectedId.value = '';
        keyWords();
      }
    });
}

const clearConneSaveSuccess = () => {
  keyWords();
};

function onSearch() {
  keyWords(1);
}

// 自动请求并暴露内部方法
onMounted(() => {
  keyWords(1);
});
</script>
  
<style scoped>
.padings {
  padding: 24px 0;
}
.marBottom {
  margin-bottom: 24px;
}

.aButtons {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  padding: 3px 8px;
  cursor: pointer;
}
.aButtons:hover {
  color: #333 !important;
  white-space: nowrap;
  background: #deeff8 !important;
  padding: 3px 8px;
}
.marBos {
  margin-bottom: 6px;
}

.marBottom1 {
  margin-bottom: 12px;
}
.pporops {
  padding: 0 20px;
}
.selected {
  font-weight: 500;
  font-size: 16px;
  padding: 8px 8px 8px 24px;
  background: #deeff8;
}
.tonts {
  font-weight: 500;
  font-size: 16px;
  padding: 8px 24px 8px 24px;
  color: #333333;
  display: flex;
  justify-content: space-between;
}
.title {
  font-weight: 500;
  font-size: 26px;
  color: #333333;
}
.text {
  font-weight: 500;
  font-size: 18px;
  color: #333333 !important;
  display: flex;
  justify-content: space-between;
}
.energy-management-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow: auto;
  position: relative;
  display: flex;
  gap: 24px;
  background: #ffffff;
  min-height: 100%;
}
.leftVBs {
  background: #e8e8e8;
  padding: 20px 0;
  width: 15%;
}
.felxOne {
  padding: 20px;
  flex: 1;
}
</style>