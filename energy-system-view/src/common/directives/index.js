/**
 * 管理自定义指令,批量注册
 */

// 引入指令
import clickOut from './modules/clickOut.js';
import copy from './modules/copy.js';
import debounce from './modules/debounce.js';
import longPress from './modules/longPress.js';
import sortable from './modules/sortable.js';
import throttle from './modules/throttle.js';
import waterMarker from './modules/waterMarker.js';

// 自定义指令
const directives = {
  clickOut,
  copy,
  debounce,
  longPress,
  sortable,
  throttle,
  waterMarker,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};

// 全局引入
// main.js
// import Vue from 'vue'
// import Directives from './directives/index'
// Vue.use(Directives)

// 局部引入
// 组件内
// import copy from '../directives/copy'
//  export default {
//    directives: {
//      copy
//    }
//  }
