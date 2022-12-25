const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            maxLength: 50,
            required: [true, "Please provide company name"],
        },
        position: {
            type: String,
            maxLength: 50,
            required: [true, "Please provide position"],
        },
        status: {
            type: String,
            enum: ["interview", "declined", "pending"],
            default: "pending",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User", // which model are we referencing
            required: [true, "Please provide user"],
        },
    },
    {
        timestamps: true, // we get createdAt  and updatedAt properties in every docs
    }
);

module.exports = mongoose.model("Job", JobSchema);
