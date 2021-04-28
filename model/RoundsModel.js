import { BaseModel } from 'startupjs/orm'
import _cloneDeep from 'lodash/cloneDeep'

export default class RoundsModel extends BaseModel {
  async addSelf(data) {
    const _id = data.id ? data.id : this.getId()

    await this.root.add(
      this.getCollection(),
      {
        _id,
        ...data
      }
    )
  }

  calculateRoundWinner = (rounds, userId, opponentId) => {
    const userAction = rounds.players[userId].response
    const opponentAction = rounds.players[opponentId].response
    let draw, userWinner = false
    if (opponentAction === 'surrender') {
      userWinner = true
    } else if (userAction === opponentAction) {
      draw = true
    } else if (
      (userAction === 'rock' && opponentAction === 'scissors') ||
      (userAction === 'scissors' && opponentAction === 'paper') ||
      (userAction === 'paper' && opponentAction === 'rock')
    ) {
      userWinner = true
    }

    return [draw, userWinner]
  }

  getScore = (score, isCombo) => {
    return isCombo ? score === 0 ? 1 : score * 2 : 1
  }

  calculatePoints = (allRounds, curRound, curWinner) => {
    const prevRound = allRounds[1]
    const playersData = allRounds[0].players
    let playersDataTemp = _cloneDeep(playersData)

    const players = Object.keys(playersDataTemp)

    const isCombo = prevRound && (prevRound.winnerId === 'draw' || prevRound.winnerId === curWinner)

    //if FIRST ROUND set winner's score to 1
    if (curRound === 1) {
      //if DRAW return current stats
      if (curWinner === 'draw') {
        return playersDataTemp
      } else {
        //set winner's score to 1
        playersDataTemp[curWinner].score = 1
        playersDataTemp[curWinner].totalScore = 1
      }
    } else {  //if NOT FIRST ROUND
      //if DRAW return previous stats
      if (curWinner === 'draw') {
        players.map(item => {
          playersDataTemp[item].score = 0
          playersDataTemp[item].totalScore = prevRound.players[item].totalScore
        })
      } else {
        //if NOT DRAW increment winner's score
        players.map(item => {
          if (item === curWinner) {
            playersDataTemp[curWinner].score = this.getScore(prevRound.players[curWinner].score, isCombo)
            playersDataTemp[curWinner].totalScore = prevRound.players[curWinner].totalScore + playersDataTemp[curWinner].score
          } else {
            playersDataTemp[item].score = 0
            playersDataTemp[item].totalScore = prevRound.players[item].totalScore
          }

        })

      }

    }

    return playersDataTemp
  }

  async chooseOption(playersData, userId, option) {
    let playersDataTemp = _cloneDeep(playersData)

    playersDataTemp[userId] = {
      response: option,
      score: 0,
      totalScore: 0,
    }
    this.set('players', { ...playersDataTemp })
  }

  async finishRound(currentRound, userId, opponentId, allRounds, round) {
    const [draw, userWinner] = this.calculateRoundWinner(currentRound, userId, opponentId)
    const winnerId = draw ? 'draw' : userWinner ? userId : opponentId

    //calculate points
    const players = this.calculatePoints(allRounds, round, winnerId)

    this.set('winnerId', winnerId)
    this.set('players', players)
  }
}