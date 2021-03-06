import {createBuffConfig} from './buffList'
import {Card} from "./Card";
// 配置的一些卡片
// todo 这里写个脚本来随机生成一些有趣的卡片

function createCardConfig(id, name, costEnergy, firstStep, hp, buffList, moveStep = 1, cardType = 0, skillList = []) {
  return {
    id,
    name,
    costEnergy,
    firstStep,
    moveStep,
    hp,
    buffList,
    cardType,
    skillList
  }
}

const spawnBuff = createBuffConfig('召唤侍从', '出牌时在后方空地召唤1个1点HP的侍从', 'afterPut', 1, [
  {name: "SpawnEffect", args: ['后方', createCardConfig('-1', '新兵', 0, 0, 1, [], 1)]}
])

const championBuff = createBuffConfig('冠军之力', '攻击前先造成3点伤害', 'beforeAttack', Infinity, [
  {name: "DamageEffect", args: [3]}
])

const batchAttackBuff = createBuffConfig('群体攻击', '攻击前对周围敌人和建筑造成2点伤害', 'beforeAttack', Infinity, [
  {name: "AroundDamageEffect", args: [2]}
])

// const ruinAttackBuff = createBuffConfig('单体攻击', '对指定目标造成3点伤害', 'onUse', Infinity, [
//   {name: "DamageEffect", args: [3]}
// ])

// 单位卡
const unit = [
  createCardConfig(1, '新兵', 2, 1, 1, [], 1),
  createCardConfig(2, '侍从', 3, 0, 3, [spawnBuff], 1), // spawnBuff
  createCardConfig(3, '传令兵', 4, 2, 2, [], 1),
  createCardConfig(4, '老兵', 5, 1, 5, [], 1),
  createCardConfig(5, '战争老兵', 7, 1, 8, [], 1),
  createCardConfig(6, '冠军', 8, 2, 6, [championBuff], 1),
  createCardConfig(7, '群攻破坏者', 6, 1, 1, [batchAttackBuff], 1),
]

const robot = [
  createCardConfig(201, '绿色原型', 1, 1, 1, [
    createBuffConfig('死亡回复', '死亡时随机治疗周围敌军1点HP', 'onDie', Infinity, [
      {name: "AroundRecoverEffect", args: [1, 1]}
    ])
  ], 1),
  createCardConfig(202, '破坏机器人', 2, 1, 2, [
    createBuffConfig('', '出牌时对随机友军造成1点伤害', 'beforePut', Infinity, [
      {name: "RandomDamageEffect", args: [1, 0]}
    ])
  ], 1),
  createCardConfig(203, '不稳定工事', 2, 0, 5, [
    createBuffConfig('', '每回合开始时对自己造成2点伤害', 'onUpdate', Infinity, [
      {name: "DamageSelfEffect", args: [2]}
    ])
  ], 0),
]

const pirate = [
  createCardConfig(301, '北海海贼', 2, 1, 1, [
    createBuffConfig('', '做为最后一张牌打出时，增加5点HP', 'onLastPut', Infinity, [
      {name: "RecoverEffect", args: [5]}
    ])
  ], 1),

]

// 技能卡，todo 缩减技能卡的配置项
const skill = [
  createCardConfig(8, '闪电', 1, 0, 1, [], 1, 1, ['lightning']),
]

// 建筑卡，将moveStep设置成0就可以
const structure = [
  createCardConfig(9, '要塞', 1, 0, 4, [], 0),
]

const cardList = [
  ...unit,
  ...skill,
  ...structure,

  ...robot,

  ...pirate
]

export const cardMap = cardList.reduce((acc, card) => {
  acc[card.id] = card
  return acc
}, {})

export function getCardConfigByKey(id) {
  return cardMap[id]
}
