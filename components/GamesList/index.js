import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useSession, useDoc, model, emit } from 'startupjs'
import { Div, H6 } from '@startupjs/ui'
import GamesListItem from 'components/GamesListItem'
import './index.styl'

export default observer(({ gamesList }) => {
  const [user] = useSession('user')

  return pug`
    Div.root
      if gamesList.length < 1
        H6.text There are no games to join
      for game, index in gamesList
        GamesListItem(
          key=index
          user=user
          game=game
          index=index
        )
  `
})
