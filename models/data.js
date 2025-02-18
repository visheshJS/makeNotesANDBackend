import mongoose, { Schema } from "mongoose";

const notesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export const Note = mongoose.model("Note", notesSchema);
