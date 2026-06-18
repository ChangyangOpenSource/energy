<!-- 碳排放因子库-碳排放因子库 -->
<template>
  <div class="">
    <div class="list_card_content_item" :class="{'list_card_content_item_active': isSame}">
      <img
          class="list_card_content_item_copyIcon m_hoverCP"
          src="../../assets/img/img8.png"
          alt=""
          @click.stop="onCopy(item)"
      />
      <img
          class="list_card_content_item_collectIcon m_hoverCP"
          src="../../assets/img/img11.png"
          alt=""
          @click.stop="onCollect(item)"
          v-if="item.collectStatus === '1' && item.type == 1"
      />
      <img
          class="list_card_content_item_collectIcon m_hoverCP"
          src="../../assets/img/img12.png"
          alt=""
          @click.stop="onCollect(item)"
          v-if="item.collectStatus === '0' && item.type == 1"
      />
      <div class="list_card_content_item_box1">
        <img class="list_card_content_item_box1_icon" src="../../assets/img/img6.png" alt=""/>
        <div class="list_card_content_item_box1_text">
          <div class="list_card_content_item_box1_text2 m_pass_1line_hidden2" :title="item.name">
            {{ item.name }}
          </div>
          <div class="list_card_content_item_box1_text3 m_pass_1line_hidden2" :title="item.model">
            {{ item.model }}
          </div>
        </div>
      </div>
      <div class="list_card_content_item_box2">
        {{ (Number(item.factorValue)).toFixed(4) }}
        <span>{{ item.numeratorUnit }}/{{ item.denominatorUnit }}</span>
      </div>
      <div class="list_card_content_item_box3">
        <div class="list_card_content_item_box4_text" :title="item.productClassification_dictText">
          {{ item.productClassification_dictText || '-' }}
        </div>
        <div class="list_card_content_item_box4_text2" :title="item.scene">
          {{ getContent(item.scene) }}
        </div>
      </div>

      <div class="list_card_content_item_box4">
        <div class="list_card_content_item_box4_text"> {{ item.releaseOrg || '-' }}</div>
        <div class="list_card_content_item_box4_text2"> {{ item.releaseYear || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRouter } from 'vue-router';
import { copyTextToClipboard } from '@/hooks/web/useCopyToClipboard';
// 导入API方法
import { addFactorCollect, deleteFactorCollect } from './api/yzCard.api';

const { t } = useI18n();
const { createMessage } = useMessage();
const router = useRouter();

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({})
  },
  isSame: {
    type: Boolean,
    default: false,
  }
});

// Emits
const emit = defineEmits(['change']);

const getContent = (content: string) => {
  if (!content) {
    return "-"
  }
  // 超过五个字就截取
  if (content.length > 5) {
    return content.substring(0, 5) + "..."
  }
  return content
};

/**
 * 复制
 */
const onCopy = (item: any) => {
  let copyMsg = `${item.name} ${item.factorValue} ${item.numeratorUnit}/${item.denominatorUnit}`;
  const success = copyTextToClipboard(copyMsg);
  if (success) {
    createMessage.success(t('carbon.message.copy_success'));
  } else {
    createMessage.error(t('carbon.message.copy_failed'));
  }
};

/**
 * 收藏
 */
const onCollect = (item: any) => {
  // 检查登录状态（这里假设通过某种方式获取token）
  // 如果未登录，跳转到登录页面
  // 注意：这里需要根据实际项目结构调整登录状态检查逻辑
  const token = localStorage.getItem('Access-Token') || sessionStorage.getItem('Access-Token');
  if (!token) {
    createMessage.warning(t('carbon.message.Please_log_in'));
    router.push('/user/login');
    return;
  }

  if (item.collectStatus === '1') {
    // 取消收藏
    deleteFactorCollect({
      id: item.id,
    }).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.delete_collect_success'));
        emit('change');
      }
    });
  } else if (item.collectStatus === '0') {
    // 收藏
    addFactorCollect({
      id: item.id,
    }).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.collect_success'));
        emit('change');
      }
    });
  }
};
</script>

<style lang="less" scoped>
.list_card_content_item {
  box-sizing: border-box;
  overflow: hidden;
  height: 160px;
  position: relative;
  border-radius: 5px;
  border: 1px solid #148958;
  background-image: url("../../assets/img/img1.1.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.list_card_content_item:hover {
  box-shadow: 2px 4px 8px rgba(2, 27, 11, 0.2);
}

.list_card_content_item_active {
  outline: 3px solid #148958;
}

.list_card_content_item_copyIcon {
  position: absolute;
  z-index: 3;
  top: 16px;
  right: 41px;
  width: 18px;
  height: 18px;
}

.list_card_content_item_collectIcon {
  position: absolute;
  z-index: 3;
  top: 16px;
  right: 16px;
  width: 18px;
  height: 18px;
}

.list_card_content_item_box1 {
  margin-top: 12px;
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.list_card_content_item_box1_icon {
  width: 24px;
  height: 24px;
}

.list_card_content_item_box1_text {
  margin-left: 12px;
  display: flex;
  align-items: flex-end;
}

.list_card_content_item_box1_text2 {
  max-width: 150px;
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 18px;
  color: #333333;
  line-height: 20px;
}

.list_card_content_item_box1_text3 {
  margin-left: 8px;
  max-width: 110px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 14px;
}

.list_card_content_item_box2 {
  margin-top: 12px;
  margin-left: 52px;
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 28px;
  color: #148958;

  span {
    font-size: 12px;
  }
}

.list_card_content_item_box3 {
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list_card_content_item_box4 {
  position: absolute;
  z-index: 3;
  left: 0;
  bottom: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 33px;
  background: #148958;
  border-radius: 0px 0px 4px 4px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
}

.list_card_content_item_box4_text {
}

.list_card_content_item_box4_text2 {
}
</style>
