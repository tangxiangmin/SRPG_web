import {Target} from "./skill/Target";
import Chessboard from './Chessboard'
import {Skill} from "./skill/Skill";

export class Chess extends Target {
  chessboard: Chessboard
  group: number

  name: string

  moveStep: number
  attackDistance: number

  isMoved: boolean = false // 是否可以移动
  isActioned: boolean = false // 是否可以操作


  // todo 把攻击和技能相关的逻辑交给Target对象
  constructor(name: string, hp: number, atk: number, moveStep: number, attackDistance: number, frame: string, skillList, buffList) {
    super({hp, mp: 10, frame, atk, speed: moveStep, skillList, buffList})

    this.name = name;

    this.attackDistance = attackDistance // 攻击距离
    this.moveStep = moveStep; // 移动距离
  }

  get isDisabled() {
    return this.isMoved && this.isActioned
  }

  attack(chess: Chess) {
    super.attack(chess);

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
    super.onDie()
    console.log(`${this.name}战败，从棋盘上移除`)
    this.chessboard.removeChess(this)
  }

  resetOnRound() {
    this.isMoved = false
    this.isActioned = false
  }
}
