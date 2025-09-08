import SavedTracks from "../models/savedTracks.model.js";

// Save a track
export const saveTrack = async (req, res) => {
  const userId = req.user.id;
  const { id, title, url, downloadUrl, duration, dateCreated } = req.body;

  if (!id || !title || !url || !downloadUrl || !duration || !dateCreated) {
    return res.status(400).json({ message: "Missing track fields" });
  }

  try {
    let userTracks = await SavedTracks.findOne({ user: userId });

    if (!userTracks) {
      userTracks = new SavedTracks({ user: userId, savedTracks: [] });
    }

    const exists = userTracks.savedTracks.some((t) => t.id === id);
    if (!exists) {
      userTracks.savedTracks.unshift({
        id,
        title,
        url,
        downloadUrl,
        duration,
        dateCreated,
      });
      await userTracks.save();
    }

    return res.status(200).json({
      message: "Tracked Saved Succesfully",
      tracks: userTracks.savedTracks,
    });
  } catch (error) {
    console.error("SavedTrack error", error);
    return res.status(500).json({ message: "Error Saving Track" });
  }
};

// Get all saved tracks for the user\
export const listTracks = async (req, res) => {
  try {
    const doc = await SavedTracks.findOne({ user: req.user.id });
    return res.status(200).json({ tracks: doc?.savedTracks || [] });
  } catch (error) {
    console.error("listTracks error", error);
    return res.status(500).json({ message: "Error Getting Tracks" });
  }
};

// Remove a track
export const removeTrack = async (req, res) => {
  try {
    const doc = await SavedTracks.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { savedTracks: { id: req.params.id } } },
      { new: true }
    );
    return res.status(200).json({
      message: "Track Removed Succesfully",
      tracks: doc?.savedTracks || [],
    });
  } catch (error) {
    console.error("removeTrack error:", error);
    return res.status(500).json({ message: "Error Removing Track" });
  }
};
