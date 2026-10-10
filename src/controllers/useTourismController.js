import { useCallback, useEffect, useMemo, useState } from 'react';
import { attractions } from '../models/attractions';
import { localizeAttraction, useLanguage } from '../context/LanguageContext';

export default function useTourismController() {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All places');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [savedAttractionIds, setSavedAttractionIds] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');

  useEffect(() => {
    document.title = language === 'st'
      ? 'Tseba Ka Lesotho | Fumana tsela ea hao'
      : 'Tseba Ka Lesotho | Find your own way';
  }, [language]);

  const visibleAttractions = useMemo(() => attractions.filter((attraction) => {
    const localized = localizeAttraction(attraction, language);
    const searchText = `${attraction.name} ${attraction.location} ${localized.name} ${localized.location} ${localized.description}`.toLowerCase();
    const matchesSearch = searchText.includes(search.trim().toLowerCase());
    const matchesCategory = category === 'All places' || attraction.category === category;
    const matchesSaved = !showSavedOnly || savedAttractionIds.includes(attraction.id);
    return matchesSearch && matchesCategory && matchesSaved;
  }), [category, language, savedAttractionIds, search, showSavedOnly]);

  const toggleSavedAttraction = useCallback((id) => {
    setSavedAttractionIds((current) => current.includes(id)
      ? current.filter((savedId) => savedId !== id)
      : [...current, id]);
  }, []);

  const openAttraction = useCallback((attraction) => {
    setSelectedAttraction(attraction);
  }, []);

  const closeAttraction = useCallback(() => {
    setSelectedAttraction(null);
  }, []);

  const planVisit = useCallback((destination) => {
    setSelectedDestination(destination);
    setSelectedAttraction(null);
    window.setTimeout(() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  return {
    category,
    closeAttraction,
    mobileMenuOpen,
    openAttraction,
    planVisit,
    savedAttractionIds,
    search,
    selectedAttraction,
    selectedDestination,
    setCategory,
    setMobileMenuOpen,
    setSearch,
    setShowSavedOnly,
    showSavedOnly,
    toggleSavedAttraction,
    visibleAttractions,
  };
}
