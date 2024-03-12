import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI } from '~/apis'
import { mockData } from '~/apis/mock-data'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
  //Su dung react-router-dom de lay chuan boardId tu url ve
    const boardId = '65ec85f33a80fc35aae678d0'
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  //call api
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={mockData.board}/>
      <BoardContent board={mockData.board}/>
    </Container>
  )
}

export default Board
