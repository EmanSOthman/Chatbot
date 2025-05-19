import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listMessages } from '../graphql/queries'; // Adjust path if needed

const client = generateClient();

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const result = await client.graphql({
        query: listMessages
      });
      setMessages(result.data.listMessages.items);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Chat Messages</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.owner}</strong>: {msg.text} <em>({msg.createdAt})</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatWindow;
