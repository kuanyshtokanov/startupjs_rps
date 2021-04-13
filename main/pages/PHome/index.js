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

  return pug`
    if user.isProfessor
      Professor
    else
      Player
  `
})
