import {Buff} from '../common/Buff'
import {Card, CardEventEnum} from "./Card";
import {AttackPlayerEffect} from "./Effect";

export class DieBoomBuff extends Buff {
  damage: number
  range: number

  constructor([damage, range]) {
    super('死亡爆炸');
    this.damage = damage
    this.range = range
  }

  install(target: Card) {
    target.on(CardEventEnum.onDie, () => {
      this.work(target)
    })
  }

  getEffects() {
    return [
      new AttackPlayerEffect([this.damage])
    ]
  }
}

export const buffMap = {
  DieBoomBuff
}
