// 实现：一键复制文本内容，用于粘贴

// 思路：

// 动态创建textarea标签，并设置reaOnly属性及移除可视区域
// 将要复制的值赋给textarea标签的value属性，并插入到body
// 选中值textarea并复制
// 将body中插入的textarea移除
// 在第一次调用时绑定事件，在解绑时移除事件

const copy = {
  bind(el, { value }) {
    el._value = value;
    el.handler = () => {
      if (!el._value) {
        // 复制的值为空时，给出的提示操作。
        console.log('无可复制的内容');
        return;
      }

      // 创建 textarea 标签
      const textarea = document.createElement('textarea');
      // 设置readOnly(规定字段为只读)属性，防止 iOS下自动唤起键盘，并移除可视区域
      textarea.readOnly = 'readOnly';
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      // 将需要复制的值，赋给 textarea 标签的 value  值
      textarea.value = el._value;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);

      // 选中值并复制
      textarea.select();
      const result = document.execCommand('Copy');
      if (result) {
        console.log('v-copy 复制成功');
      }
      document.body.removeChild(textarea);
    };
    // 绑定点击事件
    el.addEventListener('click', el.handler);
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el._value = value;
  },
  // 指令与元素解绑的时候触发，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler);
  },
};

export default copy;

// 使用示例
// <template>
//     <button v-copy="text">复制</button>
// </template>

// <script>
//     export default {
//         data () {
//             return {
//                 text: '这是一条复制文本'
//             }
//         }
//     }
// </script>
