import { useState, useRef, useEffect } from "react";
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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: `This is a simulated response from the AI backend.`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
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
        {/* Messages Container */}
        <Box 
          sx={{ 
            flex: 1, 
            overflowY: "auto", 
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {messages.length === 0 ? (
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
                Ask me anything and I'll do my best to help you.
              </Typography>
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {message.sender === "ai" && (
                  <Avatar sx={{ bgcolor: colors.blue[500], width: 32, height: 32 }}>
                    <AiIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
                
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: message.sender === "user" 
                      ? colors.blue[500] 
                      : colors.primary[600],
                    color: message.sender === "user" ? "#fff" : colors.grey[100],
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: "block", 
                      textAlign: "right",
                      color: message.sender === "user" ? "rgba(255,255,255,0.7)" : colors.grey[400],
                      mt: 1
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>

                {message.sender === "user" && (
                  <Avatar sx={{ bgcolor: colors.green[500], width: 32, height: 32 }}>
                    <UserIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
              </Box>
            ))
          )}
          
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
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
                  <Box component="span" sx={{ animation: "pulse 1.5s infinite" }}>
                    ●
                  </Box>
                  <Box component="span" sx={{ animation: "pulse 1.5s infinite", animationDelay: "0.2s", ml: 0.5 }}>
                    ●
                  </Box>
                  <Box component="span" sx={{ animation: "pulse 1.5s infinite", animationDelay: "0.4s", ml: 0.5 }}>
                    ●
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Container */}
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
                  "& fieldset": {
                    borderColor: colors.grey[600],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.blue[500],
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                backgroundColor: colors.blue[500],
                color: "#fff",
                "&:hover": {
                  backgroundColor: colors.blue[600],
                },
                "&:disabled": {
                  backgroundColor: colors.grey[600],
                },
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