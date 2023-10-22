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
    },
    async query(params) {

        const data = await documentClient
            .query(params)
            .promise();

        if(!data || !data.Items) {
            throw Error('There was an error fetching the data from ${params.TableName}');
        }

        return data.Items || [];
    },
    async update(params) {
        return documentClient
            .update(params)
            .promise();
    },
    async delete(params) {
        return documentClient
            .delete(params)
            .promise();
    },
    async write(params) {
        const res = await documentClient
            .put(params)
            .promise();

        if(!res) {
            throw Error('There was an error inserting a record');
        }

        return res;
    }
}

module.exports = Dynamo;