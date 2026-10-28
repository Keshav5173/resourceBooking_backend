import mongoose from "mongoose";


const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
    }

}, {timestamps: true});

export const Resource = mongoose.model("Resource", resourceSchema);