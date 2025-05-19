import React, { useState, useEffect, useRef } from "react";
import AWS from "aws-sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChatBot.css";
import botImg from "../assets/bg-pattern.png";
import userImg from "../assets/user.png";


AWS.config.update({
  region: "eu-west-2",

  
});

const lexV2 = new AWS.LexRuntimeV2();

const botId = "GLCG3VORGL";
const botAliasId = "TSTALIASID";
const localeId = "en_US"; 

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, how can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");

    const params = {
      botId,
      botAliasId,
      localeId,
      sessionId: "user-" + Date.now(),
      text: userMessage,
    };

    lexV2.recognizeText(params, function (err, data) {
      if (err) {
        console.error("Lex V2 error:", err);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, something went wrong.", sender: "bot" },
        ]);
      } else if (data && data.messages) {
        const botReply = data.messages.map(m => m.content).join(" ");
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
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
              className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
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
