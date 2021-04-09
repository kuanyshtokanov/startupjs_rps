import React from 'react'
import { ScrollView, Text } from 'react-native'
import _cloneDeep from 'lodash/cloneDeep'
import _get from 'lodash/get'
import { observer, useDoc, useSession, useQuery, model } from 'startupjs'
import { Content, Div, H5, Button, Row, Span, Icon } from '@startupjs/ui'
import {
  faHandRock,
  faHandScissors,
  faHandPaper,
  faFlag,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

import './index.styl'
import { calculateRoundWinner } from '../helper'

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
  const [rounds, $rounds] = useQuery('rounds', {
    gameId: game.id,
    round: round,
    $limit: 1
  })
  const currentRound = rounds[0]
  console.log('player current round', currentRound)
  const opponentId = game.players.find(key => key !== userId)
  console.log('opponentId', opponentId)
  const [opponent] = useDoc('users', opponentId)

  const finishRound = async () => {
    const playersData = currentRound.players
    if (playersData[userId] && playersData[userId].response && playersData[opponentId] && playersData[opponentId].response) {
      const [draw, userWinner] = calculateRoundWinner(currentRound, userId, opponentId)

      await $rounds.at(currentRound.id).setEach({
        winnerId: draw ? 'draw' : userWinner ? userId : opponentId
      })
    }
  }

  const handleOption = async (option) => {
    const playersData = currentRound.players

    let playersDataTemp = _cloneDeep(playersData)

    //check if player already chose option before
    if (playersData[userId] && playersData[userId].response) {
      console.log('player already chose option before')
      return
    }
    // 87272585466
    playersDataTemp[userId] = {
      response: option,
      score: 0,
      totalScore: 0,
    }
    await $rounds.at(currentRound.id).setEach({
      players: { ...playersDataTemp }
    })

    finishRound()
  }

  const handleSurrender = () => {
    handleOption('surrender')
  }

  const renderPlayers = (curUserId) => {
    const response = _get(currentRound, `players.${curUserId}.response`)

    const icon = response ? resultIcons[response] : faQuestionCircle

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
      Text Player game
      H5.title Round #{currentRound.round}
      if opponentId
        Div.responses
          Div.playerField
            Span You
            =renderPlayers(userId)
          if round.winnerId
            Span #{currentRound.winnerId === user.id ? 'YOU WIN' : currentRound.winnerId==='draw' ? 'DRAW' : 'YOU LOSE' }
          Div.playerField.right
            Span #{opponent.name}
            =renderPlayers(opponentId)
      if !currentRound.players[userId].response
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