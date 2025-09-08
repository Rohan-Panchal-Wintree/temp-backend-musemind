import savedLyricsModel from "../models/savedLyrics.model.js";
import cloudinary from "../utils/cloudinary.js";

// upload generated text to cloudinary
async function uploadTextToCloudinary({ text, publicId, filename }) {
  const res = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          public_id: `lyrics/${publicId}`,
          overwrite: true,
          folder: "lyrics",
        },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(Buffer.from(text, "utf-8"));
  });

  const fileUrl = res.secure_url;
  const downloadUrl = `${res.secure_url}?fl_attachement=${encodeURIComponent(
    filename || "generated_lyrics.txt"
  )}`;

  return { fileUrl, downloadUrl };
}

// POST /api/lyrics
export const savelyrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, content, dateCreated } = req.body;

    console.log(
      "Details for the lyrics",
      `${id} | ${title} | ${content} | ${dateCreated}`
    );

    if (!id || !title || !content || !dateCreated) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const filename = `${title.replace(/\s + /g, "_").slice(0, 50)}.txt`;
    const { fileUrl, downloadUrl } = await uploadTextToCloudinary({
      text: content,
      publicId: id,
      filename,
    });

    let doc = await savedLyricsModel.findOne({ user: userId });

    if (!doc) {
      doc = await savedLyricsModel.create({
        user: userId,
        lyrics: [
          {
            id,
            title,
            url: fileUrl,
            downloadUrl,
            dateCreated: dateCreated || new Date().toISOString(),
          },
        ],
      });
    } else {
      // avoid lyrics duplicates by id
      const exists = doc.lyrics.some((l) => l.id === id);
      if (!exists) {
        doc.lyrics.unshift({
          id,
          title,
          url: fileUrl,
          downloadUrl,
          dateCreated: dateCreated || new Date().toISOString(),
        });
        await doc.save();
      }
    }

    return res
      .status(200)
      .json({ message: "Lyric saved succesfully", lyrics: doc.lyrics });
  } catch (err) {
    console.error("SavedLyric error:", err);
    return res.status(500).json({ message: "Failed to save lyric" });
  }
};

// GET /api/lyrics
export const listLyrics = async (req, res) => {
  try {
    const doc = await savedLyricsModel.findOne({ user: req.user.id }).lean();
    return res.status(200).json({ lyrics: doc?.lyrics || [] });
  } catch (err) {
    console.error("listLyrics error", err);
    return res.status(500).json({ message: "Failed to fetch lyrics" });
  }
};

// DELETE /api/lyrics/:id
export const removeLyrics = async (req, res) => {
  try {
    const doc = await savedLyricsModel.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { lyrics: { id: req.params.id } } },
      { new: true }
    );
    return res.status(200).json({
      message: "Lyric removed succesfully",
      lyrics: doc?.lyrics || [],
    });
  } catch (error) {
    console.error("Error removing lyrics:", error);
    return res.status(500).json({ message: "Failed to remove lyric" });
  }
};
