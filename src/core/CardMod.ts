import {Chess} from "./Chess";
import Chessboard from "./Chessboard";


class Card extends Chess {

}

class CardChessboard extends Chessboard {
  constructor(props) {
    super(props);

    this.row = 5
    this.col = 4
  }
}

class Player {
  cardList: Card[]

  chessboard:Chessboard
  putCard(x,y){
    // this.chessboard.addChess(x, y )
  }
}
