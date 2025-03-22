import mongoose, { Schema, model } from "mongoose";

export interface CardInfoDocument extends mongoose.Document {
  information: InformationDocument;
  design: DesignDocument;
  fields: FieldDocument[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  avatarPublicId?: string;
  avatarUrl?: string;
  updatedAt: Date;
}

export interface InformationDocument extends mongoose.Document {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  maidenName: string;
  pronouns: string;
  title: string;
  department: string;
  company: string;
  headline: string;
  motto: string;
  createdAt: Date;
  updatedAt: Date;
}

const InformationSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "",
      required: false,
    },
    middleName: {
      type: String,
      default: "",
      required: false,
    },
    lastName: {
      type: String,
      default: "",
      required: false,
    },
    preferredName: {
      type: String,
      default: "",
      required: false,
    },
    maidenName: {
      type: String,
      default: "",
      required: false,
    },
    pronouns: {
      type: String,
      default: "",
      required: false,
    },
    title: {
      type: String,
      default: "",
      required: false,
    },
    department: {
      type: String,
      default: "",
      required: false,
    },
    company: {
      type: String,
      default: "",
      required: false,
    },
    headline: {
      type: String,
      default: "",
      required: false,
    },
    motto: {
      type: String,
      default: "",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface DesignDocument extends mongoose.Document {
  color: string;
  style: string;
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema = new Schema(
  {
    color: {
      type: String,
      default: "green-500",
      required: false,
    },
    style: {
      type: String,
      default: "solid",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface FieldDocument extends mongoose.Document {
  label: string;
  value: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      default: "",
    },
    value: {
      type: String,
      default: "",
      required: true,
    },
    text: {
      type: String,
      default: "",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CardInfoSchema = new Schema(
  {
    information: {
      type: InformationSchema,
      required: true,
      default: {},
    },
    design: {
      type: DesignSchema,
      required: true,
      default: {},
    },
    fields: {
      type: [FieldSchema],
      default: [],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    avatarPublicId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const InformationModel = model<InformationDocument>(
  "Information",
  InformationSchema,
  "information"
);

const DesignModel = model<DesignDocument>("Design", DesignSchema, "design");

const FieldModel = model<FieldDocument>("Field", FieldSchema, "fields");

const CardInfoModel = model<CardInfoDocument>(
  "CardInfo",
  CardInfoSchema,
  "card_info"
);
export default CardInfoModel;
export { InformationModel, DesignModel, FieldModel };
