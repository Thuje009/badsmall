const mongoose = require("mongoose");
const joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;


const playListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: ObjectId, ref: "user", required: true },
  desc: { type: String },
  songs: { type: Array, default: [] },
  img: { type: String },
});

const validate = (playList) => {
  const schema = joi.ObjectId({
    name: joi.string().required(),
    user: joi.string().required(),
    desc: joi.string().allow(""),
    songs: joi.array().items(joi.string()),
    img: joi.string().allow(""),
  });
  return schema.validate(playList);
};

const PlayList = mongoose.model("playlist", playListSchema);

module.exports = { PlayList, validate };
