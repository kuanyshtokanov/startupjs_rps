import React from 'react'
import { observer, useSession, model, emit, useDoc } from 'startupjs'
import { Input, Button, Div } from '@startupjs/ui'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [gameName, setGameName] = React.useState('')

  const handleCreateGame = async () => {
    const gameId = model.id()

    await model.add('games', {
      id: gameId,
      name: gameName,
      isFinished: false,
      professorId: user.id,
      players: [],
      playersStatistics: {},
      createdAt: new Date(),
    })

    await model.add('rounds', {
      id: model.id(),
      gameId,
      round: 1,
      winnerId: null,
      players: {}
    })

    emit('url', '/')
  }

  console.log(user)
  return pug`
    Div.root
      Div.createGame
        Input.gameInput(
          name="name"
          placeholder="Input game name"
          value=gameName
          onChange=e=>setGameName(e.target.value)
        )
        Button.createButton(disabled=!gameName onClick=handleCreateGame) Create game
  `
})
