import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Paper,
  Grid,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CameraAlt as CameraIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Header from "../../components/Common/Header";
import { tokens } from "../../themes";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Aashu",
    lastName: "Goswami",
    email: "Aashu@gmail.com",
    phone: "+91 1234567890",
    position: "Software Developer",
    department: "Engineering",
    location: "New Delhi",
    bio: "Building something",
  });

  const [originalData, setOriginalData] = useState({ ...profileData });

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    // For API calling
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    // await updateProfile(profileData);
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const handleChange = (field) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Upload photo
      console.log("Uploading image:", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        // setProfileData(prev => ({...prev, avatar: e.target.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box m="20px">
      <Header title="PROFILE" subtitle="Manage your profile information" />

      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: colors.primary[400],
          border: `1px solid ${colors.grey[700]}`,
        }}
      >
        {/* Header with Edit/Save buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
            Profile Information
          </Typography>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: colors.blue[500],
                "&:hover": { backgroundColor: colors.blue[600] },
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  backgroundColor: colors.green[500],
                  "&:hover": { backgroundColor: colors.green[600] },
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderColor: colors.grey[600],
                  color: colors.grey[100],
                  "&:hover": { borderColor: colors.grey[500] },
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container marginLeft={10} spacing={25}>
          {/* Left Column - Avatar and Basic Info */}
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Box position="relative">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: colors.blue[500],
                    fontSize: "3rem",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                {isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: colors.blue[500],
                      "&:hover": { backgroundColor: colors.blue[600] },
                    }}
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                )}
              </Box>

              <Box textAlign="center">
                <Typography variant="h3" fontWeight="600" color={colors.grey[100]}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography color={colors.green[400]}>
                  {profileData.position}
                </Typography>
                <Typography color={colors.grey[400]}>
                  {profileData.department}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Editable Fields */}
          <Grid item xs={12} md={8}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="h4" color={colors.grey[100]}>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={handleChange("firstName")}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: colors.grey[100],
                      },
                      "& .MuiInputLabel-root": {
                        color: colors.grey[400],
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={handleChange("lastName")}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: colors.grey[100],
                      },
                      "& .MuiInputLabel-root": {
                        color: colors.grey[400],
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={handleChange("email")}
                disabled={!isEditing}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input": {
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[400],
                  },
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={profileData.phone}
                onChange={handleChange("phone")}
                disabled={!isEditing}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input": {
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[400],
                  },
                }}
              />

              <Divider sx={{ borderColor: colors.grey[700] }} />

              <Typography variant="h4" color={colors.grey[100]}>
                Professional Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={profileData.position}
                    onChange={handleChange("position")}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: colors.grey[100],
                      },
                      "& .MuiInputLabel-root": {
                        color: colors.grey[400],
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={profileData.department}
                    onChange={handleChange("department")}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: colors.grey[100],
                      },
                      "& .MuiInputLabel-root": {
                        color: colors.grey[400],
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Location"
                value={profileData.location}
                onChange={handleChange("location")}
                disabled={!isEditing}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input": {
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[400],
                  },
                }}
              />

              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={profileData.bio}
                onChange={handleChange("bio")}
                disabled={!isEditing}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input": {
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[400],
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;