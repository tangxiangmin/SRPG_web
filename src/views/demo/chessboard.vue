<template>

  <div>
    <button @click="stage.finishRound">结束回合</button>
    <div class="screen">
      <div class="chessboard">
        <div class="row" v-for="(row,x) in stage.chessboard.grid" :key="x">
          <Cell v-for="(col,y) in row" :x="x" :y="y"
                :isSelect="currentChess && currentChess.x === x && currentChess.y === y"
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
        伤害: {{ currentChess.atk }} <br>

        <div>
          <el-tag v-for="(buff,index) in currentChess.buffList" :key="index">
            {{ buff.buff.name }}
          </el-tag>
        </div>
        <button @click="stage.showMoveRange" :disabled="currentChess.isMoved">移动</button>
        <button @click="stage.showActionRange" :disabled="currentChess.isActioned">攻击</button>
        <button @click="stage.endChessInRound" :disabled="currentChess.isDisabled">待定</button>
        <!--        <button>使用技能</button>-->
        <div>
          技能列表 <br>
          <button :disabled="currentChess.isActioned" v-for="(skill,index) in currentChess.skillList" :key="index"
                  :class="{'skill-select':currentSkill === skill}"
                  @click="useSkill(skill)">{{ skill.name }}
          </button>
        </div>
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

import Cell from './cell.vue'

import {getChessDetailById} from '../../core/config/temp'

function initStage(grid, chessList) {
  const chessboard = new Chessboard(grid)

  chessList.forEach(chessConfig => {
    const {chessId, x, y, group} = chessConfig
    const chess = getChessDetailById(chessId)
    if (!chess) {
      console.error(`${chessId}不存在配置`)
      return
    }
    const {name, hp, atk, moveStep, attackDistance, frame, skillList,buffList} = chess
    let c
    if (group === 1) {
      c = new Chess(name, hp, atk, moveStep, attackDistance, frame, skillList,buffList)
    } else {
      c = new AIChess(name, hp, atk, moveStep, attackDistance, frame, skillList,buffList)
    }

    chessboard.addChess(c, x, y, group)
  })

  return new Stage(chessboard)
}

export default {
  name: "Demo",
  components: {Cell},
  props: {
    config: {
      type: Object,
      required: true,
    },
    mapName: {
      type: String,
      default: 'map1'
    }
  },
  setup(props, {emit}) {
    const {grid = [], chessList = []} = props.config
    const instance = initStage(grid, chessList)

    const currentSkill = ref(null)

    const stage = reactive(instance)

    const currentChess = computed(() => {
      return stage.currentChess
    })

    const onCellClick = (x, y) => {
      stage.onCellClick(x, y)
      emit('click-cell', {x, y})

    }
    const onChessClick = (x, y) => {
      stage.onChessClick(x, y)
    }

    const onMoveRangeCellClick = (x, y) => {
      stage.onMoveRangeCellClick(x, y)
    }

    const onAttackRangeCellClick = (x, y) => {
      stage.onAttackRangeCellClick(x, y, currentSkill.value)
      currentSkill.value = null
    }

    const useSkill = (Skill) => {
      currentSkill.value = Skill
      // 展示技能范围
      stage.showActionRange()
    }

    // FIXME 使用箭头函数绑定会导致无法通过Proxy访问到数据，导致无法进行依赖收集，出现更新异常
    // 临时处理 手动绑定Proxy对象
    stage.chessboard.bus.on(ChessboardEvent.onToggleGroup, stage.onAIRound.bind(stage))

    return {
      stage,
      currentChess,
      currentSkill,
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

.cell {
  margin: 1px;
}

.skill-select {
  border: 1px solid red;
}
</style>
