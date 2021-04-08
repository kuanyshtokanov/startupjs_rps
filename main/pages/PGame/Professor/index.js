import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useDoc, useSession, useQuery } from 'startupjs'
import { Content, Div, H5, Button } from '@startupjs/ui'

import './index.styl'

const Professor = observer(({ userId, game, rounds }) => {
  const currentRound = rounds[0]

  const [firstPlayerId, secondPlayerId] = game.players
  console.log('first player ', firstPlayerId)
  console.log('second player ', secondPlayerId)
  console.log('professor asd', game)

  const handleFinish = async () => {
    console.log('finish game')
    await model.setEach(`games.${game.id}`, {
      isFinished: true,
      // playersStatistics: {
      //   [firstPlayerId]: {
      //     status: getPlayerStatus(firstPlayerStats.totalScore, secondPlayerStats.totalScore),
      //     finalScore: firstPlayerStats.totalScore
      //   },
      //   [secondPlayerId]: {
      //     status: getPlayerStatus(secondPlayerStats.totalScore, firstPlayerStats.totalScore),
      //     finalScore: secondPlayerStats.totalScore
      //   }
      // }
    })
  }

  const handleNext = () => {
    console.log('next round')
  }

  return pug`
    Div.root
      Text Professor game
      H5.title Round #{currentRound.round}
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