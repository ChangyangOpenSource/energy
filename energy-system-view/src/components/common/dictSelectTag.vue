<template>
  <a-select :getPopupContainer="getPopupContainer" :placeholder="placeholder" :disabled="disabled"
            v-model="getValueSting" allowClear show-search :filter-option="filterOption" @change="handleInput">
    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.value">
      <span style="display: inline-block;width: 100%" :title=" item.text || item.label ">
        {{ item.text || item.label }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import {ajaxGetDictItems, getDictItemsFromCache} from '@/api/api'

export default {
  name: "dictSelectTag",
  props: {
    dictCode: String,
    placeholder: String,
    disabled: Boolean,
    value: [String, Number],
    getPopupContainer: {
      type: Function,
      default: (node) => node.parentNode
    }
  },
  data() {
    return {
      dictOptions: [],
    }
  },
  watch: {
    dictCode: {
      immediate: true,
      handler() {
        this.initDictData()
      },
    }
  },
  created() {
    // console.log(this.dictCode);
    //获取字典数据
    // this.initDictData();
  },
  computed: {
    getValueSting() {
      // update-begin author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
      // 当有null或“” placeholder不显示
      return this.value != null ? this.value.toString() : undefined;
      // update-end author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
    },
  },
  methods: {
    /**
     * 下拉框数据过滤
     */
    filterOption(input, option) {
      console.log('filterOption', input, option)
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    initDictData() {
      //优先从缓存中读取字典配置
      if (getDictItemsFromCache(this.dictCode)) {
        this.dictOptions = getDictItemsFromCache(this.dictCode);
        return
      }

      //根据字典Code, 初始化字典数组
      ajaxGetDictItems(this.dictCode, null).then((res) => {
        if (res.success) {
//                console.log(res.result);
          this.dictOptions = res.result;
        }
      })
    },
    handleInput(e = '') {
      let val;
      if (Object.keys(e).includes('target')) {
        val = e.target.value
      } else {
        val = e
      }
      console.log(val);
      this.$emit('change', val);
      //LOWCOD-2146 【菜单】数据规则，选择自定义SQL 规则值无法输入空格
      this.$emit('input', val);
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions
    },
    getCurrentDictOptions() {
      return this.dictOptions
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style scoped>
</style>