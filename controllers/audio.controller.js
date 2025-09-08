import { decode } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";
import FormData from "form-data";
import axios from "axios";
import cloudinary from "../utils/cloudinary.js";
import stream from "stream";

// Generate an audio
export const generateAudio = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user || user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    const { prompt, duration } = req.body;
    const file = req.file;

    console.log("file name", file);

    if (!prompt || !duration) {
      return res
        .status(400)
        .json({ message: "Prompt and duration are required" });
    }

    let hfAudio;

    try {
      console.log("prompt sent to HF", prompt, duration, file?.originalname);

      // ✅ Build FormData for FastAPI
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("duration", duration.toString());

      if (file) {
        formData.append(
          "file",
          fs.createReadStream(file.path),
          file.originalname
        );
      }

      const hfResponse = await axios.post(
        "https://shubham7890-musicgen-duplicate-r.hf.space/generate/",
        // { prompt: prompt, duration: Number(duration) },
        formData,
        {
          headers: formData.getHeaders(),
          responseType: "arraybuffer",
        }
      );

      hfAudio = hfResponse.data;
    } catch (error) {
      let errorMessage = "Failed to generate audio";

      if (error?.response?.data) {
        try {
          const decoded = JSON.parse(
            Buffer.from(error.response.data).toString("utf-8")
          );
          console.error("HF api error (decoded)", decoded);
          if (decoded.detail) errorMessage = decoded.detail;
        } catch (parseErr) {
          console.error("HF api error (raw)", error.response.data, parseErr);
        }
      }

      console.error("HF api error:", error?.response?.data || error.message);
      return res.status(500).json({ message: errorMessage });
    }

    // Upload to Cloudinary
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "musemind-audio",
          public_id: `generated_${uuidv4()}`,
          format: "mp3",
        },

        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error", error);
            return reject(error);
          }

          // Deduct credit
          user.credits -= 1;
          await user.save();

          // Send response to frontend
          res.status(200).json({
            url: result.secure_url,
            downloadUrl: result.secure_url,
            credits: user.credits,
            message: "Audio generated successfully",
          });

          console.log("audio generated succesfully", hfAudio);
          console.log("Cloudinary URL", result.secure_url);
          console.log("Credits", user.credits);

          resolve();
        }
      );

      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(hfAudio));
      bufferStream.pipe(uploadStream);
    });

    /*  // Save audio as .mp3 file in public folder
    const filename = `generated_${uuidv4()}.mp3`;

    // ✅ Ensure the "public/audio" directory exists
    const dir = path.join("public", "audio");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const outputPath = path.join("public", "audio", filename);
    fs.writeFileSync(outputPath, Buffer.from(hfAudio));

    // At this point: Hugging Face response succeeded — deduct 1 credit

    user.credits -= 1;
    await user.save();

    // Respond with URL and credits
    const audioUrl = `${process.env.BASE_URL}/audio/${filename}`;
    const downloadUrl = `${process.env.BASE_URL}/api/audio/download/${filename}`;

    // res.set("Content-Type", "audio/mpeg");
    // res.set("Content-Disposition", "attachment; filename=generated.mp3");
    // res.set("X-credits", user.credits.toString());
    console.log("audio generated succesfully", hfAudio);
    console.log("Credits", user.credits);
    return res.status(200).json({
      url: audioUrl,
      downloadUrl,
      credits: user.credits,
      message: "Audio generated succesfully",
    }); */
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Deduct a credit
export const decrementCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits <= 0) {
      return res.status(400).json({ message: "Insufficient credits." });
    }

    // deduct a credit
    user.credits -= 1;
    await user.save();

    res.status(200).json({ credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: "Server error while deducting credit" });
  }
};

// Download the generated audio
export const downloadAudio = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join("public", "audio", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Error downloading file");
    }
  });
};
