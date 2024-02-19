import Box from '@mui/material/Box'
import ListCoLumns from './ListColumns/ListCoLumns'
import { mapOrder } from '~/utils/sorts'

function BoardContent(props) {
  const { board } = props
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => (theme.trello.boardContentHeight),
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      p: '10px 0'
    }}>
      <ListCoLumns columns={orderedColumns}/>
    </Box>
  )
}

export default BoardContent
