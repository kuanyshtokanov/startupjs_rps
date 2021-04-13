import React from 'react'
import { observer, useSession, useQuery } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import moment from 'moment'

import GamesListItem from 'components/GamesListItem'
import './index.styl'

const PPastGames = () => {
  const [user] = useSession('user')
  const [games] = useQuery('games', {
    $aggregate: [
      { $match: { [user.isProfessor ? 'professorId' : 'players']: user.id, isFinished: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'professorId',
          foreignField: '_id',
          as: 'professorName'
        }
      },
      {
        $set: { professorName: { $arrayElemAt: ['$professorName.name', 0] } }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'players',
          foreignField: '_id',
          as: 'players'
        }
      }
    ]
  })

  console.log('past', games)

  return pug`
    Div.root
      for game, index in games
        GamesListItem(
          key=index
          user=user
          game=game
          index=index
        )
          
  `
}

export default observer(PPastGames)