const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CardSchema = new Schema({
    cardName:{type: String, required: true},
    highestaAcademicLevel:{type: String, required: true},
    phoneNumber:{type: String, required: true},
    emailAddress:{type: String, required: true},
    comments: {type: [{author: {type: String}, text: {type: String}}], default: []}
    //resume
});
const CardModel = mongoose.model('Card', CardSchema);
module.exports = CardModel;