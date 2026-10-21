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
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
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
    publicListingConsent: {
      type: Boolean,
      required: true,
      default: false,
    },
    sharePhone: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

donorSchema.index({ location: "2dsphere" });

donorSchema.set("toJSON", {
  transform: (_doc, ret) => {
    return {
      name: ret.name,
      blood_group: ret.blood_group,
      state: ret.state,
      city: ret.city,
      isAvailable: ret.isAvailable,
      ...(ret.sharePhone === true ? { phone: ret.phone } : {}),
    };
  },
});

export const Donor = mongoose.model("Donor", donorSchema);
