import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../themes";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelected(title);
    navigate(to); 
    // console.log("Navigating to : ", to);
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.primary[600],
      }}
      onClick={handleClick}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SideBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        height: "100%",
        position: "sticky",
        left: 0,
        top: 0,
        zIndex: 1000,
        "& .pro-sidebar": {
          backgroundColor: `${colors.blue[400]} !important`,
          borderRight: `1px solid ${colors.blue[300]}`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '2px 0 10px 0 rgba(235, 219, 219, 0.1)' 
            : '2px 0 10px 0 rgba(0, 0, 0, 0.1)',
        },
        "& .pro-sidebar-inner": {
          height: "100% !important",
          background: `${colors.blue[400]} !important`,
          overflow: "hidden !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-menu-item": {
          color: `${colors.blue[800]} !important`,
          fontSize: "14px !important",
          fontWeight: "500 !important",
        },
        "& .pro-inner-item": {
          padding: "8px 35px 8px 20px !important",
          margin: "2px 0 !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.blue[500]} !important`,
          backgroundColor: `${theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.blue[500]} !important`,
          backgroundColor: `${theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]} !important`,
          fontweight:"600 !important"
        },
        "& .pro-sidebar.collapsed": {
          width: "80px !important",
          minWidth: "80px !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed} style = {{ height : "100%"}}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.blue[500],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '2.0rem',
                    background: `linear-gradient(135deg, ${colors.blue[600]}, ${colors.green[600]})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                    }}
                  >
                  FloatChat
                  </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ color: colors.primary[600]}}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"} paddingRight={isCollapsed ? undefined : "10%"}>
            <Item
              title="DASHBOARD"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="VIEW MAP"
              to="/map"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="AI CHAT"
              to="/chat"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="ANALYSIS PAGE"
              to="/analysis"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          <Box 
          sx = {{
            position: "absolute",
            bottom: 20,
            left: isCollapsed ? 0 : "10%",
            width: isCollapsed ? "100%" : "80%"
          }}
          >
            <Item
              title="VIEW PROFILE"
              to="/profile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> 
            </Box>
            
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SideBar;