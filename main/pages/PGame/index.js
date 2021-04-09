import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useDoc, useSession, useQuery } from 'startupjs'
import { Content, Div, H2, H4 } from '@startupjs/ui'
import Professor from "./Professor"
import Player from "./Player"

import './index.styl'

const PGame = observer(props => {
  const { match: { params: { gameId } } } = props
  const [user] = useSession('user')

  const [game, $game] = useDoc('games', gameId)

  const [rounds, $rounds] = useQuery('rounds', {
    gameId: gameId,
    $sort: { round: -1 },
    $limit: 1
  })
  console.log('game rounds[0]', rounds[0])

  if (!game) {
    return pug`
        H4.header Game not found!
      `
  }

  if (!game.players || game.players.length < 2) {
    return pug`
        H4.header Waiting for players!
      `
  }

  return pug`
    ScrollView.root
      Content
        H4.header= game.name
        Text GAME CHRONOLOGY HERE
        if user.isProfessor
          Professor(
            userId=user.id
            game=game
            round=rounds[0].round
          )
        else
          Player(
            userId=user.id
            game=game
            round=rounds[0].round
          )
  `
})

export default PGame