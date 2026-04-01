import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    blood_group: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    last_donation: {
      type: Date,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

donorSchema.index({ location: "2dsphere" });

donorSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const json = { ...ret };
    json.id = json._id.toString();
    delete json._id;
    delete json.__v;

    if (json.location?.coordinates?.length === 2) {
      json.longitude = json.location.coordinates[0];
      json.latitude = json.location.coordinates[1];
    }

    return json;
  },
});

export const Donor = mongoose.model("Donor", donorSchema);
