import { createSlice } from '@reduxjs/toolkit';

const saveChats = (username, conversations) => {
  if (!username) return;
  localStorage.setItem(`chats_of_${username}`, JSON.stringify(conversations));
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: {}, // format: { [participantUsername]: { messages: [], isPinned: false, isArchived: false, unreadCount: 0 } }
    activeConversation: null, // participant username
    searchQuery: '',
  },
  reducers: {
    loadUserChats: (state, action) => {
      const username = action.payload;
      if (username) {
        const data = localStorage.getItem(`chats_of_${username}`);
        state.conversations = data ? JSON.parse(data) : {};
      } else {
        state.conversations = {};
      }
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      // Mark as read immediately when switching
      if (action.payload && state.conversations[action.payload]) {
        state.conversations[action.payload].unreadCount = 0;
        state.conversations[action.payload].messages.forEach((msg) => {
          if (msg.sender !== action.payload) {
            msg.read = true;
          }
        });
      }
    },
    createConversation: (state, action) => {
      const { participant, currentUser, recipient } = action.payload;
      if (!state.conversations[participant]) {
        state.conversations[participant] = {
          messages: [],
          isPinned: false,
          isArchived: false,
          unreadCount: 0,
          recipient: recipient || { username: participant }
        };
        saveChats(currentUser, state.conversations);
      }
    },
    deleteConversation: (state, action) => {
      const { participant, currentUser } = action.payload;
      if (state.conversations[participant]) {
        delete state.conversations[participant];
        if (state.activeConversation === participant) {
          state.activeConversation = null;
        }
        saveChats(currentUser, state.conversations);
      }
    },
    pinConversation: (state, action) => {
      const { participant, currentUser } = action.payload;
      if (state.conversations[participant]) {
        state.conversations[participant].isPinned = !state.conversations[participant].isPinned;
        saveChats(currentUser, state.conversations);
      }
    },
    archiveConversation: (state, action) => {
      const { participant, currentUser } = action.payload;
      if (state.conversations[participant]) {
        state.conversations[participant].isArchived = !state.conversations[participant].isArchived;
        saveChats(currentUser, state.conversations);
      }
    },
    clearChat: (state, action) => {
      const { participant, currentUser } = action.payload;
      if (state.conversations[participant]) {
        state.conversations[participant].messages = [];
        saveChats(currentUser, state.conversations);
      }
    },
    addMessage: (state, action) => {
      const { message, currentUser } = action.payload;
      const targetUser = message.sender === currentUser ? message.receiver : message.sender;
      
      if (!targetUser) return;
      
      if (!state.conversations[targetUser]) {
        state.conversations[targetUser] = {
          messages: [],
          isPinned: false,
          isArchived: false,
          unreadCount: 0
        };
      }
      
      const conv = state.conversations[targetUser];
      
      // Prevent duplicates if already added locally
      const exists = conv.messages.some((m) => m.id === message.id);
      if (!exists) {
        conv.messages.push(message);
        
        // Handle unread counts
        if (message.sender !== currentUser && state.activeConversation !== targetUser) {
          conv.unreadCount += 1;
        }
      }
      
      saveChats(currentUser, state.conversations);
    },
    editMessage: (state, action) => {
      const { messageId, newContent, participant, currentUser } = action.payload;
      const conv = state.conversations[participant];
      if (conv) {
        const msg = conv.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.message = newContent;
          msg.edited = true;
          saveChats(currentUser, state.conversations);
        }
      }
    },
    deleteMessage: (state, action) => {
      const { messageId, participant, currentUser } = action.payload;
      const conv = state.conversations[participant];
      if (conv) {
        const msg = conv.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.deleted = true;
          msg.message = "This message was deleted";
          saveChats(currentUser, state.conversations);
        }
      }
    },
    toggleReaction: (state, action) => {
      const { messageId, emoji, username, participant, currentUser } = action.payload;
      const conv = state.conversations[participant];
      if (conv) {
        const msg = conv.messages.find((m) => m.id === messageId);
        if (msg) {
          if (!msg.reactions) msg.reactions = {};
          if (msg.reactions[username] === emoji) {
            delete msg.reactions[username]; // Remove if toggled same
          } else {
            msg.reactions[username] = emoji; // Add/change reaction
          }
          saveChats(currentUser, state.conversations);
        }
      }
    },
    markAsRead: (state, action) => {
      const { participant, currentUser, fromSelf = true } = action.payload;
      const conv = state.conversations[participant];
      if (conv) {
        if (fromSelf) {
          conv.unreadCount = 0;
        }
        conv.messages.forEach((msg) => {
          if (fromSelf) {
            if (msg.sender === participant) {
              msg.read = true;
            }
          } else {
            if (msg.sender !== participant) {
              msg.read = true;
            }
          }
        });
        saveChats(currentUser, state.conversations);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    }
  },
});

export const {
  loadUserChats,
  setActiveConversation,
  createConversation,
  deleteConversation,
  pinConversation,
  archiveConversation,
  clearChat,
  addMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  markAsRead,
  setSearchQuery,
  setConversations
} = chatSlice.actions;

export default chatSlice.reducer;