import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface IndustryHubItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  createdAt: string;
}

const useIndustryHub = () => {
  const [hubItems, setHubItems] = useState<IndustryHubItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHubItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const hubCollection = collection(db, 'industryHub');
        const q = query(hubCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const items: IndustryHubItem[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
          link: doc.data().link,
          category: doc.data().category,
          createdAt: doc.data().createdAt
        }));

        setHubItems(items);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch industry hub items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHubItems();
  }, [user]);

  return {
    hubItems,
    isLoading,
    error,
  };
};

export default useIndustryHub;
