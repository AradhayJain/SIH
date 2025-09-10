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
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  SmartToy as AiIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Header from "../../components/Common/Header";
import { tokens } from "../../themes";

const COLORS = ["#82ca9d", "#8884d8", "#ff7300", "#00C49F", "#FFBB28"];

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
    // Load messages from localStorage
    const savedMessages = localStorage.getItem(`chat_${chatId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [chatId]);
  

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    }
  }, [messages, chatId]);
  
  // Socket & localStorage setup
useEffect(() => {
  // Load saved messages first
  const savedMessages = localStorage.getItem(`chat_${chatId}`);
  if (savedMessages) setMessages(JSON.parse(savedMessages));

  // Socket connection
  socketRef.current = io("http://localhost:3000");
  socketRef.current.emit("joinChat", chatId);

  socketRef.current.on("newMessage", (message) => {
    setMessages((prev) => {
      const newMessage = {
        ...message,
        content: message.content || message.text,
        timestamp: new Date(message.timestamp),
      };
      const updatedMessages = [...prev, newMessage];

      // Save to localStorage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));

      // Stop loading if assistant responds
      if (message.sender === "assistant") setIsLoading(false);

      return updatedMessages;
    });
  });

  return () => socketRef.current.disconnect();
}, [chatId]);



  

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // Send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;
    socketRef.current.emit("sendMessage", {
      chatId,
      message: inputMessage,
      sender: "user",
      timestamp: new Date(),
    });
    setIsLoading(true);
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render table for data queries
  const renderDataTable = (data) => (
    <Paper
      elevation={4}
      sx={{
        backgroundColor: colors.primary[600],
        borderRadius: 3,
        p: 3,
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
        Data Table
      </Typography>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {Object.keys(data[0]).map((key) => (
                <TableCell
                  key={key}
                  sx={{ color: colors.grey[100], fontWeight: "bold", fontSize: "1rem" }}
                >
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {Object.values(row).map((val, i) => (
                  <TableCell key={i} sx={{ color: colors.grey[200], fontSize: "1rem" }}>
                    {typeof val === "number" ? val.toFixed(2) : val}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  // Render charts for data queries
  const renderDataCharts = (data) => {
    const keys = Object.keys(data[0]).filter((k) => k !== "month");
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 3 }}>
        {/* Line Chart */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, backgroundColor: colors.primary[600] }}>
          <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
            Line Chart
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[700]} />
                <XAxis dataKey="month" stroke={colors.grey[200]} />
                <YAxis stroke={colors.grey[200]} />
                <Tooltip />
                <Legend />
                {keys.map((k, idx) => (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Bar Chart */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, backgroundColor: colors.primary[600] }}>
          <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
            Bar Chart
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[700]} />
                <XAxis dataKey="month" stroke={colors.grey[200]} />
                <YAxis stroke={colors.grey[200]} />
                <Tooltip />
                <Legend />
                {keys.map((k, idx) => (
                  <Bar key={k} dataKey={k} fill={COLORS[idx % COLORS.length]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Pie Chart */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, backgroundColor: colors.primary[600] }}>
          <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
            Pie Chart (first month breakdown)
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={keys.map((k) => ({ name: k, value: data[0][k] }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                  dataKey="value"
                >
                  {keys.map((k, idx) => (
                    <Cell key={k} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    );
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
          position: "relative",
        }}
      >
        {/* Loading Overlay */}
        {/* Loader Overlay */}
{/* Loading Overlay */}
{isLoading && (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary[400] + "cc", // semi-transparent
      zIndex: 20,
      borderRadius: 3, // match Paper's border radius
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <CircularProgress color="inherit" />
      <Typography color={colors.grey[100]} variant="subtitle1">
        AI is typing...
      </Typography>
    </Box>
  </Box>
)}



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
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
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
                  maxWidth: "85%",
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    message.sender === "user" ? colors.blue[500] : colors.primary[600],
                  color: message.sender === "user" ? "#fff" : colors.grey[100],
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                {message.type === "DATA_QUERY" && Array.isArray(message.content) ? (
                  <>
                    {renderDataTable(message.content)}
                    {renderDataCharts(message.content)}
                  </>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                )}
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
