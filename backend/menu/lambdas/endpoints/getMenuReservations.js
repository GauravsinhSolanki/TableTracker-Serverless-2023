'use strict';
const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.menuReservationsTableName;

module.exports.handler = async (event) => {

    if(!event.pathParameters || !event.pathParameters.Id) {
        // failed to get as no id provided
        return Responses._400({
            message: 'No id specified'
        });
    }

    const reservationId = event.pathParameters.Id;

    const params = {
        TableName: tableName,
        IndexName: 'reservation-index',
        KeyConditionExpression: 'reservationId = :id',
        ExpressionAttributeValues: { 
            ':id': reservationId
        }
    };


    const reservation = await Dynamo.query(params).catch((error) => {
        console.log('Error fetching menu reservation', error);
        return null;
    });

    if(!reservation) {
        return Responses._400({
            message: 'No matching items found in '+ tableName +' for the specifed reservation id: '+ reservationId
        });
    }

    return Responses._200(reservation);
};
