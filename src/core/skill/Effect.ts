import {Target} from "./Target";
import {PoisoningDamageBuff} from './Buff'
import {Chess} from "../Chess";
import {CellType} from "../Chessboard";

// 效果接口
export interface Effect {
  cast(target: Target): void
}

// 装备、buff 等都可以当做是 effect容器
export interface EffectContainer {
  getEffects(): Effect[]
}

//  下面是需要实现的各种效果， 通过在skill中组装实现技能和buff等功能

export class DamageEffect implements Effect {
  damage: number;

  constructor(args) {
    this.damage = args[0]
  }

  cast(target: Target) {
    target.hp -= this.damage
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
}

class RecoverEffect implements Effect {
  hp: number

  constructor(args) {
    this.hp = args[0]
  }

  cast(target: Target) {
    target.hp += this.hp
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
    const buff = new PoisoningDamageBuff([damage, duration])
    target.addBuff(buff)
  }
}

// 范围效果示例  爆炸
export class BoomEffect implements Effect {
  range: number
  damage: number

  constructor(args) {
    this.range = args[0]
    this.damage = args[1]
  }

  cast(target: Target) {
    const chessboard = (target as Chess).chessboard
    const cellList = chessboard.findAroundCell(target.x, target.y)

    for (const {x, y} of cellList) {
      const c = chessboard.getChessByPos(x, y)
      if (c) {
        c.underAttack(this.damage)
        console.log(`${c.name}受到爆炸伤害${this.damage}点`)
      } else {
        // 改变地形
        chessboard.updateGrid(x, y, CellType.blank)
      }
    }
  }
}

// 位移效果示例 受到攻击后退
export class BackEffect implements Effect {
  enemyX: number
  enemyY: number

  constructor(args) {
    this.enemyX = args[0]
    this.enemyY = args[1]
  }

  cast(target: Target) {
    const {x: x0, y: y0} = target
    const {enemyX: x1, enemyY: y1} = this
    // 根据敌人的攻击方向确认移动位置
    if (x0 < x1) {
      target.x -= 1
    } else if (x0 > x1) {
      target.x += 1
    } else if (y0 < y1) {
      target.y -= 1
    } else {
      target.y += 1
    }
    // 不会受伤
    target.hp = Infinity

    console.log(`受到攻击，后退一格`)

  }
}

const effectMap = {
  DamageEffect,
  ChangeSheepEffect,
  RecoverEffect,
  PoisoningEffect,
  BoomEffect,
  BackEffect
}

// 根据配置名字和构造参数生成effect实例
export function initEffectWithName(name: string, args: any[]): Effect {
  const Construct = effectMap[name]
  return new Construct(args)
}
