import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import WheelsManager from "../components/WheelsManager";

const drawerWidth = 240;

const DashboardPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar - Barre supérieure */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Bouton Hamburger */}
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          {/* Icône de paramètres */}
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer - Menu latéral rétractable */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }} // Optimisé pour mobile
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Accueil", "Profil", "Paramètres"].map((text) => (
              <ListItemButton key={text}>
                <ListItemIcon>
                  <MenuIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <WheelsManager />
      </Box>
    </Box>
  );
};

export default DashboardPage;
