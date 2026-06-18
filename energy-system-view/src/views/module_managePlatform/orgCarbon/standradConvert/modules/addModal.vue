<template>
  <div class="wrap">
    <a-modal
      :destroy-on-close="true"
      :mask-closable="false"
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="1200px"
    >
      <div class="choose-wrap">
        <div class="choose-title">
          <div class="choose-title-item">
            <div style="margin-right: 50px;">标准1:</div>
            <div>
              <a-select
                v-model:value="chooseMainStandrandId"
                style="width: 250px"
                @change="handleChangeO"
              >
                <template v-for="item in mainStandrandList" :key="item.key">
                  <a-select-option :value="item.key">
                    {{ item.title }}
                  </a-select-option>
                </template>
              </a-select>
            </div>
          </div>
          <div class="choose-title-item">
            <div style="margin-right: 50px;">标准2:</div>
            <div>
              <a-select
                v-model:value="chooseTargetStandrandId"
                style="width: 250px"
                @change="handleChangeT"
              >
                <template v-for="item in targetStandrandList" :key="item.key">
                  <a-select-option :value="item.key">
                    {{ item.title }}
                  </a-select-option>
                </template>
              </a-select>
            </div>
          </div>
        </div>
        <div class="choose-body">
          <template v-for="item in detailList" :key="item.key">
            <template v-for="item2 in item.children" :key="item2.key">
              <div class="aaaa">
                <div class="main-detail">
                  {{ item.title + "/" + item2.title }}
                </div>
                <div class="target-detail">
                  <a-select
                    style="width: 300px"
                    v-model:value="submitDetailObject[item2.key]"
                    @change="event => detailChange(event, item2.key)"
                  >
                    <template v-for="op in targetDetailList" :key="op.key">
                      <template v-for="op2 in op.children" :key="op2.key">
                        <a-select-option :value="op2.key">
                          {{ op2.title }}
                        </a-select-option>
                      </template>
                    </template>
                  </a-select>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import { useMessage } from '/@/hooks/web/useMessage'
// 使用 i18n
const { t } = useI18n()
// 使用 useMessage
const { createMessage } = useMessage()

// 数据定义
const visible = ref(false)
const title = ref("新增标准")
const confirmLoading = ref(false)
const id = ref(null)

const urls = {
  categoryUrl: "/sys/category/loadTreeRoot?pcode=A01&async=true",
  categoryDetailUrl: "/sys/category/loadTreeRoot?async=false&pcode=",
  addUrl: "/orgCarbonStandardConversion/addProfessionFromAdmin",
  detailUrl: "/orgCarbonStandardConversion/getDetails",
  editUrl: "/orgCarbonStandardConversion/editFromAdmin",
}

const mainStandrandList = ref([])
const targetStandrandList = ref([])
const chooseMainStandrandId = ref(null)
const chooseTargetStandrandId = ref(null)
const detailList = ref([])
const targetDetailList = ref([])
const submitDetailList = ref([])
const submitDetailObject = ref({})

// 方法定义
const getAllCategory = () => {
  confirmLoading.value = true
  defHttp.get({ url: urls.categoryUrl }, { isTransformResponse: false}).then(res => {
    confirmLoading.value = false
    mainStandrandList.value = res.result
    targetStandrandList.value = res.result
  })
}

const getDetail = (editId) => {
  defHttp.get({ url: urls.detailUrl, params: { id:editId } }, { isTransformResponse: false}).then(res => {
    id.value = editId
    const info = res.result.info
    const data = res.result.data

    // 统一转换为字符串
    const mainId = String(info.mainStandardId)
    const convertId = String(info.convertStandardId)

    chooseMainStandrandId.value = mainId
    chooseTargetStandrandId.value = convertId

    // 查找并加载子项
    const mainItem = mainStandrandList.value.find(e => e.key === mainId)
    if (mainItem) {
      getMainStandradDetails(mainItem)
    }

    const targetItem = targetStandrandList.value.find(e => e.key === convertId)
    if (targetItem) {
      getTargetStandradDetails(targetItem)
    }

    // 初始化 detail 数据
    submitDetailObject.value = {}
    data.forEach(e => {
      const key = String(e.mainStandardId)
      submitDetailObject.value[key] = e.convertId
    })
  })
}

const add = () => {
  visible.value = true
}

const edit = (id) => {
  visible.value = true
  title.value = "编辑标准"
  getDetail(id)
}

const handleCancel = () => {
  visible.value = false
}

const handleOk = () => {
  if (chooseMainStandrandId.value === chooseTargetStandrandId.value) {
    createMessage.error('不能选择同样标准')
    return
  }

  const formattedArray = Object.entries(submitDetailObject.value).map(
    ([key, value]) => ({
      mainStandardId: key,
      convertId: value,
    })
  )

  submitDetailList.value = formattedArray

  const mainInfo = {
    mainStandardId: chooseMainStandrandId.value,
    convertStandardId: chooseTargetStandrandId.value,
  }

  const postData = {
    data: submitDetailList.value,
    info: mainInfo,
  }

  if (!id.value) {
    defHttp.post({ url: urls.addUrl, data: postData }, { isTransformResponse: false}).then(res => {
      if (res.success) {
        createMessage.success('添加成功')
        visible.value = false
        emit('modalFormOk')
      } else {
        createMessage.error(res.message)
      }
    })
  } else {
    postData.info.id = id.value
    defHttp.post({ url: urls.editUrl, data: postData }, { isTransformResponse: false}).then(res => {
      if (res.success) {
        createMessage.success("编辑成功")
        visible.value = false
        emit('modalFormOk')
      } else {
        createMessage.error(res.message)
      }
    })
  }
}

const detailChange = (event, extraParam) => {
  console.log("目标参数:", event)
  console.log("源参数:", extraParam)
  console.log(submitDetailObject.value)
}

const handleChangeO = (value) => {
  chooseMainStandrandId.value = value
  const target = targetStandrandList.value.find(e => e.key == value)
  if (target) {
    target.disabled = true
  }

  const item = mainStandrandList.value.find(e => e.key == value)
  if (item) {
    getMainStandradDetails(item)
  }
}

const getMainStandradDetails = (entity) => {
  defHttp.get({ url: urls.categoryDetailUrl + entity.code }, { isTransformResponse: false}).then(res => {
    detailList.value = res.result
  })
}

const getTargetStandradDetails = (entity) => {
  defHttp.get({ url: urls.categoryDetailUrl + entity.code }, { isTransformResponse: false}).then(res => {
    targetDetailList.value = res.result
  })
}

const handleChangeT = (value) => {
  if (!chooseMainStandrandId.value) {
    createMessage.error("还没有选择标准1")
    return
  }

  if (chooseMainStandrandId.value === chooseTargetStandrandId.value) {
    createMessage.error("不能选择同样标准")
    return
  }

  const item = targetStandrandList.value.find(e => e.key == value)
  if (item) {
    getTargetStandradDetails(item)
  }

  chooseTargetStandrandId.value = value
}

// 生命周期钩子
onMounted(() => {
  getAllCategory()
})

// 定义emits
const emit = defineEmits(['modalFormOk'])

// 在 setup 函数中暴露方法
defineExpose({
  add,
  edit
})

</script>

<style scoped lang="less">
.choose-wrap {
  height: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: auto;
  .choose-title {
    display: flex;
    margin-bottom: 20px;
  }
  .choose-title-item {
    display: flex;
    flex: 1;
    padding-left: 20px;
    align-items: center;
    font-size: 16px;
  }
  .body-item {
    margin-bottom: 10px;
  }
  .main-detail {
    flex: 1;
  }
  .target-detail {
    flex: 1;
  }
  .aaaa {
    display: flex;
    margin-bottom: 3px;
    background-color: #ddd;
    padding: 5px 15px;
    align-items: center;
  }
}
</style>
