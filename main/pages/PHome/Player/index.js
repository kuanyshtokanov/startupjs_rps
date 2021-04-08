import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useSession, useQuery, useDoc, model, emit } from 'startupjs'
import { Content, Input, Button, Div } from '@startupjs/ui'
import GamesList from 'components/GamesList'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [userId] = useSession('userId')
  const [games, $games] = useQuery('games',
    {
      $aggregate: [
        {
          $match: {
            isFinished: false,
            $or: [
              { players: userId },
              { $expr: { $lt: [{ $size: '$players' }, 2] } }
            ]
          }
        }
      ]
    }
  )

  const handleAddGame = () => emit('url', '/createGame')

  console.log('Player user', userId)
  console.log('Players games', games)
  return pug`
    Div.root
      Div.gamesList
        GamesList( gamesList=games )
  `
})
