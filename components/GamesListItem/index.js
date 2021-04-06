import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import moment from 'moment'
import { observer, useSession, useDoc, model, emit } from 'startupjs'
import { Div, Card, Span, Collapse, Button } from '@startupjs/ui'
import { GamesListItem } from 'components/GamesListItem'
import './index.styl'

export default observer(({
  user,
  game: { name, isFinished, professorId, players = [], createdAt },
  index
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [professor, $professor] = useDoc('users', professorId)

  const handleAddGame = () => emit('url', '/createGame')
  const handleJoinGame = () => {
    console.log('join game', name)
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
          Span.item__value= name
        Collapse.Content
          Div.info
            Div.item
              Span.item__label Created: 
              Span.item__value= moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')
            Div.item
              Span.item__label Players: 
              Span.item__value= players.length
            Div.item
              Span.item__label Professor: 
              Span.item__value= professor.name
          Div.joinButton
            Button(
              onPress=handleJoinGame
              color="success"
            ) Join
  `
})
