import React, { useState } from 'react'
import styled from 'styled-components'
import Card from './card'
import { Droppable } from 'react-beautiful-dnd'

import { createCard } from "../api"

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'skyblue' : 'white'}
  flex-grow: 1;
  min-height: 100px;
`

const Column = (props) => {
  //console.log(props.cards,"Cards in Column");
  const clicked = () => {
    console.log(props.kanbanID)
    createCard(
      props.kanbanID, 
      props.column.id, 
      {
        cardName: " ", 
        highestaAcademicLevel: " ",
        phoneNumber: " ", 
        emailAddress: " ",
        comments:" "
      }
    )
    .then((res) => {
      console.log("CREATE CARD SUCCESS")
      console.log(res)
      window.location.reload(false);
    })
    .catch((error) => {
      console.log(error)
      window.location.reload(false);
    })
  }

  return (
    <Container>
      <Title>{props.column.title}</Title>
      <button onClick={clicked}>add</button>
      <Droppable droppableId={props.column.id} type="TASK">
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {props.cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} board = {props.kanbanID} list = {props.column.id} cardID = {card.id}/>
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  )
}

export default Column