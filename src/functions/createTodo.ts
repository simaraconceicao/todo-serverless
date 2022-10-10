import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { nanoid } from "nanoid";

interface ICreateTodo {
  id: string; // id gerado para garantir um único todo com o mesmo id
  user_id: string; // id do usuário recebido no pathParameters
  title: string; // vou mandar no corpo
  done: boolean; // inicie sempre como false
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title } = JSON.parse(event.body) as ICreateTodo;
  const { user_id } = event.pathParameters;

  const id = nanoid();

  await document
    .put({
      TableName: "user_todos",
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date().toLocaleDateString(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "user_todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
