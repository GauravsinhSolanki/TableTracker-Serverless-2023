'use strict';
const Responses = require('../common/API_Responses');
const admin = require("firebase-admin");
const serviceAccount = require("./sdp3-firestore.json"); // file path for service account credentials

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://csci5410-f23-sdp3.firebaseio.com", // Firebase project URL
});

module.exports.handler = async (event) => {

    try {
        const db = admin.firestore();

        if(!event.pathParameters || !event.pathParameters.Id) {
            // failed to get as no id provided
            return Responses._400({
                message: 'No id specified'
            });
        }
    
        const collectionRef = db.collection('MenuReservations');

        // Get the document to update
        const querySnapshot = await collectionRef.where('id', '==', event.pathParameters.Id).get();

        querySnapshot.forEach(async (doc) => {
            const docId = doc.id;
            const data = doc.data();
            data.items = JSON.parse(event.body);

            // Update the document with the modified data
            await collectionRef.doc(docId).set(data);
        });

        // Return a success response
        return { 
            statusCode: 200, body: 'Menu reservation updated successfully' 
        };
    } catch (error) {
        console.log(error);
        return Responses._400({
            message: "Error updating menu reservation",
            error: error.message,
        });
    }
};
