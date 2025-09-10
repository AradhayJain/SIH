import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, useTheme, ThemeProvider, createTheme, Paper, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WavesIcon from '@mui/icons-material/Waves';
import SpeedIcon from '@mui/icons-material/Speed';
import PublicIcon from '@mui/icons-material/Public';

// --- THEME AND COLORS ---
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: { 100: "#e0e0e0", 200: "#c2c2c2", 300: "#a3a3a3" },
        primary: { 400: "#1F2A40", 500: "#141b2d" },
        greenAccent: { 400: "#4cceac", 500: "#3da58a" },
        redAccent: { 500: "#f25767" },
        blueAccent: { 500: "#2196f3" }
      }
    : {
        grey: { 100: "#141414", 300: "#525252" },
        primary: { 400: "#f5f5f5", 500: "#ffffff" },
        greenAccent: { 400: "#007B55", 500: "#00694a" },
        redAccent: { 500: "#d32f2f" },
        blueAccent: { 500: "#0d47a1" }
      }),
});

// --- MOCK OCEANOGRAPHIC DATA ---
const mockOceanData = [
  { id: "Bay of Bengal", lat: 15.0, lon: 90.0, temp: 29.1, pressure: 1010, salinity: 33.5 },
  { id: "Arabian Sea", lat: 18.0, lon: 65.0, temp: 28.5, pressure: 1012, salinity: 36.2 },
  { id: "Madagascar Coast", lat: -20.0, lon: 50.0, temp: 26.8, pressure: 1015, salinity: 35.1 },
  { id: "Sumatra Coast", lat: -8.0, lon: 100.0, temp: 29.5, pressure: 1009, salinity: 34.0 },
  { id: "Equatorial Point", lat: 0.0, lon: 80.0, temp: 28.9, pressure: 1011, salinity: 34.8 },
  { id: "Maldives Area", lat: 5.0, lon: 73.0, temp: 29.2, pressure: 1010, salinity: 34.6 },
];

// --- DYNAMIC SCRIPT LOADER ---
const loadScript = (src, callback) => {
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => callback && callback();
    document.body.appendChild(script);
  } else if (callback) {
    callback();
  }
};

// --- COMPONENTS ---

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" sx={{ mb: "5px" }}>
        {title}
      </Typography>
      <Typography variant="h6" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

const InformationPanel = ({ point, colors }) => {
    if (!point) {
        return (
            <Box textAlign="center" p={3}>
                <PublicIcon sx={{ fontSize: 48, color: colors.grey[300] }} />
                <Typography variant="h6" color={colors.grey[300]} mt={1}>
                    Click a data point on the map to view details
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[400]} gutterBottom>
                {point.id}
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemIcon><ThermostatIcon sx={{ color: colors.blueAccent[500] }} /></ListItemIcon>
                    <ListItemText primary="Temperature" secondary={`${point.temp}°C`} />
                </ListItem>
                <ListItem>
                    <ListItemIcon><SpeedIcon sx={{ color: colors.blueAccent[500] }} /></ListItemIcon>
                    <ListItemText primary="Pressure" secondary={`${point.pressure} hPa`} />
                </ListItem>
                <ListItem>
                    <ListItemIcon><WavesIcon sx={{ color: colors.blueAccent[500] }} /></ListItemIcon>
                    <ListItemText primary="Salinity" secondary={`${point.salinity} PSU`} />
                </ListItem>
            </List>
        </Box>
    );
};

const GeographyChart = ({ data = [], onPointSelect, selectedPoint }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [worldAtlas, setWorldAtlas] = useState(null);

  useEffect(() => {
    loadScript("https://d3js.org/d3.v7.min.js", () => {
        loadScript("https://unpkg.com/topojson-client@3", () => {
            d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
              .then(atlas => {
                  setWorldAtlas(topojson.feature(atlas, atlas.objects.countries));
                  setLoading(false);
              })
              .catch(error => {
                  console.error("Error loading world atlas:", error);
                  setLoading(false);
              });
        });
    });
  }, []);

  useEffect(() => {
    if (!loading && worldAtlas && wrapperRef.current) {
        const { width, height } = wrapperRef.current.getBoundingClientRect();
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const projection = d3.geoMercator().center([80, 5]).scale(width / 2.2).translate([width / 2, height / 2]);
        const path = d3.geoPath().projection(projection);

        // Draw map with hover effect
        svg.append("g")
            .selectAll("path")
            .data(worldAtlas.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", colors.primary[400])
            .attr("stroke", colors.grey[100])
            .attr("stroke-width", 0.5)
            .style("transition", "fill 0.2s ease-in-out")
            .on("mouseover", function() { d3.select(this).attr("fill", colors.greenAccent[500]); })
            .on("mouseout", function() { d3.select(this).attr("fill", colors.primary[400]); });

        const tooltip = d3.select(tooltipRef.current);

        // Draw markers
        const markers = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1])
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer")
            .on("click", (event, d) => onPointSelect(d))
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1).html(`<strong>${d.id}</strong>`);
            })
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));

        // Update marker styles based on selection
        markers
            .transition().duration(300)
            .attr("r", d => (selectedPoint && selectedPoint.id === d.id) ? 10 : 6)
            .attr("fill", d => (selectedPoint && selectedPoint.id === d.id) ? colors.blueAccent[500] : colors.redAccent[500]);
    }
  }, [loading, worldAtlas, data, colors, selectedPoint, onPointSelect]);

  return (
     <Box ref={wrapperRef} sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading && <CircularProgress color="success" />}
        <svg ref={svgRef} width="100%" height="100%" style={{ display: loading ? 'none' : 'block' }}></svg>
        <div ref={tooltipRef} style={{
            opacity: 0, position: 'absolute', padding: '8px 12px', background: 'rgba(0,0,0,0.7)', color: 'white',
            borderRadius: '4px', pointerEvents: 'none', transition: 'opacity 0.2s', fontSize: '12px',
        }}></div>
     </Box>
  );
};

const MapPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  const handlePointSelect = (point) => {
      setSelectedPoint(point);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Box width="100%" maxWidth="1400px">
            <Header title="Oceanographic Dashboard" subtitle="Interactive Indian Ocean Data Map" />
            <Paper elevation={3} sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' },
                gap: '2px',
                bgcolor: colors.primary[400],
                overflow: 'hidden',
                borderRadius: '8px',
            }}>
                <Box height={{ xs: "60vh", md: "75vh" }} sx={{ bgcolor: theme.palette.background.default, p:1 }}>
                    <GeographyChart data={mockOceanData} onPointSelect={handlePointSelect} selectedPoint={selectedPoint} />
                </Box>
                <Box sx={{ bgcolor: colors.primary[400], borderLeft: { md: `1px solid ${colors.grey[300]}` }, display: 'flex', alignItems: 'center' }}>
                    <InformationPanel point={selectedPoint} colors={colors} />
                </Box>
            </Paper>
        </Box>
    </Box>
  );
};

export default MapPage;

