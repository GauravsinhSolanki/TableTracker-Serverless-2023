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
        const dbCollection = db.collection("MenuReservations");
        
        const reservationId = event.pathParameters.Id;

        let menuReservationsDocs = null;

        menuReservationsDocs = await dbCollection
            .where("reservationId", "==", reservationId)
            .get();

        const reservations = menuReservationsDocs.docs.map((document) => ({
            id: document.id,
            ...document.data(),
        }));
    
        return Responses._200(...reservations);
    } catch (error) {
        console.log(error);
        return Responses._400({
            message: "Error fetching menu reservations",
            error: error.message,
        });
    }
    
};
