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
    const { cards, question, language } = await req.json();
    
    console.log('Interpret reading request:', { cards: cards?.length, question, language });
    
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return new Response(
        JSON.stringify({ error: "No cards provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!question) {
      return new Response(
        JSON.stringify({ error: "No question provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageNames = {
      'en': 'English',
      'zh-CN': 'Simplified Chinese (简体中文)',
      'ko': 'Korean (한국어)'
    };

    const systemPrompt = `You are an expert Lenormand card reader with deep knowledge of card meanings, combinations, and interpretations.

Your task is to provide a comprehensive, insightful reading based on the selected cards and the user's question.

IMPORTANT RESPONSE FORMAT:
You must respond with a valid JSON object with this exact structure:
{
  "overview": "A comprehensive 2-3 sentence overview of the overall reading and its energy",
  "card_analysis": [
    "Detailed analysis of card 1 (past position) - 2-3 sentences explaining its significance",
    "Detailed analysis of card 2 (present position) - 2-3 sentences explaining its significance", 
    "Detailed analysis of card 3 (future position) - 2-3 sentences explaining its significance"
  ],
  "combinations": [
    "Deep insight about the relationship between cards 1 and 2",
    "Deep insight about the relationship between cards 2 and 3",
    "Overall pattern and energy flow across all three cards"
  ],
  "advice": {
    "love": ["Specific actionable advice 1", "Specific actionable advice 2", "Specific actionable advice 3"],
    "career": ["Specific actionable advice 1", "Specific actionable advice 2", "Specific actionable advice 3"],
    "money": ["Specific actionable advice 1", "Specific actionable advice 2", "Specific actionable advice 3"],
    "personal_growth": ["Specific actionable advice 1", "Specific actionable advice 2", "Specific actionable advice 3"]
  }
}

GUIDELINES:
- Provide deep, meaningful interpretations that go beyond surface-level meanings
- Consider the specific question context in your reading
- Analyze card combinations and their synergies
- Give specific, actionable advice with timeframes when appropriate
- Be compassionate but honest
- Draw on traditional Lenormand meanings but add psychological and practical insights
- Respond in ${languageNames[language as keyof typeof languageNames] || 'English'}
- Your entire response must be valid JSON only, no additional text`;

    const cardsInfo = cards.map((card: any, index: number) => {
      const positions = ['Past', 'Present', 'Future'];
      return `${positions[index]}: Card ${card.id} - ${card.name} (${card.nameZh} / ${card.nameKo})
Keywords: ${card.keywords.join(', ')}
Themes: ${card.themes.join(', ')}`;
    }).join('\n\n');

    const userPrompt = `Question: "${question}"

Cards drawn (Past → Present → Future):
${cardsInfo}

Provide a deep, insightful reading that explores:
1. Each card's meaning in its position
2. How the cards interact and influence each other
3. The overall narrative and energy pattern
4. Specific, actionable guidance across different life areas

Remember to respond in ${languageNames[language as keyof typeof languageNames]} with valid JSON only.`;

    console.log('Calling Lovable AI for interpretation...');

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
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
    
    console.log("AI Response received, length:", aiResponse.length);

    // Parse the JSON response
    let interpretation;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      interpretation = JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e, aiResponse.substring(0, 200));
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse interpretation", 
          rawResponse: aiResponse.substring(0, 500)
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the response structure
    if (!interpretation.overview || !interpretation.card_analysis || !interpretation.combinations || !interpretation.advice) {
      console.error("Invalid interpretation structure:", interpretation);
      return new Response(
        JSON.stringify({ error: "Invalid interpretation structure" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ interpretation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in interpret-reading:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
