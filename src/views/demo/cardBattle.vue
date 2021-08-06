<template>


  <div class="page">
    <button @click="chessboard.toggleRound">切换</button>

    <div>
      hp:{{ chessboard.playerList[1]?.hp }}
      energy: {{ chessboard.playerList[1].energy }}
    </div>
    <div class="row" v-for="(row,x) in chessboard.row" :key="x"
         :class="{'row-available':putRange[0] <= x && putRange[1] >=x}">
      <div class="cell" v-for="(col,y) in chessboard.col" :x="x" :y="y" @click="onCellClick(x,y)">
        <CardCell :card="chessboard.getCardByPos(x, y)"></CardCell>
      </div>
    </div>
    <div>
      hp:{{ chessboard.playerList[0]?.hp }}
      energy: {{ chessboard.playerList[0].energy }}
    </div>
    <div>
      <button v-for="card in currentPlayer?.cardList" :disabled="card.costEnergy > currentPlayer.energy"
              @click="currentPlayer.selectCard(card)">
        {{ card.name }}
      </button>
    </div>
  </div>
</template>

<script>

import {Player} from '../../core/cardMode/Player'
import {CardChessboard} from '../../core/cardMode/CardChessboard'
import {computed, reactive} from "vue";
import CardCell from './card.vue'

export default {
  name: "card battle",
  components: {CardCell},
  setup() {

    const chessboard = new CardChessboard()

    const p1 = new Player({name: 'p1', cardGroup: [ 3], dir: -1})
    const p2 = new Player({name: 'p2', cardGroup: [1], dir: 1})

    chessboard.addPlayer(p1)
    chessboard.addPlayer(p2)

    // 开始
    chessboard.toggleRound()

    const instance = reactive(chessboard)

    const currentPlayer = computed(() => {
      return instance.currentPlayer
    })
    const putRange = computed(() => {
      return instance.putRange
    })

    const onCellClick = (x, y) => {
      instance.putCard(x, y)
    }

    return {
      chessboard: instance,
      currentPlayer,
      onCellClick,
      putRange
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  width: 500px;
  margin: 0 auto;

}
.row {
  display: flex;

  &-available .cell {
    background: rgba(127,255,170, 0.1);
  }
}

.cell {
  margin: 1px;
  position: relative;
  $s: 100px;
  width: $s;
  height: $s;
  //margin: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  border: 1px solid #000;
  font-size: 12px;
}

</style>
