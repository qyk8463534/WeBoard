const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BoardSchema = new Schema({
    boardName:{type: String, required: true},
    //admin
    lists: {
        type: [
          {
            listName: {type: String, required: true},
            cards: {type: [{type: Schema.Types.ObjectId, ref: "Card"}], default: []}
          }
        ],
        default: []
    }
});
const BoardModel = mongoose.model('Board', BoardSchema);
module.exports = BoardModel