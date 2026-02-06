import mongoose from 'mongoose'
const {Schema} = mongoose;


const quote = new Schema({
    text:{type: String, required:true, unique: true},
    author: {type: String, required:true},
    saved:{type: Date, default: Date.now}
    
})
const Quote = mongoose.model('Quote', quote);


export default Quote;