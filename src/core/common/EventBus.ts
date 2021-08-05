export default class EventBus {
  eventMap: {
    [prop: string]: Array<Function>
  } = {}


  on(type, handler) {
    if (!Array.isArray(this.eventMap[type])) {
      this.eventMap[type] = []
    }
    this.eventMap[type].push(handler)
  }

  emit(type, data?) {
    const handlers = this.eventMap[type]
    if (Array.isArray(handlers)) {
      handlers.forEach(handler => {
        handler(data)
      })
    }

  }
}
