const { OpenAI } = require('openai');
const { generateLocalPlan } = require('./fallbackService');

// Initialize OpenAI client
// We initialize lazily or wrap in a try-catch to prevent crash if key is missing/invalid
let openaiInstance = null;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_api_key')) {
    return null;
  }
  
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: apiKey
    });
  }
  return openaiInstance;
}

/**
 * Generates user-customized workout and diet plan using OpenAI gpt-4o-mini
 */
async function generateAIFitnessPlan(user) {
  const client = getOpenAIClient();
  
  if (!client) {
    console.log('🔌 OpenAI Key is missing or default. Falling back to local smart generation engine...');
    return generateLocalPlan(user);
  }

  const { name, age, gender, height, weight, medicalConditions, injuries, dailyRoutine, workoutTime, dietType, budget } = user;

  const systemPrompt = `You are an elite, celebrity-tier personal trainer, medical fitness coach, and clinical sports nutritionist. 
Your task is to design a highly personalized, luxury-tier Workout and Diet Plan for a user.
You MUST respond ONLY with a single JSON object. Do not include any markdown format tags like \`\`\`json or trailing commentary.

The response JSON structure must match this EXACT schema:
{
  "workout": {
    "routineName": "string (premium, luxury-sounding routine name)",
    "availableTime": number (must match availableTime from input),
    "safetyModifier": "string (overarching safety warnings regarding injuries or medical status)",
    "exercises": [
      {
        "name": "string",
        "sets": "string (e.g. '3')",
        "reps": "string (e.g. '12' or '30s')",
        "rest": "string (e.g. '60s')",
        "instructions": "string (concise form guide)",
        "safetyNote": "string (crucial safety instruction, especially if injury is related)"
      }
    ]
  },
  "diet": {
    "dietType": "string (Vegetarian, Non-Vegetarian, Eggitarian, Vegan)",
    "monthlyBudgetINR": number (must match budget from input),
    "estimatedDailyCostINR": number (sum of the meals' costEstimateINR),
    "macros": {
      "protein": "string (e.g., '120g')",
      "carbs": "string (e.g., '210g')",
      "fats": "string (e.g., '65g')",
      "calories": "string (e.g., '1900 kcal')"
    },
    "meals": {
      "breakfast": {
        "name": "string",
        "ingredients": ["string"],
        "costEstimateINR": number
      },
      "lunch": {
        "name": "string",
        "ingredients": ["string"],
        "costEstimateINR": number
      },
      "snack": {
        "name": "string",
        "ingredients": ["string"],
        "costEstimateINR": number
      },
      "dinner": {
        "name": "string",
        "ingredients": ["string"],
        "costEstimateINR": number
      }
    }
  }
}

STRICT NUTRITIONAL & ECONOMIC RULES:
1. The diet plan MUST strictly follow the requested dietType: "${dietType}".
2. The user has a strict monthly food budget of ₹${budget} INR. This translates to roughly ₹${Math.round(budget/30)} INR per day.
3. Every meal's costEstimateINR must be realistic, utilizing budget-friendly local Indian staples (e.g. Oats, Egg Whites, Soya Chunks, Paneer, Chickpeas, Daal, Rice, Peanut Butter, seasonal vegetables, local fruits) to stay strictly within or below the daily budget.
4. If the budget is generous (e.g. > ₹8,000/month), you may include premium staples like Whey Protein, Greek Yogurt, Avocados, Chia/Flax Seeds, Broccoli, Tofu.
5. If the user lists a Medical Condition ("${medicalConditions}"), modify the macros and carbs accordingly (e.g. restrict sugar/high-GI carbs and include high fiber if Diabetes is mentioned).
6. If the user lists an Injury ("${injuries}"), you must explicitly provide a "safetyNote" under exercises that might impact that injury, or replace standard heavy compounds with spinal/knee-supported alternatives. Add an overarching warning in "safetyModifier".
7. Structure the workout length (number of exercises, rest times) to fit perfectly in the available time: ${workoutTime} minutes.`;

  const userPrompt = `Generate a customized premium fitness and diet plan for the following user:
Name: ${name}
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Medical Conditions: ${medicalConditions}
Injuries: ${injuries}
Daily Routine description: ${dailyRoutine}
Available workout time per day: ${workoutTime} minutes
Dietary preference: ${dietType}
Monthly food budget: ₹${budget} INR (Daily cap: ₹${Math.round(budget/30)} INR)`;

  try {
    // Prefer the Responses API (modern SDKs). Fallback to chat.completions if necessary.
    let textOutput = null;

    if (client.responses && typeof client.responses.create === 'function') {
      const resp = await client.responses.create({
        model: 'gpt-4o-mini',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      });

      // Try common response fields across SDK versions
      if (resp.output_text) {
        textOutput = resp.output_text;
      } else if (resp.output && resp.output.length) {
        // Concatenate any text chunks
        textOutput = resp.output.map(o => {
          if (typeof o === 'string') return o;
          if (o.content) {
            return o.content.map(c => c.text || c).join('');
          }
          return '';
        }).join('');
      } else if (resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content) {
        textOutput = resp.choices[0].message.content;
      }

    } else if (client.chat && client.chat.completions && typeof client.chat.completions.create === 'function') {
      const resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      });

      if (resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content) {
        textOutput = resp.choices[0].message.content;
      }
    }

    if (!textOutput) {
      throw new Error('No textual output returned from OpenAI client');
    }

    const jsonText = textOutput
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '');
    const cleanJSON = JSON.parse(jsonText);
    return cleanJSON;

  } catch (error) {
    console.error('⚠️ OpenAI Generation Error:', error && error.message ? error.message : error);
    console.log('🔄 Gracefully falling back to local smart generation engine to protect uptime...');
    return generateLocalPlan(user);
  }
}

module.exports = {
  generateAIFitnessPlan
};
