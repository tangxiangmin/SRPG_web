import {EffectTarget} from '../common/Effect'
import Chessboard from "./Chessboard";
import {buffMap} from "./Buff";
import {ChessSkill} from "./Skill";
import {initBuffWithString} from "../common/Buff";

type rawConfig = {
  hp: number
  mp: number
  atk: number,
  speed: number,
  strikeBackNum: number,
  frame: string
}

export enum ChessEventType {
  onAttack,
  onUpdate,
  onDie,
  underAttack,
}


export class Chess extends EffectTarget {
  config: rawConfig

  x: number
  y: number

  hp: number
  mp: number
  atk: number

  speed: number
  frame: string

  // 反击
  strikeBackNum: number // 可反击次数
  strikeBackTarget: Chess

  chessboard: Chessboard
  group: number

  name: string

  moveStep: number
  attackDistance: number

  isMoved: boolean = false // 是否可以移动
  isActioned: boolean = false // 是否可以操作

  constructor(props) {
    super(props)

    const {
      name,
      moveStep,
      attackDistance, hp, mp, frame, atk, speed, strikeBackNum = 1
    } = props

    this.name = name;

    this.attackDistance = attackDistance // 攻击距离
    this.moveStep = moveStep; // 移动距离
    this.hp = hp
    this.mp = mp
    this.frame = frame
    this.atk = atk
    this.speed = speed

    this.buffList = []

    this.strikeBackNum = strikeBackNum

    this.config = {
      hp, mp, frame, atk, speed, strikeBackNum
    }
  }

  initSkillList(skillList: string[]) {
    this.skillList = skillList.map(key => {
      return new ChessSkill(key)
    })
  }

  initPassivityBuff(buffList) {
    buffList.forEach(str => {
      const buff = initBuffWithString(str, buffMap)
      this.addBuff(buff)
    })
  }


  // 更新时
  onUpdate() {

    this.strikeBackNum = this.config.strikeBackNum

    this.emit(ChessEventType.onUpdate)
  }

  // // 被攻击时
  onAttack(target: Chess) {

    this.emit(ChessEventType.onAttack, target)

    this.underAttack(target.atk)

    // 存活才可以反击
    if (this.hp > 0) {
      this.strikeBackTarget = target
      this.strikeBack()
    }
  }

  underAttack(damage: number) {
    this.emit(ChessEventType.underAttack, damage)

    this.hp -= damage
    if (this.hp <= 0) {
      this.onDie()
    }
  }

  // 反击
  strikeBack() {
    const {strikeBackTarget} = this
    const canStrikeBack = this.strikeBackNum > 0
      && strikeBackTarget
      && this.checkStrikeBackTarget(strikeBackTarget)

    if (canStrikeBack) {
      strikeBackTarget.hp -= this.atk
      this.strikeBackNum -= 1
    }
  }

  get isDisabled() {
    return this.isMoved && this.isActioned
  }

  attack(chess: Chess) {
    chess.onAttack(this)

    console.log(
      `${this.name}攻击${chess.name}，造成${this.atk}点伤害，${chess.name}剩余血量${chess.hp}`
    );

    this.isActioned = true
  }

  checkStrikeBackTarget(target) {
    const attackRange = this.chessboard.calcChessAttackRange(this)
    // 在攻击范围内
    return attackRange.some(({x, y}) => {
      return target.x === x && target.y === y
    })
  }

  onDie() {
    // 触发一些被动技能之类的，比如爆炸
    this.emit(ChessEventType.onDie)

    console.log(`${this.name}战败，从棋盘上移除`)
    this.chessboard.removeChess(this)
  }

  resetOnRound() {
    this.isMoved = false
    this.isActioned = false
  }
}
