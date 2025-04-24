import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CreateTrip from './create-trip/index';
import MyTrips from './my-trip/index';
import { GoogleOAuthProvider } from '@react-oauth/google';

describe('App Routing', () => {
  describe('CreateTrip route', () => {
    it('should render CreateTrip page when navigating to /create-trip', () => {
      render(
        <GoogleOAuthProvider clientId="test-client-id">
          <MemoryRouter initialEntries={['/create-trip']}>
            <Routes>
              <Route path="/create-trip" element={<CreateTrip />} />
            </Routes>
          </MemoryRouter>
        </GoogleOAuthProvider>
      );

      expect(
        screen.getByText(/Tell us your travel preferences/i)
      ).toBeInTheDocument();
    });
  });

  describe('MyTrips route', () => {
    it('should render MyTrips page when navigating to /my-trips', async () => {
      render(
        <MemoryRouter initialEntries={['/my-trips']}>
          <Routes>
            <Route path="/my-trips" element={<MyTrips />} />
          </Routes>
        </MemoryRouter>
      );
    });
  });
});
