import {Effect, EffectContainer} from "./Effect";
import {Target} from './Target'

// 装备系统，暂时不接入
interface Equip extends EffectContainer {
  wearUp(target: Target): void
}

class WoodEquip implements Equip {
  getEffects(): Effect[] {
    // todo 填充效果
    return []
  }

  wearUp(target) {
    const effectList = this.getEffects()
    for (const effect of effectList) {
      effect.cast(target);
    }
  }
}



