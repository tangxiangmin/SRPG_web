import {Effect, EffectContainer, EffectTarget} from "./Effect";

export abstract class Buff implements EffectContainer {
  name: string
  duration: number = Infinity

  // 获取功能列表
  abstract getEffects(): Effect[]

  // 添加时
  abstract install(target: EffectTarget): void

  protected constructor(name: string) {
    this.name = name
  }

  // 生效时
  work(target: EffectTarget) {
    const effectList = this.getEffects()
    for (const effect of effectList) {
      effect.cast(target);
    }

    this.duration--
    if (this.duration < 0) {
      target.removeBuff(this)
    }
  }
}

// 解析类似于'PoisoningDamageBuff,10,3'的字符串，用于构建buff实例
export function initBuffWithString(str, buffMap) {
  const [key, ...args] = str.split(',')
  const Construct = buffMap[key]
  return new Construct(args)
}
