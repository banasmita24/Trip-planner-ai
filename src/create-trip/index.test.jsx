import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import CreateTrip from './index';
import { toast } from 'sonner';

// Mocking necessary modules
vi.mock('@react-oauth/google');
vi.mock('../service/AiModel');
vi.mock('sonner');
vi.mock('firebase/firestore', () => ({
  setDoc: vi.fn(),
  getFirestore: vi.fn(), // Mocking getFirestore
}));

describe('CreateTrip Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>); // Wrap with MemoryRouter
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
