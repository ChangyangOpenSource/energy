// 场景：弹窗，点击弹窗外部（即蒙版），关闭弹窗

// 实现：点击指定区域外部，执行相应回调函数

// 思路：

// 判断点击的元素是否指定元素
// 是则不执行，否则执行相应回调函数

const clickOut = {
  bind: (el, binding) => {
    el._handler = (e) => {
      // 判断点击的元素是否本身，是则返回
      if (el.contains(e.target)) return;

      // 如果绑定了函数，则调用函数
      if (typeof binding.value === 'function') {
        binding.value();
      }
    };

    // 添加事件监听
    setTimeout((_) => {
      document.addEventListener('click', el._handler);
    }, 0);
  },
  unbind(el) {
    // 解除事件监听
    document.removeEventListener('click', el._handler);
  },
};

export default clickOut;

// 使用示例
// <template>
//     <!-- v-clickOut、v-click-out都可以使用 -->
//     <div style="width:100px;height:100px;background-color:red;" v-click-out="handleClickOut">target DOM</div>
// </template>

// <script>
//     export default {
//         methods: {
//             handleClickOut() {
//                 console.log('外部元素触发')
//             }
//         }
//     }
// </script>
