import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import moment from 'moment'
import { observer, useSession, useDoc, useQuery, emit } from 'startupjs'
import { Div, Card, Span, Collapse, Button, Icon, H6 } from '@startupjs/ui'
import { GamesListItem } from 'components/GamesListItem'
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
  console.log('game rounds', rounds)

  const [firstPlayerId, secondPlayerId] = game.players

  const [player1] = useDoc('users', firstPlayerId)
  const [player2] = useDoc('users', secondPlayerId)

  const renderResponse = (round, playerId) => {
    const response = rounds[rounds.length - round].players[playerId] ? rounds[rounds.length - round].players[playerId].response : null
    const icon = response ? resultIcons[response] : faQuestionCircle

    return pug`
      Icon.currentResponse(
        icon=icon
      )
    `
  }

  const getPlayerScore = (round, playerId) => {
    return rounds[rounds.length - round].players[playerId] ? rounds[rounds.length - round].players[playerId] : { score: 0 }
  }

  const getPlayerTotalScore = (playerId) => {
    return rounds.length === 1 ? 0 : rounds[0].players[playerId] ? rounds[0].players[playerId].totalScore : rounds[1].players[playerId].totalScore
  }

  const RenderScore = (props) => {
    const player1Score = props.isTotal ? 'Total score: ' + getPlayerTotalScore(player1.id) : 'Score: ' + getPlayerScore(props.round, player1.id).score
    const player2Score = props.isTotal ? 'Total score: ' + getPlayerTotalScore(player2.id) : 'Score: ' + getPlayerScore(props.round, player2.id).score
    return pug`
    Div.players
      Div.playerResponse
        H6.name #{player1.name}
        if !props.isTotal
          Div.response
            Span=renderResponse(props.round,player1.id)
        Span.score=player1Score
      Div.playerResponse
        H6.name #{player2.name}
        if !props.isTotal
          Div.response
            Span=renderResponse(props.round,player2.id)
        Span.score=player2Score
    `
  }

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
          Div.totalScore
            RenderScore(isTotal=true)
          for round, index in rounds
            Div.info(key=index)
              Div.round
                H6='Round # ' + round.round
              Div.responses
                RenderScore(isTotal=false, round=round.round)
              
  `
})
