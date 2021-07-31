<template>
  <div :class="cellCls" :style="cellStyle">
    <!--    ({{ x }},{{ y }})-->
    <span :class="chessCls" @click="onChessClick(x,y)" v-if="chess" :style="chessStyle">
<!--      {{ chess.name }} <br/>{{ chess.hp }}-->
    </span>
    <span class="move-tip" @click="onMoveRangeCellClick(x,y)" v-if="isMoveTip"></span>
    <span class="attack-tip" @click="onAttackRangeCellClick(x,y)" v-if="isAttackRange"></span>
  </div>
</template>

<script>
import {computed, toRefs} from "vue";

import {getCellKey, CellType} from "../../core/Chessboard";
import {getCellDetailById} from "../config/temp";

export default {
  name: "cell.vue",
  props: ['type', 'cellMap', 'moveRange', 'attackRange',
    'onCellClick', 'onChessClick', 'onMoveRangeCellClick', 'onAttackRangeCellClick', 'x', 'y'],
  setup(props) {
    const {cellMap, moveRange, attackRange, x, y} = toRefs(props)

    const key = computed(() => {
      return getCellKey(x.value, y.value)
    })
    const config = computed(() => {
      return cellMap.value[key.value] || {}
    })

    const chess = computed(() => {
      return config.value?.chess
    })

    const cellCls = computed(() => {
      const {cls: configCls} = config.value

      const ans = {
        cell: true,
      }
      if (configCls) {
        ans[configCls] = true
      }
      return ans
    })

    const cellStyle = computed(() => {
      const id = props.type
      const cell = getCellDetailById(id)
      if(!cell) return {}
      const {frame} = cell
      return {
        backgroundImage: `url('${frame}')`
      }
    })

    const chessCls = computed(() => {
      if (!chess.value) return
      const {group, isDisabled, isMoved, attackDir} = chess.value
      return {
        chess: true,
        ['chess-group-' + group]: true,
        'chess-disabled': isDisabled,
        'chess-moved': isMoved,
        ['chess-attack-' + attackDir]: attackDir
        // ['chess-attack-1']: true
      }
    })
    const chessStyle = computed(() => {
      if (!chess.value) return
      const {frame} = chess.value
      return {
        backgroundImage: `url('${frame}')`
      }
    })

    const isMoveTip = computed(() => {
      return moveRange.value[key.value]
    })

    const isAttackRange = computed(() => {
      return attackRange.value[key.value]
    })

    return {
      cellCls, cellStyle,
      chessCls, chessStyle,
      chess,
      isMoveTip, isAttackRange
    }
  }
}
</script>

<style scoped lang="scss">
%tip-cell {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;

}

@keyframes attack-1 {
  from {
    transform: translateX(0);
  }
  50% {
    transform: translateX(50%);
  }
  to {
    transform: translateX(0);
  }
}

.cell {
  position: relative;
  $s: 40px;
  width: $s;
  height: $s;
  //margin: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /*transition: all linear .2s;*/


  .move-tip {
    @extend %tip-cell;
    background-color: yellow;
  }

  .attack-tip {
    @extend %tip-cell;
    background-color: red;
  }
}

.chess {

  @extend %tip-cell;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1;
  font-size: 12px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  // todo 区分状态
  %chess-status {
    &:after {

    }
  }

  &-moved {
    //opacity: 0.6;
    &:after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      $s: 10px;
      width: $s;
      height: $s;
      background-color: purple;
    }
  }

  &-disabled {
    //opacity: 0.6;
    &:after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      $s: 10px;
      width: $s;
      height: $s;
      background-color: #000;
    }
  }

  // 攻击动画
  &-attack-1 {
    animation: attack-1 .3s linear;
  }
}


.path {
  background-color: yellow;
}

</style>
