import { useState, useEffect, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import ListCoLumns from './ListColumns/ListCoLumns'
import CoLumn from './ListColumns/Column/CoLumn'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceholderCard } from '~/utils/formatters'

import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  closestCorners,
  getFirstCollision
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent(props) {
  const { board } = props
  // Sử dụng mou và touch sensor để người dùng có trải nhiệm tốt nhất trên moblie và PC
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  //Cùng môt thời điểm chỉ có 1 item được kéo là column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setAtiveDragItemType] = useState(null)
  const [activeDragItemData, setAtiveDragItemData] = useState(null)
  const [oldColumn, setOldColumn] = useState(null)

  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    //
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  //Cap nhat state move card giua 2 column
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      //Tim vi tri index cua overCard trong overColumn la column dich (Noi card duoc tha)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      // console.log('isBelowOverItem', isBelowOverItem)
      // console.log('modifier', modifier)
      // console.log('newCardIndex', newCardIndex)
      //clone orderedCoumlumn cu ra de su ly data
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        //Xoa phan tu cac dang dragging ra khoi column cu
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        //Them placeholder card neu column rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards.push(generatePlaceholderCard(nextActiveColumn))
        }
        // cap nhat lai mang cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        //Kiem tra xem card dang keo co ton tai o over column hay chua, neu dang co thi xoa no
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //Them cac dang keo vao column moi theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        //Xoa placeholder card
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        //Cap nhat lai trang thai cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  const handleDragStart = (e) => {
    // console.log('handleDragStart', e)
    //Lấy ra id của phần tử drag
    setActiveDragItemId(e?.active?.id)
    setAtiveDragItemType(e?.active?.data?.current?.columnId ?
      ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setAtiveDragItemData(e?.active?.data?.current)
    if (e?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(e?.active?.id))
    }
  }

  const handleDragOver = (e) => {
    // console.log('handleDragOver', e)
    //Neu keo tha column thi khong lam gi ca
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //Keo tha card qua lai giua cac column
    const { active, over } = e
    if (!active || !over) return
    // activeDragginCard la card dang duoc keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId la la card dang tuong tac voi cac duoc keo o tren
    const { id: overCardId } = over
    //Lay column theo card id
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    //check active over column
    if (!activeColumn || !overColumn) return
    //Chi thuc thi khi 2 column khac nhau
    if (activeColumn._id !== overColumn._id) {
      //prevColums la danh sach id columns truoc khi cap nhat state
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event
    //Nếu over null return luôn, kéo linh tinh ra ngoài
    if (!active || !over) return

    //SU ly keo tha cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDragginCard la card dang duoc keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId la la card dang tuong tac voi cac duoc keo o tren
      const { id: overCardId } = over
      //Lay column theo card id
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      //check active over column
      if (!activeColumn || !overColumn) return
      //KEo card sang column khac
      if (oldColumn._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        //Keo tha card trong 1 column
        // lẤY VỊ TRÍ CŨ TỪ ACTIVE
        const oldCardIndex = oldColumn?.cards?.findIndex(c => c._id === activeDragItemId)
        // LẤY VỊ TRÍ MỚI TỪ OVER
        const newCardIndex = overColumn.cards.findIndex(c => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumn?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns( prevColumn => {
          const nextColumns = cloneDeep(prevColumn)

          //Tim column ma chung ta dang tha
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          //update card va set ordered column
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map( c => c._id)
          return nextColumns
        })
      }
    }

    //Su ly keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lẤY VỊ TRÍ CŨ TỪ ACTIVE
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // LẤY VỊ TRÍ MỚI TỪ OVER
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
        setOrderedColumns(dndOrderedColumns)
      }
    }
    setActiveDragItemId(null)
    setAtiveDragItemType(null)
    setAtiveDragItemData(null)
    setOldColumn(null)
  }
  //Nếu vị trí kéo thả khác với vị trí ban đầu

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    const pointerInterSection = pointerWithin(args)
    if (!pointerInterSection?.length) return
    // const intersections = pointerInterSection?.length > 0 ? pointerInterSection : rectIntersection(args)

    let overId = getFirstCollision(pointerInterSection, 'id')
    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListCoLumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <CoLumn column={activeDragItemData}/>)}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData}/>)}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
