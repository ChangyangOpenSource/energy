<!-- src/views/ledger/carbonAssent/modules/CyCarbonAssetTabs.vue -->
<template>
  <a-tabs v-model:activeKey="tab" @change="callback">
    <a-tab-pane key="1" :tab="t('carbon.message.CarbonAssetFlow')"></a-tab-pane>
    <a-tab-pane :key="types[0].value" :tab="t('carbon.message.CarbonAsset')"></a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// props
const props = defineProps({
  types: {
    type: Array,
    default: () => []
  }
});

// emits
const emit = defineEmits(['callback']);
const tab = ref<string>('1');

function callback(key: string){
  console.log(tab.value,'tab')
  emit('callback', key)
}
</script>

<style scoped>

</style>
