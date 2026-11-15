import { useState } from 'react';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  ApiDirectory,
  CountdownPanel,
  HealthPanel,
  NewsPanel,
  ProfilesPanel,
  StardewPanel,
  WeatherPanel,
} from './components/SourceShowcase.jsx';
import AppTheme from './shared-theme/AppTheme.jsx';
import ColorModeIconDropdown from './shared-theme/ColorModeIconDropdown.jsx';

const navigation = [
  { label: 'Weather', href: '#weather', icon: <WbSunnyOutlinedIcon /> },
  { label: 'Countdown', href: '#countdowns', icon: <TimerOutlinedIcon /> },
  { label: 'Tech & AI news', href: '#news', icon: <ArticleOutlinedIcon /> },
  { label: 'Profiles', href: '#profiles', icon: <PeopleOutlineRoundedIcon /> },
  { label: 'Health glossary', href: '#health', icon: <HealthAndSafetyOutlinedIcon /> },
  { label: 'Farm planner', href: '#stardew', icon: <GrassOutlinedIcon /> },
];

export default function Dashboard(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menu = (
    <Box sx={{ px: 2, py: 2.5 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 1, mb: 3 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <AutoAwesomeRoundedIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>Choice Archive</Typography>
          <Typography variant="caption" color="text.secondary">API component gallery</Typography>
        </Box>
      </Stack>
      <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
        Explore the data
      </Typography>
      <List sx={{ mt: 0.5 }}>
        {navigation.map((item) => (
          <ListItemButton
            component="a"
            href={item.href}
            key={item.href}
            onClick={() => setMobileMenuOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ px: 1, display: 'block' }}>
        Built with React, Vite & MUI. Live APIs are fetched directly from your browser.
      </Typography>
    </Box>
  );

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="app-shell" sx={{ display: 'flex', minHeight: '100vh' }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: 270 } }}
          >
            {menu}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: 250,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 250,
                boxSizing: 'border-box',
                borderRight: 1,
                borderColor: 'divider',
              },
            }}
          >
            {menu}
          </Drawer>
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            backgroundColor: 'background.default',
          }}
        >
          <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              height: 72,
              px: { xs: 2, sm: 3, lg: 5 },
              borderBottom: 1,
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              zIndex: 5,
              bgcolor: 'background.default',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              {isMobile && (
                <IconButton aria-label="Open navigation menu" onClick={() => setMobileMenuOpen(true)}>
                  <MenuRoundedIcon />
                </IconButton>
              )}
              <Typography variant="subtitle2" color="text.secondary">
                Open-source data, tangible UI
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                component="a"
                href="#sources"
                size="small"
                variant="outlined"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Data sources
              </Button>
              <ColorModeIconDropdown aria-label="Choose color theme" />
            </Stack>
          </Stack>

          <Box sx={{ maxWidth: 1500, mx: 'auto', px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 5 } }}>
            <Box className="hero-panel" sx={{ mb: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 2 }}>
                    A living component playground
                  </Typography>
                  <Typography
                    component="h1"
                    sx={{
                      maxWidth: 780,
                      mt: 1,
                      mb: 1.5,
                      fontSize: { xs: '2.35rem', sm: '3.2rem', lg: '3.8rem' },
                      fontWeight: 800,
                      lineHeight: 1.06,
                      letterSpacing: '-0.055em',
                    }}
                  >
                    Different data.
                    <Box component="span" sx={{ color: 'primary.main' }}> Different ways </Box>
                    to see it.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680, lineHeight: 1.8 }}>
                    A hands-on gallery of MUI cards, charts, tabs, tables, sliders, pagination,
                    tooltips and more — each connected to a real open data source.
                  </Typography>
                  <Button component="a" href="#weather" variant="contained" sx={{ mt: 2.5 }}>
                    Explore the gallery
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box className="hero-aside" sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 3 }}>
                    <Typography variant="overline" color="text.secondary">Today’s brief</Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>Seven sources. One small app.</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Data loads in the browser, with visible source links and retry states.
                      No keys or backend required.
                    </Typography>
                    <Link
                      href="https://mui.com/material-ui/"
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      variant="body2"
                      sx={{ display: 'inline-block', mt: 1.5 }}
                    >
                      Built with MUI components ↗
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box id="sources" sx={{ scrollMarginTop: 88 }}>
              <ApiDirectory />
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, lg: 7 }}><WeatherPanel /></Grid>
              <Grid size={{ xs: 12, lg: 5 }}><CountdownPanel /></Grid>
              <Grid size={{ xs: 12, lg: 7 }}><NewsPanel /></Grid>
              <Grid size={{ xs: 12, lg: 5 }}><HealthPanel /></Grid>
              <Grid size={{ xs: 12, lg: 8 }}><ProfilesPanel /></Grid>
              <Grid size={{ xs: 12, lg: 4 }}><StardewPanel /></Grid>
            </Grid>

            <Stack
              component="footer"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent="space-between"
              sx={{ py: 4, color: 'text.secondary' }}
            >
              <Typography variant="caption">Choice Archive · React + Vite + MUI</Typography>
              <Typography variant="caption">
                Data is provided by independent public services; availability and terms vary.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
