import {Card, CardFactory} from './Card'
import {CardChessboard} from "./CardChessboard";
import {randomPick} from './util'

export class Player {
  name: string
  dir: number // 方向
  hp: number = 10 // 生命值

  maxCardNum: number = 4 // 最大卡片数量
  maxEnergy: number = 2 // 最大能量值

  // 当前能量
  energy: number = 2

  cardList: Card[] = []

  cardFactory: CardFactory // 负责实现随机抽卡算法

  currentCard: Card

  chessboard: CardChessboard
  hasRefreshCard: boolean = false

  constructor({name, cardGroup, dir}) {
    this.name = name
    this.dir = dir

    this.cardFactory = new CardFactory(cardGroup)
    this.drawFillCard()
  }


  onRoundStart() {
    this.hasRefreshCard = false
    this.maxEnergy += 1
    this.energy = this.maxEnergy
    this.drawFillCard()
  }

  // 补满卡牌
  drawFillCard() {
    this.drawCard(this.maxCardNum - this.cardList.length)
  }

  // 抽取指定数量的卡片
  drawCard(num: number) {
    if (num > 0) {
      const expect = this.cardList.map(card => card.id)
      const cards = this.cardFactory.drawCards(num, expect)
      this.cardList = [...this.cardList, ...cards]
    }
  }

  // 选择卡片
  selectCard(card) {
    this.currentCard = card
  }

  // 打出一张牌
  putCard(card: Card) {
    this.energy -= card.costEnergy
    card.player = this
    this.currentCard = null
    this.cardList = this.cardList.filter(c => c !== card)
  }

  // 丢弃当前牌，重新抽一张
  refreshCard() {
    if (this.hasRefreshCard) return // 同一回合只能重选一张

    this.cardList = this.cardList.filter(c => c !== this.currentCard)
    this.currentCard = null
    this.hasRefreshCard = true

    this.drawCard(1)
  }
}

// 背包获取，在有限容量内获取价值最大的组合
function knapsack(capacity, list, index, path) {
  if (index < 0 || capacity <= 0) {
    return {
      val: 0,
      path: path,
    };
  }

  if (list[index].size > capacity) {
    return knapsack(capacity, list, index - 1, path);
  }
  const {value, size} = list[index];
  const cur = value;
  const {val: nextContainCur, path: nextContainPath} = knapsack(
    capacity - size,
    list,
    index - 1,
    path
  );

  const {val: nextIgnoreCur, path: nextIgnorePath} = knapsack(
    capacity,
    list,
    index - 1,
    path
  );

  if (cur + nextContainCur > nextIgnoreCur) {
    return {
      val: cur + nextContainCur,
      path: [...nextContainPath, index],
    };
  } else {
    return {
      val: nextIgnoreCur,
      path: nextIgnorePath,
    };
  }
}

// todo 这里需要设计比较灵活的AI https://www.xqbase.com/index.htm
export class AIPlayer extends Player {
  // 先随便写一点，假设AIPlayer都是dir === 1的，在屏幕上方
  calcCurrentPos(card: Card) {
    const {chessboard} = this
    const {putRange, col} = chessboard

    const [x0, x1] = putRange
    const list = []
    let maxX = -1
    for (let x = x1; x >= x0; --x) {
      for (let y = 0; y < col; ++y) {
        // 计算每个单元格和卡片的权重
        const target = chessboard.getCardByPos(x, y)
        if (!target) {
          list.push({x, y})
          if (maxX < x) {
            maxX = x
          }
        }
      }
    }

    const enemy = chessboard.findPlayerEnemy(this)
    const enemyChessList = chessboard.getPlayerChessList(enemy)

    if (enemyChessList) {
      // 找到最靠近城堡且血量较低的棋子，用于消灭
      enemyChessList.sort((a, b) => a.x - b.x || a.hp - b.hp)
      let target
      if (target = enemyChessList.shift()) {
        const cell = list.find(({x, y}) => {
          return (y === target.y && x < target.x) || (x === target.x && y === target.y - 1) || (x === target.x && y === target.y + 1)
        })
        if (cell) {
          return cell
        }
      }
    }

    // 找不到合适的位置，则在最远的那一行随机选择一个空位放置
    return randomPick(list.filter(({x,}) => x === maxX))
  }

  // 计算某张卡牌的权重
  calcCardWeight(card: Card) {
    const {chessboard} = this
    const {costEnergy, hp, firstStep} = card
    let weight = 1

    weight += hp
    weight += firstStep

    // 背包问题选择可以打出的卡片
    return {
      value: weight,
      size: costEnergy,
      card
    }
  }

  choosePutCardList(): Card[] {
    const listWithWeight = this.cardList
      .filter(card => card.costEnergy <= this.energy)
      .map(card => this.calcCardWeight(card))

    const {path} = knapsack(this.energy, listWithWeight, listWithWeight.length - 1, [])

    // 返回对应的卡牌列表
    return path.map(idx => {
      return listWithWeight[idx].card
    })
    // 计算卡牌的权重值
  }

  async autoPlay() {
    const {chessboard} = this
    // 选出一张合适的牌

    let cards = this.choosePutCardList()
    let card
    while (card = cards.shift()) {
      // todo 选择一个合适的位置
      // 解决办法，对于每张卡牌，每个可放置的单元格都计算一个权重值
      const cell = this.calcCurrentPos(card)
      if (!cell) break

      // 打牌
      this.selectCard(card)
      await chessboard.putCard(cell.x, cell.y)
    }

    // 随便放个位置
    await chessboard.toggleRound()
  }
}
