import React from 'react'
import { ScrollView, Text } from 'react-native'
import _cloneDeep from 'lodash/cloneDeep'
import { observer, useDoc, useSession, useQuery, model } from 'startupjs'
import { Content, Div, H5, Button, Row } from '@startupjs/ui'
import { faHandRock, faHandScissors, faHandPaper, faFlag } from '@fortawesome/free-solid-svg-icons'

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

const Player = observer(({ userId, game, rounds }) => {
  const currentRound = rounds[0]
  const opponentId = game.players.find(key => key !== userId)
  console.log('userId', userId)
  console.log('opponentId', opponentId)

  console.log('opponentId', opponentId)

  const handleFinish = () => {
    console.log('finish game')
  }

  const handleNext = () => {
    console.log('next round')
  }

  const handleOption = async (option) => {
    const playerData = currentRound.players[userId]
    //check if player already chose option before
    if (playerData && playerData.response) {
      console.log('asd')
      return
    }

    // const currentRoundTemp = _cloneDeep(currentRound)
    // currentRoundTemp.players[userId] = { response: option }

    await model.setEach(`rounds.${currentRound.id}.players.${userId}`, { response: option })
  }

  const handleSurrender = () => {
    console.log('handleSurrender')
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