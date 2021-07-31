


## 开发环境
```
npm i 
npm run dev
```

## 基础元素

棋盘
* 地形，限制移动范围
* 添加棋子
* 切换回合

棋子
* 分组，分为玩家棋子、敌方棋子、第三方棋子等
* 当前回合，每一轮回合只有对应组的棋子可以进行操作

棋子的操作
* 移动，根据移动力计算可移动范围，然后将棋子修改到对应位置
* 攻击，根据攻击范围选择目标进行攻击
* 使用技能 待定
* 使用道具 待定


## 一些设定

遭受攻击后，如果攻击目标在攻击范围内，可以进行1次反击

职业
* 转职，等级到达一定程度可以转职，需要引入等级和经验系统

技能
* 伤害型，单体，群攻
* 功能型，如治疗、buff、debuff 
* 特殊型技能，如改变地形、召唤
* 普攻也作为常规技能

道具
* 与技能类似，可以理解成不受限某种棋子的技能


## 进阶

AI https://blog.51cto.com/cping1982/133392


配置表
https://zhuanlan.zhihu.com/p/25745069

战棋游戏设计难点

https://www.zhihu.com/question/24915345


技能设计
https://gameinstitute.qq.com/course/detail/10112
https://www.zhihu.com/question/29545727
https://www.jianshu.com/p/1ea03fb899eb


表现层与逻辑层解耦
https://zhuanlan.zhihu.com/p/53952563


游戏公司岗位介绍
https://gitbook.cn/books/5bb0c13b6045817d35b98a34/index.html

游戏设计模式，看起来很酷的一本书
https://gpp.tkchu.me/introduction.html
