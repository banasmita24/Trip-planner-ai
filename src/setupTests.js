import '@testing-library/jest-dom'
import { vi } from 'vitest';

// Mock the missing utils module
vi.mock('@/lib/utils', () => ({
  cn: () => 'mocked-class-name',
  // Add other utility functions you use
}));
