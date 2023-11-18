'use strict';
const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.menuTableName;

module.exports.handler = async (event) => {
    try {
        if(!event.pathParameters || !event.pathParameters.Id) {
            // failed to get as no id provided
            return Responses._400({
                message: 'No id specified'
            });
        }
    
        const updatedVal = JSON.parse(event.body);
        
        const params = {
            TableName: tableName,
            Key: {
                // Menu reservation Id
                id : event.pathParameters.Id
            },
            UpdateExpression: 'SET #key = :updateKeyValue',
            ExpressionAttributeValues: {
                ':updateKeyValue' : updatedVal
            }, 
            ExpressionAttributeNames: {
              "#key": "items"
            }
        };
    
        await Dynamo.update(params);
    
        return Responses._200({
            message : 'Menu updated successfully'
        });
    } catch (error) {
        return Responses._400({
            message : 'Failed to updated menu'
        });
    }
};