import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the Food Delivery App!/i);
  expect(linkElement).toBeInTheDocument();
});
