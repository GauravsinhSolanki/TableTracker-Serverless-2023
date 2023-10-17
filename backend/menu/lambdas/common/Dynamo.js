const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(id, TableName) {
        const params = {
            TableName,
            Key: {
                id
            }
        };
        
        const data = await documentClient
            .get(params)
            .promise();

        if(!data || !data.Item) {
            throw Error('There was an error fetching the data for id of ${id} from ${tableName}');
        }

        return data.Item;
    }
}

module.exports = Dynamo;