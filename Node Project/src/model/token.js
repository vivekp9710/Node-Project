import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId

const TokenSchema = mongoose.Schema({
    token: [{ type: String }],
    userId: ObjectId

}, { timestamps: true },
);
export const Token = mongoose.model("token", TokenSchema);