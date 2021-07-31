<template>

  <div>
    <button @click="stage.finishRound">结束回合</button>
    <div class="screen">
      <div class="chessboard">
        <div class="row" v-for="(row,x) in stage.chessboard.grid" :key="x">
          <Cell v-for="(col,y) in row" :x="x" :y="y"
                :key="y"
                :type="stage.chessboard.grid[x][y]"
                :cellMap="stage.cellMap"
                :moveRange="stage.currentMoveRange"
                :attackRange="stage.currentAttackRange"
                :onCellClick="onCellClick"
                :onChessClick="onChessClick"
                :onMoveRangeCellClick="onMoveRangeCellClick"
                :onAttackRangeCellClick="onAttackRangeCellClick"
          />
        </div>
      </div>
      <div class="profile" v-if="currentChess">
        {{ currentChess.name }} <br>
        HP: {{ currentChess.hp }} <br>
        伤害: {{ currentChess.damage }} <br>

        <div>
          <el-tag v-for="(buff,index) in currentChess.buffList" :key="index">
            {{buff.buff.name}}
          </el-tag>
        </div>

        <!--        <button @click="stage.showMoveRange">移动</button>-->
        <teamplate v-if="currentChess.isMoved">
          <button @click="stage.showActionRange">攻击</button>
          <button>使用技能</button>
          <div>
            技能列表 <br>
            <button v-for="(skill,index) in skillList" :key="index" @click="useSkill(skill)">{{ skill.name }}</button>
          </div>

        </teamplate>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {reactive, computed, ref} from 'vue'
import {Chess} from "../../core/Chess"
import {AIChess} from '../../core/AIChess'
import {Stage} from "../../core/Stage"
import Chessboard, {ChessboardEvent} from "../../core/Chessboard"
import {ChangeSheepSkill, RecoverSkill, PoisoningSkill} from "../../core/skill/Skill";

import Cell from './cell.vue'

import {getConfig, getChessDetailById} from '../config/temp'

function initStage(key) {
  const {grid, chessList} = getConfig(key)


  const chessboard = new Chessboard(grid)

  chessList.forEach(chessConfig => {
    const {chessId, x, y, group} = chessConfig
    const chess = getChessDetailById(chessId)
    if (!chess) {
      console.error(`${chessId}不存在配置`)
      return
    }
    const {name, hp, damage, moveStep, attackDistance, frame} = chess
    let c
    if (group === 1) {
      c = new Chess(name, hp, damage, moveStep, attackDistance, frame)
    } else {
      c = new AIChess(name, hp, damage, moveStep, attackDistance, frame)
    }

    chessboard.addChess(c, x, y, group)
  })

  return new Stage(chessboard)
}

export default {
  name: "Demo",
  components: {Cell},
  props: {
    mapName: {
      type: String,
      default: 'map1'
    }
  },
  setup(props) {
    const instance = initStage(props.mapName)

    const skillList = [
      ChangeSheepSkill,
      RecoverSkill,
      PoisoningSkill
    ]

    const currentSkill = ref(null)

    const stage = reactive(instance)

    const currentChess = computed(() => {
      return stage.currentChess
    })

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
      stage.onAttackRangeCellClick(x, y, currentSkill.value)
      currentSkill.value = null
    }

    const useSkill = (Skill) => {
      currentSkill.value = Skill
    }

    // FIXME 使用箭头函数绑定会导致无法通过Proxy访问到数据，导致无法进行依赖收集，出现更新异常
    // 临时处理 手动绑定Proxy对象
    stage.chessboard.bus.on(ChessboardEvent.onToggleGroup, stage.onAIRound.bind(stage))

    return {
      stage,
      currentChess,
      skillList,
      useSkill,
      onCellClick, onChessClick, onMoveRangeCellClick, onAttackRangeCellClick
    }
  }
}
</script>

<style scoped lang="scss">
.row {
  display: flex;
}

.screen {
  display: flex;
}

.profile {
  margin-left: 20px;
}
</style>
