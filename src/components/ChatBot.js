import React, { useState, useEffect, useRef } from "react";
import AWS from "aws-sdk";
import { getCurrentUser } from '@aws-amplify/auth';
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChatBot.css";
import botImg from "../assets/bg-pattern.png";
import userImg from "../assets/user.png";

// AWS Lex V2 config
AWS.config.update({
  region: "eu-west-2",
});


const lexV2 = new AWS.LexRuntimeV2();
const botId = "GLCG3VORGL";
const botAliasId = "TSTALIASID";
const localeId = "en_US";


const saveConversation = async (userMessage, userMessageTime, botReply, botReplyTime) => {
  try {
    const user = await getCurrentUser();
    const email = user.signInDetails?.loginId || "unknown";
    const username = user.username || "unknown";

    await fetch("https://q4pteydjr3.execute-api.eu-west-2.amazonaws.com/prod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        userMessage,
        userMessageTime,
        botReply,
        botReplyTime,
      }),
    });
  } catch (error) {
    console.error("Failed to save conversation:", error);
  }
};


const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, how can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = input;
    const userMessageTime = new Date().toISOString();
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");

    const params = {
      botId,
      botAliasId,
      localeId,
      sessionId: "user-" + Date.now(),
      text: userMessage,
    };

    lexV2.recognizeText(params, async function (err, data) {
      if (err) {
        console.error("Lex V2 error:", err);
        const botReply = "Sorry, something went wrong.";
        const botReplyTime = new Date().toISOString();

        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
        await saveConversation(userMessage, userMessageTime, botReply, botReplyTime);
      } else if (data && data.messages) {
        const botReply = data.messages.map((m) => m.content).join(" ");
        const botReplyTime = new Date().toISOString();

        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
        await saveConversation(userMessage, userMessageTime, botReply, botReplyTime);
      }
    });
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
                msg.sender === "user" ? "justify-content-end" : "justify-content-start"
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

