import React, { useEffect } from 'react'
import { observer, emit, useValue, useSession, useLocal, useDoc } from 'startupjs'
import { Button, Div, H1, Layout, Menu, Row, SmartSidebar, Avatar } from '@startupjs/ui'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import APP from '../../app.json'
import './index.styl'

const { displayName } = APP

const APP_NAME = displayName.charAt(0).toUpperCase() + displayName.slice(1)

const MenuItem = observer(({ url, children }) => {
  const [currentUrl] = useLocal('$render.url')
  return pug`
    Menu.Item(
      active=currentUrl === url
      onPress=() => emit('url', url)
    )= children
  `
})

export default observer(function ({ children }) {
  const [open, $open] = useValue(false)
  const [userId] = useSession('userId')
  const [user] = useDoc('users', userId)
  console.log(user)

  useEffect(() => {
    if (!user) {
      emit('url', '/login')
    }
  }, [])

  function renderSidebar() {
    return pug`
      Menu.sidebar-menu
        MenuItem(url='/') Games
        MenuItem(url='/leader-board') Leader board
        MenuItem(url='/past-games') Past games
    `
  }

  return pug`
    Layout
      SmartSidebar.sidebar(
        $open=$open
        renderContent=renderSidebar
      )
        Row.menu
          Button(color='secondaryText' icon=faBars onPress=() => $open.set(!open))
          H1.logo= APP_NAME
          Row.user
            if user
              Avatar(size='s')=user.name

        Div.body= children
  `
})
