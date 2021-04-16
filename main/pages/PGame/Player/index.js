import React from 'react'
import { Text } from 'react-native'
import _cloneDeep from 'lodash/cloneDeep'
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
import { calculateRoundWinner, calculatePoints, getUser } from '../helper'

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
  // const currentRound = curRounds[0]

  const opponentId = game.players.find(key => key !== userId)

  const [opponent] = useDoc('users', opponentId)

  const finishRound = async () => {
    const playersData = currentRound.players
    if (playersData[userId] && playersData[userId].response && playersData[opponentId] && playersData[opponentId].response) {
      const [draw, userWinner] = calculateRoundWinner(currentRound, userId, opponentId)
      const winnerId = draw ? 'draw' : userWinner ? userId : opponentId
      //calculate points
      const players = calculatePoints(allRounds, round, winnerId)
      await $currentRound.setEach({
        winnerId,
        players,
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
    await $currentRound.setEach({
      players: { ...playersDataTemp }
    })

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
      Text Player game
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