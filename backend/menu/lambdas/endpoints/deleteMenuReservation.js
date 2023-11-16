'use strict';
const Responses = require('../common/API_Responses');
const admin = require("firebase-admin");
const serviceAccount = require("./sdp3-firestore.json"); // file path for service account credentials

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://csci5410-f23-sdp3.firebaseio.com", // Firebase project URL
});

module.exports.handler = async (event) => {

    if(!event.pathParameters || !event.pathParameters.Id) {
        // failed to get as no id provided
        return Responses._400({
            message: 'No id specified'
        });
    }
    
    const db = admin.firestore();
    const collectionRef = db.collection('MenuReservations');

    try {
        const querySnapshot = await collectionRef.where('id', '==', event.pathParameters.Id).get();

        if (querySnapshot.empty) {
            return Responses._400({
                message: 'Menu reservation not found'
            });
        }

        // Delete the first document found with the specified child ID
        const documentSnapshot = querySnapshot.docs[0];
        await documentSnapshot.ref.delete();

        return Responses._200({message: 'Menu reservation deleted successfully'})
    } catch (error) {
        return Responses._400({message: 'Error deleting menu reservation'});
    }
};
