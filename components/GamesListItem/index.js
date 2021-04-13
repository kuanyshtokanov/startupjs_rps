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
  const [isOpen, setIsOpen] = useState(false)
  const [professor, $professor] = useDoc('users', game.professorId)
  const [curGame, $curGame] = useDoc('games', game._id)
  const [rounds, $rounds] = useQuery('rounds', { gameId: game._id })

  const handleAddGame = () => emit('url', '/createGame')

  const handleJoinGame = async () => {
    if (game.players.length < 2 && !game.players.includes(user.id) && !user.isProfessor) {
      $curGame.set('players', [...curGame.players, user.id])
    }
    emit('url', '/game/' + game._id)
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
              Span.item__value= game.players.length
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
