import { API, graphqlOperation } from 'aws-amplify';
import { createMessage } from './graphql/mutations';

const saveMessage = async (text) => {
  try {
    const newMessage = {
      text: text,
      createdAt: new Date().toISOString(),
    };

    await API.graphql(graphqlOperation(createMessage, { input: newMessage }));
    console.log('Message saved!');
  } catch (error) {
    console.error('Error saving message:', error);
  }
};
