<template>

  <div>
    <button @click="stage.finishRound">结束回合</button>
    <div class="chessboard">
      <div class="row" v-for="(row,x) in stage.chessboard.grid" :key="x">
        <Cell v-for="(col,y) in row" :x="x" :y="y"
              :key="y"
              :cellMap="stage.cellMap"
              :onCellClick="onCellClick"
              :onChessClick="onChessClick"
              :onMoveRangeCellClick="onMoveRangeCellClick"
              :onAttackRangeCellClick="onAttackRangeCellClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, watch, reactive} from 'vue'
import {AIChess, Chess} from "../../core/Chess"
import {Stage} from "../../core/Stage"
import Chessboard, {ChessboardEvent} from "../../core/Chessboard"

import Cell from './cell.vue'

import {getConfig, getChessDetailById} from '../config/temp'

function initStage() {
  const {grid, chessList} = getConfig()

  const chessboard = new Chessboard(grid)

  chessList.forEach(chessConfig => {
    const {chessId, x, y, group} = chessConfig
    const chess = getChessDetailById(chessId)
    if (!chess) {
      console.error(`${chessId}不存在配置`)
      return
    }
    const {name, hp, damage, moveStep} = chess
    let c
    if (group === 1) {
      c = new Chess(name, hp, damage, moveStep)
    } else {
      c = new AIChess(name, hp, damage, moveStep)
    }

    chessboard.addChess(c, x, y, group)
  })

  return new Stage(chessboard)
}

export default {
  name: "Demo",
  components: {Cell},
  setup() {
    const instance = initStage()

    const stage = reactive(instance)

    const onCellClick = (x, y) => {
      stage.onCellClick(x, y)
    }
    const onChessClick = (x, y) => {
      stage.onChessClick(x, y)
    }

    const onMoveRangeCellClick = (x, y) => {
      console.log('onMoveRangeCellClick')
      stage.onMoveRangeCellClick(x, y)
    }

    const onAttackRangeCellClick = (x, y) => {
      console.log('onAttackRangeCellClick')
      stage.onAttackRangeCellClick(x, y)
    }

    // FIXME 使用箭头函数绑定会导致无法通过Proxy访问到数据，导致无法进行依赖收集，出现更新异常
    // 临时处理 手动绑定Proxy对象
    stage.chessboard.bus.on(ChessboardEvent.onToggleGroup, stage.onAIRound.bind(stage))

    return {
      stage,
      onCellClick, onChessClick, onMoveRangeCellClick, onAttackRangeCellClick
    }
  }
}
</script>

<style scoped lang="scss">
.row {
  display: flex;
}
</style>
