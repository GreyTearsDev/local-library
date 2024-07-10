const mongoose = require("mongoose");
const uri = require("./uri");
const collectionName = "local_library";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection;
  const collection = db.collection(collectionName);

  const duplicates = await collection
    .aggregate([
      {
        $group: {
          _id: { email: "$email" }, // Group by the field that should be unique
          ids: { $push: "$_id" }, // Push all document IDs into an array
          count: { $sum: 1 }, // Count the number of documents per group
        },
      },
      {
        $match: { count: { $gt: 1 } }, // Find groups with more than one document
      },
    ])
    .toArray(); // Convert the aggregation cursor to an array

  for (const doc of duplicates) {
    const [firstId, ...duplicateIds] = doc.ids;
    await collection.deleteMany({ _id: { $in: duplicateIds } }); // Remove the remaining duplicates
  }
  mongoose.connection.close();
}
