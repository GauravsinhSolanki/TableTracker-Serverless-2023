'use strict';
const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.menuTableName;

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

    const menu = await Dynamo.write(params).catch((error) => {
        console.log('Error creating menu', error);
        return null;
    });

    if(!menu) {
        return Responses._400({
            message: 'Error creating menu'
        });
    }

    return Responses._200({
        message : 'Menu created successfully'
    });
};