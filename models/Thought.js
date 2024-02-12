const { Schema, model } = require('mongoose');

const ReactionSchema = new Schema({
  reactionId: { type: Schema.Types.ObjectId, default: () => new Schema.Types.ObjectId() },
  reactionBody: { type: String, required: true, maxlength: 280 },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, get: createdAtVal => createdAtVal.toISOString() },
}, {
  toJSON: { getters: true },
});

const ThoughtSchema = new Schema({
  thoughtText: { type: String, required: true, minlength: 1, maxlength: 280 },
  createdAt: { type: Date, default: Date.now, get: createdAtVal => createdAtVal.toISOString() },
  username: { type: String, required: true },
  reactions: [ReactionSchema],
}, {
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true },
});

ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
