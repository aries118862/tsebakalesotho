import { useEffect, useState } from 'react';
import { attractions } from '../models/attractions';

function getLocalDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function validateEnquiry(form, today) {
  const errors = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  } else if (form.fullName.length > 20) {
    errors.fullName = 'Name cannot exceed 20 characters.';
  } else if (!/^[\p{L}\p{M}\s.'’-]+$/u.test(form.fullName)) {
    errors.fullName = 'Name can only contain letters, spaces, apostrophes, periods, and hyphens.';
  }
  if (!form.email.includes('@')) {
    errors.email = 'Email address must include @.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!/^\d{7,15}$/.test(form.phone)) errors.phone = 'Enter a valid phone number (7–15 digits).';
  if (!form.destination) errors.destination = 'Please choose a destination.';
  if (!form.visitors || Number(form.visitors) < 1 || Number(form.visitors) > 20) errors.visitors = 'Choose between 1 and 20 visitors.';
  if (!form.visitDate || form.visitDate < today) errors.visitDate = 'Choose today or a future date.';
  if (form.message.trim().length < 10) errors.message = 'Please write at least 10 characters.';

  return errors;
}

export default function useEnquiryController(selectedDestination) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    countryCode: '+266',
    phone: '',
    destination: '',
    visitors: '2',
    visitDate: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submittedName, setSubmittedName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [today] = useState(getLocalDateString);

  useEffect(() => {
    if (selectedDestination) {
      setForm((current) => ({ ...current, destination: selectedDestination }));
      setErrors((current) => ({ ...current, destination: '' }));
      setIsSubmitted(false);
    }
  }, [selectedDestination]);

  function updateField(event) {
    const { name, value } = event.target;

    if (name === 'fullName') {
      if (value.length > 20) {
        setErrors((current) => ({ ...current, fullName: 'Name cannot exceed 20 characters.' }));
        return;
      }
      if (!/^[\p{L}\p{M}\s.'’-]*$/u.test(value)) {
        setErrors((current) => ({ ...current, fullName: 'Name can only contain letters, spaces, apostrophes, periods, and hyphens.' }));
        return;
      }
    }

    if (name === 'phone' && !/^\d*$/.test(value)) {
      setErrors((current) => ({ ...current, phone: 'Phone number must contain digits only.' }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: name === 'email' && value && !value.includes('@')
        ? 'Email address must include @.'
        : '',
    }));
    setIsSubmitted(false);
  }

  function submitEnquiry(event) {
    event.preventDefault();
    const nextErrors = validateEnquiry(form, today);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitted(false);
      return;
    }

    setSubmittedName(form.fullName.trim());
    setIsSubmitted(true);
    setForm((current) => ({
      ...current,
      fullName: '',
      email: '',
      phone: '',
      visitors: '2',
      visitDate: '',
      message: '',
    }));
  }

  return {
    attractions,
    errors,
    form,
    isSubmitted,
    submitEnquiry,
    submittedName,
    today,
    updateField,
  };
}
