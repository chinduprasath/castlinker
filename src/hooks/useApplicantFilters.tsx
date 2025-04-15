
import { useState, useEffect, useMemo } from 'react';
import { PostApplication } from '@/services/postsService';

export const useApplicantFilters = (applicants: PostApplication[] | null) => {
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique professions from applicants
  const availableProfessions = useMemo(() => {
    if (!applicants || !Array.isArray(applicants)) return [];
    
    const professions = applicants
      .map(app => app.profile?.profession_type)
      .filter(Boolean) as string[];
      
    return [...new Set(professions)];
  }, [applicants]);
  
  // Extract unique locations from applicants
  const availableLocations = useMemo(() => {
    if (!applicants || !Array.isArray(applicants)) return [];
    
    const locations = applicants
      .map(app => app.profile?.location)
      .filter(Boolean) as string[];
      
    return [...new Set(locations)];
  }, [applicants]);
  
  // Filter applicants based on selected filters
  const filteredApplicants = useMemo(() => {
    if (!applicants || !Array.isArray(applicants)) return [];
    
    return applicants.filter(applicant => {
      // Filter by profession if any selected
      const matchesProfession = selectedProfessions.length === 0 || 
        (applicant.profile?.profession_type && 
         selectedProfessions.includes(applicant.profile.profession_type));
      
      // Filter by location if any selected
      const matchesLocation = selectedLocations.length === 0 || 
        (applicant.profile?.location && 
         selectedLocations.includes(applicant.profile.location));
      
      // Filter by search term
      const matchesSearch = !searchTerm || 
        (applicant.profile?.full_name && 
         applicant.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesProfession && matchesLocation && matchesSearch;
    });
  }, [applicants, selectedProfessions, selectedLocations, searchTerm]);
  
  // Reset filters
  const resetFilters = () => {
    setSelectedProfessions([]);
    setSelectedLocations([]);
    setSearchTerm('');
  };
  
  return {
    selectedProfessions,
    setSelectedProfessions,
    selectedLocations,
    setSelectedLocations,
    searchTerm,
    setSearchTerm,
    availableProfessions,
    availableLocations,
    filteredApplicants,
    resetFilters
  };
};
