import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  API_SOURCES,
  CITIES,
  SOURCE_BY_ID,
  diceBearAvatar,
  fetchCrops,
  fetchHealthGlossary,
  fetchNews,
  fetchProfiles,
  fetchWeather,
  getWeatherDescription,
} from '../data/apiSources';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
];

function useRemoteData(loader, resourceKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    loader(controller.signal)
      .then((result) => setData(result))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'The data source could not be reached.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [loader, resourceKey, refreshKey]);

  return {
    data,
    loading,
    error,
    refresh: () => setRefreshKey((current) => current + 1),
  };
}

function SourceNote({ sourceId }) {
  const source = SOURCE_BY_ID[sourceId];
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5, flexWrap: 'wrap' }}>
      <Chip size="small" variant="outlined" label={source.name} />
      <Typography variant="caption" color="text.secondary">
        {source.description}
      </Typography>
      <Link href={source.url} target="_blank" rel="noreferrer" variant="caption">
        Source details
      </Link>
    </Stack>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
      <Box>
        <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.5 }}>
          {eyebrow}
        </Typography>
        <Typography variant="h5" component="h2">{title}</Typography>
      </Box>
      {action}
    </Stack>
  );
}

function LoadingState() {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 4 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">Loading live data…</Typography>
    </Stack>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <Alert
      severity="error"
      action={<Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}
      sx={{ my: 2 }}
    >
      {error}
    </Alert>
  );
}

export function ApiDirectory() {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h6">Seven sources, one component gallery</Typography>
            <Typography variant="body2" color="text.secondary">
              Each panel names its source and links to the API documentation.
            </Typography>
          </Box>
          <Chip icon={<WbSunnyOutlinedIcon />} color="success" variant="outlined" label="Public data · no keys" />
        </Stack>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {API_SOURCES.map((source) => (
            <Grid key={source.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box sx={{ p: 1.25, height: '100%', border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Link href={source.url} target="_blank" rel="noreferrer" underline="hover" fontWeight={700}>
                  {source.name}
                </Link>
                <Typography variant="caption" display="block" color="text.secondary">
                  {source.endpoint}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export function WeatherPanel() {
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [unit, setUnit] = useState('c');
  const [hours, setHours] = useState(12);
  const city = CITIES.find((item) => item.id === cityId) || CITIES[0];
  const loadWeather = useCallback((signal) => fetchWeather(city, signal), [city]);
  const { data, loading, error, refresh } = useRemoteData(loadWeather, cityId);
  const current = data?.current;
  const forecast = useMemo(() => {
    if (!data?.hourly?.time) return [];
    return data.hourly.time
      .map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m?.[index],
        precipitation: data.hourly.precipitation_probability?.[index],
      }))
      .filter((hour) => hour.time >= (current?.time || ''))
      .slice(0, hours);
  }, [data, current, hours]);
  const toDisplayedTemperature = (temperature) =>
    unit === 'f' ? (temperature * 9) / 5 + 32 : temperature;

  return (
    <Card id="weather" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <SectionHeading
          eyebrow="Weather · chart + slider"
          title="Forecast at a glance"
          action={
            <Tooltip title="Refresh Open-Meteo data">
              <IconButton aria-label="Refresh weather" onClick={refresh} size="small">
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="weather-city-label">City</InputLabel>
            <Select
              labelId="weather-city-label"
              value={cityId}
              label="City"
              onChange={(event) => setCityId(event.target.value)}
            >
              {CITIES.map((option) => <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>)}
            </Select>
          </FormControl>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={unit}
            onChange={(_, value) => value && setUnit(value)}
            aria-label="Temperature units"
          >
            <ToggleButton value="c" aria-label="Celsius">°C</ToggleButton>
            <ToggleButton value="f" aria-label="Fahrenheit">°F</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {loading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={refresh} />}
        {current && (
          <>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
                {Math.round(toDisplayedTemperature(current.temperature_2m))}°
              </Typography>
              <Box>
                <Typography variant="h6">{getWeatherDescription(current.weather_code)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Feels like {Math.round(toDisplayedTemperature(current.apparent_temperature))}°
                  {' · '}{current.relative_humidity_2m}% humidity
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ height: 190, width: '100%' }}>
              <LineChart
                xAxis={[{
                  data: forecast.map((hour) => hour.time.split('T')[1]?.slice(0, 5) || ''),
                  scaleType: 'point',
                  tickLabelStyle: { fontSize: 11 },
                }]}
                yAxis={[{ width: 42, valueFormatter: (value) => `${Math.round(toDisplayedTemperature(value))}°` }]}
                series={[{
                  data: forecast.map((hour) => toDisplayedTemperature(hour.temperature)),
                  label: `Temperature (°${unit.toUpperCase()})`,
                  curve: 'monotoneX',
                  showMark: false,
                  valueFormatter: (value) => `${Math.round(value)}°`,
                }]}
                height={180}
                margin={{ left: 4, right: 12, top: 16, bottom: 24 }}
                grid={{ horizontal: true }}
              />
            </Box>
            <Box sx={{ px: 1, mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Forecast window: {hours} hours
              </Typography>
              <Slider
                aria-label="Forecast window in hours"
                value={hours}
                onChange={(_, value) => setHours(value)}
                step={6}
                marks
                min={6}
                max={24}
                valueLabelDisplay="auto"
              />
            </Box>
            <SourceNote sourceId="weather" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function NewsPanel() {
  const [language, setLanguage] = useState('en');
  const loadNews = useCallback((signal) => fetchNews(language, signal), [language]);
  const { data, loading, error, refresh } = useRemoteData(loadNews, language);
  const articles = (data || []).slice(0, 4);
  const host = language === 'en' ? 'https://sonto.tech' : `https://${language}.sonto.tech`;

  return (
    <Card id="news" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <SectionHeading
          eyebrow="Tech & AI · tabs + cards"
          title="The signal, in your language"
          action={
            <Tooltip title="Refresh Sonto headlines">
              <IconButton aria-label="Refresh headlines" onClick={refresh} size="small">
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <Tabs
          value={language}
          onChange={(_, value) => setLanguage(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Sonto feed language"
          sx={{ mb: 1 }}
        >
          {languages.map((option) => <Tab key={option.code} value={option.code} label={option.label} />)}
        </Tabs>
        {loading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={refresh} />}
        {!loading && !error && articles.length === 0 && (
          <Alert severity="info">No headlines are available in this feed right now.</Alert>
        )}
        {!loading && !error && articles.map((article) => (
          <Box key={article.slug || article.url || article.title} sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Chip size="small" label={article.category || 'News'} />
              {article.date && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(article.date).toLocaleDateString(language)}
                </Typography>
              )}
            </Stack>
            <Link href={`${host}${article.url || `/articles/${article.slug}`}`} target="_blank" rel="noreferrer" color="inherit" underline="hover">
              <Typography variant="subtitle1" fontWeight={700}>{article.title}</Typography>
            </Link>
            {article.subtitle && (
              <Typography variant="body2" color="text.secondary">{article.subtitle}</Typography>
            )}
          </Box>
        ))}
        <SourceNote sourceId="news" />
      </CardContent>
    </Card>
  );
}

export function ProfilesPanel() {
  const loadProfiles = useCallback((signal) => fetchProfiles(signal), []);
  const { data, loading, error, refresh } = useRemoteData(loadProfiles, 'random-profiles');

  return (
    <Card id="profiles" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <SectionHeading
          eyebrow="Profiles · cards + avatars"
          title="People-shaped placeholders"
          action={
            <Button size="small" startIcon={<RefreshRoundedIcon />} onClick={refresh}>
              New people
            </Button>
          }
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Synthetic RandomUser profiles paired with deterministic DiceBear illustrations.
        </Typography>
        {loading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={refresh} />}
        <Grid container spacing={1.5}>
          {(data || []).map((person) => {
            const name = `${person.name.first} ${person.name.last}`;
            return (
              <Grid key={person.email} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={diceBearAvatar(name)} alt={`${name} illustrated avatar`} sx={{ width: 48, height: 48 }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>{name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {person.location.city}, {person.location.country}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1.5, overflowWrap: 'anywhere' }}>
                      {person.email}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <SourceNote sourceId="people" />
        <SourceNote sourceId="avatars" />
      </CardContent>
    </Card>
  );
}

export function HealthPanel() {
  const loadGlossary = useCallback((signal) => fetchHealthGlossary(signal), []);
  const { data, loading, error, refresh } = useRemoteData(loadGlossary, 'health-glossary');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pages = Math.max(1, Math.ceil((data || []).length / pageSize));
  const rows = (data || []).slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card id="health" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <SectionHeading
          eyebrow="Health literacy · table + pagination"
          title="Marketplace glossary"
          action={
            <Tooltip title="Refresh official glossary">
              <IconButton aria-label="Refresh glossary" onClick={refresh} size="small">
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        />
        {loading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={refresh} />}
        {!loading && !error && (
          <>
            <TableContainer sx={{ maxHeight: 350 }}>
              <Table size="small" stickyHeader aria-label="HealthCare.gov glossary">
                <TableHead>
                  <TableRow>
                    <TableCell>Term</TableCell>
                    <TableCell>Definition</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((entry) => (
                    <TableRow key={entry.url || entry.title} hover>
                      <TableCell sx={{ minWidth: 145, fontWeight: 600, verticalAlign: 'top' }}>
                        <Link href={`https://www.healthcare.gov${entry.url}`} target="_blank" rel="noreferrer">
                          {entry.title}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ minWidth: 190 }}>{entry.bite}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={pages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="small"
                aria-label="Glossary pages"
              />
            </Stack>
          </>
        )}
        <SourceNote sourceId="health" />
      </CardContent>
    </Card>
  );
}

export function StardewPanel() {
  const loadCrops = useCallback((signal) => fetchCrops(signal), []);
  const { data, loading, error, refresh } = useRemoteData(loadCrops, 'stardew-crops');
  const crops = (data || []).slice(0, 6);

  return (
    <Card id="stardew" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <SectionHeading
          eyebrow="Game data · responsive grid"
          title="Farm planner snippets"
          action={
            <Tooltip title="Refresh crop data">
              <IconButton aria-label="Refresh crop data" onClick={refresh} size="small">
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        />
        {loading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={refresh} />}
        <Grid container spacing={1}>
          {crops.map((crop) => (
            <Grid key={crop.id} size={{ xs: 6, sm: 4, md: 6 }}>
              <Box sx={{ height: '100%', p: 1.5, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="subtitle2">{crop.name_en || crop.name}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {(crop.season || []).join(' · ') || 'Season varies'}
                </Typography>
                <Chip size="small" sx={{ mt: 1 }} label={`${crop.growth_days ?? '—'} days`} />
              </Box>
            </Grid>
          ))}
        </Grid>
        <SourceNote sourceId="stardew" />
      </CardContent>
    </Card>
  );
}

function nextNewYearDate() {
  const now = new Date();
  return `${now.getFullYear() + 1}-01-01`;
}

export function CountdownPanel() {
  const [targetDate, setTargetDate] = useState(nextNewYearDate);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const targetTime = Date.parse(`${targetDate}T00:00:00`);
  const isValidTarget = Number.isFinite(targetTime);
  const remaining = isValidTarget ? Math.max(0, targetTime - now) : 0;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <Card
      id="countdowns"
      variant="outlined"
      sx={{
        height: '100%',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        '& .MuiTypography-root, & a, & .MuiChip-root': { color: 'inherit' },
        '& .MuiChip-root': { borderColor: 'currentColor' },
      }}
    >
      <CardContent>
        <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.5 }}>
          Calendar · live countdown
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mt: 0.5, mb: 2 }}>
          Next big moment
        </Typography>
        <TextField
          label="Event date"
          type="date"
          size="small"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { color: 'inherit' },
            '& .MuiInputLabel-root': { color: 'inherit' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'currentColor' },
          }}
        />
        {isValidTarget ? (
          <Grid container spacing={1}>
            {[
              ['Days', days],
              ['Hours', hours],
              ['Minutes', minutes],
              ['Seconds', seconds],
            ].map(([label, value]) => (
              <Grid key={label} size={3}>
                <Box sx={{ p: 1, textAlign: 'center', borderRadius: 2, bgcolor: 'rgba(255,255,255,.13)' }}>
                  <Typography variant="h4" component="p">{String(value).padStart(2, '0')}</Typography>
                  <Typography variant="caption">{label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography role="status" variant="body2">
            Choose a valid event date to start the countdown.
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
          Pick any date to watch the clock tick in real time.
        </Typography>
        <SourceNote sourceId="countdowns" />
      </CardContent>
    </Card>
  );
}
