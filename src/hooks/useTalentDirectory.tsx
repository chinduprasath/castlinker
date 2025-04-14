import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

type Profession = 'Actor' | 'Director' | 'Writer' | 'Producer' | 'Cinematographer' | 'Editor' | 'Production Designer' | 'Costume Designer' | 'Makeup Artist' | 'Sound Designer' | 'Composer';

interface Talent {
  id: string;
  full_name: string;
  profession: Profession;
  email: string;
  avatar_url: string;
  city: string;
  country: string;
  bio: string;
  experience_years: number;
  hourly_rate: number;
  skills: string[];
  // Add other relevant fields
}

interface UseTalentDirectoryResult {
  talent: Talent[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  professionFilter: Profession | null;
  setProfessionFilter: (profession: Profession | null) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  experienceFilter: number | null;
  setExperienceFilter: (experience: number | null) => void;
  rateFilter: [number, number];
  setRateFilter: (rate: [number, number]) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
}

const defaultPageSize = 20;

export const useTalentDirectory = (): UseTalentDirectoryResult => {
  const [talent, setTalent] = useState<Talent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search term state and debouncing
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Profession filter state
  const initialProfession = searchParams.get('profession') || null;
  const [professionFilter, setProfessionFilter] = useState<Profession | null>(
    initialProfession as Profession | null
  );

  // Location filter state
  const initialLocation = searchParams.get('location') || '';
  const [locationFilter, setLocationFilter] = useState<string>(initialLocation);

  // Experience filter state
  const initialExperience = searchParams.get('experience') || null;
  const [experienceFilter, setExperienceFilter] = useState<number | null>(
    initialExperience ? parseInt(initialExperience, 10) : null
  );

  // Rate filter state
  const initialRateMin = searchParams.get('rateMin') || '0';
  const initialRateMax = searchParams.get('rateMax') || '1000';
  const [rateFilter, setRateFilter] = useState<[number, number]>([
    parseInt(initialRateMin, 10),
    parseInt(initialRateMax, 10),
  ]);

  // Pagination state
  const initialPage = searchParams.get('page') || '1';
  const [page, setPage] = useState<number>(parseInt(initialPage, 10));
  const initialPageSize = searchParams.get('pageSize') || defaultPageSize.toString();
  const [pageSize, setPageSize] = useState<number>(parseInt(initialPageSize, 10));

  // Sorting state
  const initialSortBy = searchParams.get('sortBy') || 'full_name';
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const initialSortOrder = searchParams.get('sortOrder') || 'asc';
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    initialSortOrder === 'asc' ? 'asc' : 'desc'
  );

  useEffect(() => {
    const fetchTalent = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (debouncedSearchTerm) {
        query = query.ilike('full_name', `%${debouncedSearchTerm}%`);
      }

      if (professionFilter) {
        query = query.eq('profession', professionFilter);
      }

      if (locationFilter) {
        query = query.ilike('city', `%${locationFilter}%`);
      }

      if (experienceFilter) {
        query = query.gte('experience_years', experienceFilter);
      }

      query = query.gte('hourly_rate', rateFilter[0]).lte('hourly_rate', rateFilter[1]);

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      try {
        const { data, error, count } = await query;

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
        } else {
          setTalent(data || []);
          setTotalCount(count || 0);
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTalent();
  }, [
    debouncedSearchTerm,
    professionFilter,
    locationFilter,
    experienceFilter,
    rateFilter,
    page,
    pageSize,
    sortBy,
    sortOrder,
    setTalent,
    setTotalCount,
    setError,
    setLoading,
  ]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (professionFilter) params.set('profession', professionFilter);
    if (locationFilter) params.set('location', locationFilter);
    if (experienceFilter) params.set('experience', experienceFilter.toString());
    params.set('rateMin', rateFilter[0].toString());
    params.set('rateMax', rateFilter[1].toString());
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);

    setSearchParams(params);
  }, [
    searchTerm,
    professionFilter,
    locationFilter,
    experienceFilter,
    rateFilter,
    page,
    pageSize,
    sortBy,
    sortOrder,
    setSearchParams,
  ]);

  return {
    talent,
    loading,
    error,
    totalCount,
    searchTerm,
    setSearchTerm,
    professionFilter,
    setProfessionFilter,
    locationFilter,
    setLocationFilter,
    experienceFilter,
    setExperienceFilter,
    rateFilter,
    setRateFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};
