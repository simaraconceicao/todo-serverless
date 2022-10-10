import { document } from 'src/utils/dynamodbClient';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
export const handler = async (event) => {
    const generateIdTodo = nanoid();
    const deadlineDate = dayjs().format('DD/MM/YYYY');
    const { title } = JSON.parse(event.body);
    const { user_id } = event.pathParameters;
    const response = await document.query({
        TableName: 'user_todos',
        KeyConditionExpression: 'id = :user_id',
        ExpressionAttributeValues: {
            ':user_id': user_id
        }
    }).promise();
    await document.put({
        TableName: 'user_todos',
        Item: {
            id: generateIdTodo,
            title,
            done: false,
            deadline: new Date(deadlineDate)
        }
    }).promise();
    console.log(response.Items[0]);
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Todo created with success',
            title
        })
    };
};
//# sourceMappingURL=createTodo.js.map