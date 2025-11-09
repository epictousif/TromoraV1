const mongoose = require('mongoose');
require('dotenv').config();

async function fixContactNumberIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Check if contactNumber index exists
    const contactNumberIndex = indexes.find(idx => idx.name === 'contactNumber_1');
    
    if (contactNumberIndex) {
      console.log('Found contactNumber_1 index, dropping it...');
      await collection.dropIndex('contactNumber_1');
      console.log('Successfully dropped contactNumber_1 index');
    } else {
      console.log('contactNumber_1 index not found');
    }

    // Ensure phoneNumber field is properly set for existing users
    const result = await collection.updateMany(
      { contactNumber: { $exists: true } },
      [
        {
          $set: {
            phoneNumber: "$contactNumber"
          }
        },
        {
          $unset: "contactNumber"
        }
      ]
    );
    
    console.log(`Updated ${result.modifiedCount} documents to use phoneNumber instead of contactNumber`);

    // Remove any documents with duplicate null phoneNumbers (keep only one)
    const duplicateNulls = await collection.find({ phoneNumber: null }).toArray();
    if (duplicateNulls.length > 1) {
      const idsToKeep = duplicateNulls[0]._id;
      const idsToRemove = duplicateNulls.slice(1).map(doc => doc._id);
      
      if (idsToRemove.length > 0) {
        await collection.deleteMany({ _id: { $in: idsToRemove } });
        console.log(`Removed ${idsToRemove.length} duplicate users with null phoneNumber`);
      }
    }

    console.log('Database cleanup completed successfully');
    
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the fix
fixContactNumberIndex();
