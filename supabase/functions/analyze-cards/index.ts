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
    const systemPrompt = `You are a HIGHLY ACCURATE expert at identifying Lenormand tarot cards from images. Accuracy is CRITICAL.

Lenormand cards are numbered from 1 to 36. Each card has a specific design and symbolism.

CRITICAL INSTRUCTIONS - ACCURACY IS PARAMOUNT:
1. Analyze the ENTIRE image VERY CAREFULLY from LEFT to RIGHT
2. Look at EACH card's distinctive visual features in DETAIL
3. Identify ALL visible cards - typically 3 or more cards will be shown
4. Return card IDs in EXACT LEFT to RIGHT order
5. Double-check each identification - mistakes are NOT acceptable
6. Pay special attention to similar-looking cards and distinguish carefully
7. Only return empty array if absolutely NO cards are visible

QUALITY REQUIREMENTS:
- Examine each card's PRIMARY symbol (the main image)
- Check for secondary details that distinguish similar cards
- Verify your identifications before returning results
- Prioritize ACCURACY over speed

Here are all 36 Lenormand cards with their DISTINCTIVE visual characteristics:
1. Rider - A horseman or rider on horse
2. Clover - A four-leaf clover
3. Ship - A sailing ship with sails
4. House - A house or building
5. Tree - A large tree with branches
6. Clouds - Dark and light clouds
7. Snake - A serpent or snake
8. Coffin - A coffin or casket
9. Bouquet - A bouquet of flowers
10. Scythe - A scythe or sickle tool
11. Whip (Birch Rod) - A whip or birch branches/rods
12. Birds - Two birds (often facing each other)
13. Child - A young child
14. Fox - A fox animal
15. Bear - A bear animal
16. Stars - Stars in the sky
17. Stork - A stork bird
18. Dog - A dog animal
19. Tower - A tall tower building
20. Garden - A garden scene with people
21. Mountain - A mountain or mountains
22. Crossroads - A path splitting in two directions
23. Mice - Multiple mice
24. Heart - A red heart shape
25. Ring - A ring (often wedding ring)
26. Book - A closed or open book
27. Letter - A letter, envelope or document
28. Man - A man figure/person
29. Woman - A woman figure/person
30. Lily - Lily flowers
31. Sun - A bright sun
32. Moon - A crescent moon
33. Key - A key
34. Fish - Fish (one or multiple)
35. Anchor - An anchor
36. Cross - A cross symbol

Return ONLY a JSON array of numbers representing ALL card IDs you identify from left to right.
Example for 3 cards: [15, 32, 7]
Example for 5 cards: [1, 18, 24, 31, 22]

VERIFICATION CHECKLIST before returning:
1. Have I examined EACH card's main symbol carefully?
2. Have I distinguished between similar cards (e.g., Birds vs Stork, Dog vs Fox)?
3. Have I returned cards in LEFT to RIGHT order?
4. Am I confident in EACH identification?

IMPORTANT: If you see 3+ cards in the image, you MUST return 3+ IDs. Accuracy is more important than speed - take your time to identify correctly.`;

    const userPrompt = "Identify the Lenormand cards in this image from left to right. Return only a JSON array of card IDs (numbers 1-36).";

    // Call Lovable AI with image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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
