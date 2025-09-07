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
        color: selected === title ? colors.blue[500] : colors.blue[theme.palette.mode === 'dark' ? colors.blue[500] : colors.blue[500]],
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
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        "& .pro-sidebar": {
          backgroundColor: `${theme.palette.background.default} !important`,
        },
        "& .pro-sidebar-inner": {
          height: "100% !important",
          background: `${theme.palette.background.default} !important`,
          overflow: "hidden !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          color: `${theme.palette.mode === 'dark' ? colors.blue[500] : colors.blue[500]} !important`,
        },
        "& .pro-menu-item": {
          color: `${theme.palette.mode === 'dark' ? colors.blue[500] : colors.blue[500]} !important`,
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: `${theme.palette.mode === 'dark' ? colors.blue[500] : colors.blue[500]} !important`,
        },
        "& .pro-inner-item:hover": {
          color: `${colors.blue[500]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.blue[500]} !important`,
          backgroundColor: `${theme.palette.mode === 'dark' ? colors.blue[500] : colors.blue[500]} !important`,
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
                <Typography variant="h3" color={colors.blue[500]}>
                  FLOATCHAT
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ color: colors.grey[700]}}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
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
          </Box>

          <Box 
          sx = {{
            position: "absolute",
            bottom: 20,
            left: isCollapsed ? 0 : "10%",
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