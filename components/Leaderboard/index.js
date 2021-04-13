import React from 'react'
import { observer, useQuery } from 'startupjs'
import { Div, Card, Span, H4 } from '@startupjs/ui'

import './index.styl'

const Leaderboard = observer(() => {
  const [players = []] = useQuery('games', {
    $aggregate: [
      { $match: { isFinished: true } },
      { $set: { statistics: { $objectToArray: '$playersStatistics' } } },
      { $unwind: '$statistics' },
      {
        $group: {
          _id: '$statistics.k',
          totalScore: { $sum: '$statistics.v' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'player'
        }
      },
      {
        $set: { name: { $arrayElemAt: ['$player.name', 0] } }
      },
      { $unset: 'player' },
      { $sort: { totalScore: -1 } }
    ]
  })

  if (!players || !players.length) {
    return pug`
      H4.title There are no players.
    `
  }

  return pug`
    Div.root
      for player, index in players
        Card.info(
          styleName=[index === 0 && 'first']
          key=player._id
        )
          Span.position #{index + 1}. 
          Span.name= player.name
          Span.score #{player.totalScore} points
  `
})

export default Leaderboard