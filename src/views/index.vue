<template>
  <div>

    {{ instance.data.x }}
    <button @click="instance.change1">change1</button>
    <button @click="instance.change2">change2</button>

    <router-link to="/demo">
      <button>战棋</button>
    </router-link>
    <router-link to="/card">
      <button>卡片对战</button>
    </router-link>
  </div>
</template>

<script>
import { reactive} from "vue";

class Test {
  constructor() {
    this.data = {
      x: 1
    }
  }

  // 这种方式的无法自动更新
  change1 = () => {
    this.data.x += 1
    console.log(this)

  }

  // 这种方式的可以正常检测到变化
  change2() {
    console.log(this)
    this.data.x += 1
  }
}

export default {
  name: "index",
  setup() {

    const instance = reactive(new Test())

    return {
      instance
    }
  }
}
</script>

<style scoped>

</style>
