import {Buff} from '../common/Buff'
import {Effect} from "../common/Effect";

import {Card, CardEventEnum} from "./Card";
import {initEffectWithName} from "./Effect";

import {BuffConfig} from "./buffList";

export class CardBuff extends Buff {
  event: string
  desc: string
  duration: number

  effectList: Effect[]

  constructor(config: BuffConfig) {
    const {name, desc, effects, event, duration} = config
    super(name);
    this.event = event
    this.desc = desc
    this.duration = duration || Infinity // Infinity表示永久

    this.effectList = effects.map(({name, args}) => {
      return initEffectWithName(name, args)
    })
  }

  install(target: Card) {
    target.on(CardEventEnum[this.event], () => {
      this.work(target)
    })

    target.on(CardEventEnum.onUpdate, () => {
      this.duration--
      if (this.duration <= 0) {
        target.removeBuff(this)
      }
    })
  }

  getEffects() {
    return this.effectList
  }
}

