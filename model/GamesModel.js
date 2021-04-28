import { BaseModel } from 'startupjs/orm'

export default class GamesModel extends BaseModel {
  async addSelf(data) {
    const _id = this.getId()
    const $rounds = this.root.scope('rounds.*')

    const gameId = await this.root.add(
      this.getCollection(),
      {
        _id,
        createdAt: new Date(),
        ...data
      })

    await $rounds.addSelf({
      gameId,
      round: 1,
      winnerId: null,
      players: {},
    })
  }

  async finishGame(players, currentRound) {
    const stats = players.reduce((acc, item) => {
      acc[item] = currentRound.players[item].totalScore
      return acc
    }, {})

    this.set('isFinished', true)
    this.set('playersStatistics', stats)
  }
}