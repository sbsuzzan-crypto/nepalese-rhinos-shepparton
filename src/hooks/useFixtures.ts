
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Fixture } from "@/types";

export const useNextFixture = () => {
  return useQuery({
    queryKey: ['next-fixture'],
    queryFn: async () => {
      console.log('Fetching next fixture from Supabase...');
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .gte('match_date', new Date().toISOString().split('T')[0])
        .eq('status', 'upcoming')
        .order('match_date', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching next fixture:', error);
        throw error;
      }
      
      console.log('Next fixture fetched successfully:', data);
      return data as Fixture | null;
    },
  });
};
