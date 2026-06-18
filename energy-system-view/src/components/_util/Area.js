/**
 * 省市区
 */
export default class Area {
  /**
   * 构造器
   * @param pcaa
   */
  constructor(pcaa) {
    if (!pcaa) {
      // 在 Vue 3 中，可以通过 app.config.globalProperties 获取全局属性
      // 这里假设 pcaa 是通过 app.config.globalProperties.$Jpcaa 注册的
      pcaa = window.$Jpcaa; // 假设 $Jpcaa 已经挂载到 window 上
    }
    let arr = [];
    const province = pcaa['86'];
    Object.keys(province).map(key => {
      arr.push({ id: key, text: province[key], pid: '86', index: 1 });
      const city = pcaa[key];
      Object.keys(city).map(key2 => {
        arr.push({ id: key2, text: city[key2], pid: key, index: 2 });
        const qu = pcaa[key2];
        if (qu) {
          Object.keys(qu).map(key3 => {
            arr.push({ id: key3, text: qu[key3], pid: key2, index: 3 });
          });
        }
      });
    });
    this.all = arr;
  }

  get pca() {
    return this.all;
  }

  getCode(text) {
    if (!text || text.length === 0) {
      return '';
    }
    for (let item of this.all) {
      if (item.text === text) {
        return item.id;
      }
    }
  }

  getText(code) {
    if (!code || code.length === 0) {
      return '';
    }
    let arr = [];
    this.getAreaBycode(code, arr, 3);
    return arr.join('/');
  }

  getRealCode(code) {
    let arr = [];
    this.getPcode(code, arr, 3);
    return arr;
  }

  getPcode(id, arr, index) {
    for (let item of this.all) {
      if (item.id === id && item.index === index) {
        arr.unshift(id);
        if (item.pid !== '86') {
          this.getPcode(item.pid, arr, --index);
        }
      }
    }
  }

  getAreaBycode(code, arr, index) {
    for (let item of this.all) {
      if (item.id === code && item.index === index) {
        arr.unshift(item.text);
        if (item.pid !== '86') {
          this.getAreaBycode(item.pid, arr, --index);
        }
      }
    }
  }
}
