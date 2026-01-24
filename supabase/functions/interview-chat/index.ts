import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  interviewId: string;
  roleType: string;
  difficulty: string;
  jobDescription?: string;
  messages: Message[];
  action: "start" | "respond" | "end";
}

const rolePrompts: Record<string, string> = {
  devops: "DevOps Engineer with expertise in CI/CD, Docker, Kubernetes, AWS/Azure/GCP, Infrastructure as Code, monitoring, and automation",
  cloud: "Cloud Engineer specializing in cloud architecture, migration, security, cost optimization, and multi-cloud strategies",
  software: "Software Engineer with knowledge of system design, algorithms, data structures, OOP, and software development best practices",
  data: "Data Engineer with expertise in data pipelines, ETL, big data technologies, SQL, and data warehousing",
  fullstack: "Full Stack Developer proficient in frontend frameworks, backend technologies, databases, and API design",
  frontend: "Frontend Developer with expertise in React, Vue, Angular, CSS, performance optimization, and accessibility",
  backend: "Backend Developer skilled in server-side development, databases, APIs, microservices, and system design",
};

const difficultyContext: Record<string, string> = {
  beginner: "This is a beginner-level interview for entry-level candidates (0-2 years experience). Ask fundamental questions, be encouraging, and provide hints when needed.",
  intermediate: "This is an intermediate-level interview for mid-level candidates (2-5 years experience). Ask moderately challenging questions that test practical knowledge and problem-solving.",
  advanced: "This is an advanced-level interview for senior candidates (5+ years experience). Ask complex questions about architecture, trade-offs, leadership, and deep technical expertise.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body: RequestBody = await req.json();
    const { roleType, difficulty, jobDescription, messages, action } = body;

    let systemPrompt = `You are an experienced technical interviewer conducting a mock interview for a ${rolePrompts[roleType] || "Software Engineer"} position in India's IT industry.

${difficultyContext[difficulty] || difficultyContext.intermediate}

${jobDescription ? `The candidate is applying for a role with this job description: ${jobDescription}` : ""}

Interview Guidelines:
- Be professional, friendly, and encouraging
- Ask one question at a time
- Wait for the candidate's response before asking follow-up questions
- Provide brief feedback after each answer (what was good, what could be improved)
- Ask follow-up questions based on their answers to probe deeper
- Cover technical skills, problem-solving, and situational questions
- Keep responses concise but helpful
- Use Indian IT industry context when relevant (mention common companies, technologies used in India)`;

    let userPrompt = "";

    if (action === "start") {
      userPrompt = "Start the interview with a warm greeting, briefly introduce yourself as the interviewer, and ask your first question. Keep it professional and encouraging.";
    } else if (action === "respond") {
      userPrompt = "Continue the interview based on the candidate's response. Provide brief feedback on their answer, then either ask a follow-up question or move to a new topic. Keep the conversation flowing naturally.";
    } else if (action === "end") {
      systemPrompt = `You are evaluating a mock interview for a ${rolePrompts[roleType] || "Software Engineer"} position. Analyze the conversation and provide:

1. An overall score from 0-100
2. Skill ratings as a JSON object with skills relevant to the role (each rated 0-100)
3. A brief feedback summary (2-3 paragraphs)
4. An improvement plan as an array of 3-5 actionable items

Respond ONLY with valid JSON in this exact format:
{
  "overallScore": <number>,
  "skillRatings": {"skill_name": <number>, ...},
  "summary": "<string>",
  "improvementPlan": ["<string>", ...]
}`;
      userPrompt = "Evaluate this interview and provide the structured feedback.";
    }

    const apiMessages: Message[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    if (userPrompt) {
      apiMessages.push({ role: "user", content: userPrompt });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: action === "end" ? 1500 : 800,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please upgrade your plan." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    if (action === "end") {
      try {
        // Parse the JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const feedback = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify(feedback), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("Could not parse feedback JSON");
      } catch (parseError) {
        console.error("Parse error:", parseError);
        // Return default feedback if parsing fails
        return new Response(
          JSON.stringify({
            overallScore: 70,
            skillRatings: { technical_knowledge: 70, communication: 75, problem_solving: 70 },
            summary: "Thank you for completing this mock interview. You showed good potential and understanding of the core concepts. Continue practicing to improve your confidence and depth of knowledge.",
            improvementPlan: [
              "Practice explaining complex concepts in simple terms",
              "Work on more hands-on projects to gain practical experience",
              "Study common interview patterns for your target role",
            ],
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ message: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Interview chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
