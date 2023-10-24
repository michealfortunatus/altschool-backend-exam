const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter a title"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Enter a description"],
      maxlength: [
        100,
        "Description must be or equal to 100 characters",
      ],
    },
     tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Enter an author"],
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    read_time: {
      type: Number,
      default: 0,
    },
   
    body: {
      type: String,
      required: [true, "Enter the body"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "first_name last_name email",
  });
  next();
});
blogSchema.pre("save", function (next) {
  this.reading_time = Math.ceil(this.body.split(" ").length / 200);
  next();
});
module.exports = mongoose.model("Blog", blogSchema);
