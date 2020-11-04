import React, { useState, useRef} from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import {updateCard} from '../api/index'
const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDragDisabled
      ? 'lightgrey'
      : props.isDragging
        ? 'lightgreen'
        : 'white'};
`
const List = styled.div`
  display: flex;
  flex-direction: column
`

const information = {
  info1:'cardName',
  info2:'highestaAcademicLevel',
  info3:'phoneNumber',
  info4:'emailAddress',
  info5:'comments'
}
const Card = (props) => {
  //console.log(props.card,"Card");
  const [card,setCard] = useState(props);
  const [name, setName] =useState(props.card.cardName);
  const [education, setEdu] =useState(props.card.highestaAcademicLevel);
  const [phone, setPhone] =useState(props.card.phoneNumber);
  const [email,setEmail] =useState(props.card.emailAddress);
  const [comments,setComments] = useState(props.card.comments);
  const onChangeName = (event) => {
    setName(event.target.value)
  }
  const onChangeEducation = (event) => {
    setEdu(event.target.value)
  }
  const onChangePhone = (event) => {
    setPhone(event.target.value)
  }
  const onChangeEmail = (event) => {
    setEmail(event.target.value)
  }
  const onChangeComments = (event) => {
    setComments(event.target.value)
  }
  const onEdit = () => {
    console.log(props);
    if (!card.isEditting){
      //console.log(card);
      setCard({
        id: props._id, 
        cardName: props.cardName,
        highestaAcademicLevel: props.highestaAcademicLevel,
        phoneNumber: props.phoneNumber,
        isEditting:Boolean(true)
      })
      //console.log(card);
    }
  };

  const onUpdate = () => {
    setCard({
      ...card,
      isEditting: false
    })
    //console.log(name,education,phone,email,"send data")
    updateCard(props.board,props.list,props.cardID,
      {
        name:name, 
        education:education,
        phone:phone, 
        email:email,
        comments:comments
    }
    )


  }
  return (
    <Draggable
      draggableId={props.card.id}
      index={props.index}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {
            !card.isEditting ? 
            <List>
              <div>
                name: 
                {name}
              </div>
              <div>
                education:
                {education}</div>
              <div>
                phone: 
                {phone}</div>
              <div>
                email: 
                {email}</div>
              <div>
                comments: 
                {comments}</div>
              <button onClick={onEdit}>edit</button>
            </List> :  
            <List>
              <div>
                name: 
                <input value={name} onChange={onChangeName}></input>
              </div>
              <div>
                education:
                <input value={education} onChange={onChangeEducation}></input></div>
              <div>
                phone: 
                <input value={phone} onChange={onChangePhone}></input></div>
              <div>
                email: 
                <input value={email} onChange={onChangeEmail}></input></div>
              <div>
                comments: 
                <input value={comments} onChange={onChangeComments}></input></div>
              <button onClick={onUpdate}>update</button>
            </List>
          }
        </Container>
      )}
    </Draggable>
  )
}

export default Card