import mongoose from "mongoose";

const { Schema } = mongoose;
const ErrorSchema = new Schema(
    {
        message: { type: String, required: true },  
        statusCode: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
    }
)

const Error = mongoose.model('Error', ErrorSchema);

export default Error;