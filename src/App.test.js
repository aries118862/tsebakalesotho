import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.localStorage.clear();
  window.scrollTo = jest.fn();
});

test('home page initially shows four attractions', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /find your own way/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /find your somewhere/i })).toBeInTheDocument();
  expect(screen.getByText('4 places to fall for')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Sani Pass' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Afriski Mountain Resort' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Morija Museum & Archives' })).not.toBeInTheDocument();
});

test('footer includes Instagram and Facebook links', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/');
  expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', 'https://www.facebook.com/');
});

test('Explore them all reveals the remaining four attractions on the home page', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /explore them all/i }));

  expect(window.location.pathname).toBe('/');
  expect(screen.getByText('8 places to fall for')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Afriski Mountain Resort' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Morija Museum & Archives' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /show fewer places/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /show fewer places/i }));
  expect(screen.getByText('4 places to fall for')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /explore them all/i })).toBeInTheDocument();
});

test('search and category filters dynamically update the destinations', () => {
  render(<App />);

  fireEvent.change(screen.getByRole('searchbox', { name: 'Search destinations by name or location' }), { target: { value: 'katse' } });
  expect(screen.getByRole('heading', { name: 'Katse Dam' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Sani Pass' })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole('searchbox', { name: 'Search destinations by name or location' }), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Adventure' }));
  expect(screen.getByRole('heading', { name: 'Sani Pass' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Afriski Mountain Resort' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Katse Dam' })).not.toBeInTheDocument();
});

test('opens attraction details and selects the destination in the enquiry form', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'View details for Sani Pass' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('Visit the highest pub')).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: /plan a visit/i }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Destination *')).toHaveValue('Sani Pass');
});

test('validates the enquiry and displays a confirmation after a valid submission', () => {
  render(<App />);

  fireEvent.change(screen.getByRole('combobox', { name: 'Country calling code' }), { target: { value: '+27' } });
  fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '50123456' } });
  fireEvent.click(screen.getByRole('button', { name: /send your enquiry/i }));
  expect(screen.getByText('Please enter your full name.')).toBeInTheDocument();
  expect(screen.getByText('Email address must include @.')).toBeInTheDocument();
  expect(screen.getByText('Please choose a destination.')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: 'Mpho Visitor' } });
  fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: 'mpho@example.com' } });
  fireEvent.change(screen.getByLabelText(/Destination/), { target: { value: 'Katse Dam' } });
  fireEvent.change(screen.getByLabelText(/Preferred visit date/), { target: { value: '2027-01-15' } });
  fireEvent.change(screen.getByLabelText(/A little about your trip/), { target: { value: 'We are excited to explore the mountains.' } });
  fireEvent.click(screen.getByRole('button', { name: /send your enquiry/i }));

  expect(screen.getByRole('status')).toHaveTextContent('Thanks, Mpho Visitor!');
});

test('reveals the enquiry form with an unwrapping animation when its link is clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: /plan your trip/i }));

  expect(document.querySelector('.enquiry-form')).toHaveClass('enquiry-form--unwrapping');
});

test('rejects invalid name and phone characters and enforces the name length', () => {
  render(<App />);

  const name = screen.getByLabelText(/Full name/);
  fireEvent.change(name, { target: { value: 'Mpho2' } });
  expect(name).toHaveValue('');
  expect(screen.getByText('Name can only contain letters, spaces, apostrophes, periods, and hyphens.')).toBeInTheDocument();

  fireEvent.change(name, { target: { value: 'abcdefghijklmnopqrstu' } });
  expect(name).toHaveValue('');
  expect(screen.getByText('Name cannot exceed 20 characters.')).toBeInTheDocument();

  fireEvent.change(name, { target: { value: 'Mpho Visitor' } });
  expect(name).toHaveValue('Mpho Visitor');

  const phone = screen.getByLabelText(/Phone number/);
  fireEvent.change(phone, { target: { value: '123abc' } });
  expect(phone).toHaveValue('');
  expect(screen.getByText('Phone number must contain digits only.')).toBeInTheDocument();
});

test('requires an at sign in email addresses', () => {
  render(<App />);

  const email = screen.getByLabelText(/Email address/);
  fireEvent.change(email, { target: { value: 'invalid-email' } });

  expect(email).toHaveValue('invalid-email');
  expect(screen.getByText('Email address must include @.')).toBeInTheDocument();
});

test('country calling code selector defaults to Lesotho and includes international codes', () => {
  render(<App />);

  const callingCode = screen.getByRole('combobox', { name: 'Country calling code' });
  expect(callingCode).toHaveValue('+266');
  expect(within(callingCode).getByRole('option', { name: /\+27 — South Africa/ })).toBeInTheDocument();
  fireEvent.change(callingCode, { target: { value: '+27' } });
  expect(callingCode).toHaveValue('+27');
});

test('saves and filters favourite places', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Save Sani Pass to favourites' }));
  fireEvent.click(screen.getByRole('button', { name: /saved/i }));

  expect(screen.getByRole('heading', { name: 'Sani Pass' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Katse Dam' })).not.toBeInTheDocument();
});

test('language selector switches the interface between English and Sesotho', () => {
  render(<App />);
  const languagePicker = screen.getByRole('combobox', { name: 'Select language' });

  fireEvent.change(languagePicker, { target: { value: 'st' } });
  expect(screen.getByRole('heading', { name: 'Fumana tsela ea hao.' })).toBeInTheDocument();
  expect(within(screen.getByRole('navigation')).getByRole('link', { name: 'Libaka' })).toBeInTheDocument();

  fireEvent.change(languagePicker, { target: { value: 'en' } });
  expect(screen.getByRole('heading', { name: /find your own way/i })).toBeInTheDocument();
});
