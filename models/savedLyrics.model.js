import mongoose from "mongoose";

const LyricsItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    dateCreated: { type: String, required: true },
  },
  { _id: false }
);

const SavedLyricsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    lyrics: { type: [LyricsItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("SavedLyrics", SavedLyricsSchema);
