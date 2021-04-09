export const calculateRoundWinner = (rounds, userId, opponentId) => {
  console.log('calculateRoundWinner', rounds)
  const userAction = rounds.players[userId].response
  const opponentAction = rounds.players[opponentId].response
  let draw, userWinner = false

  if (userAction === opponentAction) {
    draw = true
  } else if (
    (userAction === 'rock' && opponentAction === 'scissors') ||
    (userAction === 'scissors' && opponentAction === 'paper') ||
    (userAction === 'paper' && opponentAction === 'rock')
  ) {
    userWinner = true
  }

  return [draw, userWinner]
}