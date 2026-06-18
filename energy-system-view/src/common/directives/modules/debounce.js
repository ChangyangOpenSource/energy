// 场景：项目开发中，经常会遇到按钮多次点击后，重复请求接口，造成数据混乱，例如表单提交。

// 实现：使用防抖，防止按钮在短时间内多次点击，设置按钮在1秒内只能点击一次。

// 思路：

// 定义延时方法，在1秒内再调用该方法，则重新计算执行时间
// 将事件绑定在点击方法上

const debounce = {
  inserted: (el, binding) => {
    // 没有绑定函数抛出错误
    if (typeof binding.value !== 'function') {
      throw 'debounce callback not a function';
    }

    let timer;
    el.addEventListener('click', () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout((_) => {
        binding.value();
      }, 1000);
    });
  },
};

export default debounce;

// 使用示例
// <template>
//     <button v-debounce="handleDebounce">防抖</button>
// </template>

// <script>
//     export default {
//         methods: {
//             handleDebounce() {
//                 console.log('防抖，触发一次')
//             }
//         }
//     }
// </script>
