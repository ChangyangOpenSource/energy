<template>
  <div class="flow-node" :data-node-id="node.id">
    <div class="node-header">
      <div class="node-name">{{ node.name }}</div>
      <!-- <a-input v-model:value="node.name" placeholder="请输入值"></a-input> -->
      <a-popover>
        <template #content>
          <div class="aButtons marBos" @click="onNodeUpdata()"> 编辑 </div>
          <a-popconfirm title="确认删除嘛？" ok-text="确定" cancel-text="取消" @confirm="onNodeDelte" @cancel="cancel">
            <div class="aButtons"> 删除 </div>
          </a-popconfirm>
        </template>
        <Icon class="foniswICon" icon="ant-design:bars-outlined" />
      </a-popover>
    </div>

    <div class="node-meters" v-if="node.meters && node.meters.length > 0">
      <div
        class="meter-item"
        :class="[node.type, { selected, 'connect-mode': mode === 'connect' }]"
        v-for="(meter, index) in node.meters"
        :key="index"
        :data-meters-id="meter.id"
        @click="handleClick(meter)"
      >
        <div>
          <div class="meter-name">{{ meter.name }}</div>
          <div class="meter-type">{{ meter.value }}</div>
        </div>
        <a-popover>
          <template #content>
            <!-- <div class="aButtons marBos" @click="onNodeUpdata()"> 编辑 </div> -->
            <a-popconfirm title="确认删除嘛？" ok-text="确定" cancel-text="取消" @confirm="onNodeMeterDelte(meter)" @cancel="cancel">
              <div class="aButtons"> 删除 </div>
            </a-popconfirm>
          </template>
          <Icon class="foniswICon" icon="ant-design:bars-outlined" />
        </a-popover>
        <!-- <button class="add-meter-btn" @click.stop="$emit('add-meter', node)">+添加表计</button> -->
        <div class="node-actions" v-if="mode === 'connect'">
          <!-- <div class="connection-dot start" @click.stop="selectAsStart"></div> -->
          <!-- <div class="connection-dot end" @click.stop="selectAsEnd"></div> -->
        </div>
      </div>
    </div>

    <div class="add-meter-btn-container">
      <button class="add-meter-btn" @click.stop="$emit('add-meter', node)">+添加表计</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'view',
  },
  items:{
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['select', 'add-meter', 'update-node', 'delete-node']);

const handleClick = (value) => {
  if (props.mode === 'connect') {
    emit('select', value, props.items);
  }
};

const onNodeUpdata = () => {
  emit('update-node', props.node);
};

const onNodeDelte = () => {
  emit('delete-node', props.node);
};

const onNodeMeterUpdata = () => {
  emit('update-Meternode', props.node);
};

const onNodeMeterDelte = (value) => {
  emit('delete-Meternode', value);
};

// const handleClick = () => {
//   if (props.mode === 'connect') {
//     emit('select', props.node);
//   }
// };

const selectAsStart = () => {
  emit('select', props.node);
};

const selectAsEnd = () => {
  emit('select', props.node);
};
</script>

<style scoped>
.meter-type{
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  margin-top: 6px;
  color: #1890ff;
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
  margin-bottom: 16px;
}
.foniswICon {
  /* font-size: 18px !important; */
}
.flow-node {
  /* background: white; */
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.meter-item.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.meter-item.connect-mode {
  cursor: pointer;
}

.meter-item.connect-mode:hover {
  border-color: #1890ff;
  transform: translateY(-2px);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.node-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.node-value {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.node-meters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meter-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 10px;
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  position: relative;
}

.meter-name {
  font-size: 12px;
  color: #666;
}

.add-meter-btn {
  padding: 2px 8px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  font-size: 11px;
  color: #666;
}

.add-meter-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.add-meter-btn-container {
  text-align: center;
  padding-top: 5px;
}

.node-actions {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.connection-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
}

.connection-dot.start {
  background: #52c41a;
  border: 2px solid white;
}

.connection-dot.end {
  background: #fa8c16;
  border: 2px solid white;
}

.connection-dot.start::after {
  content: '起点';
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 10px;
  color: #52c41a;
  opacity: 0;
  transition: opacity 0.3s;
}

.connection-dot.end::after {
  content: '终点';
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 10px;
  color: #fa8c16;
  opacity: 0;
  transition: opacity 0.3s;
}

.connection-dot:hover::after {
  opacity: 1;
}

.connection-dot:hover {
  transform: scale(1.2);
}
</style>