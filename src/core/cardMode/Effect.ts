import {Effect} from "../common/Effect";
import {Card} from "./Card";

export class AttackPlayerEffect implements Effect {
  damage: number

  constructor(args) {
    this.damage = args[0]
  }

  cast(target: Card) {
    target.attackPlayer(this.damage)
  }
}

// 根据配置名字和构造参数生成effect实例

const effectMap = {
  AttackPlayerEffect
}

export function initEffectWithName(name: string, args: any[]): Effect {
  const Construct = effectMap[name]
  return new Construct(args)
}
