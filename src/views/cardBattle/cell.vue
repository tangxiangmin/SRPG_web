<template>

  <div v-if="card" :class="{['card-'+card.player.dir]:true,card:true}">
    {{ card.name }} <br>
    {{ card.hp }}
<!--    <div class="card-damage">-->
<!--      <div class="card-damage_inner">2</div>-->
<!--    </div>-->
  </div>
</template>

<script lang="ts">
export default {
  name: "card",
  props: {
    card: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  position: relative;
}
.card-1 {
  color: red;
}
.card--1{
  color: blue;
}


@keyframes damage-show {
  from {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.card-damage {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  height: 50px;
  width: 50px;
  line-height: 50px;
  background-color: red;
  color: #fff;
  transform: rotate(45deg);

  animation: damage-show 2s linear forwards;


  &_inner {
    transform: rotate(-45deg);
  }
}
</style>
