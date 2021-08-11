abstract class State {
  abstract execute(entity: Entity): void
}

class Entity {
  state: State

  update() {
    this.state.execute(this)
  }

  changeState(state: State) {
    this.state = state
  }

  isSafe(): boolean {
    return true
  }

  isThreatened(){
    return false
  }

  moveAwayFromEnemy():void{}
  snore(){}
}


class State_RunAway extends State {
  execute(entity: Entity) {
    if(entity.isSafe()){
      entity.changeState(new State_Sleep())
    }else {
      entity.moveAwayFromEnemy()
    }
  }
}
class State_Sleep extends State{
  execute(entity: Entity) {
    if(entity.isThreatened()){
      entity.changeState(new State_RunAway())
    }else {
      entity.snore()
    }
  }
}
