import { Box, Button, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../../themes";
import { mockAGRO } from "../../../data/mockData";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import WaterIcon from '@mui/icons-material/Water';
import OpacityIcon from '@mui/icons-material/Opacity';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../../components/Common/Header";
import LineChart from "../../../components/Charts/LineChart";
import GeographyChart from "../../../components/Charts/GeographyChart";
import BarChart from "../../../components/Charts/BarChart";
import StatBox from "../../../components/Charts/StatBox";
import ProgressCircle from "../../../components/Charts/ProgressCircle";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box m={{ xs: "10px", sm: "15px", md: "20px" }}>
      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        gap={isMobile ? 2 : 0}
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blue[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "8px 16px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isMobile ? "repeat(1, 1fr)" : isTablet ? "repeat(6, 1fr)" : "repeat(12, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
        mt={2}
      >
        {/* ROW 1 */}
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title="Salinity"
            subtitle="1400 ppt"
            progress="0.75"
            increase="+14%"
            icon={<WaterIcon sx={{ color: colors.green[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title="Temperature"
            subtitle="45 C"
            progress="0.50"
            increase="+21%"
            icon={<ThermostatIcon sx={{ color: colors.green[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title="Pressure"
            subtitle="200 pascal"
            progress="0.30"
            increase="+5%"
            icon={<AirIcon sx={{ color: colors.green[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title="Density"
            subtitle="Increase"
            progress="0.80"
            increase="+43%"
            icon={<OpacityIcon sx={{ color: colors.green[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 8"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box mt="25px" p={{ xs: "0 15px", sm: "0 20px", md: "0 30px" }} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                BCG parameters
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.green[500]}>
                Comparison
              </Typography>
            </Box>
            {!isMobile && (
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.green[500] }} />
              </IconButton>
            )}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard />
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Nearest AGRO
            </Typography>
          </Box>
          {mockAGRO.map((transaction, i) => (
            <Box key={`${transaction.txId}-${i}`} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
              <Box>
                <Typography color={colors.green[500]} variant="h5" fontWeight="600">
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>{transaction.user}</Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box backgroundColor={colors.green[500]} p="5px 10px" borderRadius="4px">
                {transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600">
            Satellite Data
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="20px">
            <ProgressCircle size="120" />
            <Typography variant="h5" color={colors.green[500]} sx={{ mt: "15px" }}>
              Low pressure near Indian ocean
            </Typography>
            <Typography textAlign="center">Coastline experience low pressures amid approaching Monsoon</Typography>
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "20px 20px 0 20px" }}>
            Selected Water Bodies
          </Typography>
          <Box height="250px" mt="-10px">
            <BarChart isDashboard />
          </Box>
        </Box>

        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }}>
            Map Based Tracker
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
