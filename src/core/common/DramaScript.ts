import EventBus from "./EventBus";
import {getTransitionRawChildren} from "vue";

function chat(username: string, avatar: string, content: string) {
  console.log(`${username}[${avatar}]说:${content}`)
}

function resume() {

}

// 感觉需要一个脚本触发器，在游戏流程的某些点触发剧本，然后按照剧本设计执行剧本，完毕后回到游戏流程继续游戏

function playDrama() {

}


function fragment1() {
  chat('A', '头像1', '你好')
  chat('B', '头像2', '你也好')
}

function fragment2() {
  chat('A', '头像1', '今天天气不错')
  chat('B', '头像2', '对啊')
}

const fragmentMap = {
  fragment1,
  fragment2
}

const bus = new EventBus()

bus.on('play fragment', async (name) => {
  // ... 根据name执行相关的剧本逻辑

  const fragment = fragmentMap[name]

  if (typeof fragment === 'function') {
    await fragment1()
  }

  resume()
})

function main() {


  // game start

  // game trigger drama

  bus.emit('play fragment', 'fragment1')

  // resume game

}

main()

class Actor {
}
