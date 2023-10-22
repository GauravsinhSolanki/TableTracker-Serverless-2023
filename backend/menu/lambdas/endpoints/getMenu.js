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

    let id = event.pathParameters.Id;

    const menuItems = await Dynamo.get(id, tableName).catch((error) => {
        console.log('Error fetching menu item', error);
        return null;
    });

    if(!menuItems) {
        return Responses._400({
            message: 'No matching items found for the restaurant'
        });
    }

    return Responses._200(menuItems);
};
