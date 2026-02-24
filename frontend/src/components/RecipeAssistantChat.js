import React, { useState, useRef, useEffect } from 'react';

function RecipeAssistantChat({ recipeName }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: `Hi! I'm your cooking assistant for **${recipeName}**. Ask me anything about ingredients, substitutions, cooking techniques, or tips!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll after initial mount when new messages are added
    if (!isInitialMount) {
      scrollToBottom();
    } else {
      setIsInitialMount(false);
    }
  }, [messages, isInitialMount]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      // Call backend endpoint for cooking assistance
      const response = await fetch('/cooking-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input, 
          recipe: recipeName 
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `Sorry, I couldn't generate a response. Try asking about cooking techniques, ingredient substitutions, or tips for ${recipeName}!` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-assistant-chat">
      <div className="chat-header">
        <span className="chat-icon">🤖</span>
        <h3>Cooking Assistant</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.type}`}>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="message-content">
              <span className="typing-indicator">
                <span></span><span></span><span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about ingredients, substitutions..."
          className="chat-input"
          disabled={loading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={loading || input.trim() === ''}
          className="chat-send-btn"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
}

export default RecipeAssistantChat;
