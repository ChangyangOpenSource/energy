<template>
  <div style="position: relative">
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <div class="tabBox marBottom" style="padding-bottom: 20px;">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="24">
                  <a-col :xl="12" :lg="12" :md="12" :sm="12">
                    <a-form-item
                      :label="t('carbon.message.Product_name')"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 14 }"
                    >
                      <a-input
                        class="input"
                        type="text"
                        :placeholder="t('carbon.message.Please_enter')"
                        v-model:value="queryParam.productName"
                        style="width: 200px;"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :xl="6" :lg="6" :md="6" :sm="6">
                    <div style="display: flex; align-items: center; height: 32px;">
                      <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery" style="margin-right: 8px;">
                        {{ t('carbon.message.Search') }}
                      </a-button>
                      <a-button preIcon="ant-design:reload-outlined" @click="searchReset" >
                        {{ t("carbon.message.Reset") }}
                      </a-button>
                    </div>
                  </a-col>

                  <a-col :xl="6" :lg="6" :md="6" :sm="6">
                    <div style="display: flex; justify-content: flex-end; height: 32px;">
                      <a-button preIcon="ant-design:plus-outlined"   @click="onAdd" type="primary">
                        {{ t('carbon.message.Add_product') }}
                      </a-button>
                    </div>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>

          <!-- 第二个白色框：产品分类和分类管理按钮 -->
          <div class="tabBox marBottom" style="padding: 12px 24px;">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row>
                  <a-col :span="18">
                    <div style="margin-top: 6px;">
                      <span style="margin-right: 8px;">{{ t('carbon.message.productCategory') }}：</span>
                      <template v-for="(item, index) in productClassificationList" :key="item.id">
                        <a-tag
                          :class="{
                            'custom-tag': true,
                            'active': selectProductClassification === item.id
                          }"
                          @click="handleCategoryChange(item.id)"
                          style="margin-right: 8px; cursor: pointer;"
                        >
                          {{ item.name }}
                        </a-tag>
                      </template>
                    </div>
                  </a-col>
                  <a-col :span="6" style="text-align: right;">
                    <a-button preIcon="ant-design:plus-outlined"  type="primary" @click="handleCategoryManage">{{ t('carbon.message.categoryManagement') }}</a-button>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>


          <section class="cardBox">
            <div
              class="cardBox_item"
              v-for="(item, index) in dataSource"
              :key="index"
            >
              <a-popconfirm
                :title="t('carbon.message.Confirm_delete')"
                :cancelText="t('carbon.message.Cancel')"
                :okText="t('carbon.message.Confirm')"
                @confirm="() => onDelete(item)"
              >
                <div class="cardBox_item_delBtn m_hoverCP">
                  <img
                    class="cardBox_item_delBtn_img1"
                    src="../../../assets/img/img33.png"
                    alt=""
                  />
                  <img
                    class="cardBox_item_delBtn_img2"
                    src="../../../assets/img/img34.png"
                    alt=""
                  />
                </div>
              </a-popconfirm>
              <div class="" @click="onDetail(item, index)">
                <section class="cardBox_item_box1">
                  <img
                    v-if="item.productPic"
                    class="cardBox_item_box1_img"
                    :src="getAvatarView(item.productPic)"
                    alt=""
                  />
                  <img
                    v-else
                    class="cardBox_item_box1_img"
                    src="@/assets/carbon/img16.png"
                    alt=""
                  />

                  <div class="cardBox_item_box1_text">
                    <div class="cardBox_item_box1_text1">
                      {{ item.productName || "-" }}
                    </div>
                    <div class="cardBox_item_box1_text2">
                      {{ item.productCode || "-" }}
                    </div>
                  </div>
                </section>
                <section class="cardBox_item_box2">
                  <div class="cardBox_item_box2_item">
                    <div class="cardBox_item_box2_item_label">
                      {{ t("carbon.message.Specifications_and_models") }}：
                    </div>
                    <div class="cardBox_item_box2_item_content">
                      {{ item.productSpecification || "-" }}
                    </div>
                  </div>
                  <div class="cardBox_item_box2_item">
                    <div class="cardBox_item_box2_item_label">
                      {{ t("carbon.message.Unit") }}：
                    </div>
                    <div class="cardBox_item_box2_item_content">
                      {{ item.productUnitName || "-" }}
                    </div>
                  </div>
                  <div class="cardBox_item_box2_item">
                    <div class="cardBox_item_box2_item_label">
                      {{ t("carbon.message.Product_weight") }}：
                    </div>
                    <div class="cardBox_item_box2_item_content">
                      {{
                        item.productWeight || "-"
                      }}{{ item.productWeightUnit }}
                    </div>
                  </div>
                </section>
                <div class="cardBox_item_hr"></div>
                <section class="cardBox_item_box3">
                  <div class="cardBox_item_box3_item">
                    <div
                      class="cardBox_item_box3_item_content"
                      style="color: #148958"
                    >
                      {{ item.modelTotal || "0" }}
                    </div>
                    <div class="cardBox_item_box3_item_label">
                      {{ t("carbon.message.Model_creation") }}
                    </div>
                  </div>
                  <div class="cardBox_item_box3_item">
                    <div
                      class="cardBox_item_box3_item_content"
                      style="color: #e37318"
                    >
                      {{ item.completeTotal || "0" }}
                    </div>
                    <div class="cardBox_item_box3_item_label">
                      {{ t("carbon.message.Accounting_completion") }}
                    </div>
                  </div>
                  <div class="cardBox_item_box3_item">
                    <div
                      class="cardBox_item_box3_item_content"
                      style="color: #333333"
                    >
                      {{ item.archivedTotal || "0" }}
                    </div>
                    <div class="cardBox_item_box3_item_label">
                      {{ t("carbon.message.Archived") }}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </a-card>
    </div>
    <!-- 分类管理弹窗 -->
    <CyFootprintProductClassificationModal ref="classificationModal" @back="classificationBack"  @refreshPage="refreshFullPage"></CyFootprintProductClassificationModal>
    <!-- 添加产品弹窗 -->
    <addfootprintProductForm ref="addFootprintProductForm" @back="back" />

    <!-- 详情弹窗 -->
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <footprintProductDetail
        ref="footprintProductDetails"
        @back="back"
        @update="updateData"
      ></footprintProductDetail>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from '/@/hooks/web/useMessage'
import { useI18n } from '/@/hooks/web/useI18n'
import {
  get_TPYZ_ProductId,
  remove_TPYZ_ProductId,
  get_From_Flag,
  remove_From_Flag
} from "@/common/storage"
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import footprintProductDetail from "../footprintProductView/modules/footprintProductDetail.vue"
import CyFootprintProductClassificationModal from "../footprintProductView/modules/CyFootprintProductClassificationModal.vue"
import addfootprintProductForm from "../footprintProductView/modules/addfootprintProductForm.vue"
import {defHttp} from "@/utils/http/axios";

// 使用 Composition API 的工具
const { t } = useI18n()
const { createMessage } = useMessage()
const router = useRouter()

// 定义 refs
const classificationModal = ref()
const addFootprintProductForm = ref()
const footprintProductDetails = ref()


// 定义响应式数据
const loading = ref(false)
const queryParam = reactive({
  productName: '', // 产品名称
  productTypeId: '', // 产品类型ID
  productClassificationId: null // 产品分类ID
})
const dataSource = ref([]) // 产品数据
const isShowDetailPopup = ref(false) // 详情弹窗
const productTypeData = ref([])
const productClassificationList = ref([]) //存储从后端获取的所有产品分类
const selectProductClassification = ref(null) // 当前选中的分类（ID），默认未选
const pageNum = ref(1) // 页码

/*
* 分类管理
* */
function handleCategoryManage() {
  console.log("classificationModal.value",classificationModal.value)
  classificationModal.value.open()
}

function handleCategoryChange(productClassificationId) {
  selectProductClassification.value = productClassificationId
  queryParam.productClassificationId = productClassificationId // 同步到查询参数
  pageNum.value = 1 // 切换分类，重置页码为第 1 页
  getData() // 执行带条件的分页查询
}

/*
* 获取产品分类列表
* */
function getProductClassificationList(){
  defHttp.get({url: '/cyFootprintProductClassification/cyFootprintProductClassification/all'}).then(res => {
    if (res) {
      console.log('获取到的分类数据:', res)
      productClassificationList.value = res
    } else {
      createMessage.error('获取分类失败')
    }
  }).catch(error => {
    console.error('获取分类出错：', error)
    createMessage.error('网络异常，请稍后重试')
  })
}

/**
 * 查询
 */
function searchQuery() {
  console.log("searchQuery")
  getData()
}

/**
 * 重置
 */
function searchReset() {
  Object.assign(queryParam, {
    productName: '',
    productTypeId: '',
    productClassificationId: null // 重置分类ID
  })
  selectProductClassification.value = null // 重置选中状态
  getData()
}

/**
 * 下拉框数据过滤
 */
function filterOption(input, option) {
  return (
    option.componentOptions.children[0].text
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
  )
}

function getAvatarView(avatar) {
  return getFileAccessHttpUrl(avatar)
}

/**
 * 添加产品
 */
function onAdd() {
  addFootprintProductForm.value.getData()
  addFootprintProductForm.value.visible = true
}

/**
 * 删除产品
 */
function onDelete(item) {
  defHttp.post({url: "/footprintProduct/cyFootprintProduct/delProduct", params:{
      productId: item.id
    }}).then((res) => {
    if (res) {
      getData()
    }
  })
}

/**
 * 详情
 */
function onDetail(item, index) {
  console.log("onDetail",dataSource.value, item, index)
  isShowDetailPopup.value = true
  nextTick(() => {
    console.log("onDetail", footprintProductDetails.value)
      footprintProductDetails.value.ProductI = index
      footprintProductDetails.value.ProductS = dataSource.value
      footprintProductDetails.value.getData()
  })
}

/**
 * 更新数据
 */
function updateData() {
  defHttp.get({url:"/footprintProduct/cyFootprintProduct/getProductList",params: queryParam}).then((res) => {
      dataSource.value = res || []
    footprintProductDetails.value.ProductS = dataSource.value
  })
}

function back() {
  // 如果是从'产品碳足迹-碳足迹看板'，点击'查看更多'跳转到'产品碳足迹-产品碳足迹'，返回时需要回到'产品碳足迹-碳足迹看板'
  if (get_From_Flag()) {
    if(get_From_Flag() == 1){
      remove_From_Flag()
      router.push({
        path: "/footprint/footprintHomeView/footprintHomeView",
      })
    }
  }else{
    isShowDetailPopup.value = false
    getData()
  }
}

function classificationBack() {
  getData()
}

// 全量刷新页面数据
function refreshFullPage() {
  getData() // 刷新产品列表
  pageNum.value = 1
}

function getData() {
  defHttp.get({url:"/footprintProduct/cyFootprintProduct/getProductList",params:queryParam}
  ).then((res) => {
      dataSource.value = res || []
      // 从'产品碳足迹-碳足迹看板'，点击'查看更多'跳转到'产品碳足迹-产品碳足迹'打开详情
      if (get_TPYZ_ProductId()) {
        res.forEach((item, index) => {
          if (item.id == get_TPYZ_ProductId()) {
            onDetail(item, index)
            remove_TPYZ_ProductId()
          }
        })
      }
  })

  // 产品类型
  defHttp.get({url: `/sys/dict/getDictItems/product_type`}).then((res) => {
    productTypeData.value = res || []
    console.log('getDictItems product_type =>', res)
  })

  getProductClassificationList()
}

// 生命周期钩子
onMounted(() => {
  getData()
  getProductClassificationList()
})
</script>

<style lang="less" scoped>
// 分类标签样式
.custom-tag {
  border: none !important;
  background: transparent !important;
  color: #333333 !important;
  padding: 2px 8px !important;
  font-size: 14px !important;
}

.custom-tag.active {
  color: #148958 !important;
  font-weight: 500 !important;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.custom-tag:hover {
  background: rgba(24, 144, 255, 0.05) !important;
}

/deep/ .ant-card-body {
  background: #f5f8f7;
}

.marBottom {
  margin-bottom: 24px;
}

.tabBox {
  padding: 24px 24px 24px;
  background: #ffffff;
  border-radius: 3px;
}

.cardBox {
  margin-top: 16px;
  display: grid;
  // grid-template-columns: repeat(4, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  row-gap: 24px;
  column-gap: 19px;

  .cardBox_item {
    position: relative;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 3px;
    padding: 24px;
  }

  .cardBox_item_box1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cardBox_item_box1_img {
    margin-right: 16px;
    width: 60px;
    height: 60px;
  }

  .cardBox_item_box1_text {
    flex: 1;
  }

  .cardBox_item_box1_text1 {
    width: 80%;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-break: anywhere;
  }

  .cardBox_item_box1_text2 {
    width: 80%;
    margin-top: 7px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
    line-break: anywhere;
  }

  .cardBox_item_delBtn {
    position: absolute;
    z-index: 2;
    top: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #eeeeee;

    img {
      width: 16px;
      height: 16px;
    }

    .cardBox_item_delBtn_img1 {
      display: block;
    }

    .cardBox_item_delBtn_img2 {
      display: none;
    }
  }

  .cardBox_item_delBtn:hover {
    border: 1px solid #148958;

    .cardBox_item_delBtn_img1 {
      display: none;
    }

    .cardBox_item_delBtn_img2 {
      display: block;
    }
  }

  .cardBox_item_box2 {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cardBox_item_box2_item {
  }

  .cardBox_item_box2_item_label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .cardBox_item_box2_item_content {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .cardBox_item_hr {
    margin-top: 16px;
    width: 100%;
    height: 1px;
    background: #e7e7e7;
  }

  .cardBox_item_box3 {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cardBox_item_box3_item {
  }

  .cardBox_item_box3_item_content {
    text-align: center;
    font-family: DIN, DIN;
    font-weight: 500;
    font-size: 18px;
    color: #148958;
  }

  .cardBox_item_box3_item_label {
    margin-top: 6px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }
}

.optionBox {
  display: flex;
  justify-content: flex-end;
}

.addBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  height: 30px;
  background: #148958;
  border-radius: 3px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
}
</style>
