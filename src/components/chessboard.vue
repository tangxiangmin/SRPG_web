<template>
  <div class="chessboard">
    <div class="row" v-for="(x) in row" :key="x">
      <div class="cell" v-for="(y) in col" :x="x" :y="y"
           @click="onCellClick(x,y)"
           :key="y"
      />
    </div>
  </div>

</template>

<script>

export default {
  name: "chessboard",
  props: {
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      required: true
    },
    onCellClick: {
      type: Function,
    }
  },
  setup(props, {emit}) {

  }
}
</script>

<style scoped lang="scss">
.row {
  display: flex;
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
}
</style>
