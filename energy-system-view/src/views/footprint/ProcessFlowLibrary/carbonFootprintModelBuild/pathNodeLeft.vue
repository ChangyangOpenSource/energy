<template>
  <div class="node-item left" :class="getProductLifeCycle_color()">
    <div class="node-name boxItem_side" :class="getProductLifeCycle_color()">
      <div class="flex2">
        <div class="boxItem_side_left warp">
          {{ node.emissionSourceName }}
        </div>
        <a-input
          :placeholder="t('carbon.message.Please_enter_the_consumption_volume')"
          @blur="onInpit"
          type="number"
          v-model:value="node.emissionSourceNumber"
          :suffix="node.emissionSourceUnitName"
        />
        <div class="uplosad" v-if="!node.attachment">
          <j-image-upload
            class="avatar-uploader"
            :type="'buttons'"
            :disabled="disabled"
            v-model:value="node.attachment"
          ></j-image-upload>
        </div>
        <div v-else class="pingzs">
          {{ node.attachment ? "凭证1" : ""
          }}<img
          src="@/assets/cptzj/img9.png"
          class="img9"
          alt=""
          @click.stop="onDeletImag"
        />
        </div>
        <div class="colloe1">
          {{ node.totalEmissionNumber }}kgCO₂e
        </div>
        <!-- 无运输信息 -->
        <a-tooltip
          placement="topLeft"
          v-if="!node.cyEmissionSourceTransports || node.cyEmissionSourceTransports.length == 0"
        >
          <template #title>
            <span>{{ t("carbon.message.No_transportation_information") }}</span>
          </template>
          <img src="@/assets/cptzj/img10.png" alt="" />
        </a-tooltip>
        <!-- 有运输信息但无填写距离 -->
        <a-tooltip
          placement="topLeft"
          @click="editInput(2)"
          v-else-if="node.cyEmissionSourceTransports.length > 0 && processMessages()"
        >
          <template #title>
            <span>{{
                t("carbon.message.The_transportation_information_was_not_filled_in")
              }}</span>
          </template>
          <img src="@/assets/cptzj/img11.png" alt="" />
        </a-tooltip>
        <!-- 有运输信息填写距离 -->
        <a-tooltip
          @click="editInput(2)"
          placement="topLeft"
          v-else-if="node.cyEmissionSourceTransports.length > 0 && processTwo()"
        >
          <template #title>
            <span>{{
                t("carbon.message.The_transportation_information_has_been_filled_in")
              }}</span>
          </template>
          <img src="@/assets/cptzj/img14.png" alt="" />
        </a-tooltip>

        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <div class="aButtons" @click="editInput">
                  {{ t("carbon.message.Edit") }}
                </div>
              </a-menu-item>
              <a-menu-item>
                <div class="aButtons" @click="onDeltes">
                  {{ t("carbon.message.Delete") }}
                </div>
              </a-menu-item>
            </a-menu>
          </template>
          <img src="@/assets/cptzj/img6.png" class="img6" alt="" />
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { defHttp } from '/@/utils/http/axios'

// 使用 Composition API 工具
const { t } = useI18n()

// 定义 emits
const emit = defineEmits([
  'onUpData',
  'delInput',
  'editInput',
  'edEmiss'
])

// Props
const props = defineProps({
  node: {
    type: Object,
    default() {
      return {};
    },
  },
  calculateProcessItem: {
    type: Object,
    default() {
      return {};
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Reactive 数据
const uploadAction = ref(window._CONFIG["domianURL"] + "/sys/common/upload")
const headers = reactive({})
const fileList = ref([])
const picUrl = ref(false)
const previewImage = ref('')
const previewVisible = ref(false)

// Lifecycle
onMounted(() => {
  const token = localStorage.getItem(ACCESS_TOKEN)
  headers["X-Access-Token"] = token
})

// Methods
const processMessages = () => {
  if (!props.node.cyEmissionSourceTransports) return false
  var list = props.node.cyEmissionSourceTransports.findIndex(
    (item) => item.distance == null
  )
  console.log(list)
  if (list != -1) {
    return true
  } else {
    return false
  }
}

const processTwo = () => {
  if (!props.node.cyEmissionSourceTransports) return false
  var list = props.node.cyEmissionSourceTransports.findIndex(
    (item) => item.distance != null
  )
  console.log(list)
  if (list != -1) {
    return true
  } else {
    return false
  }
}

const getProductLifeCycle_color = () => {
  return {
    productLifeCycle_color1: props.calculateProcessItem.lifeCycleTypeId == 1,
    productLifeCycle_color2: props.calculateProcessItem.lifeCycleTypeId == 2,
    productLifeCycle_color3: props.calculateProcessItem.lifeCycleTypeId == 3,
    productLifeCycle_color4: props.calculateProcessItem.lifeCycleTypeId == 4,
    productLifeCycle_color5: props.calculateProcessItem.lifeCycleTypeId == 5,
  }
}

const handleChange = (info) => {
  console.log(info)
  picUrl.value = false
  props.node.attachment = info.file.name
  emit("onUpData")
}

const onDeletImag = () => {
  props.node.attachment = ""
  emit("onUpData")
}

// 预览
const handlePreview = (file) => {
  previewImage.value = file.url || file.thumbUrl
  previewVisible.value = true
}

const onInpit = () => {
  console.log(props.node)
  emit("onUpData")
}

const onDeltes = () => {
  emit("delInput")
}

const editInput = (value) => {
  if(value==2){
    emit("editInput")
    emit("edEmiss", 2)
  }else{
    emit("editInput")
    emit("edEmiss", 1)
  }
}
</script>

<style lang="less" scoped>
.uplosad{
  :deep(.ant-upload.ant-upload-select-picture-card){
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    .ant-upload{
      padding: 0 !important;
    }
  }
}
.colloe1 {
  font-weight: 500;
  font-size: 14px;
}
.textLeft {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
}
.textLeft1 {
  font-weight: 400;
  font-size: 12px;
  color: #333333;
}
.pingzs {
  font-weight: 400;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  .img9 {
    width: 10px;
    height: 10px;
    margin-left: 6px;
  }
}
.aButtons {
  width: 56px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
}
.marBos {
  margin-bottom: 16px;
}
.aButtons:hover {
  font-weight: 400;
  font-size: 14px;
  color: #148958;
}
.wofaf {
  flex-wrap: wrap;
}
:deep(.ant-input) {
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.flex2 {
  display: flex;
  align-items: center;
  gap: 16px;
}
.fleWarp {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.img6 {
  width: 14px;
  height: 14px;
  position: absolute;
  right: 6px;
  top: 14px;
}
.flex2{
  :deep(.ant-input-affix-wrapper) {
    width: auto !important;
    span {
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }
  }
}

.maeRihtg {
  margin-right: 12px;
}

.warp {
  white-space: nowrap;
}
.pingzhen {
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #dcdcdc;
  font-weight: 400;
  font-size: 8px;
  color: #148958;
  padding: 3px;
  white-space: nowrap;
}
.img5 {
  width: 8px;
  height: 9px;
}
.flex {
  display: flex;
  align-items: center;
}
.node-item {
  flex-wrap: wrap;
  position: relative;
  border-left: 1px dashed #b5bdc4;
}

.node-item:first-child {
  position: relative;
  border: none;
}

.node-item::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  border-top: 1px dashed #1573eb;
}
.node-item:first-child::before {
  bottom: 0;
  border-radius: 4px 0 0 0;
  border-left: 1px dashed #1573eb;
}
.node-item:last-child::before {
  right: 0;
  top: 0;
  bottom: 50%;
  border-radius: 0 0 0 4px;
  border: none;
  border-left: 1px dashed #1573eb;
  border-bottom: 1px dashed #1573eb;
}
.node-item:first-child:last-child::before {
  left: 0;
  top: 50%;
  bottom: auto;
  border: 0;
  border-radius: 0;
  border-top: 1px dashed #1573eb;
}
.node-item .node-children::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  border-top: 1px dashed #1573eb;
}
.node-item .node-item_not-leaf::before {
  border-left: 1px solid #1573eb;
}
.node-item.left::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 30px;
  border-top: 1px dashed #1573eb;
  left: auto;
  right: 0px;
}
.node-item.left:first-child::before {
  right: 0px;
  bottom: 0;
  border-radius: 4px 0 0 0;
  border-left: 1px dashed #1573eb;
  border: none;
  border-radius: 0 4px 0 0;
  border-top: 1px dashed #1573eb;
  border-right: 1px dashed #1573eb;
}

.node-item.left:last-child::before {
  right: 0px;
  top: 0;
  bottom: 50%;
  border-radius: 0 0 0 4px;
  border: none;
  border-left: 1px dashed #1573eb;
  border-bottom: 1px dashed #1573eb;
  border-radius: 0 0 4px 0;
  border: none;
  border-right: 1px dashed #1573eb;
  border-bottom: 1px dashed #1573eb;
}

.node-item.left:first-child:last-child::before {
  left: 0;
  top: 50%;
  bottom: auto;
  border: 0;
  border-radius: 0;
  border-top: 1px dashed #1573eb;
  left: auto;
  right: 0;
}

.node-item.left .node-item_not-leaf::before {
  border: none;
  border-right: 1px solid #1573eb;
}

.node-item.left .node-children::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  border-top: 1px dashed #1573eb;
  left: auto;
  right: 0;
}

.node-item:last-child {
  border-left: none;
}

.node-item:first-child:last-child {
  border-left: none;
}

.node-item .node-name {
  flex-shrink: 0;
  margin: 6px 0;
  font-weight: 600;
}

.node-item .node-name.round {
  width: 64px;
  height: 64px;
  padding: 0;
  border-radius: 50%;
  line-height: 64px;
  text-align: center;
}

.node-item .node-children {
  position: relative;
  padding-left: 50px;
  border-left: 1px dashed #b5bdc4;
  border-left: none;
}

.node-item .node-item_not-leaf {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.node-item .node-item_leaf .node-name {
  margin-right: 20px;
}

.node-item.left {
  position: relative;
  padding: 0;
  border: none;
  border-right: 1px dashed #1573eb;
  flex-wrap: wrap;
  padding: 0 49px;
}

.node-item.left:first-child {
  position: relative;
  border: none;
}

.node-item.left:last-child {
  border: none;
}

.node-item.left:first-child:last-child {
  border-right: none;
}

.node-item.left .node-name::after {
  content: "\200E";
}

.node-item.left .node-children {
  position: relative;
  padding: 0;
  padding-right: 50px;
  border: none;
  border-right: 1px dashed #b5bdc4;
  border-right: none;
}

.node-item.left .node-item_leaf .node-name {
  margin-right: 0;
  margin-left: 20px;
}

.node-item .node-fade-enter-acitve,
.node-item .node-fade-leave-active {
  transition: all 0.5s;
}

.node-item .node-fade-enter,
.node-item .node-fade-leave-to {
  opacity: 0;
}

.node-item .node-fade-enter-to,
.node-item .node-fade-leave {
  opacity: 1;
}

.boxItem_side {
  box-sizing: border-box;
  gap: 10px;
  padding: 8px 16px;
  background: #eaf3ff;
  border-radius: 3px;
  border: 1px solid #1573eb;
  color: #999;
  line-height: 22px;
  display: flex;
  position: relative;
  .boxItem_side_left {
    flex: 1;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    width: 80px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxItem_side_right {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
  }

  .boxItem_side_right_text {
    flex: 1;
    text-align: right;
    line-break: anywhere;
  }

  .boxItem_delIcon {
    width: 22px;
    height: 22px;
    margin-left: 6px;
  }

  .boxItem_yunshuIcon {
    width: 22px;
    height: 22px;
  }
}

.productLifeCycle_color1 {
  background: #f1fff9;
  border: 1px solid #148958;
  color: #148958;
}
.productLifeCycle_colorbefore1::before {
  border-color: #148958 !important;
}

.productLifeCycle_color2 {
  background: #eaf3ff;
  border: 1px solid #1573eb;
  color: #1573eb;
}
.productLifeCycle_colorbefore2::before {
  border-color: #1573eb !important;
}

.productLifeCycle_color3 {
  background: #fff9ee;
  border: 1px solid #ffbe49;
  color: #ffbe49;
}
.productLifeCycle_colorbefore3::before {
  border-color: #ffbe49 !important;
}

.productLifeCycle_color4 {
  background: #fff4eb;
  border: 1px solid #e37318;
  color: #e37318;
}
.productLifeCycle_colorbefore4::before {
  border-color: #e37318 !important;
}

.productLifeCycle_color5 {
  background: #fae4e3;
  border: 1px solid #d54941;
  color: #d54941;
}
.productLifeCycle_colorbefore5::before {
  border-color: #d54941 !important;
}
</style>
