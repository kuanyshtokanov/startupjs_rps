import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useDoc, useQueryDoc, emit, model } from 'startupjs'
import { Content, Div, H5, H6, Span, Button } from '@startupjs/ui'

import { getUser } from '../helper'
import './index.styl'

const Professor = observer(({ game, round }) => {
  const [currentRound, $currentRound] = useQueryDoc('rounds', {
    gameId: game.id,
    round: round,
  })

  const [, $games] = useDoc('games', game.id)

  const handleFinish = async () => {
    await $games.finishGame(game.players, currentRound)

    emit('url', '/games')
  }

  const handleNext = async () => {
    const rId = model.id()
    await $currentRound.addSelf({
      id: rId,
      gameId: game.id,
      round: currentRound.round + 1,
      winnerId: null,
      players: {},
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