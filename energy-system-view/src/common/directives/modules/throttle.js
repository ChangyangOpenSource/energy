// 场景：同防抖指令场景

// 实现：使用节流方法，限制1秒内按钮只能点击一次

// 思路：

// 定义一个开关，默认时打开状态
// 在点击按钮后关闭开关，在1秒内再点击按钮，不执行回调函数
// 1秒过后，开关打开

const throttle = {
  bind: (el, binding) => {
    // 没有绑定函数抛出错误
    if (typeof binding.value !== 'function') {
      throw 'throttle callback not a function';
    }

    // 开关
    el._flag = true;
    el._timer = null;
    el._handler = () => {
      if (!el._flag) return;

      // 函数执行后关闭开关
      el._flag && binding.value();
      el._flag = false;

      if (el._timer) clearTimeout(el._timer);

      el._timer = setTimeout((_) => {
        el._flag = true;
      }, 1000);
    };
    el.addEventListener('click', el._handler);
  },
  unbind: (el, binding) => {
    el.removeEventListener('click', el._handler);
  },
};

export default throttle;

// <template>
//     <button v-throttle="handleThrottle">节流</button>
// </template>

// <script>
//     export default {
//         methods: {
//             handleThrottle() {
//                 console.log('节流，触发一次')
//             }
//         }
//     }
// </script>
