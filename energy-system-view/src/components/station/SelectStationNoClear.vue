<script setup lang="ts">
import { stationList } from '@/views/energy/station/CyStation.api';
import { onMounted, ref } from 'vue';
const emit = defineEmits();
const props = defineProps({
  //是否禁用页面
  stationId: {
    type: String,
    default: undefined,
  },
});
const stations = ref([]);
const stationId = ref(localStorage.getItem("stationId") ? localStorage.getItem("stationId") : undefined);

onMounted(async () => {
  stationList({ pageSize: -1 }).then((res) => {
    Object.assign(stations.value, res.records);
    console.log(props.stationId, "props.stationId");
    if (props.stationId) {
      stationId.value = props.stationId;
    }
    if (!stationId.value) {
      stationId.value = res.records[0].id;
      localStorage.setItem("stationId", stationId.value);
    }
    console.log(stationId.value ,'stationId');
    emit('update:value',  stationId.value);
    emit('ok');
  });
});

function selectStation() {
  localStorage.setItem("stationId", stationId.value);
  emit('update:value', stationId.value );
  emit('ok');
}
</script>

<template>
  <a-select
    style="width: 100%"
    v-model:value="stationId"
    :options="stations"
    show-search
    :option-filter-prop="'name'"
    :field-names="{ label: 'name', value: 'id' }"
    placeholder="请选择关联场站"
    @change="selectStation"
  >
  </a-select>
</template>

<style scoped lang="less">
</style>
