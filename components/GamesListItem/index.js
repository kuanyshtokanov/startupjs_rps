import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import moment from 'moment'
import { observer, useSession, useDoc, useQuery, emit } from 'startupjs'
import { Div, Card, Span, Collapse, Button } from '@startupjs/ui'
import { GamesListItem } from 'components/GamesListItem'
import './index.styl'

export default observer(({
  user,
  game,
  index
}) => {
  console.log('gameslistitem', game)
  const [isOpen, setIsOpen] = useState(false)
  const [professor, $professor] = useDoc('users', game.professorId)
  const [curGame, $curGame] = useDoc('games', game._id)

  const [player1, player2] = game.players
  const player1Id = player1._id ? player1._id : player1
  const player2Id = player2._id ? player2._id : player2

  const [firstPlayer, $firstPlayer] = useDoc('users', player1Id)
  const [secondPlayer, $secondPlayer] = useDoc('users', player2Id)

  const handleAddGame = () => emit('url', '/createGame')

  const handleJoinGame = async () => {
    if (game.players.length < 2 && !game.players.includes(user.id) && !user.isProfessor) {
      $curGame.set('players', [...curGame.players, user.id])
    }
    emit('url', '/game/' + game._id)
  }

  const getPlayerScore = (playerId) => {
    return game.playersStatistics[playerId] ? ', score: ' + game.playersStatistics[playerId] : ''
  }

  return pug`
    Card.root(
      styleName={first: index===0}
    )
      Collapse.collapse(
        key=index
        open=isOpen
        onChange=() => setIsOpen(!isOpen)
        variant='pure'
      )
        Collapse.Header(iconPosition='left')
          Span.item__value= game.name
        Collapse.Content
          Div.info
            Div.item
              Span.item__label Created: 
              Span.item__value= moment(game._m.ctime).format('MMMM Do YYYY, h:mm:ss a')
            Div.item
              Span.item__label Players: 
              Span.item__value= firstPlayer.name + getPlayerScore(player1Id)
              Span.item__value= secondPlayer.name + getPlayerScore(player2Id)
            Div.item
              Span.item__label Professor: 
              Span.item__value= professor.name
          Div.joinButton
            Button(
              onPress=handleJoinGame
              color="success"
            ) 
              if (user.isProfessor || game.isFinished)
                Text Open
              else if game.players.includes(user.id)
                Text Continue
              else
                Text Join
  `
})
