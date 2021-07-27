<template>
  <div :class="cls">
    ({{ x }},{{ y }})
    <span :class="chessCls" @click="onChessClick(x,y)" v-if="chess">
      {{ chess.name }} <br/>{{ chess.hp }}
    </span>
    <span class="move-tip" @click="onMoveRangeCellClick(x,y)" v-if="isMoveTip"></span>
    <span class="attack-tip" @click="onAttackRangeCellClick(x,y)" v-if="isAttackRange"></span>
  </div>
</template>

<script>
import {computed, onUpdated, toRefs, watchEffect, watch} from "vue";

import {getCellKey} from "../../core/Chessboard";

export default {
  name: "cell.vue",
  props: ['cellMap', 'onCellClick', 'onChessClick', 'onMoveRangeCellClick', 'onAttackRangeCellClick', 'x', 'y'],
  setup(props) {
    const {cellMap, x, y} = toRefs(props)

    const config = computed(() => {
      const key = getCellKey(x.value, y.value)
      return cellMap.value[key] || {}
    })

    const chess = computed(() => {
      return config.value?.chess
    })

    const cls = computed(() => {
      const {cls: configCls} = config.value

      const ans = {
        cell: true,
      }
      if (configCls) {
        ans[configCls] = true
      }
      return ans
    })

    const chessCls = computed(() => {
      if (!chess.value) return
      const {group, isDisabled, isMoved} = chess.value
      return {
        chess: true,
        ['chess-group-' + group]: true,
        'chess-disabled': isDisabled,
        'chess-moved': isMoved,
      }
    })

    const isMoveTip = computed(() => {
      const {cls: configCls} = config.value
      return configCls && configCls.indexOf('move-range') > -1
    })

    const isAttackRange = computed(() => {
      const {cls: configCls} = config.value
      return configCls && configCls.indexOf('attack-range') > -1
    })

    return {
      cls,
      chessCls,
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

.cell {
  position: relative;
  $s: 40px;
  width: $s;
  height: $s;
  margin: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  background-color: gray;
  /*transition: all linear .2s;*/


  .move-tip {
    @extend %tip-cell;
    background-color: blue;
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

  &-group-1 {
    background-color: red;
  }

  &-group-2 {
    background-color: green;
  }

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
}

.wall {
  background-color: #000;
}

.mark {
  background-color: purple;
}

.path {
  background-color: yellow;
}

.move-range {
  //background-color: blue;
}

</style>
