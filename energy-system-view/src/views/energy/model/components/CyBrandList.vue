<template>
  <a-drawer
    title="品牌管理"
    :width="600"
    :visible="visible"
    @ok="handleCancel"
    :footer-style="{ textAlign: 'right' }"
    @close="handleCancel">
    <a-button type="primary" @click="handleAdd">新增</a-button>
    <a-table :columns="columns" :data-source="dataSources" :pagination="false" style="margin-top: 8px">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <Popconfirm title="确定删除吗？" @confirm="handleDelete(record)">
              <a>删除</a>
            </Popconfirm>
          </span>
        </template>
      </template>
    </a-table>

    <template #footer>
      <a-button style="margin-right: 8px" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleCancel">确认</a-button>
    </template>
  </a-drawer>

  <CyBrandModal ref="registerModal" @success="handleSuccess"></CyBrandModal>
</template>

<script lang="ts" setup>
import {ref, defineExpose} from 'vue';
import CyBrandModal from "@/views/energy/model/components/components/CyBrandModal.vue";
import {brandList, deleteOne} from "@/views/energy/model/components/components/CyBrand.api";
import {Popconfirm} from "ant-design-vue";

const visible = ref<boolean>(false);
const registerModal = ref();

const dataSources = ref([])
const columns = ref([
  {
    title: '品牌名称',
    dataIndex: 'brandName',
    key: 'brandName',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
])

/**
 * 新增
 */
function visTrue() {
  visible.value = true;
  getBrandList();
}

/**
 * 取消按钮回调事件
 */
function handleCancel() {
  visible.value = false;
}

/**
 * 成功回调
 */
function handleSuccess() {
  getBrandList()
}

/**
 * 品牌列表
 */
function getBrandList() {
  brandList({pageSize: -1}).then((res) => {
    dataSources.value = res.records
  })
}


/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.disableSubmit = false;
  registerModal.value.add();
}

/**
 * 编辑事件
 */
function handleEdit(record: Recordable) {
  registerModal.value.disableSubmit = false;
  registerModal.value.edit(record);
}
/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteOne({ id: record.id }, handleSuccess);
}

defineExpose({
  visTrue
});
</script>

<style lang="less">
/**隐藏样式-modal确定按钮 */
.jee-hidden {
  display: none !important;
}
</style>
<style lang="less" scoped></style>
