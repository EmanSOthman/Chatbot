import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChatBot.css";
import botImg from "../assets/bg-pattern.png";
import userImg from "../assets/user.png";
import { generateClient } from 'aws-amplify/api';
import { createMessage } from '../graphql/mutations';
import { Auth } from 'aws-amplify';

const client = generateClient();


const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, how can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);


  

  const sendMessage = async () => {
    if (input.trim() === "") return;
  
    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
  
    // Save user message
    await saveMessage(userMessage, "user");
  
    try {
      const response = await fetch("https://your-backend-api-url.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
  
      const data = await response.json();
      const botReply = data.reply;
  
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
  
      // Save bot reply
      await saveMessage(botReply, "bot");
    } catch (error) {
      const errorMsg = "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { text: errorMsg, sender: "bot" }]);
  
      // Save error message from bot
      await saveMessage(errorMsg, "bot");
  
      console.error("Error contacting backend:", error);
    }
  };

  const saveMessage = async (text, sender) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await client.graphql({
        query: createMessage,
        variables: {
          input: {
            text,
            type: sender, // "user" or "bot"
            owner: user.username,
            createdAt: new Date().toISOString(),
          },
        },
      });
    } catch (err) {
      console.error("Error saving message to DynamoDB:", err);
    }
  };
  

  useEffect(() => {
    
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat-wrapper d-flex justify-content-center align-items-center">
      <div className="chat-container d-flex flex-column shadow">
        <div className="chat-box flex-grow-1 p-3" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${
                msg.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <img
                src={msg.sender === "user" ? userImg : botImg}
                alt={msg.sender}
                className="avatar me-2"
              />
              <div className={`bubble ${msg.sender}`}>{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input d-flex border-top p-2">
          <input
            type="text"
            className="form-control rounded-pill me-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="btn custom-blue-btn rounded-pill px-4"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <img src={botImg} alt="bot" className="bot-fixed" />
    </div>
  );
};

export default ChatBot;
