import {MongoClient} from 'mongodb'

async function main() {
    const client = new MongoClient('mongodb+srv://admin-devin:m00nPhas3@cluster0.54ycb.mongodb.net/music_data?retryWrites=true&w=majority');

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await createModule(client, {
            name: "prototype module",
            series: 'part 3 of the jazz pack',
            author: 'devnaut',
            category: 'jazz', 
            key: 1,
            chord: '',
            scale: [],
            pattern: [],
            rhythm: [],
            position: [],
            beat: 4,
            speed: '4d'
        })

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

// Add functions that make DB calls here
async function createModule(client, newModule){
    const result = await client.db("global").collection("modules").insertOne(newModule);
    console.log(`New module created with the following id: ${result.insertedId}`)
}