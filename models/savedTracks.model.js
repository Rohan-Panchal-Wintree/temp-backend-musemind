import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
    downloadUrl: { type: String, required: true },
    dateCreated: { type: String, required: true },
  },
  { _id: false }
);

const SavedTrackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    savedTracks: { type: [TrackSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("SavedTracks", SavedTrackSchema);
