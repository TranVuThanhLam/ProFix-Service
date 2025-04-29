import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
                  className={`d-flex align-items-center p-2 mb-2 rounded ${
                    receiverId === person.id
                      ? "bg-primary text-white fw-bold"
                      : "bg-light"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setReceiverId(person.id)}
                >
                  <div
                    className="bg-success rounded-circle me-3"
                    style={{ width: "10px", height: "10px" }}
                  ></div>
                  {person.name}
                  {person.id == user.id ? " (me) " : ""}
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
            messages
              .filter(
                (msg) =>
                  (msg.sender_id === user.id &&
                    msg.receiver_id === receiverId) ||
                  (msg.sender_id === receiverId && msg.receiver_id === user.id)
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={`py-2 px-3 mb-2 rounded-pill shadow-sm w-auto ${
                    msg.sender_id === user.id
                      ? "bg-primary text-white align-self-end"
                      : "bg-secondary text-white align-self-start"
                  }`}
                >
                  {msg.content}
                </div>
              ))
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
