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
        const menuReservationsDocs = db.collection("MenuReservations");

        if(!event.pathParameters || !event.pathParameters.Id) {
            // failed to get as no id provided
            return Responses._400({
                message: 'No id specified'
            });
        }
    
        const addedReservation = await menuReservationsDocs.add({
            id: event.pathParameters.Id,
            ...JSON.parse(event.body)
        });
    
        return Responses._200({
            message: "Reservation successful",
            reservation_id: addedReservation.id,
        });
    } catch (error) {
        return Responses._400({
            message: 'Error creating menu reservations'
        });
    }
};
