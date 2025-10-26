import { supabase } from '@/integrations/supabase/client';

export const analyzeCardImage = async (imageData: string): Promise<number[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-cards', {
      body: { image: imageData }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error('Failed to analyze image');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data?.cardIds || !Array.isArray(data.cardIds)) {
      throw new Error('Invalid response from analysis');
    }

    return data.cardIds;
  } catch (error) {
    console.error('Card analysis error:', error);
    throw error;
  }
};
