import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useSession, useQuery, useDoc, model, emit } from 'startupjs'
import { Content, Input, Button, Div } from '@startupjs/ui'
import GamesList from 'components/GamesList'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [userId] = useSession('userId')
  console.log('Professor user', userId)
  const [games, $games] = useQuery('games', {
    professorId: userId, isFinished: false
  })

  const handleAddGame = () => emit('url', '/createGame')

  console.log('Professor games', games)
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
