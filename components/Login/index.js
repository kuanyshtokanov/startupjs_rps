import React from 'react'
import { model, observer, useValue, useSession, emit } from 'startupjs'
import { Content, H4, Input, Checkbox, Button } from '@startupjs/ui'

import './index.styl'

const Login = observer(() => {
  const [userId] = useSession('userId')
  const [name, $name] = useValue()
  const [checked, $checked] = useValue(false)

  const handleLogin = async () => {
    if (name) {
      model.add('users', { id: userId, name, isProfessor: checked })
      emit('url', '/')
    }
  }

  const handleCheck = () => {
    $checked.set(!checked)
  }

  return pug`
    Content
      H4 Login as
      Input.name(
        type='text'
        placeholder='Enter name'
        $value=$name
      )
      Checkbox.checkbox(
        label='Professor'
        value=checked
        onChange=handleCheck
      )
      Button.login(
        onPress=handleLogin
      ) Login
  `
})

export default Login