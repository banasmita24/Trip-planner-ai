import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateTrip from '../src/create-trip/index';
import { useGoogleLogin } from '@react-oauth/google';
import { chatSession } from '../src/service/AiModel';
import { setDoc, getFirestore } from "firebase/firestore";
import { toast } from 'sonner';
import { vi } from 'vitest';
import React from 'react';

// ✅ Mock react-google-places-autocomplete to prevent "Google script not loaded" error
vi.mock('react-google-places-autocomplete', () => {
  return {
    __esModule: true,
    default: () => <input placeholder="Mock Google Autocomplete" />,
  };
});

// Mocking necessary modules
vi.mock('@react-oauth/google');
vi.mock('../service/AiModel');
vi.mock('sonner');
vi.mock('firebase/firestore', () => ({
  setDoc: vi.fn(),
  getFirestore: vi.fn(),
}));

describe('CreateTrip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders CreateTrip component', () => {
    renderWithRouter(<CreateTrip />);
    
    expect(screen.getByText(/Tell us your travel preferences/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex.3/i)).toBeInTheDocument();
  });

  test('shows toast when required fields are missing', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    renderWithRouter(<CreateTrip />);
    
    fireEvent.click(screen.getByText(/Generate Trip/i));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Please fill all details!");
    });
  });
});
