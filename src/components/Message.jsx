// src/components/Message.js
import React from 'react';

function Message({ message, fromSelf, sender }) {
  return (
    <div
      className={`mb-3 p-4 rounded-xl max-w-[40%]  break-words
        ${fromSelf
          ? 'bg-blue-600 text-white ml-auto text-right shadow-lg hover:bg-blue-700 transition-colors duration-200'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-auto text-left shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200'}`}
      style={{ wordBreak: 'break-word' }}
    >
      <strong className="block mb-2 text-sm opacity-75">
        {fromSelf ? 'Me' : sender}:
      </strong>
      <span className="text-base leading-relaxed">{message}</span>
    </div>
  );
}

export default Message;
