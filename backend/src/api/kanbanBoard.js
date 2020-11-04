const express = require('express')
const passport = require('passport')
const CardModel = require('../modelsMongoDB/card')
const BoardModel = require('../modelsMongoDB/board')

const router = express.Router();
/*
* board api
*/
  /*
  * create a board
  */
  router.post(
    "/kanban",
    async (req, res) => {
      try {
        const {name} = req.body;
        const kanban= {
            boardName: name,
          lists: [
            {_id: "Applied", cards: []},
            {_id: "Phone Screen", cards: []},
            {_id: "On Site", cards: []},
            {_id: "Offered", cards: []},
            {_id: "Accepted", cards: []},
            {_id: "Rejected", cards: []}
          ]
        };
        const kanbanDoc = new BoardModel(kanban);
        await kanbanDoc.save();
        res.status(200).send(kanbanDoc.toJSON());
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
  /*
  * get a board
  */
  router.get(
    "/kanban/:kanbanID",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {kanbanID} = req.params;
        const kanban = (await BoardModel.findOne({_id: kanbanID})
          .populate({
            path: "lists",
            populate: {path: "cards"}
          })
          .lean());
  
        res.status(200).send(kanban);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
/*
* update a board
*/
  router.put(
    "/kanban/:kanbanID/board",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {kanbanID} = req.params;
        const {lists} = req.body;
        await BoardModel.updateOne({_id: kanbanID}, {lists: lists});
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
/*
* close(delete) a board
*/
  router.delete(
    "/kanban/:kanbanID",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {kanbanID} = req.params;
        const Kanban = (await BoardModel.findOneAndDelete({
          _id: kanbanID,
        }).lean());
  
        const cards = Kanban.lists.map((list) => list.cards).reduce((pre, curr) => pre.concat(curr), []);
        await CardModel.deleteMany({_id: {$in: cards}});
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
/*
* card api
*/
  /*
  * post a card on a board
  */
  router.post(
    "/kanban/:kanbanID/board/:_id/card",

    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {cardName, highestaAcademicLevel,phoneNumber, emailAddress} = req.body;
        const {kanbanID, _id} = req.params;
  
        const kanban = (await BoardModel.findOne({
          _id: kanbanID
        }).lean());
        if (kanban === null) {
          throw {status: 421, message: "Board not found"};
        }
        if (kanban.lists.every((list) => list._id.toString() !== _id)) {
          throw {status: 421, message: "List not found"};
        }
  
        const card = {
          cardName: cardName,
          highestaAcademicLevel:highestaAcademicLevel,
          phoneNumber: phoneNumber,
          emailAddress: emailAddress,
          comments: []
        };
  
        const CardDoc = new CardModel(card);
        await CardDoc.save();
  
        kanban.lists.map((list) => {
          if (list._id.toString() === _id) {
            list.cards.push(CardDoc._id);
          }
          return list;
        });
        await BoardModel.updateOne({_id: kanban._id}, kanban);
  
        res.status(200).send(CardDoc._id);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
/*
* update a card
*/
  router.put(
    "/kanban/:kanbanID/board/:_id/card/:cardID",
    
  passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {cardName, highestaAcademicLevel,phoneNumber, emailAddress} = req.body;
        const {kanbanID, _id, cardID} = req.params;
  
        const kanban = (await BoardModel.findOne({
          _id: kanbanID
        }).lean());
        if (kanban === null) {
          throw {status: 421, message: "Board not found"};
        }
        if (kanban.lists.every((list) => list._id.toString() !== _id)) {
          throw {status: 421, message: "List not found"};
        }
  
        await CardModel.updateOne(
          {_id: cardID},
          {
            $set: {
              cardName: cardName,
              highestaAcademicLevel:highestaAcademicLevel,
              phoneNumber: phoneNumber,
              emailAddress: emailAddress,
            }
          },
        );
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
/*
* move a card from one list to another
*/ 
  router.put(
    "/kanban/:kanbanID/move",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {oldID, oldIndex, newID, newIndex} = req.body;
        const {kanbanID} = req.params;
  
        const kanban = (await BoardModel.findOne({
          _id: kanbanID
        }).lean());
        if (kanban === null) {
          throw {status: 421, message: "Board not found"};
        }
        if (kanban.lists.every((list) => list._id.toString() !== oldID && list._id.toString() !== newID)) {
          throw {status: 421, message: "List not found"};
        }
        const cardID = kanban.lists.reduce((pre, curr) => {
          console.log(curr._id);
          if (curr._id.toString() === oldID) {
            return curr.cards[oldIndex]._id || "";
          } else {
            return pre;
          }
        }, "");
        console.log("reach")
        console.log(cardID);
        await BoardModel.updateOne(
          {_id: kanban._id},
          {
            $push: {
              "lists.$[newID].cards": cardID,
              $position: newIndex
            }
          },
          {arrayFilters: [{"newID._id": newID}]}
        );
        await BoardModel.updateOne(
          {_id: kanban._id},
          {
            $pull: {
              "lists.$[oldID].cards": cardID,
              $position: oldIndex
            }
          },
          {arrayFilters: [{"oldID._id": oldID}]}
        );
  
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
  /*
  * delete a card
  */
  router.delete(
    "/kanban/:kanbanID/board/:_id/card/:cardID",
    
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const {kanbanID, _id, cardID} = req.params;
  
        const kanban = (await BoardModel.findOne({
          _id: kanbanID
        }).lean());
        if (kanban === null) {
          throw {status: 421, message: "Board not found"};
        }
        if (kanban.lists.every((list) => list._id.toString() !== _id)) {
          throw {status: 421, message: "List not found"};
        }
  
        await BoardModel.updateOne(
          {_id: kanbanID},
          {
            $pull: {
              "lists.$[thelist].cards": cardID
            }
          },
          {arrayFilters: [{"thelist._id": _id}]}
        );
  
        await CardModel.deleteOne({_id: cardID});
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.status(error.status ? error.status : 500).send(error.message);
      }
    }
  );
  module.exports = router