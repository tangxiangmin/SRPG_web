interface Model {
  key:string,
  set:Function,
  get:Function,
  remove:Function,
  update:Function
}

const { localStorage } = window
const storageMap = new Map()
// 管理本地存储的键值数据
export default function createStorageModel(key:string, storage = localStorage):Model {
  // 相同key返回单例
  if (storageMap.has(key)) {
    return storageMap.get(key)
  }

  const model = {
    key,
    set(val, stringify = true) {
      if (stringify) {
        val = JSON.stringify(val)
      }
      storage.setItem(this.key, val)
    },
    get(parse = true) {
      let val = storage.getItem(this.key)
      if (parse && val !== null) {
        try {
          val = JSON.parse(val)
        } catch (e) {
          // console.log(e)
        }
      }
      return val
    },
    remove() {
      storage.removeItem(this.key)
    },
    update(cb, defaultValue = {}) {
      const val = this.get() || defaultValue
      this.set(cb(val))
    },
  }
  storageMap.set(key, model)
  return model
}
