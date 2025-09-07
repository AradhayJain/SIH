import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./components/Common/topBar";
import SideBar from "./components/Common/sideBar";
import Dashboard from "./pages/DashBoard/dashboard";
import { CssBaseline, ThemeProvider, Box, useMediaQuery } from "@mui/material";
import { colorModeContext, useMode } from "./themes";
import MapPage from "./pages/MapPage/mapPage";
import Chat from "./pages/Chat/index";
import Profile from "./pages/Profile/index";
import LandingPage from "./pages/LandingPage";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          {/* Sidebar */}
          <SideBar
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            
          />

          {/* Main Content Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              transition: "margin-left 0.3s ease",
            }}
          >
            {/* Topbar */}
            <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Page Content */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: { xs: 1, sm: 2 },
              }}
            >
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Box>
          </Box>
        </Box>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
