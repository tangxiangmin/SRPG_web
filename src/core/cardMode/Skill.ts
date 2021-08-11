import {Skill} from "../common/Skill";

import {initEffectWithName} from "./Effect";

export class CardSkill extends Skill {
  // 子类实现
  getSkillMap() {
    // todo 做成跟buff那样，直接传入配置
    return {
      'lightning': {
        name: '闪电',
        desc: '对选中单位造成2点伤害',
        effects: [
          {
            name: 'DamageSelfEffect',
            args: [2]
          }
        ]
      }
    }
  }

  initEffectWithName(name, args) {
    return initEffectWithName(name, args)
  }
}
