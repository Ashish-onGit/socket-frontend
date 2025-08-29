// src/components/Chat.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Message from './Message';

function Chat({ message, setMessage, sendMessage, onLogout }) {
  const username = useSelector((state) => state.auth.user?.username);
  const chat = useSelector((state) => state.chat.messages);

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Welcome, {username}</h2>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow-inner max-h-[60vh]">
        {chat.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No messages yet</p>
        ) : (
          chat.map((msg, idx) => (
            <Message
              key={idx}
              message={msg.message}
              fromSelf={msg.fromSelf}
              sender={msg.sender || 'Unknown'}
            />
          ))
        )}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-grow p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
