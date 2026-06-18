import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './public-path.js'

let instance = null;

function render(props = {}) {
  const { container } = props;

  instance = createApp(App);
  instance.use(router); // 集成路由

  const mountPoint = container ? container.querySelector('#app') : '#app';
  instance.mount(mountPoint);
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  if (!instance) return;
  instance.unmount();
  instance = null;
}

export async function update() {}
