import React from 'react'
import { Text } from 'react-native'
import _get from 'lodash/get'
import { observer, useDoc, useQuery, useQueryDoc } from 'startupjs'
import { Content, Div, H5, H6, Button, Row, Span, Icon } from '@startupjs/ui'
import {
  faHandRock,
  faHandScissors,
  faHandPaper,
  faFlag,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

import './index.styl'

const options = [
  {
    action: 'rock',
    icon: faHandRock
  },
  {
    action: 'paper',
    icon: faHandPaper
  },
  {
    action: 'scissors',
    icon: faHandScissors
  },
]

const resultIcons = {
  rock: faHandRock,
  paper: faHandPaper,
  scissors: faHandScissors,
  surrender: faFlag
}

const Player = observer(({ userId, game, round }) => {
  const [currentRound, $currentRound] = useQueryDoc('rounds', {
    gameId: game.id,
    round: round,
  })
  console.log('currentRound', currentRound)
  const [allRounds, $allRounds] = useQuery('rounds', {
    gameId: game.id,
    $sort: { round: -1 },
    $limit: 2
  })

  const opponentId = game.players.find(key => key !== userId)

  const [opponent] = useDoc('users', opponentId)

  const finishRound = async () => {
    const playersData = currentRound.players
    if (playersData[userId] && playersData[userId].response && playersData[opponentId] && playersData[opponentId].response) {
      await $currentRound.finishRound(currentRound, userId, opponentId, allRounds, round)
    }
  }

  const handleOption = async (option) => {
    const playersData = currentRound.players

    //check if player already chose option before
    if (playersData[userId] && playersData[userId].response) {
      console.log('player already chose option before')
      return
    }

    await $currentRound.chooseOption(playersData, userId, option)

    finishRound()
  }

  const handleSurrender = () => {
    handleOption('surrender')
  }

  const renderPlayers = (curUserId, isUser) => {
    const response = _get(currentRound, `players.${curUserId}.response`)

    const icon = (currentRound.winnerId) || (isUser && response) ? resultIcons[response] : faQuestionCircle

    return pug`
      Icon.currentResponse(
        icon=icon
      )
    `
  }

  if (game.isFinished) {
    return pug`
      H5.title Game is finished!
    `
  }

  return pug`
    Div.root
      H5.title Round #{currentRound.round}
      if currentRound && currentRound.winnerId
        H6.winnerHeader Round finished! 
        Span.winner #{currentRound.winnerId === 'draw' ? 'DRAW' : currentRound.winnerId===userId ? 'You win!' : 'You lost!'}
      if opponentId
        Div.responses
          Div.playerResponse
            Span You
            =renderPlayers(userId, true)
          if round.winnerId
            Span #{currentRound.winnerId === user.id ? 'YOU WIN' : currentRound.winnerId==='draw' ? 'DRAW' : 'YOU LOSE' }
          Div.playerResponse
            Span #{opponent.name}
            =renderPlayers(opponentId, false)
      if !currentRound.players[userId]
        H5.title Make a move!
      Row.options
        for option, index in options
          Button.option(
            key=option.action
            shape="circle"
            icon=option.icon
            size="xxl"
            color="success"
            onPress=() => handleOption(option.action)
          )
      Button.btn(
        color="error"
        icon=faFlag
        onPress=handleSurrender
      ) Surrender
  `
})

export default Player