// src/components/NewsNotifications.jsx
import React, { useEffect, useState } from "react";
import socket from "./socket";


const NewsNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for new movie news
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO");
    });

    socket.on("new-movie-news", (data) => {
      console.log("📢 New movie news received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("new-movie-news");
    };
  }, []);

  return (
    <div>
      <h2>🔔 Live Movie News</h2>
      {notifications.length === 0 ? (
        <p>No news yet.</p>
      ) : (
        <ul>
          {notifications.map((news, index) => (
            <li key={index}>
              <strong>{news.title}</strong>: {news.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsNotifications;
