import mongoose from "mongoose";

export interface FileDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  type: "image" | "file" | "video";
  public: boolean;
}

const FileSchema = new mongoose.Schema<FileDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "file",
    },
    public: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model<FileDocument>("File", FileSchema);

export default FileModel;
