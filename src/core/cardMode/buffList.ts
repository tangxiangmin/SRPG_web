export interface BuffConfig {
  name: string,
  desc: string,
  event: string,
  effects: { name: string, args: any[] }[],
  duration: number
}

export function createPositionBuffConfig(damage, duration): BuffConfig {
  return {
    name: '中毒',
    desc: `每回合扣除${damage}点HP`,
    event: 'onUpdate',
    duration: duration,
    effects: [
      {
        name: 'DamageEffect',
        args: [damage]
      }
    ]
  }
}

// 假设这是个配置表
export const buffMap = {
  'DieBoomBuff': {
    name: '死亡伤害',
    desc: 'xxxxx',
    event: 'onDie',
    duration: Infinity,
    effects: [
      {
        name: 'AttackPlayerEffect',
        args: [1]
      },
    ]
  },
  'RecoverAfterAttackBuff': {
    name: '受击治疗',
    desc: '受到攻击后存活，则恢复2点HP',
    event: 'afterAttack',
    duration: Infinity,
    effects: [
      {
        name: 'RecoverEffect',
        args: [2]
      }
    ]
  },

  'PoisoningBuff': createPositionBuffConfig(3, 1),
  'DieRandomPoisoningBuff': {
    name: '死亡释毒',
    desc: '死亡时向周围2个随机目标释放伤害为1的中毒buff，持续3回合',
    event: 'onDie',
    duration: Infinity,
    effects: [
      {
        name: 'DieRandomPoisoningEffect',
        args: [2, 1, 3]
      }
    ]
  }
}

export function getBuffConfigByKey(key): BuffConfig {
  return buffMap[key]
}
