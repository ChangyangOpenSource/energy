<template>
    <div class="connection-panel">
      <div class="panel-header">
        <h4>连线详情</h4>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="panel-content">
        <div class="connection-info">
          <div class="info-section">
            <div class="info-row">
              <span class="label">起点:</span>
              <span class="value">{{ connection.from.name }}</span>
            </div>
            <div class="info-row" v-if="connection.from.nodeName">
              <span class="label">所属节点:</span>
              <span class="value">{{ connection.from.nodeName }}</span>
            </div>
            <div class="info-row">
              <span class="label">类型:</span>
              <span class="value">{{ connection.from.elementType === 'node' ? '节点' : '表计' }}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="label">终点:</span>
              <span class="value">{{ connection.to.name }}</span>
            </div>
            <div class="info-row" v-if="connection.to.nodeName">
              <span class="label">所属节点:</span>
              <span class="value">{{ connection.to.nodeName }}</span>
            </div>
            <div class="info-row">
              <span class="label">类型:</span>
              <span class="value">{{ connection.to.elementType === 'node' ? '节点' : '表计' }}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="label">连线类型:</span>
              <span class="value">{{ connection.type }}</span>
            </div>
            <div class="info-row">
              <span class="label">能耗:</span>
              <div class="energy-input">
                <input 
                  type="text" 
                  v-model="energyValue"
                  @change="updateEnergy"
                  placeholder="输入能耗值"
                />
                <span class="unit">吨标准煤</span>
              </div>
            </div>
            <div class="info-row">
              <span class="label">线型:</span>
              <span class="value">{{ connection.style.type }}</span>
            </div>
          </div>
        </div>
        
        <div class="panel-actions">
          <button class="btn save" @click="saveChanges">
            保存修改
          </button>
          <button class="btn delete" @click="$emit('delete')">
            删除连线
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    connection: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['update-energy', 'delete', 'close'])
  
  const energyValue = ref(props.connection.energy)
  
  watch(() => props.connection.energy, (newValue) => {
    energyValue.value = newValue
  })
  
  const updateEnergy = () => {
    emit('update-energy', energyValue.value)
  }
  
  const saveChanges = () => {
    updateEnergy()
    alert('修改已保存')
  }
  </script>
  
  <style scoped>
  .connection-panel {
    position: absolute;
    right: 20px;
    top: 80px;
    width: 320px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
    border-radius: 8px 8px 0 0;
  }
  
  .panel-header h4 {
    margin: 0;
    color: #333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .close-btn:hover {
    background: #f0f0f0;
    color: #666;
  }
  
  .panel-content {
    padding: 20px;
  }
  
  .info-section {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .info-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .info-row:last-child {
    margin-bottom: 0;
  }
  
  .label {
    width: 80px;
    color: #666;
    font-size: 14px;
  }
  
  .value {
    flex: 1;
    color: #333;
    font-weight: 500;
    font-size: 14px;
  }
  
  .energy-input {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .energy-input input {
    flex: 1;
    padding: 6px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .energy-input input:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  .unit {
    font-size: 12px;
    color: #999;
  }
  
  .panel-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
  }
  
  .btn.save {
    background: #1890ff;
    color: white;
  }
  
  .btn.save:hover {
    background: #40a9ff;
  }
  
  .btn.delete {
    background: #ff4d4f;
    color: white;
  }
  
  .btn.delete:hover {
    background: #ff7875;
  }
  </style>