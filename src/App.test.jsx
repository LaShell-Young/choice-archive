import { render, screen } from '@testing-library/react';
import App from './App.jsx';
import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('shows the data sources and component gallery', () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  render(<App />);

  expect(screen.getByRole('heading', { name: /different data/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Forecast at a glance' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open-Meteo' })).toHaveAttribute('href', 'https://open-meteo.com/');
  expect(screen.getByRole('link', { name: 'HealthCare.gov' })).toHaveAttribute('href', 'https://www.healthcare.gov/developers/');
});
