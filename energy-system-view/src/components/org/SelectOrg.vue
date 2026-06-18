<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getTenantId} from "@/utils/auth";
import {queryCompanyAndSubsidiaryByTenantIdResult} from "@/components/org/selectOrg.api";
const emit = defineEmits();

const parentId = ref(undefined)
const orgs = ref([])

onMounted(async () => {
  let tenantId = getTenantId()
  queryCompanyAndSubsidiaryByTenantIdResult({tenantId: tenantId}).then((res) => {
    Object.assign(orgs.value, res);
  })
});

function selected() {
  emit("update:value", parentId.value)
}
</script>

<template>
  <a-select
    v-model:value="parentId"
    :options="orgs"
    :field-names="{ label: 'departName', value: 'id'}"
    placeholder="请选择上级组织"
    @change="selected"
    allow-clear>
  </a-select>
</template>

<style scoped lang="less">

</style>
