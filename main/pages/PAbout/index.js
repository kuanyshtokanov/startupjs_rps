import React from 'react'
import { Text, ScrollView } from 'react-native'
import { observer, emit } from 'startupjs'
import { Content, Button, H5 } from '@startupjs/ui'

import Leaderboard from 'components/Leaderboard'
import './index.styl'

export default observer(function PAbout() {
  return pug`
    ScrollView.root
      Content.content
        Button.btn(
          color="success"
          onPress=() => emit('url', '/games')
        ) Play!
        H5.text Leaderboard
        Leaderboard
  `
})
