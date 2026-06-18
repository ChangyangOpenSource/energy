<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <!-- 搜索框 -->
          <section class="m_cbFlex">
            <section class="searchBoxOutBox" v-click-outside="handleBlur">
              <div class="searchBox">
                <input class="searchBox_input" type="text" :placeholder="$t('carbon.message.Please_enter')" v-model="queryParam.name"
                       placeholder-class="searchBox_input_placeholder" @focus="handleFocus" @keyup.enter="onSearch()"/>
                <img class="searchBox_clear m_hoverCP" :src="img5" alt="" @click="onReset"
                     v-if="queryParam.name"/>
                <img class="searchBox_searchIcon m_hoverCP" :src="img18" alt="" @click="onSearch"/>
              </div>
              <div class="searchRecordsBox" v-if="isShowSearchRecords">
                <div class="searchRecordsBox_header">
                  {{ $t('carbon.message.History') }}
                  <div class="searchRecordsBox_header_line"></div>
                </div>
                <div v-if="searchRecordsData && searchRecordsData.length > 0">
                  <div class="searchRecordsBox_item m_hoverCP" v-for="(item, index) in searchRecordsData" :key="index"
                       @click="onChangeName(item)">
                    {{ item }}
                  </div>
                </div>
                <div class="searchRecordsBox_noData" v-else>-{{ $t('carbon.message.No_data') }}-</div>
              </div>
            </section>
            <section class="browseRecordsOutBox" v-click-outside="closeIsShowBrowseRecords">
              <div class="browseRecordsBtn m_hoverCP" @click="onChangeIsShowBrowseRecords">{{ $t('carbon.message.Browse_records') }}</div>
              <div class="browseRecordsBox" v-if="isShowBrowseRecords">
                <div v-if="historyRecordData && historyRecordData.length > 0">
                  <div class="browseRecordsBox_item" :title="item.name || ''" v-for="(item, index) in historyRecordData"
                       :key="index">
                    <div class="browseRecordsBox_item_text m_hoverCP" @click="onDetail({id:item.id})">
                      <div class="browseRecordsBox_item_text1 m_pass_1line_hidden">
                        {{ item.name }}
                      </div>
                      <div class="browseRecordsBox_item_text2 m_pass_1line_hidden">
                        {{ (Number(item.factorValue)).toFixed(4) }}
                        {{ item.numeratorUnit }}/
                        {{ item.denominatorUnit }}
                      </div>
                    </div>
                    <div class="m_cFlex">
                      <img class="browseRecordsBox_item_copyIcon m_hoverCP" :src="img25" alt=""
                           @click="onCopy(item, index)"/>
                      <img class="browseRecordsBox_item_collectIcon m_hoverCP" :src="img11" alt=""
                           @click="onCollect(item, index)"
                           v-if="item.collectStatus === '1' && item.type == 1"/>
                      <img class="browseRecordsBox_item_collectIcon m_hoverCP" :src="img12" alt=""
                           @click="onCollect(item, index)"
                           v-if="item.collectStatus === '0' && item.type == 1"/>
                      <img class="browseRecordsBox_item_collectIcon" :src="img12" alt=""
                           style="opacity: 0;" v-if="item.type == 2"/>
                    </div>
                  </div>
                </div>
                <div class="browseRecordsBox_noData" v-else>
                  <img class="browseRecordsBox_noData_img" :src="img26" alt=""/>
                  <div class="browseRecordsBox_noData_text">-{{ $t('carbon.message.No_data') }}-</div>
                </div>
              </div>
            </section>
          </section>
          <!-- 相关行业筛选 -->
          <section class="screenBox">
            <div class="screenBox_box1">
              <div class="screenBox_box1_label"> {{ $t('carbon.message.Related_industries') }}：</div>
              <div class="screenBox_box1_content">
                <div class="screenBox_box1_content_item m_hoverCP"
                     :class="{ 'screenBox_box1_content_item_active': queryParam.industryId === item.id || !queryParam.industryId && !item.id && searched }"
                     v-for="(item, index) in industryData" :key="item.id" @click="onChangeScreenKey(item)">
                  {{ item.name }}<span v-if="showNum">({{ item.totalNum || 0 }})</span>
                </div>
              </div>
            </div>
          </section>
          <section>
            <section class="searchContent" v-if="openListData && openListData.length > 0">
              <div style="width: 100%">
                <div class="cardList">
                  <div class="cardItem" v-for="(item, index)  in openListData" :key="index"
                       @click="onDetail(item)">
                    <yzCard :item="item" @change="getData"></yzCard>
                  </div>
                </div>
                <a-pagination show-size-changer show-quick-jumper v-model:current="pageObj.pageNo"
                              v-model:page-size="pageObj.pageSize" :total="pageObj.total"
                              :page-size-options="pageObj.pageSizeOptions"
                              :show-total="(total, range) => range[0] + '-' + range[1] + ' 共' + total + '条'"
                              style="margin: 24px auto 0;width: fit-content;"
                              @change="onChangePage" @show-size-change="onChangePageSize">
                  <template #buildOptionText="{ value }">
                    <span>{{ value }}条/页</span>
                  </template>
                </a-pagination>
              </div>
            </section>
            <section class="searchContent" v-else>
              <emptyBox :text1="$t('carbon.message.Sorry__there_are_no_relevant_search_results')"
                        :text2="$t('carbon.message.Welcome_to_contact_us_and_make_suggestions')"
                        :btnText="$t('carbon.message.Contact_us')"
                        @change="onConcat"></emptyBox>
            </section>
          </section>
        </div>
      </a-card>
    </div>
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <tpyzDetail ref="tpyzDetailRef" @back="back"></tpyzDetail>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { useRouter } from 'vue-router';
import { defHttp } from '/@/utils/http/axios'
import { getToken } from "/@/utils/auth"
import emptyBox from '/@/components/common/emptyBox.vue'
import yzCard from "/@/components/common/yzCard2.vue"
import tpyzDetail from './modules/tpyzDetail.vue'
import { INDUSTRY } from "@/common/constKey"

import img5 from '@/assets/img/img5.png'
import img11 from '@/assets/img/img11.png'
import img12 from '@/assets/img/img12.png'
import img18 from '@/assets/img/img18.png'
import img25 from '@/assets/img/img25.png'
import img26 from '@/assets/img/img26.png'



import {
  get_TPYZ_SearchRecords,
  set_TPYZ_SearchRecords
} from "@/common/storage"

// 国际化和消息提示
const { t } = useI18n()
const $message = useMessage()
const router = useRouter()

// 引用元素
const tpyzDetailRef = ref(null)

// 响应式数据
const token = ref(getToken())
const isShowSearchRecords = ref(false)
const searchRecordsData = ref([])
const isShowBrowseRecords = ref(false)
const historyRecordData = ref([])
const isShowDetailPopup = ref(false)
const categoryChildList = ref([])
const topSearchFactorData = ref([])
const newPublishFactorData = ref([])
const openListData = ref([])
const IndustryTypeBadgeData = ref([])
const industryData = ref([])
const searched = ref(false)
const showNum = ref(false)

// 查询参数
const queryParam = reactive({
  type: 1, // 类型（1=碳排因子库，2=组织因子库）
  token: getToken(),
})

// 分页配置
const pageObj = reactive({
  pageNo: 1,
  pageSize: 12,
  total: 0,
  pageSizeOptions: ['12', '24', '36', '48', '60'],
})

// 路由监听
watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    pageObj.pageNo = 1
    onSearch()
  }
)

// 方法定义
/**
 * 修改页码
 */
const onChangePage = (page, pageSize) => {
  console.log('onChangePage', page, pageSize)
  pageObj.pageNo = page
  onSearch()
}

/**
 * 修改每页条数
 */
const onChangePageSize = (current, size) => {
  console.log('onChangePageSize', current, size)
  pageObj.pageNo = 1
  pageObj.pageSize = size
  onSearch()
}

/**
 * 选择搜索历史记录
 */
const onChangeName = (item) => {
  console.log('onChangeName', item)
  queryParam.name = item
  handleBlur()
  onSearch()
}

/**
 * 显示搜索历史记录
 */
const handleFocus = () => {
  isShowSearchRecords.value = !isShowSearchRecords.value
}

/**
 * 隐藏搜索历史记录
 */
const handleBlur = () => {
  isShowSearchRecords.value = false
}

/**
 * 因子详情
 */
const onDetail = (item) => {
  if (!token.value) {
    $message.createMessage.warning(t('carbon.message.Please_log_in'))
    router.push('/user/login')
    return
  }
  isShowDetailPopup.value = true
  nextTick(() => {
    console.log('onDetail', tpyzDetailRef.value)
    tpyzDetailRef.value.detailIndex = 0
    tpyzDetailRef.value.detailKeys = [item.id]
    tpyzDetailRef.value.getData()
  })
}

/**
 * 显示/隐藏浏览记录
 */
const onChangeIsShowBrowseRecords = () => {
  isShowBrowseRecords.value = !isShowBrowseRecords.value
}

/**
 * 隐藏浏览记录
 */
const closeIsShowBrowseRecords = () => {
  console.log('closeIsShowBrowseRecords')
  isShowBrowseRecords.value = false
}

const back = () => {
  isShowDetailPopup.value = false
  getData()
}

/**
 * 联系
 */
const onConcat = () => {
  console.log('onConcat')
  $message.createMessage.success(t('carbon.message.Contact_us'))
}

const onSearch = () => {
  // 筛选因子
  // 关闭搜索历史记录
  isShowSearchRecords.value = false
  if (queryParam.name) {
    // 记录搜索记录历史
    let theIndex = searchRecordsData.value.findIndex(ele => ele == queryParam.name)
    // 重复的删除
    if (theIndex > -1) {
      searchRecordsData.value.splice(theIndex, 1)
    }
    // 记录最新的一条
    searchRecordsData.value.unshift(queryParam.name)
    // 最多记录5条
    if (searchRecordsData.value.length > 5) {
      searchRecordsData.value = searchRecordsData.value.slice(0, 5)
    }
    set_TPYZ_SearchRecords(searchRecordsData.value)
  }
  searched.value = true
  queryParam.pageNo = pageObj.pageNo
  queryParam.pageSize = pageObj.pageSize
  queryParam.state = 1 // 用于区分：碳排因子库-碳排因子库、管理平台-碳排因子库
  // const pathParts = router.currentRoute.value.path.split('=')
  // queryParam.emissionFactorDatabase = pathParts[1] || '1'

  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/list',
    params: queryParam
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      openListData.value = res.result.records || []
      pageObj.total = res.result.total
      if (queryParam.name) {
        showNum.value = true
        if (!queryParam.industryId) {
          IndustryTypeBadge()
        }
      } else {
        showNum.value = false
      }
    }
  })
}

/**
 * 获取行业统计数量
 */
const IndustryTypeBadge = () => {
  defHttp.get({ url: '/emission/factor/cyEmissionFactor/IndustryTypeBadge' }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      IndustryTypeBadgeData.value = res.result || {}
      // 其他行业
      industryData.value.forEach(item => {
        item.totalNum = 0
        for (const [key, value] of Object.entries(IndustryTypeBadgeData.value)) {
          if (item.id == key) {
            item.totalNum = value
          }
        }
      })
      // 全行业
      let total = 0
      for (const [key, value] of Object.entries(IndustryTypeBadgeData.value)) {
        total = total + value
      }
      industryData.value[0].totalNum = total
      console.log('industryData', industryData.value)
    }
  })
}

const onReset = () => {
  delete queryParam.name
  delete queryParam.industryId
  onSearch()
}

const getData = () => {
  // 行业
  if (token.value) {
    // 登录
    defHttp.get({
      url: '/sys/category/childList',
      params: { pid: INDUSTRY }
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        let industryDataTemp = [{
          name: t('carbon.message.whole_industry'),
          id: ''
        }]
        industryData.value = industryDataTemp.concat(res.result || [])
      }
    })
    // 浏览记录数据
    defHttp.get({ url: '/emission/factor/cyEmissionFactor/historyRecord' }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        historyRecordData.value = res.result || []
      }
    })
  } else {
    // 未登录
    defHttp.get({ url: '/emission/factor/cyEmissionFactor/industryCategory' }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        let industryDataTemp = [{
          name: t('carbon.message.whole_industry'),
          id: ''
        }]
        industryData.value = industryDataTemp.concat(res.result || [])
      }
    })
  }
  if (searched.value) {
    // 筛选状态
    onSearch()
  } else {
    // 非筛选状态
    // 热门搜索因子
    defHttp.get({
      url: '/emission/factor/cyEmissionFactor/topSearchFactor',
      params: {
        SearchNum: 8,
        token: getToken(),
      }
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        topSearchFactorData.value = res.result || []
      }
    })
    // 最新发布因子
    defHttp.get({
      url: '/emission/factor/cyEmissionFactor/newPublishFactor',
      params: {
        Number: 4,
        token: getToken(),
      }
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        newPublishFactorData.value = res.result || []
      }
    })
  }
}

/**
 * 相关行业筛选-切换
 */
const onChangeScreenKey = (item) => {
  queryParam.industryId = item.id
  onSearch()
}

/**
 * 浏览记录-复制
 */
const onCopy = (item, index) => {
  let copyMsg = `${item.name} ${item.factorValue} ${item.numeratorUnit}/${item.denominatorUnit}`
  copyText(copyMsg)
}

/**
 * 复制到剪切板
 */
function copyText(text, tipMsg) {
  // 复制文本
  const element = createElement(text);
  element.select();
  element.setSelectionRange(0, element.value.length);
  document.execCommand('copy');
  element.remove();

  // 使用Vue 3的方式显示成功消息
  createMessage.success(tipMsg || t('carbon.message.copied_to_clipboard'));

  // 创建临时的输入框元素
  function createElement(text) {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const element = document.createElement('textarea');
    // 防止在ios中产生缩放效果
    element.style.fontSize = '12pt';
    // 重置盒模型
    element.style.border = '0';
    element.style.padding = '0';
    element.style.margin = '0';
    // 将元素移到屏幕外
    element.style.position = 'absolute';
    element.style[isRTL ? 'right' : 'left'] = '-9999px';
    // 移动元素到页面底部
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    element.style.top = `${yPosition}px`;
    // 设置元素只读
    element.setAttribute('readonly', '');
    element.value = text;
    document.body.appendChild(element);
    return element;
  }
}

/**
 * 浏览记录-收藏
 */
const onCollect = (item, index) => {
  if (item.collectStatus === '1') {
    // 取消收藏
    defHttp.delete({
      url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',
      params: { id: item.id }
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        $message.createMessage.success(t('carbon.message.delete_collect_success'))
        getData()
      }
    })
  } else if (item.collectStatus === '0') {
    // 收藏
    defHttp.get({
      url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/add',
      params: { id: item.id }
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        $message.createMessage.success(t('carbon.message.collect_success'))
        getData()
      }
    })
  }
}

// 生命周期钩子
onMounted(() => {
  searchRecordsData.value = get_TPYZ_SearchRecords() || []
  console.log('searchRecordsData', searchRecordsData.value)
  getData()
  searched.value = true
  queryParam.industryId = ''
  //获取路由参数
  console.log('queryParam', router.currentRoute.value.path)
  //切割等号后面的数据
  setTimeout(() => {
    onSearch()
  }, 500)
})
defineExpose({
  queryParam
})
</script>

<style lang="less" scoped>
:deep(.ant-card-body) {
  background: #F5F8F7;
}

.searchContent {
  margin-top: 24px;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 3px;
}

.searchBoxOutBox {
  position: relative;

  .searchBox {
    padding: 0 4px 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 372px;
    height: 32px;
    background: #FFFFFF;
    box-shadow: 2px 2px 0px 0px rgba(20, 137, 88, 0.08);
    border-radius: 3px;
    border: 1px solid #148958;

    .searchBox_input {
      width: 300px;
      height: 22px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
      border: none;
      outline: none;
    }

    .searchBox_input_placeholder {
      color: rgba(0, 0, 0, 0.4);
    }

    .searchBox_clear {
      width: 16px;
      height: 16px;
    }

    .searchBox_searchIcon {
      width: 24px;
      height: 24px;
    }
  }

  .searchRecordsBox {
    position: absolute;
    z-index: 3;
    top: 40px;
    left: 0;
    padding: 6px 13px 0;
    width: 372px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
  }

  .searchRecordsBox_header {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }

  .searchRecordsBox_header_line {
    flex: 1;
    height: 1px;
    background: #E7E7E7;
  }

  .searchRecordsBox_noData {
    margin-bottom: 10px;
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .searchRecordsBox_item {
    margin-bottom: 10px;
    width: 346px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
  }

  .searchRecordsBox_item:hover {
    background: #E3F9E9;
  }
}

.browseRecordsOutBox {
  position: relative;

  .browseRecordsBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 80px;
    padding: 0 5px;
    height: 24px;
    background: #FFFFFF;
    border-radius: 2px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
  }

  .browseRecordsBox {
    position: absolute;
    z-index: 3;
    top: 32px;
    right: 0;
    padding: 12px;
    background: #FFFFFF;
    box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.07);
    border-radius: 3px;

    .browseRecordsBox_noData {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 251px;
      height: 172px;

      .browseRecordsBox_noData_img {
        display: block;
        width: 62px;
        height: 62px;
      }

      .browseRecordsBox_noData_text {
        margin-top: 7px;
        text-align: center;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #888888;
      }
    }

    .browseRecordsBox_item {
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .browseRecordsBox_item:last-child {
      margin-bottom: 0;
    }

    .browseRecordsBox_item_text {
      width: 250px;
      display: flex;
    }

    .browseRecordsBox_item_text1 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      //==========================
      max-width: 100px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }

    .browseRecordsBox_item_text2 {
      margin-left: 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #148958;
      line-height: 22px;
      //==========================
      max-width: 150px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }

    .browseRecordsBox_item_copyIcon {
      margin-left: 3px;
      width: 18px;
      height: 18px;
    }

    .browseRecordsBox_item_collectIcon {
      margin-left: 7px;
      width: 18px;
      height: 18px;
    }
  }
}

.screenBox {
  margin-top: 25px;
  padding: 26px 16px;
  background: #FFFFFF;
  border-radius: 3px;

  .screenBox_box1 {
    display: flex;
    align-items: flex-start;
  }

  .screenBox_box1_label {
    // width: 70px;
    height: 20px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    line-height: 16px;
    transform: translateY(4px);
  }

  .screenBox_box1_content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .screenBox_box1_content_item {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 24px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #CDCDCD;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #333333;

    img {
      margin-left: 4px;
      width: 10px;
      height: 10px;
    }
  }

  .screenBox_box1_content_item_active {
    border-color: #148958;
    color: #148958;
  }
}

.list_card {
  margin-top: 25px;
  background: #FFFFFF;
  border-radius: 3px;
  padding: 17px 25px 25px;

  .list_card_title {
    display: flex;
    align-items: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: #333333;

    img {
      margin-right: 8px;
      width: 22px;
      height: 22px;
    }
  }
}

.cardList {
  width: 100%;
  gap: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

  .cardItem {
  }
}
</style>
