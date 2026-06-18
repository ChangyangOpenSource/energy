<template>
  <div class="">
    <div class="cardHeader">
      <img class="cardHeader_icon m_hoverCP" :src="img28" alt="" @click="onBack"/>
      <span class="m_hoverCP" @click="onBack">返回</span>
    </div>
    <section class="contentBox">
      <div class="content_left">
        <section class="tpyzxxBox">
          <div class="titleBox">碳排放因子信息</div>
          <section class="box2">
            <div class="box2_tr1">
              <div class="box2_tr1_text1"> {{ dataSource.emissionFactorObject.name }}</div>
            </div>
            <div class="box2_tr2">
              <div class="box2_tr2_text1">
                <div class="box2_tr2_text1_a"> {{ (Number(dataSource.emissionFactorDataObject.factorValue)).toFixed(4) }}</div>
                <div class="box2_tr2_text1_b">
                  {{
                    dataSource.emissionFactorDataObject.numeratorUnit
                  }}/{{ dataSource.emissionFactorDataObject.denominatorUnit }}
                </div>
              </div>
              <div class="box2_tr2_text2" v-if="dataSource.emissionFactorObject.type == 1"> 碳排因子库<span v-if="dataSource.emissionFactorDatabaseDict">/{{dataSource.emissionFactorDatabaseDict}}</span></div>
              <div class="box2_tr2_text2" v-if="dataSource.emissionFactorObject.type == 2"> 组织因子库<span v-if="dataSource.emissionFactorDatabaseDict">/{{dataSource.emissionFactorDatabaseDict}}</span></div>
            </div>
          </section>

          <section class="box3">
            <div class="box3_item">
              <div class="box3_item_label">规格型号:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.model || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">适用行业:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.industry || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">因子分类:</div>
              <div class="box3_item_content">{{ dataSource.productClassificationDict || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">适用场景:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.scene || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">GWP版本:</div>
              <div class="box3_item_content">{{ dataSource.gwpVersionDict || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">排放系数种类:</div>
              <div class="box3_item_content">{{ dataSource.categoryDict || '-' }}</div>
            </div>
          </section>

          <div class="gas_table">
            <a-table :columns="columns" :data-source="dataSource.gasList" :pagination="false" :bordered="false" row-key="id" size="middle">
              <template #factorValue="{ text, record }">
                {{ (Number(record.factorValue)).toFixed(4) }}
              </template>
              <template #theUnit="{ text, record }">
                {{ record.molecularUnit }}/{{ record.denominatorUnit }}
              </template>
              <template #gwpValue>
                <div class="m_ccFlex">
                  GWP值
                  <a-popover placement="bottomRight">
                    <template #content>
                      <div class="popoverBox">
                        <img class="popoverBox_icon m_hoverCP" :src="img32" alt=""/>
                        <div class="popoverBox_text">
                          <div class="popoverBox_text_a"> 说明</div>
                          <div class="popoverBox_text_b">
                            全球升温潜能值，是将特定气体和相同质量二氧化碳比<br> 较之下，造成全球变暖的相对能力
                          </div>
                        </div>
                      </div>
                    </template>
                    <a-icon type="question-circle" style="margin-left: 8px;transform: translateY(1px);"/>
                  </a-popover>
                </div>
              </template>
            </a-table>
          </div>
        </section>

        <section class="lyxxBox">
          <div class="titleBox2">创建信息</div>
          <section class="box3">
            <div class="box3_item">
              <div class="box3_item_label">创建人:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.createBy || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">发布人:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.updateBy || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">创建时间:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.createTime || '-' }}</div>
            </div>
            <div class="box3_item">
              <div class="box3_item_label">发布时间:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.updateTime || '-' }}</div>
            </div>
          </section>
        </section>

        <section class="lyxxBox">
          <div class="titleBox2">来源信息</div>
          <section class="box3">
            <div class="box3_item">
              <div class="box3_item_label">发布机构:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.releaseOrg || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">发布年份:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.releaseYear || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">文献类型:</div>
              <div class="box3_item_content">{{ dataSource.docTypeDict || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">来源类型:</div>
              <div class="box3_item_content">{{ dataSource.sourceTypeDict || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">适用地区:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.ownership || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">来源文件:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.sourceFile || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">来源网址链接:</div>
              <div class="box3_item_content">{{ dataSource.emissionFactorObject.sourceUrlLink || '-' }}</div>
            </div>

            <div class="box3_item">
              <div class="box3_item_label">附件:</div>
              <div class="box3_item_content">
                <j-upload v-model:value="dataSource.emissionFactorObject.attachments" disabled :number="3"></j-upload>
              </div>
            </div>
          </section>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import yzCard from "/@/components/common/yzCard.vue";

// Import images
import img28 from '@/assets/img/img28.png';
import img32 from '@/assets/img/img32.png';

export default defineComponent({
  name: 'tpyzDetail',
  components: {
    yzCard,
  },
  setup(props, { emit }) {
    const { createMessage } = useMessage();

    // Data properties
    const visible = ref(false);
    const columns = reactive([{
      title: '温室气体类型',
      align: 'center',
      dataIndex: 'gasName',
    }, {
      title: '因子数值',
      align: 'center',
      dataIndex: 'factorValue',
      slots: { customRender: 'factorValue' },
    }, {
      title: '因子单位',
      align: 'center',
      slots: { customRender: 'theUnit' },
    }, {
      align: 'center',
      dataIndex: 'gwpValue',
      slots: { customRender: 'gwpValue' },
    }]);

    const dataSource = reactive({
      emissionFactorDataObject: {},
      emissionFactorObject: {},
      gasList: [],
    });

    const topSearchFactorData = ref([]);
    const isShouCang = ref(false);
    const detailIndex = ref(0); // 当前详情索引
    const detailKeys = ref([]); // 当前详情所有keys
    const fangLianDian = ref(true);


    // Methods
    const onDetail = (item) => {
      if (detailKeys.value[detailIndex.value] == item.id) {
        return;
      }
      if (fangLianDian.value) {
        detailIndex.value = detailIndex.value + 1;
        detailKeys.value.push(item.id);
        getData();
      }
    };

    const onBack = () => {
      if (fangLianDian.value) {
        if (detailIndex.value == 0) {
          emit('back');
        } else {
          detailIndex.value = detailIndex.value - 1;
          detailKeys.value.pop();
          getData();
        }
      }
    };

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e) => {
      console.log(e);
      visible.value = false;
    };

    const getData = (ShouCang) => {
      let url = '';
      if (ShouCang) {
        isShouCang.value = true;
        url = '/CyEmissionFactorCollect/cyEmissionFactorCollect/queryById';
      } else {
        url = '/emission/factor/cyEmissionFactor/listInfo';
      }

      fangLianDian.value = false;

      defHttp.get({
        url: url,
        params: {
          id: detailKeys.value[detailIndex.value]
        }
      }, { isTransformResponse: false}).then((res) => {
        if (res.success) {
          Object.assign(dataSource, res.result || {});
          if (ShouCang) {
            dataSource.collectStatus = '1';
          }
        }
      }).finally(() => {
        fangLianDian.value = true;
      });

      // 热门搜索因子
      defHttp.get({
        url: '/emission/factor/cyEmissionFactor/topSearchFactor',
        params: {
          SearchNum: 4,
        }
      }, { isTransformResponse: false}).then((res) => {
        if (res.success) {
          topSearchFactorData.value = res.result || [];
        }
      });
    };

    const onCopy = (item, index) => {
      let copyMsg = `${dataSource.emissionFactorObject.name} ${dataSource.emissionFactorDataObject.factorValue} ${dataSource.emissionFactorDataObject.numeratorUnit}/${dataSource.emissionFactorDataObject.denominatorUnit}`;
      copyText(copyMsg);
    };

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
      createMessage.success(tipMsg || '已复制到剪贴板');

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


    const onCollect = () => {
      if (fangLianDian.value) {
        if (dataSource.collectStatus === '1') {
          // 取消收藏
          defHttp.delete({
            url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',
            params: {
              id: dataSource.emissionFactorObject.id,
            }
          }, { isTransformResponse: false}).then((res) => {
            if (res.success) {
              createMessage.success(res.message);
              if (isShouCang.value) {
                onBack();
              } else {
                getData();
              }
            }
          });
        } else {
          // 收藏
          defHttp.get({
            url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/add',
            params: {
              id: dataSource.emissionFactorObject.id,
            }
          }, { isTransformResponse: false}).then((res) => {
            if (res.success) {
              createMessage.success(res.message);
              if (isShouCang.value) {
                onBack();
              } else {
                getData();
              }
            }
          });
        }
      }
    };

    // Expose to template
    return {
      visible,
      columns,
      dataSource,
      topSearchFactorData,
      isShouCang,
      detailIndex,
      detailKeys,
      fangLianDian,
      onDetail,
      onBack,
      showModal,
      handleOk,
      getData,
      onCopy,
      onCollect,
      // Images
      img28,
      img32
    };
  }
});
</script>

<style lang="less" scoped>

.ant-form-item {
  margin-bottom: 20px !important;
}

.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.contentBox {
  margin-top: 24px;
  display: flex;
  gap: 24px;

  .content_left {
    flex: 1;
  }

  .content_right {
    flex: 1;
  }

  .tpyzxxBox {
    padding: 32px 24px;
    background: #FFFFFF;
    border-radius: 3px;
  }

  .lyxxBox {
    margin-top: 24px;
    padding: 24px;
    background: #FFFFFF;
    border-radius: 3px;
  }

  .xgtjBox {
    padding: 32px 24px;
    background: #FFFFFF;
    border-radius: 3px;
  }

  .titleBox {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    color: #333333;
  }

  .titleBox2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #888888;
  }

  .titleBox3 {
    margin-top: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
  }

  .box1 {
    margin-top: 3px;
    margin-bottom: 3px;
    display: flex;
    justify-content: flex-end;
    gap: 7px;
  }

  .box1_icon {
    width: 18px;
    height: 18px;
  }
}

.box2 {
  margin-top: 20px;
  padding: 20px;
  background: rgba(43, 164, 113, 0.1);

  .box2_tr1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .box2_tr1_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
  }

  .box2_tr1_text2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #148958;
  }

  .box2_tr2 {
    margin-top: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .box2_tr2_text1 {
    display: flex;
    align-items: flex-end;
  }

  .box2_tr2_text1_a {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 36px;
    color: #148958;
    line-height: 36px;
  }

  .box2_tr2_text1_b {
    margin-left: 13px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .box2_tr2_text2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }
}

.box3 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .box3_item {
    display: flex;
    align-items: center;
    margin-top: 24px;
    width: 49%;
  }

  .box3_item_label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .box3_item_content {
    margin-left: 12px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.gas_table {
  margin-top: 24px;
}

.box4 {
  .box4_item {
    display: flex;
    align-items: flex-start;
    margin-top: 16px;
  }

  .box4_item_label {
    width: 200px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .box4_item_content {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.box5 {
  .box5_item {
    margin-top: 24px;
  }
}

.box6 {
  margin-bottom: 27px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 34px;
  background: rgba(43, 164, 113, 0.1);

  .box6_left {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
  }

  .box6_right {
    display: flex;
    align-items: flex-end;
  }

  .box6_right_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 36px;
    color: #148958;
    line-height: 36px;
  }

  .box6_right_text2 {
    margin-left: 13px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.popoverBox {
  display: flex;
  align-items: flex-start;
}

.popoverBox_icon {
  width: 20px;
  height: 20px;
}

.popoverBox_text {
  margin-left: 8px;
}

.popoverBox_text_a {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
}

.popoverBox_text_b {
  margin-top: 8px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

/deep/ .ant-upload{
  display: none;
}
</style>
