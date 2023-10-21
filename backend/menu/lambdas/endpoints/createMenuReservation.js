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

    const data = JSON.parse(event.body);
    data.id = event.pathParameters.Id;
    
    const params = {
        TableName: tableName,
        Item: data
    };

    const reservation = await Dynamo.write(params).catch((error) => {
        console.log('Error creating menu reservation', error);
        return null;
    });

    if(!reservation) {
        return Responses._400({
            message: 'Error creating menu reservations'
        });
    }

    return Responses._200({
        message : 'Menu reservation created successfully'
    });
};
