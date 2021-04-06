import React from 'react'
import { ScrollView } from 'react-native'
import { Content } from '@startupjs/ui'

import Login from 'components/Login'

const PLogin = () => {
  return pug`
    ScrollView.root
      Content
        Login
  `
}

export default PLogin