// 实现：可拖拽排序指令

const sortable = {
  bind(el, binding, vnode) {
    console.log('v-sortable bind',el,el.getAttribute('draggableDisabled'),binding,vnode)
    if(el.getAttribute('draggableDisabled')){
      // v-sortable元素设置draggableDisabled为true时，禁止拖拽排序
      // 禁用拖拽排序
      return
    }
    el.draggable = true;

    el.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', binding.value);
      el.classList.add('dragging');
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });

    el.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    el.addEventListener('drop', (event) => {
      event.preventDefault();
      const draggedIndex = event.dataTransfer.getData('text/plain');
      const droppedIndex = binding.value;

      console.log('Drag Drop Event: ', { draggedIndex, droppedIndex });
      vnode.context.handleDrop({ draggedIndex, droppedIndex });
    });
  }
};

export default sortable;

// 使用示例
/*<template>
  <div>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="item.id"
        v-sortable="index"
        :class="{ dragging: draggingIndex === index }"
        @dragstart="setDraggingIndex(index)"
        @dragend="clearDraggingIndex"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import sortable from './directives/sortable';

export default {
  directives: {
    sortable
  },
  data() {
    return {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ],
      draggingIndex: null
    };
  },
  methods: {
    handleDrop({ draggedIndex, droppedIndex }) {
      console.log('Handle Drop Event: ', { draggedIndex, droppedIndex });

      const draggedItem = this.items[draggedIndex];
      this.items.splice(draggedIndex, 1);
      this.items.splice(droppedIndex, 0, draggedItem);
    },
    setDraggingIndex(index) {
      this.draggingIndex = index;
    },
    clearDraggingIndex() {
      this.draggingIndex = null;
    }
  }
};
</script>

<style scoped>
li {
  list-style: none;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  cursor: move;
}

li.dragging {
  opacity: 0.5;
  background-color: #ddd;
}
</style> */

