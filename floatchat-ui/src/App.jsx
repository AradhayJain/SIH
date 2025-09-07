import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Common/topBar";
import SideBar from "./components/Common/sideBar";
import Dashboard from "./pages/DashBoard/dashboard";
import { CssBaseline, ThemeProvider, Box, useMediaQuery } from "@mui/material";
import { colorModeContext, useMode } from "./themes";
import MapPage from "./pages/MapPage/mapPage";
import Chat from "./pages/Chat/index";
import Profile from "./pages/Profile/index";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100vh" }}>
          {/* Sidebar */}
          <SideBar
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            variant={isMobile ? "temporary" : "permanent"}
          />

          {/* Main Content Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              ml: isMobile ? 0 : (isSidebarOpen ? "250px" : "0px"), // push only on desktop
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
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
