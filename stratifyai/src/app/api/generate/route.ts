import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SONG_DATABASE: Record<string, Array<{ songName: string; artist: string; spotifyTrackId: string }>> = {
  english: [
    { songName: "Falling", artist: "Trevor Daniel", spotifyTrackId: "2rRJrJEo19S2J82BDsQ3F7" },
    { songName: "Astronaut In The Ocean", artist: "Masked Wolf", spotifyTrackId: "0BGwAKW4u8kWOhWFflZxfl" },
    { songName: "Let Me Down Slowly", artist: "Alec Benjamin", spotifyTrackId: "2qxmye6gAegTMjLKEBoR3d" },
    { songName: "2002", artist: "Anne-Marie", spotifyTrackId: "2BgEsaKNfHUdlh97KmvFyo" },
    { songName: "As It Was", artist: "Harry Styles", spotifyTrackId: "4LRPiXqCikMaN15xV39Y3a" },
    { songName: "Blinding Lights", artist: "The Weeknd", spotifyTrackId: "0VjIj6eRzTxqpOI5NetG4i" },
    { songName: "Stay", artist: "The Kid LAROI & Justin Bieber", spotifyTrackId: "5PjdY0CKG2P21G2Jm2tquK" },
    { songName: "Cruel Summer", artist: "Taylor Swift", spotifyTrackId: "1BxfuPKQ2ZJ6pD524F2G3H" },
    { songName: "Starboy", artist: "The Weeknd", spotifyTrackId: "7MXVkk9YMctZqd1Srtv4MB" }
  ],
  hindi: [
    { songName: "Khat", artist: "Navjot Ahuja", spotifyTrackId: "3gixnmepHSsyAuho34rprN" },
    { songName: "Gehra Hua", artist: "Shashwat Sachdev & Arijit Singh", spotifyTrackId: "0Y6YW1552df031DjV8qBHv" },
    { songName: "Bairan", artist: "Banjaare", spotifyTrackId: "0RsH8g8DxdYZgdGcod5I36" },
    { songName: "Kesariya", artist: "Arijit Singh", spotifyTrackId: "6VBhH7sC9nN8m8a37Y617P" },
    { songName: "Apna Bana Le", artist: "Arijit Singh", spotifyTrackId: "34s4d915s94D5B6a9F1j2c" },
    { songName: "Maan Meri Jaan", artist: "King", spotifyTrackId: "50Q02S1ZY0hwbmHTMABuDC" }
  ],
  kannada: [
    { songName: "Tulasi", artist: "Sumedh K & Sumant Shridhar", spotifyTrackId: "1CQ7sRQeHw1xIzLSOkGXHn" },
    { songName: "Gira Gira", artist: "Vasuki Vaibhav", spotifyTrackId: "7vwrPdFX2FNF6imTRXO4Pw" },
    { songName: "Masth Malaika", artist: "B. Ajaneesh Loknath & Nakash Aziz", spotifyTrackId: "17r18GzFNJzLZxn0d3k0ns" },
    { songName: "Singara Siriye", artist: "Vijay Prakash & Ananya Bhat", spotifyTrackId: "55Zp6xvOvNwIB8nno2AhEz" },
    { songName: "Belageddu", artist: "Vijay Prakash", spotifyTrackId: "1LqRkXp6bM4yD6q6S86Z7r" }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, feature, inputs, customApiKey, image } = body;

    // Check API Key: prioritize custom key from frontend, fallback to server environment
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API_KEY_MISSING",
          message: "Gemini API Key is missing. Please configure it in your environment or enter it via the Settings modal in the top right.",
        },
        { status: 400 }
      );
    }

    if (!platform || !feature || !inputs) {
      return NextResponse.json(
        { error: "INVALID_PARAMETERS", message: "Platform, feature, and inputs are required." },
        { status: 400 }
      );
    }

    let prompt = "";

    // Build the prompt based on the platform and feature
    if (platform === "instagram") {
      switch (feature) {
        case "trendPredictor":
          prompt = `You are an expert Instagram Social Media Strategist and Product Manager.
Analyze the trend predictions for:
- Business Category: ${inputs.category || "General"}
- Target Audience: ${inputs.audience || "General Instagram Users"}
- Country: ${inputs.country || "Worldwide"}

Identify trending topics, viral opportunities, trending hashtags, suggested reel ideas (with hook, audio concept, and script outline), and competitor benchmarks.
Respond STRICTLY with a JSON object. Do not include markdown wraps like \`\`\`json. Ensure it matches this schema exactly:
{
  "trendingTopics": [
    { "title": "Topic title", "description": "Why it is trending", "relevanceScore": "High/Medium/Low" }
  ],
  "viralOpportunities": [
    { "angle": "Unique angle name", "concept": "Execution concept", "type": "Reel / Carousel / Story" }
  ],
  "trendingHashtags": [
    { "tag": "#example", "volume": "Estimated reach/engagement", "context": "How to use" }
  ],
  "suggestedReels": [
    { "title": "Reel Title", "hook": "Attention grabber hook", "audioConcept": "Suggested audio description", "visualScript": "Detailed visual timeline" }
  ],
  "competitorInsights": [
    { "benchmark": "What competitors are doing", "keyTakeaway": "Actionable takeaway for user" }
  ]
}`;
          break;

        case "trendingSongs":
          prompt = `You are an expert Instagram reels strategist.
Recommend exactly ONE trending Reels song from the following database that best matches:
- Language: ${inputs.language || "English"}
- Content Niche: ${inputs.niche || "General"}
${inputs.exclude ? `- EXCLUDE this song from recommendations: "${inputs.exclude}"` : ""}

DATABASE OF SONGS (Only select from here based on selected Language):

- English Tracks:
  1. Title: "Falling", Artist: "Trevor Daniel", spotifyTrackId: "2rRJrJEo19S2J82BDsQ3F7"
  2. Title: "Astronaut In The Ocean", Artist: "Masked Wolf", spotifyTrackId: "0BGwAKW4u8kWOhWFflZxfl"
  3. Title: "Let Me Down Slowly", Artist: "Alec Benjamin", spotifyTrackId: "2qxmye6gAegTMjLKEBoR3d"
  4. Title: "2002", Artist: "Anne-Marie", spotifyTrackId: "2BgEsaKNfHUdlh97KmvFyo"
  5. Title: "As It Was", Artist: "Harry Styles", spotifyTrackId: "4LRPiXqCikMaN15xV39Y3a"
  6. Title: "Blinding Lights", Artist: "The Weeknd", spotifyTrackId: "0VjIj6eRzTxqpOI5NetG4i"
  7. Title: "Stay", Artist: "The Kid LAROI & Justin Bieber", spotifyTrackId: "5PjdY0CKG2P21G2Jm2tquK"
  8. Title: "Cruel Summer", Artist: "Taylor Swift", spotifyTrackId: "1BxfuPKQ2ZJ6pD524F2G3H"
  9. Title: "Starboy", Artist: "The Weeknd", spotifyTrackId: "7MXVkk9YMctZqd1Srtv4MB"

- Hindi Tracks:
  1. Title: "Khat", Artist: "Navjot Ahuja", spotifyTrackId: "3gixnmepHSsyAuho34rprN"
  2. Title: "Gehra Hua", Artist: "Shashwat Sachdev & Arijit Singh", spotifyTrackId: "0Y6YW1552df031DjV8qBHv"
  3. Title: "Bairan", Artist: "Banjaare", spotifyTrackId: "0RsH8g8DxdYZgdGcod5I36"
  4. Title: "Kesariya", Artist: "Arijit Singh", spotifyTrackId: "6VBhH7sC9nN8m8a37Y617P"
  5. Title: "Apna Bana Le", Artist: "Arijit Singh", spotifyTrackId: "34s4d915s94D5B6a9F1j2c"
  6. Title: "Maan Meri Jaan", Artist: "King", spotifyTrackId: "50Q02S1ZY0hwbmHTMABuDC"

- Kannada Tracks:
  1. Title: "Tulasi", Artist: "Sumedh K & Sumant Shridhar", spotifyTrackId: "1CQ7sRQeHw1xIzLSOkGXHn"
  2. Title: "Gira Gira", Artist: "Vasuki Vaibhav", spotifyTrackId: "7vwrPdFX2FNF6imTRXO4Pw"
  3. Title: "Masth Malaika", Artist: "B. Ajaneesh Loknath & Nakash Aziz", spotifyTrackId: "17r18GzFNJzLZxn0d3k0ns"
  4. Title: "Singara Siriye", Artist: "Vijay Prakash & Ananya Bhat", spotifyTrackId: "55Zp6xvOvNwIB8nno2AhEz"
  5. Title: "Belageddu", Artist: "Vijay Prakash", spotifyTrackId: "1LqRkXp6bM4yD6q6S86Z7r"

Choose the song from the selected language that best fits the content niche (e.g. tech, travel, comedy). If 'exclude' is provided, pick a different song from the corresponding language list.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "isAiGeneratedSignal": true,
  "trendingSongs": [
    {
      "songName": "Name of selected song from list",
      "artist": "Artist of selected song",
      "spotifyTrackId": "The corresponding spotifyTrackId string from the list",
      "matchReason": "Why this song matches the selected content niche (e.g. why 'Starboy' is great for tech unboxing)",
      "reelIdea": "Specific Reel idea to create using this audio",
      "trendStatus": "Viral / Rising"
    }
  ]
}`;
          break;

        case "contentStrategy":
          prompt = `You are an AI Product Manager and Content Strategist.
Create an Instagram Content Strategy and Calendar for:
- Business Name: ${inputs.businessName || "Creator"}
- Business Type: ${inputs.businessType || "General Niche"}
- Goal: ${inputs.goal || "Brand Awareness"}
- Posting Frequency: ${inputs.frequency || "Weekly"}

Provide content pillars, a posting schedule summary, and a calendar list of post ideas. If frequency is "Weekly", generate 7 days of ideas. If "Monthly", generate 15 key ideas across the month.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "contentPillars": [
    { "name": "Pillar Name", "description": "What this pillar focuses on" }
  ],
  "calendar": [
    {
      "day": "Day 1 / Week 1 Day 1",
      "topic": "Post Topic Title",
      "format": "Reel", // Reel, Carousel, or Story
      "concept": "Core post concept",
      "captionOutline": "Quick caption copy draft",
      "visualCue": "Visual or image instruction"
    }
  ],
  "postingSchedule": "Summary description of best posting times and routine"
}`;
          break;

        case "growthOptimizer":
          prompt = `You are an Instagram Growth Optimizer.
Optimize this content details:
- Topic: ${inputs.topic || "Social media growth"}
- Platform Goal: ${inputs.goal || "Follower Growth"}

Provide an engaging hook, high-converting caption, tags, a call to action, posting window, and user engagement hacks.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "caption": "Full caption copy text",
  "hook": "First line hook to capture attention",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "Strong call to action line",
  "bestPostingTime": "Best time window to post this",
  "engagementTips": ["Tip 1", "Tip 2"]
}`;
          break;

        default:
          return NextResponse.json({ error: "UNKNOWN_FEATURE" }, { status: 400 });
      }
    } else if (platform === "linkedin") {
      switch (feature) {
        case "thoughtLeadership":
          prompt = `You are a LinkedIn thought leadership strategist.
Build a thought leadership planner for:
- Industry/Niche: ${inputs.niche || "Technology"}
- Target Audience: ${inputs.audience || "Professionals"}
- Goal: ${inputs.goal || "Lead Generation"}

Provide weekly post ideas, educational frameworks, industry insight points, and personal story starters.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "weeklyPostIdeas": [
    { "day": "Monday", "title": "Post Title", "contentOutline": "Outline of the post body", "type": "Educational" } // Educational, Industry Insight, or Personal Story
  ],
  "educationalContent": [
    { "topic": "Framework Topic", "framework": "How to structure this educational post" }
  ],
  "industryInsights": [
    { "trend": "Trending Industry Shift", "expertTake": "What professional take to present" }
  ],
  "personalStoryIdeas": [
    { "hookEvent": "Personal struggle/event to start with", "businessLesson": "Professional takeaway" }
  ]
}`;
          break;

        case "hookGenerator":
          prompt = `You are a LinkedIn copywriting expert.
Generate high-performing hooks for:
- Post Topic: ${inputs.topic || "Remote work"}
- Target Audience: ${inputs.audience || "Hiring Managers"}

Provide 10 hooks categorized into Curiosity, Story, Data-driven, and Bold Statement.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "hooks": [
    {
      "text": "The hook line",
      "category": "Curiosity", // Curiosity, Story, Data-driven, or Bold Statement
      "tip": "Why this works for the audience"
    }
  ]
}`;
          break;

        case "brandRoadmap":
          prompt = `You are an executive personal branding consultant on LinkedIn.
Create a long-term personal brand roadmap for:
- Industry/Focus: ${inputs.industry || "Software Engineering"}
- Focus Area: ${inputs.focus || "AI/ML Integration"}
- Goal: ${inputs.goal || "Career growth & consulting gigs"}

Generate weekly objectives, brand pillars/themes, networking strategies, engagement tactics, and a 30-day chronological milestone plan.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "weeklyObjectives": [
    { "week": 1, "goal": "Week 1 theme/objective", "tasks": ["Task 1", "Task 2"] }
  ],
  "contentThemes": ["Theme A", "Theme B"],
  "networkingStrategy": ["Strategy 1", "Strategy 2"],
  "engagementStrategy": ["Tactic 1", "Tactic 2"],
  "roadmap30Days": [
    { "dayRange": "Days 1-7", "focus": "Actions to focus on" }
  ]
}`;
          break;

        default:
          return NextResponse.json({ error: "UNKNOWN_FEATURE" }, { status: 400 });
      }
    } else if (platform === "shorts") {
      switch (feature) {
        case "shortsTrend":
          prompt = `You are an expert YouTube Shorts producer.
Find trending Short ideas for:
- Content Niche: ${inputs.niche || "Tech Reviews"}
- Country: ${inputs.country || "United States"}

Provide viral topics, trending formats, best upload schedules, and clickable/visual thumbnail ideas.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "viralTopics": [
    { "title": "Video Topic Concept", "explanation": "Why this works for Shorts", "viralPotential": "Score 1-10 or Percentage" }
  ],
  "trendingFormats": [
    { "name": "Format Name", "description": "How the video is structured", "referenceStyle": "Visual style reference" }
  ],
  "bestUploadTime": "Summary of best times to publish on YouTube Shorts",
  "suggestedThumbnails": [
    { "description": "Visual scene description", "overlayText": "Bold text overlay", "visualTheme": "Color theme/vibe" }
  ]
}`;
          break;

        case "retentionOptimizer":
          prompt = `You are a YouTube Shorts retention analyst.
Optimize this script for maximum watch time and hook engagement:
Script:
"${inputs.script || ""}"

Identify an improved first 5 seconds, write a stronger hook, and provide specific timestamp-by-timestamp retention modifications and watch time optimizations.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "improvedFirstFiveSeconds": "Script rewrite for first 5 seconds",
  "betterHook": "Multiple alternate punchy hook variations",
  "retentionSuggestions": [
    { "timestampRange": "0:05 - 0:15", "issue": "Why viewers drop here", "solution": "What visual/verbal change to make" }
  ],
  "watchTimeOptimization": [
    "Tip 1 for looping or CTR",
    "Tip 2 for editing rhythm"
  ]
}`;
          break;

        case "seriesPlanner":
          prompt = `You are a professional YouTube Shorts content planner.
Convert this single content idea into a high-retention 10-part series:
Idea: "${inputs.idea || "Coding hacks"}"

Provide a series name, story progression summary, optimal publishing schedule, and 10 detailed individual episode breakdowns.
Respond STRICTLY with a JSON object. Do not include markdown wraps. Ensure it matches this schema:
{
  "seriesName": "Catchy Series Title",
  "storyProgression": "Narrative arc across the 10 episodes",
  "publishingSchedule": "Pacing recommendation",
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "Episode 1 Title",
      "hook": "Episode-specific hook",
      "plotPoints": "Core points to cover in 45 seconds",
      "CTA": "Episode 1 specific CTA"
    }
  ]
}`;
          break;

        default:
          return NextResponse.json({ error: "UNKNOWN_FEATURE" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "UNKNOWN_PLATFORM" }, { status: 400 });
    }

    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash since it is available in this environment and supports JSON response schema
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const contents: any[] = [];
    if (image && image.data && image.mimeType) {
      contents.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType,
        },
      });
      contents.push(prompt + "\n\nCRITICAL MULTIMODAL INSTRUCTION: You are also provided an image (e.g., profile screenshot, bio page, or portfolio mockup). Scan this image for text and visual content. If the user has a tech background or developer portfolio, extract their specific tech stack, brand topics, and visual identity. Generate and customize the JSON output fields (trending topics, suggested reels, calendar scripts, and hashtags) so they are highly relevant to this specific tech background and match their profile identity.");
    } else {
      contents.push(prompt);
    }

    const result = await model.generateContent(contents);
    const responseText = result.response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", responseText);
      // Fail-safe parser attempt: extract JSON if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Gemini returned invalid JSON: " + responseText);
      }
    }

    // Validate trendingSongs output to guarantee a single-track ID from our SONG_DATABASE
    if (platform === "instagram" && feature === "trendingSongs") {
      try {
        const lang = (inputs.language || "English").toLowerCase();
        const dbSongs = SONG_DATABASE[lang] || SONG_DATABASE.english;
        
        let song = data.trendingSongs?.[0];
        
        // Find matching song in our local database by name or track ID
        let matchingDbSong = dbSongs.find(
          s => s.songName.toLowerCase() === song?.songName?.toLowerCase() || 
               s.spotifyTrackId === song?.spotifyTrackId
        );
        
        if (!matchingDbSong) {
          // If no matching song was found (e.g. Gemini hallucinated one), select a candidate from the DB
          let candidates = dbSongs;
          if (inputs.exclude) {
            candidates = dbSongs.filter(s => s.songName.toLowerCase() !== inputs.exclude.toLowerCase());
            if (candidates.length === 0) candidates = dbSongs;
          }
          // Pick a random candidate from the database
          matchingDbSong = candidates[Math.floor(Math.random() * candidates.length)];
        }
        
        // Overwrite the returned song values with the correct database track properties
        data.trendingSongs = [{
          songName: matchingDbSong.songName,
          artist: matchingDbSong.artist,
          spotifyTrackId: matchingDbSong.spotifyTrackId,
          matchReason: song?.matchReason || `This track matches the ${inputs.niche || 'general'} niche perfectly due to its tempo and high user engagement rate.`,
          reelIdea: song?.reelIdea || `Create a reel highlighting key tips about ${inputs.niche || 'your niche'} set to the beat of this song.`,
          trendStatus: song?.trendStatus || "Viral"
        }];
      } catch (err) {
        console.error("Error post-validating trending song:", err);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error in Generate route:", error);
    return NextResponse.json(
      { error: "GENERATION_FAILED", message: error.message || "An error occurred during strategy generation." },
      { status: 500 }
    );
  }
}
