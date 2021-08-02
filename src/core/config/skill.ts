// 假设这是个配置表
export const skillMap = {
  'ChangeSheepSkill': {
    desc: '将单位变羊，并造成10点伤害',
    effects: [
      {
        name: 'ChangeSheepEffect',
        args: ['sheep', 0, 0]
      },
      {
        name: 'DamageEffect',
        args: [10]
      }
    ]
  },
  'RecoverSkill': {
    desc: '恢复单位15点HP',
    effects: [
      {
        name: 'RecoverEffect',
        args: [15]
      }
    ]
  },
  'PoisoningSkill': {
    desc: '向单位添加中毒buff，持续2回合，每回合造成10点伤害',
    effects: [
      {
        name: 'PoisoningEffect',
        args: [2, 10]
      }
    ]
  },
  'BoomSkill': {
    desc: '向指定位置周围2格内的所有单位爆炸，造成15点伤害',
    effects: [
      {
        name: 'BoomEffect',
        args: [2, 15]
      }
    ]
  }
}
