// 实现：给指定页面添加背景水印

// 思路：

// 使用canvas特性生成base64格式的图片文件，设置其字体大小，颜色等。
// 将其设置为背景图，实现水印效果

function addWaterMarker(str, parentNode, font, textColor) {
  // 水印文字，父元素，字体，文字颜色
  var can = document.createElement('canvas');
  parentNode.appendChild(can);
  can.width = 200;
  can.height = 150;
  can.style.display = 'none';
  var cans = can.getContext('2d');
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = font || '16px Microsoft JhengHei';
  cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)';
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  cans.fillText(str, can.width / 10, can.height / 2);
  parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')';
}

const waterMarker = {
  bind: function (el, binding) {
    addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor);
  },
};

export default waterMarker;

// 使用示例
// <template>
//     <div class="water-marker" v-waterMarker="waterMarker"></div>
// </template>

// <script>
//     export default {
//         waterMarker: {
//             text: 'Fuleny版权所有',
//             font: '14px Microsoft JhengHei',
//             textColor: 'rgba(180, 180, 180, 0.4)'
//         }
//     }
// </script>

// <style lang="scss" scoped>
// .water-marker {
//   width: 400px;
//   height: 400px;
//   border: 1px solid #eee;
// }
// </style>
