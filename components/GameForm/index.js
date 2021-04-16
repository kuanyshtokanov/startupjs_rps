import React from 'react'
import { observer, useSession, model, emit, useDoc, useQuery } from 'startupjs'
import { Input, Button, Div, TextInput } from '@startupjs/ui'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [gameName, setGameName] = React.useState('')

  const $gameData = model.scope('games')
  const $roundsData = model.scope('rounds')

  const handleCreateGame = async () => {
    const gameId = model.id()

    await $gameData.add({
      id: gameId,
      name: gameName,
      isFinished: false,
      professorId: user.id,
      players: [],
      playersStatistics: {},
      createdAt: new Date(),
    })

    await $roundsData.add({
      id: model.id(),
      gameId,
      round: 1,
      winnerId: null,
      players: {}
    })

    emit('url', '/games')
  }

  const handleInputChange = val => {
    console.log('val', val)
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
