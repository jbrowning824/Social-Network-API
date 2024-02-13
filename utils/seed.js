const connection = require('../config/connection');
const User = require('../models/User'); // Path to your User model
const Thought = require('../models/Thought'); // Path to your Thought model


connection.on('error', (err) => err);


connection.once('open', async () => {
    console.log('connected');
    await User.deleteMany({});
    await Thought.deleteMany({});
    const usersData = [
        {
          username: 'aliceWonder',
          email: 'alice@example.com',
          thoughts: [],
          friends: [],
        },
        {
          username: 'bobBuilder',
          email: 'bob@example.com',
          thoughts: [],
          friends: [],
        },
      ];
      
      // Sample thoughts
      const thoughtsData = [
        {
          thoughtText: "Here's a cool thought...",
          username: 'aliceWonder',
          reactions: [
            {
              reactionBody: 'Wow, so cool!',
              username: 'bobBuilder',
            },
          ],
        },
        {
          thoughtText: "Another interesting thought...",
          username: 'bobBuilder',
          reactions: [
            {
              reactionBody: 'This is amazing!',
              username: 'aliceWonder',
            },
          ],
        },
      ];

      
        // Insert users and save the inserted data to update later
        const insertedUsers = await User.insertMany(usersData);

         // Insert thoughts without reactions first
        const thoughtsWithoutReactions = thoughtsData.map(({ reactions, ...thought }) => thought);
        const insertedThoughts = await Thought.insertMany(thoughtsWithoutReactions);
    
        // Create a map of username to user ID for easy lookup
        const userMap = insertedUsers.reduce((acc, user) => {
          acc[user.username] = user._id;
          return acc;
        }, {});
    
        // Update each thought to include the user's _id
        for (let thought of insertedThoughts) {
          await Thought.findByIdAndUpdate(thought._id, { $set: { username: userMap[thought.username] } });
        }
        
    
        // Optionally, update users with their thoughts
        // For simplicity, this example assumes each thought is created by the corresponding user in order
        for (let i = 0; i < insertedUsers.length; i++) {
          const userId = insertedUsers[i]._id;
          const thoughtId = insertedThoughts[i]._id;
          await User.findByIdAndUpdate(userId, { $push: { thoughts: thoughtId } });
        }
    
        // Establishing friend connections (example: making the first two users friends)
        if (insertedUsers.length > 1) {
          await User.findByIdAndUpdate(insertedUsers[0]._id, { $addToSet: { friends: insertedUsers[1]._id } });
          await User.findByIdAndUpdate(insertedUsers[1]._id, { $addToSet: { friends: insertedUsers[0]._id } });
        }


    
    console.table(usersData);
    console.table(thoughtsData);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});

// Seed function to insert sample data

