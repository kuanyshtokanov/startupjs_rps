import GamesModel from './GamesModel'
import RoundsModel from './RoundsModel'

export default function (racer) {
  racer.orm('games.*', GamesModel)
  racer.orm('rounds.*', RoundsModel)
}
