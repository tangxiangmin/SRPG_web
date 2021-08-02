import {Target} from "./Target";
import {PoisoningDamageBuff} from './Buff'

// 效果接口
export interface Effect {
  cast(target: Target): void

  reverse(): void
}

// 装备、buff 等都可以当做是 effect容器
export interface EffectContainer {
  getEffects(): Effect[]
}

// todo 下面是需要实现的各种效果， 通过在skill中组装实现技能和buff等功能

export class DamageEffect implements Effect {
  damage: number;

  constructor(args) {
    this.damage = args[0]
  }

  cast(target: Target) {
    target.hp -= this.damage
  }

  reverse() {
  }
}

class ChangeSheepEffect implements Effect {
  frame: string
  atk: number
  speed: number

  constructor(args) {
    this.frame = args[0]
    this.atk = args[1]
    this.speed = args[2]
  }

  cast(target: Target) {
    target.frame = this.frame
    target.atk = this.atk
    target.speed = this.speed
  }

  reverse() {
  }
}

class RecoverEffect implements Effect {
  hp: number

  constructor(args) {
    this.hp = args[0]
  }

  cast(target: Target) {
    target.hp += this.hp
  }

  reverse() {
  }
}

// 持续影响的效果
class PoisoningEffect implements Effect {
  duration: number
  damage: number

  constructor(args) {
    this.duration = args[0]
    this.damage = args[1]
  }

  cast(target: Target) {
    const {damage, duration} = this
    const buff = new PoisoningDamageBuff(damage)
    target.addBuff(buff, duration)
  }

  reverse() {
  }
}

// 范围效果
class BoomEffect implements Effect {
  range: number
  damage: number

  constructor(args) {
    this.range = args[0]
    this.damage = args[1]
  }

  cast(target: Target) {
    const {x, y} = target
    // todo 找到x、y周围的元素，执行对应动画和逻辑
    console.log({x, y})
    target.hp -= this.damage
  }

  reverse() {
  }
}

const effectMap = {
  DamageEffect,
  ChangeSheepEffect,
  RecoverEffect,
  PoisoningEffect,
  BoomEffect
}

// 根据配置名字和构造参数生成effect实例
export function initEffectWithName(name: string, args: any[]): Effect {
  const Construct = effectMap[name]
  return new Construct(args)
}
