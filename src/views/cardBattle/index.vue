<template>
  <div class="page">

    <button class="btn-round" @click="chessboard.toggleRound">结束回合</button>
    <button class="btn-refresh" @click="currentPlayer.refreshCard" :disabled="currentPlayer.hasRefreshCard">重抽一张
    </button>

    <div class="status-bar">
      <div class="status-bar_l">
        hp:{{ chessboard.playerList[1]?.hp }}
      </div>
      <div class="status-bar_r">
        energy: {{ chessboard.playerList[1].energy }}
      </div>
    </div>

    <div class="chessboard">
      <div class="row" v-for="(row,x) in chessboard.row" :key="x">
        <div class="cell" v-for="(col,y) in chessboard.col" :x="x" :y="y" @click="onCellClick(x,y)">
          <CardCell :card="chessboard.getCardByPos(x, y)"></CardCell>
        </div>
      </div>
      <div :class="[isSelfRound ? 'available-range' : 'available-range-2']"
           :style="{'height':(putRange[1] - putRange[0] + 1) / chessboard.row*100+'%'}"></div>
    </div>


    <div class="status-bar">
      <div class="status-bar_l">
        hp:{{ chessboard.playerList[0]?.hp }}
      </div>
      <div class="status-bar_r">
        energy: {{ chessboard.playerList[0].energy }}
      </div>
    </div>
    <div v-if="currentPlayer === chessboard.playerList[0]">
      <div class="card-list">
        <Card class="card"
              :class="{
          'card-select':card === currentPlayer?.currentCard,
          'card-disabled': card.costEnergy > currentPlayer.energy
        }"
              :card="card"
              v-for="card in currentPlayer?.cardList"
              @click="currentPlayer.selectCard(card)">

        </Card>
      </div>
    </div>
  </div>
</template>

<script>

import {AIPlayer, Player} from '../../core/cardMode/Player'
import {CardChessboard} from '../../core/cardMode/CardChessboard'
import {computed, reactive} from "vue";
import CardCell from './cell.vue'
import Card from './card.vue'

export default {
  name: "card battle",
  components: {CardCell, Card},
  setup() {

    const chessboard = new CardChessboard()

    // const p1 = new Player({name: 'p1', cardGroup: [1, 2, 3, 4, 5, 6,8], dir: -1})
    const p1 = new Player({name: 'p1', cardGroup: [1, 2, 9], dir: -1})
    const p2 = new AIPlayer({name: 'p2', cardGroup: [1, 2], dir: 1})

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

    const isSelfRound = computed(() => {
      return instance.currentPlayer === instance.playerList[0]
    })

    const onCellClick = (x, y) => {
      instance.putCard(x, y)
    }

    return {
      chessboard: instance,
      isSelfRound,
      currentPlayer,
      onCellClick,
      putRange
    }
  }
}
</script>

<style scoped lang="scss">
$width: 500px;
.page {
  position: relative;
  width: $width;
  margin: 0 auto;
}

%side-btn {
  cursor: pointer;
  position: absolute;
  border: 1px solid #000;
  right: -100px;
  padding: 10px;
}

.btn-round {
  @extend %side-btn;
  top: 400px;

}

.btn-refresh {
  @extend %side-btn;
  top: 460px;
}

.row {
  display: flex;
}

$cell-size: $width/ 4;
.cell {
  position: relative;
  width: $cell-size;
  height: $cell-size;
  margin: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  outline: 1px solid #000;
  font-size: 12px;
}


.chessboard {
  position: relative;
  width: $width;
  margin: 0 auto;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #000;
  margin: 3px;
}

.card-list {
  display: flex;

  .card {
    //flex-shrink: 0;

    margin: 3px;
    cursor: pointer;

    &-select {
      border-color: red;
      color: red;
    }

    &-disabled {
      cursor: default;
      background-color: #dedede;
    }
  }
}

%available-range {
  pointer-events: none;
  position: absolute;
  width: 100%;
}

.available-range {
  @extend %available-range;
  bottom: 0;
  $color: blue;
  border-top: 1px solid $color;
  border-right: 1px solid $color;
}

.available-range-2 {
  @extend %available-range;
  top: 0;
  $color: red;
  border-left: 1px solid $color;
  border-bottom: 1px solid $color;
}

</style>
