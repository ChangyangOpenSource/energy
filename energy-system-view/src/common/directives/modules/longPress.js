// 实现：长按超过两秒，执行回调函数

// 思路：

// 创建一个计时器，两秒后执行函数
// 当用户按下按钮时触发mousedown事件（移动端touchstart事件)，启动计时器；
// 用户松开按钮时调用mouseout事件（移动端touchend事件）
// 如果mouseup事件在两秒内触发，此事件当作普通点击事件
// 如果计时器没有在两秒内清除，定为长按事件，触发相关回调函数

const longPress = {
  bind: (el, binding, vNode) => {
    // 没有绑定函数抛出错误
    if (typeof binding.value !== 'function') {
      throw 'longPress callback not a function';
    }

    // 计时器变量
    el._timer = null;
    // 运行函数
    el._handler = (e) => {
      binding.value(e);
    };
    // 创建计时器（2秒后执行函数）
    el._start = (e) => {
      // 0为鼠标左键
      if (e.type === 'click' && e.button !== 0) return;

      if (el._timer === null) {
        el._timer = setTimeout((_) => {
          el._handler();
        }, 2000);

        // 取消浏览器默认事件
        el.addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });
      }
    };
    // 两秒内松手，取消计时器
    el._cancel = (e) => {
      if (el._timer !== null) {
        clearTimeout(el._timer);
        el._timer = null;
      }
    };

    // 添加计时监听
    el.addEventListener('mousedown', el._start);
    el.addEventListener('touchstart', el._start);
    // 添加取消监听
    el.addEventListener('click', el._cancel);
    el.addEventListener('mouseout', el._cancel);
    el.addEventListener('touchend', el._cancel);
    el.addEventListener('touchcancel', el._cancel);
  },
  unbind(el) {
    // 移除监听
    el.removeEventListener('mousedown', el._start);
    el.removeEventListener('touchstart', el._start);
    el.removeEventListener('click', el._cancel);
    el.removeEventListener('mouseout', el._cancel);
    el.removeEventListener('touchend', el._cancel);
    el.removeEventListener('touchcancel', el._cancel);
  },
};


export default longPress;

// 使用示例
// <template>
//     <button v-longPress="handleLongPress">复制</button>
// </template>

// <script>
//     export default {
//         methods: {
//             handleLongPress() {
//                 alert('这是长按指令')
//             }
//         }
//     }
// </script>
