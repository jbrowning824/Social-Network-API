const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Regex to validate email
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought', // Ensure this matches the Thought model name
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', // Self-reference to create a friends list
      },
    ],
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `friendCount` that retrieves the length of the user's friends array field on query.
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize our User model
const User = model('User', userSchema); // Use 'User' to match the casing convention for model names

module.exports = User;
