<template>
  <div>
    <el-row>
      <el-col :span="12">
        <Chessboard :row="10" :col="10" :onCellClick="onCellClick"></Chessboard>
      </el-col>
      <el-col :span="12">
        <el-form>
          <el-form-item label="坐标">
            <el-input class="w100" v-model="pos.x" :disabled="true"/>
            /
            <el-input class="w100" v-model="pos.y" :disabled="true"/>
          </el-form-item>
          <el-form-item label=""></el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {reactive} from "vue"

import Chessboard from '../../components/chessboard.vue'

export default {
  name: "index",
  components: {Chessboard},
  setup() {

    const pos = reactive({x: 0, y: 0})

    const onCellClick = (x, y) => {
      pos.x = x
      pos.y = y
    }

    return {
      pos,
      onCellClick
    }
  }
}
</script>

<style scoped lang="scss">
.w100 {
  width: 100px;
}
</style>
