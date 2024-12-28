import mongoose, { Document, Schema } from "mongoose";

export interface EntryDocument extends Document {
    title: string
    desc: string
    img?: string
    url: string
}

const EntrySchema = new Schema<EntryDocument>({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    desc: {
        type: String,
        required: [true, "Description is required"],
    },
    img: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: [true, "URL is required"],
    }
});

export const Entry =
    mongoose.models.Entry ||
    mongoose.model<EntryDocument>("Entry", EntrySchema);
