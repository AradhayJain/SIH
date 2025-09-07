import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Common/topBar";
import SideBar from "./components/Common/sideBar";
import Dashboard from "./pages/DashBoard/dashboard";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { colorModeContext, useMode } from "./themes";
import MapPage from "./pages/MapPage/mapPage";
import Chat from "./pages/Chat/index";
import Profile from "./pages/Profile/index";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden"}}>
          <SideBar isSidebar={isSidebar} />
          <Box
            component="main" 
            className="content"
            sx={{ 
              flexGrow: 1, 
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginLeft: isSidebar ? "250px" : "0px", 
              transition: "margin-left 0.3s ease", 
            }}
          >
            <Topbar setIsSidebar={setIsSidebar} />
            <Box sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 2,
              }}>
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
