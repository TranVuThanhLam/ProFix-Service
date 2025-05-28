import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultImage from "../../image/default-avatar.png";

function Chat() {
  const [people, setPeople] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const navigate = useNavigate();
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  let socketUrl = "";

  if (
    window.location.hostname === "localhost" &&
    window.location.port === "3000"
  ) {
    // Đang chạy local React => WebSocket tới backend ở 8080
    socketUrl = `${protocol}://${window.location.hostname}:8080/wss`;
  } else {
    // Đang production => WebSocket theo domain hiện tại
    socketUrl = `${protocol}://${window.location.hostname}/wss`;
  }

  useEffect(() => {
    if (!user.id || !receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/chat/messages`,
          {
            params: { sender_id: user.id, receiver_id: receiverId },
            withCredentials: true,
          }
        );
        setMessages(res.data); // Lưu tin nhắn vào state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user.id, receiverId]); // Khi người dùng hoặc người nhận thay đổi, gọi API lấy tin nhắn

  const [sockets] = useState([socketUrl]);
  const [connectionStatus, setConnectionStatus] = useState("Đang kết nối...");

  useEffect(() => {
    if (!user.id) return;

    const fetchPeople = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chat/people`,
          { params: { user_id: user.id }, withCredentials: true }
        );
        setPeople(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPeople();
  }, [user.id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user.id) return;
    let socket;
    const connectWebSocket = async () => {
      setConnectionStatus("Đang kết nối...");
      const validSocketUrl = await getValidSocket(user.id);
      if (validSocketUrl) {
        socket = new WebSocket(validSocketUrl);
        setWs(socket);

        socket.onopen = () => {
          setConnectionStatus("Đã kết nối thành công!");
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("Kết nối thất bại!");
        };

        socket.onclose = () => {
          setConnectionStatus("Đã ngắt kết nối");
        };

        socket.onmessage = (event) => {
          const newMessage = JSON.parse(event.data);
          if (
            newMessage.sender_id === user.id ||
            newMessage.receiver_id === user.id
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        };
      } else {
        setConnectionStatus("Không tìm thấy server WebSocket!");
      }
    };
    connectWebSocket();
    return () => socket && socket.close();
  }, [user.id]);

  const getValidSocket = async (userID) => {
    for (let url of sockets) {
      const fullUrl = `${url}?user_id=${userID}`;
      if (await testWebSocket(fullUrl)) return fullUrl;
    }
    return null;
  };

  const testWebSocket = (url) =>
    new Promise((resolve) => {
      const socket = new WebSocket(url);
      socket.onopen = () => {
        socket.close();
        resolve(true);
      };
      socket.onerror = () => resolve(false);
    });

  const handleSendMessage = () => {
    if (input.trim() && ws) {
      const message = {
        sender_id: user.id,
        receiver_id: receiverId,
        content: input,
      };
      ws.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="vh-100 d-flex bg-light">
      {/* Sidebar */}
      <div
        className={`d-flex flex-column bg-white shadow-sm p-3 ${
          isSidebarOpen ? "col-3" : "col-1"
        } transition-all`}
      >
        <button
          className="btn btn-outline-primary mb-3 rounded-pill"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          {isSidebarOpen && <span className="ms-2">Back</span>}
        </button>
        <button
          className="btn btn-outline-secondary mb-4 rounded-pill"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>
        {isSidebarOpen && (
          <>
            <h5 className="fw-semibold text-center">People</h5>
            <div className="overflow-auto mt-3">
              {people.map((person) => (
                <div
                  key={person.id}
                  className={`d-flex align-items-center gap-3 p-2 mb-2 rounded-3 ${
                    receiverId === person.id
                      ? "bg-primary text-white"
                      : "bg-white border"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setReceiverId(person.id)}
                >
                  <img
                    src={person.image_url || defaultImage}
                    alt={person.name}
                    className="rounded-circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                  />
                  {isSidebarOpen && (
                    <div>
                      <div className="fw-semibold">{person.name}</div>
                      <small className="text-muted">
                        {person.id === user.id ? "(Bạn)" : "Đang hoạt động"}
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Chat */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">{user.name}</h6>
            <small className="text-muted">{user.email}</small>
          </div>
          <div className="d-flex flex-column">
            <span className="badge bg-success">{user.role}</span>
            <small className="text-muted">{connectionStatus}</small>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-grow-1 overflow-auto p-3 d-flex flex-column"
          style={{ background: "#f9fafb" }}
        >
          {receiverId ? (
            (() => {
              const safeMessages = Array.isArray(messages) ? messages : [];
              const filteredMessages = safeMessages.filter(
                (msg) =>
                  (msg.sender_id === user.id &&
                    msg.receiver_id === receiverId) ||
                  (msg.sender_id === receiverId && msg.receiver_id === user.id)
              );

              if (filteredMessages.length === 0) {
                return (
                  <div className="text-muted text-center mt-5">
                    <i className="bi bi-chat-left-text fs-1 mb-3 d-block text-secondary"></i>
                    <p>Chưa có tin nhắn nào giữa bạn và người này.</p>
                  </div>
                );
              }

              return filteredMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${
                    msg.sender_id === user.id
                      ? "justify-content-end"
                      : "justify-content-start"
                  } mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-4 shadow-sm ${
                      msg.sender_id === user.id
                        ? "bg-primary text-white"
                        : "bg-light border"
                    }`}
                    style={{ maxWidth: "75%", wordWrap: "break-word" }}
                  >
                    {msg.content}
                  </div>
                </div>
              ));
            })()
          ) : (
            <div className="text-center text-muted mt-5">
              <h5>👉 Vui lòng chọn người để bắt đầu chat!</h5>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white shadow-sm d-flex align-items-center">
          <input
            type="text"
            className="form-control rounded-pill me-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="btn btn-success rounded-pill"
            onClick={handleSendMessage}
          >
            <i className="bi bi-send"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
