import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useSession, useDoc, model, emit } from 'startupjs'
import { Div } from '@startupjs/ui'
import GamesListItem from 'components/GamesListItem'
import './index.styl'

export default observer(({ gamesList }) => {
  const [user] = useSession('user')

  const handleAddGame = () => emit('url', '/createGame')

  return pug`
    Div.root
      for game, index in gamesList
        GamesListItem(
          key=index
          user=user
          game=game
          index=index
        )
  `
})
