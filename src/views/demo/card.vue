<template>
  <div v-if="card" :class="{['card-'+card.player.dir]:true}">
    {{ card.name }} <br>
    {{ card.hp }}
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
.card-1 {
  color: red;
}
.card--1{
  color: blue;
}
</style>
