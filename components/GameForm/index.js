import React from 'react'
import { observer, useSession, emit, useDoc } from 'startupjs'
import { Input, Button, Div, TextInput } from '@startupjs/ui'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [gameName, setGameName] = React.useState('')

  const [, $games] = useDoc('games')
  const [, $rounds] = useDoc('rounds')

  const handleCreateGame = async () => {
    const gameId = await $games.addSelf({
      name: gameName,
      isFinished: false,
      professorId: user.id,
      players: [],
      playersStatistics: {},
    })

    emit('url', '/games')
  }

  return pug`
    Div.root
      Div.createGame
        TextInput.gameInput(
          name="name"
          placeholder="Input game name"
          value=gameName
          onChangeText=setGameName
        )
        Button.createButton(disabled=!gameName onClick=handleCreateGame) Create game
  `
})
