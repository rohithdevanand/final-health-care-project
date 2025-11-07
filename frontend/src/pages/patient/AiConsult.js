import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "./AiConsult.css"; // We'll add some CSS

const AiConsult = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hi, ${user?.name}! I'm your AI health assistant. What symptoms are you experiencing today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState("symptoms"); // symptoms -> diagnosis -> satisfaction

  const handleSend = (e) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    let newMessages = [...messages, userMessage];

    // Mock AI response
    let aiResponse = "";
    if (conversationState === "symptoms") {
      aiResponse =
        "Thank you for sharing. Based on your symptoms (fever, cough, and headache), I suspect it might be the Flu. Are you satisfied with this preliminary diagnosis?";
      setConversationState("diagnosis");
    } else if (conversationState === "diagnosis") {
      if (input.toLowerCase().includes("yes")) {
        aiResponse =
          "Great! I recommend booking an appointment with a General Physician for a formal consultation. You can visit our 'Book an Appointment' page.";
      } else {
        aiResponse =
          "I apologize. Please provide more details about your symptoms, or consider booking an appointment with a doctor for a more accurate diagnosis.";
      }
      setConversationState("satisfaction");
    } else {
      aiResponse =
        "You can manage your health by booking an appointment or visiting our resources page.";
    }

    // Add AI response after a short delay
    setTimeout(() => {
      setMessages([...newMessages, { sender: "ai", text: aiResponse }]);
    }, 1000);

    setMessages(newMessages); // Show user message immediately
    setInput("");
  };

  return (
    <div className="consult-container">
      <h2>AI Consultation</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default AiConsult;