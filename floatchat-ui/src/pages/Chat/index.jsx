import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Avatar,
  useTheme 
} from "@mui/material";
import { 
  Send as SendIcon, 
  SmartToy as AiIcon,
  Person as UserIcon 
} from "@mui/icons-material";
import Header from "../../components/Common/Header";
import { tokens } from "../../themes";

const Chat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatId = "64f3f5f6c9a5d2e5b7e12345"; // example Mongo ObjectId

  // Socket setup
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.emit("joinChat", chatId);

    socketRef.current.on("newMessage", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          content: message.content || message.text,
          timestamp: new Date(message.timestamp),
        },
      ]);
      setIsLoading(false);
    });

    return () => socketRef.current.disconnect();
  }, [chatId]);

  // Auto-scroll
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // Send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;
    setIsLoading(true);
    socketRef.current.emit("sendMessage", {
      chatId,
      message: inputMessage,
      sender: "user",
      timestamp: new Date(),
    });
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     sender: "user",
    //     content: inputMessage,
    //     timestamp: new Date(),
    //   },
    // ]);
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box m="20px">
      <Header title="AI CHAT" subtitle="Chat with our AI assistant" />

      <Paper
        elevation={3}
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.primary[400],
          border: `1px solid ${colors.grey[700]}`,
        }}
      >
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.length === 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              color={colors.grey[400]}
            >
              <AiIcon sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" textAlign="center">
                Welcome to AI Chat!
              </Typography>
              <Typography textAlign="center">
                Ask me anything and I'll help you.
              </Typography>
            </Box>
          )}

          {messages.map((message, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                gap: 1,
              }}
            >
              {message.sender !== "user" && (
                <Avatar sx={{ bgcolor: colors.blue[500], width: 32, height: 32 }}>
                  <AiIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}

              <Box
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    message.sender === "user"
                      ? colors.blue[500]
                      : colors.primary[600],
                  color: message.sender === "user" ? "#fff" : colors.grey[100],
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  "& p": { margin: 0, fontSize: "1.05rem" },
                  "& pre": {
                    background: colors.grey[900],
                    padding: "10px",
                    borderRadius: "6px",
                    overflowX: "auto",
                    fontSize: "0.95rem",
                  },
                  "& code": {
                    fontFamily: "monospace",
                    background: colors.grey[800],
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontSize: "0.95rem",
                  },
                  "& a": {
                    color: colors.blue[400],
                    textDecoration: "underline",
                    fontSize: "1.05rem",
                  },
                  "& li": { fontSize: "1.05rem" },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    color:
                      message.sender === "user"
                        ? "rgba(255,255,255,0.7)"
                        : colors.grey[400],
                    mt: 1,
                    fontSize: "0.8rem",
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>

              {message.sender === "user" && (
                <Avatar sx={{ bgcolor: colors.green[500], width: 32, height: 32 }}>
                  <UserIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
            </Box>
          ))}

          {/* Loader */}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
              <Avatar sx={{ bgcolor: colors.blue[500], width: 32, height: 32 }}>
                <AiIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: colors.primary[600],
                }}
              >
                <Typography variant="body1">
                  <Box
                    component="span"
                    sx={{ animation: "pulse 1.5s infinite" }}
                  >
                    ●
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      animation: "pulse 1.5s infinite",
                      animationDelay: "0.2s",
                      ml: 0.5,
                    }}
                  >
                    ●
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      animation: "pulse 1.5s infinite",
                      animationDelay: "0.4s",
                      ml: 0.5,
                    }}
                  >
                    ●
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${colors.grey[700]}`,
            backgroundColor: colors.primary[500],
          }}
        >
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.primary[400],
                  color: colors.grey[100],
                  "& fieldset": { borderColor: colors.grey[600] },
                  "&:hover fieldset": { borderColor: colors.blue[500] },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                backgroundColor: colors.blue[500],
                color: "#fff",
                "&:hover": { backgroundColor: colors.blue[600] },
                "&:disabled": { backgroundColor: colors.grey[600] },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;
