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
      match: [/.+\@.+\..+/, 'Please fill a valid email address'], 
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought', 
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', 
      },
    ],
  },
  {
   
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property friendCount that retrieves the length of the user's friends array field on query.
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize User model
const User = model('User', userSchema); 

module.exports = User;
