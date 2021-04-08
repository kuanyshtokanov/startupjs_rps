import React from 'react'
import { ScrollView, Text } from 'react-native'
import { observer, useSession, useQuery } from 'startupjs'
import { Content } from '@startupjs/ui'
import { TestComponent } from 'components'
import Professor from './Professor'
import Player from './Player'
import './index.styl'

export default observer(function PHome() {
  const [user] = useSession('user')
  const [games, $games] = useQuery('games', {})
  const [rounds, $rounds] = useQuery('rounds', {})

  console.log('PHome games - ', games)
  console.log('PHome rounds - ', rounds)
  console.log('PHome user - ', user)

  return pug`
    if user.isProfessor
      Professor
    else
      Player
  `
})
