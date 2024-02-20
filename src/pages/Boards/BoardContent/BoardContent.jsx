import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ListCoLumns from './ListColumns/ListCoLumns'

import { mapOrder } from '~/utils/sorts'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent(props) {
  // Sử dụng mou và touch sensor để người dùng có trải nhiệm tốt nhất trên moblie và PC
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const { board } = props
  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event
    //Nếu over null return luôn, kéo linh tinh ra ngoài
    if (!over) return
    //Nếu vị trí kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // lẤY VỊ TRÍ CŨ TỪ ACTIVE
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // LẤY VỊ TRÍ MỚI TỪ OVER
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListCoLumns columns={orderedColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
