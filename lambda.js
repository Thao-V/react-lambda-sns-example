import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Message";

const topicArn = "arn:aws:sns:us-east-1:892818745168:notify-message";
const sns = new SNSClient({});

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': 'https://trialappsite.com',//'*'
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
  };
  
  try{
    const obj = JSON.parse(event.body);
    if(!obj.email || !obj.content){
      throw new Error("Invalid message")
    }
    await dynamo.send(new PutCommand({
      TableName: tableName,
      Item:{...obj, timestamp: new Date().toISOString()}
    }));
    
    const snsParams = {
      Message: `A new message from ${obj.email}: ${obj.content}`,
      TopicArn: topicArn
    }
    
    await sns.send(new PublishCommand(snsParams));
    
    body = `Created a new message from ${obj.email}`;
  }catch(error){
    statusCode = 400;
    body = error.message;
  }finally{
    body = JSON.stringify(body);
  }
  return {
    statusCode,
    body,
    headers
  }
}
