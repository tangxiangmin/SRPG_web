import {Effect} from "../common/Effect";
import {Card} from "./Card";
import {createPositionBuffConfig} from './buffList'
import {CardBuff} from "./Buff";
import {randomPick} from "./util";

export class AttackPlayerEffect implements Effect {
  damage: number

  constructor(args) {
    this.damage = args[0]
  }

  cast(target: Card) {
    target.attackPlayer(this.damage)
  }
}

export class RecoverEffect implements Effect {
  num: number

  constructor(args) {
    this.num = args[0]
  }

  cast(target: Card) {
    target.underRecover(this.num)
  }
}

export class DamageEffect implements Effect {
  num: number

  constructor(args) {
    this.num = args[0]
  }

  cast(card: Card) {
    card.target.underAttack(this.num)
  }
}

export class DamageSelfEffect implements Effect {
  num: number

  constructor(args) {
    this.num = args[0]
  }

  cast(card: Card) {
    card.underAttack(this.num)
  }
}

export class DieRandomPoisoningEffect implements Effect {
  cardNum: number
  damage: number
  duration: number

  constructor(args) {
    this.cardNum = args[0]
    this.damage = args[1]
    this.duration = args[2]
  }

  cast(target: Card) {
    const list = target.chessboard.findAroundCard(target.x, target.y, true)

    // 找到随机两个目标
    const ans = list.slice(0, 2)

    // 对目标添加中毒效果
    const buffConfig = createPositionBuffConfig(this.damage, this.duration)

    ans.forEach(card => {
      const buff = new CardBuff(buffConfig)
      card.addBuff(buff)
    })
  }
}

// 在指定位置召唤
export class SpawnEffect implements Effect {
  pos: string
  spawnChessConfig: any

  constructor(args) {
    this.pos = args[0]
    this.spawnChessConfig = args[1] || {}
  }

  cast(target: Card) {
    const card = new Card(this.spawnChessConfig)

    card.costEnergy = 0

    const {player, chessboard} = target

    const pos = {
      x: target.x - player.dir,
      y: target.y
    }

    player.selectCard(card)
    chessboard.putCard(pos.x, pos.y)
  }
}

// 对周围造成伤害
export class AroundDamageEffect implements Effect {
  damage: number

  constructor(args) {
    this.damage = args[0]
  }

  cast(target: Card) {
    const list = target.chessboard.findAroundCard(target.x, target.y, true)
    for (const card of list) {
      if (card.player !== target.player) {
        card.underAttack(this.damage)
      }
    }
  }
}

enum TargetEnum {
  friend = 0,
  enemy = 1
}

// 治疗周围单位
export class AroundRecoverEffect implements Effect {
  num: number
  target: TargetEnum // 0己方 1 对手
  constructor(args) {
    this.num = args[0]
    this.target = args[1]
  }

  cast(target: Card) {
    const list = target.chessboard.findAroundCard(target.x, target.y, true).filter(card => {
      const isCur = card.player === target.player
      return card !== target && this.target === TargetEnum.friend ? isCur : !isCur
    })

    if (list.length) {
      const card = randomPick(list)
      card.underRecover(this.num)
    }
  }
}

// 随机伤害
export class RandomDamageEffect implements Effect {
  damage: number
  target: TargetEnum

  constructor(args) {
    this.damage = args[0]
    this.target = args[1]
  }

  cast(target: Card) {
    const player = this.target === TargetEnum.friend ? target.player : target.chessboard.findPlayerEnemy(target.player)
    const list = target.chessboard.getPlayerChessList(player).filter(card => card !== target)

    console.log(list)
    console.log(player)
    if (list.length) {
      const cell = randomPick(list)
      cell.underAttack(this.damage)
    }
  }
}

// 根据配置名字和构造参数生成effect实例
const effectMap = {
  AttackPlayerEffect,
  RecoverEffect,
  DamageEffect,
  DamageSelfEffect,
  DieRandomPoisoningEffect,
  SpawnEffect,
  AroundDamageEffect,
  AroundRecoverEffect,
  RandomDamageEffect
}

export function initEffectWithName(name: string, args: any[]): Effect {
  const Construct = effectMap[name]
  return new Construct(args)
}
