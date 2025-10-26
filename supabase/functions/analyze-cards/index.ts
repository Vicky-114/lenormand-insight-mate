import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { image } = body;
    
    console.log('Request received, image length:', image ? image.length : 0);
    
    if (!image) {
      console.error('No image in request');
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check image size
    if (image.length > 5000000) { // ~5MB limit
      console.error('Image too large:', image.length);
      return new Response(
        JSON.stringify({ error: "Image too large. Please use a smaller image." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Calling Lovable AI...');

    // System prompt explaining the task
    const systemPrompt = `You are an expert at identifying Lenormand cards from images.
Lenormand cards are numbered 1-36 with specific names:
1-Rider, 2-Clover, 3-Ship, 4-House, 5-Tree, 6-Clouds, 7-Snake, 8-Coffin, 9-Bouquet, 10-Scythe, 
11-Whip, 12-Birds, 13-Child, 14-Fox, 15-Bear, 16-Stars, 17-Stork, 18-Dog, 19-Tower, 20-Garden, 
21-Mountain, 22-Crossroads, 23-Mice, 24-Heart, 25-Ring, 26-Book, 27-Letter, 28-Man, 29-Woman, 
30-Lily, 31-Sun, 32-Moon, 33-Key, 34-Fish, 35-Anchor, 36-Cross.

Analyze the image and identify the Lenormand cards shown. Return ONLY the card IDs from left to right in a JSON array.
If you see 3 cards, return exactly 3 numbers. If uncertain, make your best educated guess based on visible symbols.`;

    const userPrompt = "Identify the Lenormand cards in this image from left to right. Return only a JSON array of card IDs (numbers 1-36).";

    // Call Lovable AI with image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { 
                type: "image_url", 
                image_url: { url: image }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response:", aiResponse);

    // Extract card IDs from the response
    let cardIds: number[] = [];
    try {
      // Try to parse as JSON array
      const jsonMatch = aiResponse.match(/\[[\d,\s]+\]/);
      if (jsonMatch) {
        cardIds = JSON.parse(jsonMatch[0]);
      } else {
        // Try to extract numbers
        const numbers = aiResponse.match(/\d+/g);
        if (numbers) {
          cardIds = numbers.map((n: string) => parseInt(n)).filter((n: number) => n >= 1 && n <= 36);
        }
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse card identification", 
          rawResponse: aiResponse 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (cardIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "No cards identified", 
          rawResponse: aiResponse 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ cardIds, rawResponse: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-cards:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
