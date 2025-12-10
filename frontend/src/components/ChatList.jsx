import React, { useEffect, useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import Conversation from "./Conversation";
import "../styles/ChatList.css";
import { ACCESS_TOKEN } from "../token";

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
          const decodedToken = jwtDecode(token);
          setCurrentUserId(decodedToken.user_id);
        }

        const userResponse = await api.get("users/");
        setUsers(userResponse.data);

        const conversationResponse = await api.get("conversations/");
        setConversations(conversationResponse.data);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  const handleStartConversation = async () => {
    if (selectedUser && currentUserId) {
      const participants = [selectedUser, currentUserId];
      try {
        const response = await api.post("conversations/", { participants });
        setConversations([...conversations, response.data]);
        setActiveConversation(response.data);
        setErrorMessage("");
      } catch (error) {
        if (error.response?.data?.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleBackToChatList = () => {
    setActiveConversation(null);
  };

  return (
    <div className="chat-list-container">
      {/* Sidebar - Always visible */}
      <div className="chat-sidebar">
        <header className="chat-header">
          <h1>Welcome to ChitChat</h1>
          <p>Connect with your friends instantly!</p>
        </header>

        <div className="user-selector">
          <select 
            onChange={(e) => setSelectedUser(e.target.value)} 
            value={selectedUser || ""}
            className="user-select"
          >
            <option value="" disabled>
              Select a user to chat with
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <button 
            className="start-chat-btn"
            onClick={handleStartConversation}
            disabled={!selectedUser}
          >
            Start Conversation
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <div className="conversation-list">
          <h2>Active Conversations</h2>
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet.</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  activeConversation?.id === conversation.id ? "active" : ""
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="conversation-preview">
                  <span className="participant-names">
                    {conversation.participants
                      .filter((user) => user.id !== currentUserId)
                      .map((user) => user.username)
                      .join(", ")}
                  </span>
                  <span className="unread-badge">3</span> {/* Optional: unread count */}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <p className="current-user">
            Logged in as: <strong>User {currentUserId}</strong>
          </p>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem(ACCESS_TOKEN);
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="conversation-view">
        {activeConversation ? (
          <Conversation
            conversationId={activeConversation.id}
            currentUserId={currentUserId}
            onBack={handleBackToChatList}
          />
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h2>👋 Welcome to ChitChat!</h2>
              <p>
                Select a conversation from the sidebar or start a new chat by choosing a user.
              </p>
              <div className="welcome-features">
                <div className="feature">
                  <span>💬</span>
                  <h3>Real-time Messaging</h3>
                  <p>Send and receive messages instantly with WebSocket.</p>
                </div>
                <div className="feature">
                  <span>👁️</span>
                  <h3>Online Status</h3>
                  <p>See who's online in your conversations.</p>
                </div>
                <div className="feature">
                  <span>⌨️</span>
                  <h3>Typing Indicators</h3>
                  <p>Know when someone is typing.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;