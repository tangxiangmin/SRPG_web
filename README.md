


## 开发环境
```
npm i 
npm run dev
```

## 基础元素



## 一些设定

### 棋盘

地形
* 不同的UI
* 不同的移动消耗点
* 职业地形加成

回合
* 当前回合，每一轮回合只有对应组的棋子可以进行操作

### 棋子

职业
* UI
* 移动距离
* 攻击距离
* 技能列表

转职
* 等级到达一定程度可以转职，需要引入等级和经验系统

分组
* 玩家棋子
* 敌方棋子
* 第三方棋子

操作
* 移动，根据移动力计算可移动范围，然后将棋子修改到对应位置
* 攻击，根据攻击范围选择目标进行攻击
* 使用技能
* 使用道具 待定

### 技能系统

主动技能
* 伤害型，单体，群攻
* 功能型，如治疗、buff、debuff
* 特殊型技能，如改变地形、召唤

Buff
* 与技能类似，一些增益状态，有一定的持续回合

被动技能
* 被动技能可以当做是无持续时间的特殊BUFF

道具
* 与技能类似，可以理解成不受限某种棋子的技能

### 攻击系统

攻击
* 选择在攻击范围内的目标，造成伤害

反击
* 遭受攻击后，如果攻击目标在攻击范围内，可以进行反击
* 反击次数：0次、1次或多次，由棋子决定
* 反击伤害：暂定为原始攻击

## 进阶：一些功能的实现
《SRPG游戏开发》导航
https://blog.csdn.net/darkrabbit/article/details/79200777

AI
https://blog.51cto.com/cping1982/133392


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

如何在游戏机制中使用AI/剧情脚本－－－－基于LUA
http://www.cppblog.com/darkdestiny/archive/2006/10/30/14400.html

一款RPG游戏中的剧情脚本应该怎么实现？
https://www.zhihu.com/question/38858235

《游戏脚本的设计与开发》
https://blog.csdn.net/lufy_legend/article/details/8888787
