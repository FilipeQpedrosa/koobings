import { render, screen } from '@testing-library/react';
import { Button } from '../../components/ui/button';

test('renders UI Button', () => {
  render(<Button>Test Button</Button>);
  expect(screen.getByText('Test Button')).toBeInTheDocument();
}); 