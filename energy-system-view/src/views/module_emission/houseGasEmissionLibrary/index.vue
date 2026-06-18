<template>
  <tpfyzkView ref="viewRef"></tpfyzkView>
</template>

<script setup lang="ts">
import tpfyzkView from "../tpfyzkView/tpfyzkView.vue";
import {onMounted, ref} from "vue";


const viewRef = ref();

onMounted(() => {
  viewRef.value.queryParam.emissionFactorDatabase = "3"
});
</script>

<style scoped lang="less">

</style>
