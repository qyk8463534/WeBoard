import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { getKanban, moveCard, refreshAuthToken } from '../api'


import Column from './column'

const Container = styled.div`
  display:flex;
`

/*
{
  cards: {
    '1': { id: '1', cardName: 'Take out the garbage' },
    '2': { id: '2', cardName: 'Watch my favorite show' },
    '3': { id: '3', cardName: 'Charge my phone' },
    '4': { id: '4', cardName: 'Cook dinner' }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Applied',
      cardIds: ['1', '2', '3', '4']
    },
    'column-2': {
      id: 'column-2',
      title: 'Phone Screen',
      cardIds: []
    },
    'column-3': {
      id: 'column-3',
      title: 'On Site',
      cardIds: []
    },
    'column-4': {
      id: 'column-4',
      title: 'Offered',
      cardIds: []
    },
    'column-5': {
      id: 'column-5',
      title: 'Accepted',
      cardIds: []
    },
    'column-6': {
      id: 'column-6',
      title: 'Rejected',
      cardIds: []
    }
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3','column-4','column-5','column-6']
}
*/
const Board = (props) => {
  const [board, setBoard] = useState({
    cards: {
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'Applied',
        cardIds: []
      },
      'column-2': {
        id: 'column-2',
        title: 'Phone Screen',
        cardIds: []
      },
      'column-3': {
        id: 'column-3',
        title: 'On Site',
        cardIds: []
      },
      'column-4': {
        id: 'column-4',
        title: 'Offered',
        cardIds: []
      },
      'column-5': {
        id: 'column-5',
        title: 'Accepted',
        cardIds: []
      },
      'column-6': {
        id: 'column-6',
        title: 'Rejected',
        cardIds: []
      }
    },
    columnOrder: ['column-1', 'column-2', 'column-3','column-4','column-5','column-6']
  })

  useEffect(() => {
    getKanban("5f9cd17a2397413e105f32a7")
    .then((kanban) => {
      // extract cards
      const cardsTMP = kanban.lists.map((list) => {
        const cardsID = list.cards.map((card) => {
          const boardCard = {
            id: card._id, 
            cardName: card.cardName,
            highestaAcademicLevel: card.highestaAcademicLevel,
            phoneNumber: card.phoneNumber,
            emailAddress:card.emailAddress,
            comments:card.comments,
            isEditting:Boolean(false)
          }
          return boardCard
        })
        return cardsID
      })

      const cards = [].concat.apply([], cardsTMP);
      const cardsObjects = {}
      for (const card of cards) {
        cardsObjects[card.id] = card
      }

      const columns = kanban.lists.map((list) => {
        const columnObject = {
          id: list._id,
          title: list.listName,
          cardIds: list.cards.map((card) => {
            return card._id
          })
        }
        return columnObject
      })

      const columnObjects = {}
      for (const column of columns) {
        columnObjects[column.id] = column
      }

      const columnOrder = columns.map((column) => {
        return column.id
      })


      console.log(cardsObjects)
      console.log(columnObjects)
      console.log(columnOrder)

      const newBoard = {
        cards: cardsObjects,
        columns: columnObjects,
        columnOrder: columnOrder
      }

      console.log(newBoard)
      setBoard(newBoard)
    })
    .catch((error) => {
      console.log(error)
      window.location.reload(false);
    })
  }, []);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    console.log(source, destination)

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    moveCard(
      "5f9cd17a2397413e105f32a7", 
      source.droppableId, 
      source.index,
      destination.droppableId,
      destination.index
    )
    .then((value) => {
      console.log(value)//upload
    })
    .catch((error) => {console.log(error);
      window.location.reload(false);})

    const start = board.columns[source.droppableId]
    const finish = board.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.cardIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        cardIds: newTaskIds
      }

      const newState = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn
        }
      }

      setBoard(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.cardIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      cardIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.cardIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      cardIds: finishTaskIds
    }

    const newState = {
      ...board,
      columns: {
        ...board.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    setBoard(newState)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {board.columnOrder.map(columnId => {
          const column = board.columns[columnId]
          //console.log(board.cards,"cards in board");
          const cards = column.cardIds.map(
            cardId => board.cards[cardId]
          )
          return (
            <Column key={column.id} kanbanID={"5f9cd17a2397413e105f32a7"} column={column} cards={cards} />
          )
        })}
      </Container>
    </DragDropContext>
  )
}

export default Board