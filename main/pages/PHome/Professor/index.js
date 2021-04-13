import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useSession, useQuery, useDoc, model, emit } from 'startupjs'
import { Content, Input, Button, Div } from '@startupjs/ui'
import GamesList from 'components/GamesList'
import './index.styl'

export default observer(() => {
  const [userId] = useSession('userId')
  const [games, $games] = useQuery('games',
    {
      $aggregate: [
        {
          $match: {
            isFinished: false,
            professorId: userId
          }
        }
      ]
    }
  )

  const handleAddGame = () => emit('url', '/createGame')

  return pug`
    Div.root
      Div.actions
        Button.btn(
          color="success"
          onPress=handleAddGame
        ) Add Game
      Div.gamesList
        GamesList( gamesList=games )
  `
})
