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
        
        const params = {
            TableName: tableName,
            Key: {
                // Menu Id
                id : event.pathParameters.Id
            },
        };
    
        await Dynamo.delete(params);
    
        return Responses._200({
            message : 'Menu deleted successfully'
        });
    } catch (error) {
        return Responses._400({
            message: 'Error deleting menu'
        });
    }
};