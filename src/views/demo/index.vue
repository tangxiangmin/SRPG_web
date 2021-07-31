<template>

  <div>
    <div>
      <el-select v-model="currentMap">
        <el-option v-for="key in Object.keys(mapList)" :key="key" :label="key" :value="key"></el-option>
      </el-select>
    </div>

    <div style="margin-top: 20px">
      <Map :mapName="currentMap" :key="currentMap"></Map>
    </div>

  </div>
</template>

<script lang="ts">
import {ref} from 'vue'

import Map from './map.vue'
import {mapList} from "../config/temp";


export default {
  name: "Demo",
  components: {Map},
  setup() {
    const currentMap = ref('map1')


    return {
      currentMap,
      mapList
    }
  }
}
</script>

<style scoped lang="scss">
</style>
