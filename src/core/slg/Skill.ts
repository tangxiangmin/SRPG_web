import {Skill} from '../common/Skill'
import {skillMap} from "../config/skill";
import {initEffectWithName} from './Effect'


export class ChessSkill extends Skill {
  // 子类实现
  getSkillMap() {
    return skillMap
  }

  initEffectWithName(name, args) {
    return initEffectWithName(name, args)
  }
}
