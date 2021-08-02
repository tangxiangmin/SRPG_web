<template>
  <div>
    <!--    <div class="wind"></div>-->
    <!--    <div class="wind2"></div>-->
    <!--    <div class="light"></div>-->
    <!--    <div class="fire"></div>-->


    <div class="main">
      <div class="left"></div>
      <div class="action">
        <button @click="changeSheepSkill">changeSheepSkill</button>
        <button @click="recoverSkill">recoverSkill</button>
        <button @click="poisoningSkill">poisoningSkill</button>
        <button @click="battle">battle</button>
        <button @click="boomSkill">boomSkill</button>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script lang="ts">

import {ChangeSheepSkill, RecoverSkill, PoisoningSkill, BoomSkill} from "../../core/skill/Skill";
import {DemoTarget} from '../../core/skill/Target'
import {sleep} from "../../util";

export default {
  name: "skill",
  setup() {
    const getTarget = () => {
      return new DemoTarget({
        hp: 100,
        mp: 10,
        frame: 'none',
        atk: 10,
        speed: 4,
      })
    }

    const changeSheepSkill = () => {
      const skill = new ChangeSheepSkill()
      const target = getTarget()
      skill.spellTo(target)
      console.log(target)
    }

    const recoverSkill = () => {
      const skill = new RecoverSkill()
      const target = getTarget()
      skill.spellTo(target)
      console.log(target)
    }

    const poisoningSkill = async () => {
      const skill = new PoisoningSkill()
      const target = getTarget()
      skill.spellTo(target)
      console.log(target)

      await sleep(500)
      target.onUpdate()
      console.log(target)

      await sleep(500)
      target.onUpdate()
      console.log(target)
    }

    const battle = () => {
      const target1 = getTarget()
      const target2 = getTarget()

      target1.attack(target2)
      console.log(target2)

      const skill1 = new RecoverSkill()
      target1.useSkill(skill1, target2)
      console.log(target2)
    }

    const boomSkill = () => {
      const skill = new BoomSkill()
      const target = getTarget()
      skill.spellTo(target)
      console.log(target)
    }


    return {
      changeSheepSkill,
      recoverSkill,
      poisoningSkill,
      battle,
      boomSkill
    }
  }
}
</script>

<style scoped lang="scss">
@keyframes wind {
  @for $i from 1 through 18 {
    #{percentage($i/18)} {
      background-image: url('../../assets/skill/wind/#{$i}.png');
    }
  }
}

.wind {
  width: 128px;
  height: 96px;
  background-size: contain;
  animation: wind 1s infinite;
}

.wind2 {
  width: 96px;
  height: 128px;
  background: url('../../assets/skill/wind2.gif') no-repeat center;
  background-size: contain;
}

.light {
  width: 60px;
  height: 240px;
  background: url('../../assets/skill/light.gif') no-repeat center;
  background-size: contain;
}

@keyframes fire {
  @for $i from 1 through 15 {
    #{percentage($i/15)} {
      background-image: url('../../assets/skill/fire/155_#{$i}.png');
    }
  }
}

.fire {
  width: 81px;
  height: 101px;
  background-size: contain;
  animation: fire 1s infinite;
}

.main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
