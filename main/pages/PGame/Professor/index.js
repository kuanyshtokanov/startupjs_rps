import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useDoc, useSession, useQuery, emit, model } from 'startupjs'
import { Content, Div, H5, H6, Span, Button } from '@startupjs/ui'

import { getUser } from '../helper'
import './index.styl'

const Professor = observer(({ game, round }) => {
  const [curRounds, $curRounds] = useQuery('rounds', {
    gameId: game.id,
    round: round,
  })
  const currentRound = curRounds[0]

  const handleFinish = async () => {
    const stats = game.players.reduce((acc, item) => {
      acc[item] = currentRound.players[item].totalScore
      return acc
    }, {})

    await model.setEach(`games.${game.id}`, {
      isFinished: true,
      playersStatistics: stats
    })

    emit('url', '/')
    // await model.del('games.' + '4af2d247-127c-48ce-be8a-69210ab67f85')
  }

  const handleNext = async () => {
    await model.add('rounds', {
      id: model.id(),
      gameId: game.id,
      round: currentRound.round + 1,
      winnerId: null,
      players: {}
    })
  }

  return pug`
    Div.root
      Text Professor game
      H5.title Round #{currentRound.round}
      if currentRound && currentRound.winnerId
        H6.winnerHeader Round finished! 
      Div.actions
        Button.btn(
          disabled=currentRound.winnerId || game.isFinished ? false: true
          color="warning"
          onPress=handleFinish
        ) Finish game
        Button.btn(
          disabled=currentRound.winnerId? false: true
          color="success"
          onPress=handleNext
        ) Next Round
        
  `
})

export default Professor