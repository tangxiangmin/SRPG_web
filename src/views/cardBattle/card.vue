<template>
  <div class="card">
    <div class="card_cost">{{ card.costEnergy }}</div>
    <div class="card_name">{{ card.name }}</div>
    <div class="card_img"></div>
    <div class="card_desc">
      <div v-for="buff in card.buffList">
        {{ buff.desc }}
      </div>
    </div>
    <div class="card_ft">
      <div class="card_hp">HP:{{ card.hp }}</div>
      <div class="card_step">步数:{{ card.firstStep }}</div>
    </div>
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
  width: 200px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  text-align: center;
  &_cost {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    line-height: 30px;
    margin: 0 auto;
    padding: 5px;
    border: 1px solid #000;
  }
  &_name {
    font-size: 16px;
    margin: 10px;
  }

  &_desc {
    height: 50px;
    font-size: 14px;
  }

  &_ft {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}


</style>
