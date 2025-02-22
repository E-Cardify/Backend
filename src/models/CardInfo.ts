import { InferSchemaType, Schema, Types, model } from "mongoose";

const InformationSchema = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  middleName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  preferredName: {
    type: String,
    default: "",
  },
  maidenName: {
    type: String,
    default: "",
  },
  pronouns: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  department: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  headline: {
    type: String,
    default: "",
  },
  motto: {
    type: String,
    default: "",
  },
});

const DesignSchema = new Schema({
  color: {
    type: String,
    default: "green-500",
  },
  style: {
    type: String,
    default: "solid",
  },
});

const FieldSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
});

const CardInfoSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
    },
    information: {
      type: InformationSchema,
      required: true,
    },
    design: {
      type: DesignSchema,
      required: true,
    },
    fields: {
      type: [FieldSchema],
      default: [],
    },
    isMain: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type FieldType = {
  label: string;
  value: string;
};

export type CardInfoType = InferSchemaType<typeof CardInfoSchema>;

const CardInfo = model<CardInfoType>("CardInfo", CardInfoSchema);
export default CardInfo;
