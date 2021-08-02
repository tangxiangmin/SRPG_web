<template>

  <div>
    <div>
      <el-select v-model="currentMap">
        <el-option v-for="key in Object.keys(mapList)" :key="key" :label="key" :value="key"></el-option>
      </el-select>
    </div>

    <div style="margin-top: 20px">
      <Map :config="config" :key="currentMap"></Map>
    </div>

  </div>
</template>

<script lang="ts">
import {computed, ref} from 'vue'

import Map from './chessboard.vue'
import {getConfig, mapList} from "../../core/config/temp";


export default {
  name: "Demo",
  components: {Map},
  setup() {

    const currentMap = ref('map1')
    const config = computed(() => {
      return getConfig(currentMap.value)
    })

    return {
      currentMap,
      mapList,
      config
    }
  }
}
</script>

<style scoped lang="scss">
</style>
