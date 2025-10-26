import { supabase } from '@/integrations/supabase/client';

export const analyzeCardImage = async (imageData: string): Promise<number[]> => {
  try {
    console.log('Analyzing image, size:', imageData.length);
    
    const { data, error } = await supabase.functions.invoke('analyze-cards', {
      body: { image: imageData }
    });

    console.log('Response received:', { data, error });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to analyze image');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data?.cardIds || !Array.isArray(data.cardIds)) {
      console.error('Invalid response:', data);
      throw new Error('Invalid response from analysis');
    }

    return data.cardIds;
  } catch (error) {
    console.error('Card analysis error:', error);
    throw error;
  }
};
