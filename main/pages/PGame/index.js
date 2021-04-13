import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useDoc, useSession, useQuery } from 'startupjs'
import { Content, Div, H2, H4, H6, Span } from '@startupjs/ui'
import GameChronology from 'components/GameChronology'
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
  })

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
        GameChronology(
          rounds=rounds
          game=game
          user=user
        )
        if user.isProfessor
          Professor(
            game=game
            round=rounds[0] ? rounds[0].round : 1
          )
        else
          Player(
            userId=user.id
            game=game
            round=rounds[0] ? rounds[0].round : 1
          )
  `
})

export default PGame