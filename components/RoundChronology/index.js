import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import moment from 'moment'
import { observer, useSession, useDoc, useQuery, emit } from 'startupjs'
import { Div, Card, Span, Collapse, Button, Icon, H6 } from '@startupjs/ui'
import RoundChronologyItem from 'components/RoundChronologyItem'
import {
  faHandRock,
  faHandScissors,
  faHandPaper,
  faFlag,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

import './index.styl'

const resultIcons = {
  rock: faHandRock,
  paper: faHandPaper,
  scissors: faHandScissors,
  surrender: faFlag
}

export default observer(({ game, user }) => {
  const [isOpen, setIsOpen] = useState(false)

  const [rounds, $rounds] = useQuery('rounds', {
    gameId: game.id,
    $sort: { round: -1 },
  })

  const [firstPlayerId, secondPlayerId] = game.players

  return pug`
    Card.root
      Collapse.collapse(
        open=isOpen
        onChange=() => setIsOpen(!isOpen)
        variant='pure'
      )
        Collapse.Header(iconPosition='left')
          Span.item__value= 'Game chronology'
        Collapse.Content
          RoundChronologyItem(
            firstPlayerId=firstPlayerId
            secondPlayerId=secondPlayerId
            rounds=rounds
          )
              
  `
})
