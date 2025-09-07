import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Dialog,
  TextField,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Waves as WavesIcon,
  Insights as ActivityIcon,
  BarChart as BarChartIcon,
  Storage as DatabaseIcon,
  Map as MapIcon,
  TrendingUp as TrendingUpIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { tokens } from "../../themes";

const LandingPage = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);

  const handleAuthTabChange = (event, newValue) => {
    setAuthTab(newValue);
  };

  const features = [
    {
      icon: <ActivityIcon sx={{ fontSize: 40 }} />,
      title: "Real-time Monitoring",
      description: "Track ARGO float positions, temperature, salinity, and BGC parameters in real-time across global oceans",
      items: ["Live float tracking", "Parameter monitoring", "Ocean condition alerts"]
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      title: "AI Predictions",
      description: "Leverage machine learning models to predict ocean conditions and identify patterns in marine data",
      items: ["Predictive modeling", "Anomaly detection", "Trend analysis"]
    },
    {
      icon: <DatabaseIcon sx={{ fontSize: 40 }} />,
      title: "Historical Data",
      description: "Access comprehensive historical oceanographic datasets with advanced querying and visualization tools",
      items: ["Multi-year datasets", "Custom visualizations", "Comparative analysis"]
    }
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0c4a6e 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #bae6fd 100%)'
    }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `2px solid ${theme.palette.mode === 'dark' ? colors.blue[700] : colors.blue[200]}`,
          py: 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WavesIcon sx={{ color: colors.blue[500], fontSize: 40 }} />
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  background: `linear-gradient(135deg, ${colors.blue[600]}, ${colors.green[600]})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                FloatChat
              </Typography>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              <Button color="inherit" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>Features</Button>
              <Button color="inherit" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>About</Button>
              <Button color="inherit" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>Contact</Button>
            </Box>

            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: colors.blue[700],
                fontSize: '1.1rem',
                padding: '12px 24px',
                fontWeight: 600,
                '&:hover': { backgroundColor: colors.blue[800] }
              }}
              onClick={() => setIsAuthOpen(true)}
            >
              Get Started
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: 20, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 1000, mx: 'auto' }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' },
                lineHeight: 1.1,
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(135deg, ${colors.grey[100]}, ${colors.blue[200]}, ${colors.green[200]})`
                  : `linear-gradient(135deg, ${colors.grey[900]}, ${colors.blue[800]}, ${colors.green[800]})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 4
              }}
            >
              Ocean Intelligence
              <br />
              <Box component="span" sx={{ 
                background: `linear-gradient(135deg, ${colors.blue[600]}, ${colors.green[600]})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Platform
              </Box>
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600],
                mb: 8,
                lineHeight: 1.6,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                fontWeight: 400
              }}
            >
              Real-time marine data analytics powered by AI for ARGO float data exploration and visualization
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  backgroundColor: colors.blue[700],
                  fontSize: '1.2rem',
                  padding: '16px 32px',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: colors.blue[800] },
                  minWidth: '200px'
                }}
                onClick={() => setIsAuthOpen(true)}
              >
                Start Exploring Data
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  border: '2px solid',
                  borderColor: colors.blue[300],
                  color: colors.blue[200],
                  fontSize: '1.2rem',
                  padding: '16px 32px',
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: colors.blue[200],
                    backgroundColor: colors.blue[50]
                  },
                  minWidth: '200px'
                }}
              >
                View Demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 20, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 15 }}>
            <Typography variant="h1" component="h2" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 3 }}>
              Powerful Marine Analytics
            </Typography>
            <Typography variant="h4" sx={{ 
              color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600],
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              fontWeight: 400
            }}>
              Unlock insights from oceanographic data with our comprehensive suite of analysis tools
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 6 }}>
            {features.map((feature, index) => (
              <Card key={index} sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${theme.palette.mode === 'dark' ? colors.blue[700] : colors.blue[200]}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                borderRadius: 3,
                p: 3,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[10]
                }
              }}>
                <CardHeader
                  avatar={
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      background: `linear-gradient(135deg, ${colors.blue[500]}, ${colors.green[500]})`,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {feature.icon}
                    </Box>
                  }
                  title={
                    <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', fontSize: '1.8rem', mb: 2 }}>
                      {feature.title}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600], fontSize: '1.1rem', lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <List>
                    {feature.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 50 }}>
                          <MapIcon sx={{ color: colors.blue[500], fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                              {item}
                            </Typography>
                          } 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 20, 
        background: `linear-gradient(135deg, ${colors.blue[600]}, ${colors.green[600]}, ${colors.blue[700]})`,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="xl">
          <Typography variant="h1" component="h2" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 4 }}>
            Ready to Dive Into Ocean Data?
          </Typography>
          <Typography variant="h3" sx={{ 
            mb: 8, 
            opacity: 0.9, 
            fontSize: { xs: '1.3rem', md: '1.8rem' },
            fontWeight: 400
          }}>
            Join researchers and marine scientists using FloatChat to unlock insights from the world's oceans
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              backgroundColor: 'white',
              color: colors.blue[600],
              fontSize: '1.3rem',
              padding: '20px 40px',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': { 
                backgroundColor: colors.blue[50],
                transform: 'scale(1.05)'
              },
              minWidth: '250px'
            }}
            onClick={() => setIsAuthOpen(true)}
          >
            Start Your Analysis
          </Button>
        </Container>
      </Box>

      {/* Auth Dialog */}
      <Dialog 
        open={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            color: '#000000',
          }
        }}
      >
        <Box sx={{ p: 5 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: '#000000',
            paddingLeft: "100px"
          }}>
            Welcome to FloatChat
          </Typography>
          <Typography variant="h5" sx={{ 
            mb: 4,
            color: '#666666',
            paddingLeft: "115px"
          }}>
            Access your marine analytics dashboard
          </Typography>

          <Tabs value={authTab} onChange={handleAuthTabChange} sx={{ mb: 4 }}>
            <Tab label="Login" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#000000' }} />
            <Tab label="Register" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#000000' }} />
          </Tabs>

          {authTab === 0 && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Email" 
                type="email" 
                fullWidth 
                size="medium"
                InputProps={{ 
                  sx: { 
                    fontSize: '1.1rem', 
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    '& input': {
                      color: '#000000 !important',
                    }
                  } 
                }}
                InputLabelProps={{ 
                  sx: { 
                    fontSize: '1.1rem',
                    color: '#666666',
                    '&.Mui-focused': {
                      color: colors.blue[700],
                    }
                  } 
                }}
              />
              <TextField 
                label="Password" 
                type="password" 
                fullWidth 
                size="medium"
                InputProps={{ 
                  sx: { 
                    fontSize: '1.1rem', 
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    '& input': {
                      color: '#000000 !important',
                    }
                  } 
                }}
                InputLabelProps={{ 
                  sx: { 
                    fontSize: '1.1rem',
                    color: '#666666',
                    '&.Mui-focused': {
                      color: colors.blue[700],
                    }
                  } 
                }}
              />
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  backgroundColor: colors.blue[700],
                  fontSize: '1.1rem',
                  padding: '14px',
                  fontWeight: 600
                }}
                onClick={() => setIsAuthenticated(true)}
              >
                Sign In
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                startIcon={<GoogleIcon />}
                sx={{ 
                  fontSize: '1.1rem',
                  padding: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  borderColor: '#cccccc',
                  '&:hover': {
                    borderColor: '#000000',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Continue with Google
              </Button>
            </Box>
          )}

          {authTab === 1 && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Email" 
                type="email" 
                fullWidth 
                size="medium"
                InputProps={{ 
                  sx: { 
                    fontSize: '1.1rem', 
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    '& input': {
                      color: '#000000 !important',
                    }
                  } 
                }}
                InputLabelProps={{ 
                  sx: { 
                    fontSize: '1.1rem',
                    color: '#666666',
                    '&.Mui-focused': {
                      color: colors.blue[700],
                    }
                  } 
                }}
              />
              <TextField 
                label="Password" 
                type="password" 
                fullWidth 
                size="medium"
                InputProps={{ 
                  sx: { 
                    fontSize: '1.1rem', 
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    '& input': {
                      color: '#000000 !important',
                    }
                  } 
                }}
                InputLabelProps={{ 
                  sx: { 
                    fontSize: '1.1rem',
                    color: '#666666',
                    '&.Mui-focused': {
                      color: colors.blue[700],
                    }
                  } 
                }}
              />
              <TextField 
                label="Confirm Password" 
                type="password" 
                fullWidth 
                size="medium"
                InputProps={{ 
                  sx: { 
                    fontSize: '1.1rem', 
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    '& input': {
                      color: '#000000 !important',
                    }
                  } 
                }}
                InputLabelProps={{ 
                  sx: { 
                    fontSize: '1.1rem',
                    color: '#666666',
                    '&.Mui-focused': {
                      color: colors.blue[700],
                    }
                  } 
                }}
              />
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  backgroundColor: colors.blue[700],
                  fontSize: '1.1rem',
                  padding: '14px',
                  fontWeight: 600
                }}
                onClick={() => setIsAuthenticated(true)}
              >
                Create Account
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                startIcon={<GoogleIcon />}
                sx={{ 
                  fontSize: '1.1rem',
                  padding: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  borderColor: '#cccccc',
                  '&:hover': {
                    borderColor: '#000000',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Continue with Google
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default LandingPage;