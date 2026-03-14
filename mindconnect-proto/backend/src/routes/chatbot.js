const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

function moodAdvice(mood) {
  if (!mood || !mood.label) return null;
  const label = mood.label.toLowerCase();

  const advice = {
    happy: {
      moodText: "You sound happy! That’s wonderful—ride the wave and use it to do something uplifting for yourself or someone else.",
      suggestions: [
        'Share a kind message with someone who makes you smile.',
        'Take a moment to write down one thing you did well today.',
        'Use this energy to start a small creative project or hobby you enjoy.'
      ]
    },
    calm: {
      moodText: "You seem calm and steady. That feeling is valuable—use it to plan a productive and balanced session.",
      suggestions: [
        'Plan one priority for the next hour and focus on just that.',
        'Take a moment to savor something (a sip of tea, a short walk, or deep breathing).',
        'Consider sharing what’s going well with someone you trust.'
      ]
    },
    neutral: {
      moodText: "You sound neutral today. It can help to add a small enjoyable activity so the day feels a bit brighter.",
      suggestions: [
        'Take a 5-minute walk to reset.',
        'Pick one small goal and celebrate when you complete it.',
        'Try a breathing exercise for a quick refresh.'
      ]
    },
    angry: {
      moodText: "It sounds like you're feeling angry. That energy can be powerful—try channeling it into something constructive.",
      suggestions: [
        'Take 3 deep breaths to help calm your body first.',
        'If you can, step outside and do a short walk or quick movement to release tension.',
        'Write down the main trigger and one small step you can take to improve the situation.',
        'Try jotting down what you’re grateful for right now to shift perspective slightly.'
      ]
    },
    excited: {
      moodText: "You seem excited! That’s a great boost. Use it to move forward with something meaningful.",
      suggestions: [
        'Jot down one goal you want to achieve with this energy.',
        'Channel excitement into starting a small creative task.',
        'Share your enthusiasm with someone—it can make the moment even better.'
      ]
    },
    sad: {
      moodText: "I'm sorry you're feeling sad. It's okay to take things a bit easier and care for yourself.",
      suggestions: [
        'Reach out to a friend or family member and let them know how you feel.',
        'Try jotting down one thing you’re grateful for, even if it feels small.',
        'Consider taking a short break with a calming activity like music or a walk.'
      ]
    },
    anxious: {
      moodText: "Feeling anxious is tough. Breaking things into tiny steps can make it easier to move forward.",
      suggestions: [
        'Try a breathing exercise: inhale 4s, hold 4s, exhale 6s.',
        'Write down the next small step you can take, then take it.',
        'Take a short sensory break: notice 5 things you can see, hear, and feel.'
      ]
    },
    depressed: {
      moodText: "It sounds like you might be feeling quite low. That’s okay — small, gentle steps can help, and reaching out can make a big difference.",
      suggestions: [
        'If you can, tell someone you trust how you’re feeling.',
        'Try a very small, kind thing for yourself (drink water, rest).',
        'Consider contacting a counselor or helpline for support.'
      ]
    }
  };

  return advice[label] || null;
}

function inferMoodFromText(text) {
  const lower = (text || '').toLowerCase();

  // Prefer explicit self-reporting ("i am ...", "i'm ...") over generic keywords.
  const explicitMatch = lower.match(/\b(i am|i'm|im)\s+(happy|angry|sad|anxious|excited|calm|depressed|stressed|neutral)\b/);
  if (explicitMatch && explicitMatch[2]) {
    const explicitMood = explicitMatch[2].trim();
    if (explicitMood === 'stressed') return { label: 'anxious' };
    return { label: explicitMood };
  }

  if (lower.includes('happy') || lower.includes('good') || lower.includes('great')) return { label: 'happy' };
  if (lower.includes('calm') || lower.includes('relaxed')) return { label: 'calm' };
  if (lower.includes('neutral') || lower.includes('okay') || lower.includes('fine')) return { label: 'neutral' };
  if (lower.includes('sad') || lower.includes('down') || lower.includes('unhappy')) return { label: 'sad' };
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('nervous') || lower.includes('stressed')) return { label: 'anxious' };
  if (lower.includes('angry') || lower.includes('mad') || lower.includes('irritated') || lower.includes('frustrated')) return { label: 'angry' };
  if (lower.includes('excited') || lower.includes('thrilled') || lower.includes('pumped')) return { label: 'excited' };
  if (lower.includes('depressed') || lower.includes('hopeless') || lower.includes('worthless')) return { label: 'depressed' };
  return null;
}

router.post('/message', authMiddleware, (req,res)=>{
  const { message, mood } = req.body;
  if(!message) return res.status(400).json({ error:'No message' });
  const lower = message.toLowerCase();
  let text="Thanks for sharing — tell me more, or press 'Emergency' if you're in immediate danger.";
  let urgent=false;
  if(lower.match(/\b(suicide|kill myself|harm myself|end my life)\b/)){
    urgent=true;
    text="This sounds urgent. Please press the Emergency button now or we can connect you to a counselor immediately.";
  } else if(lower.includes('stress') || lower.includes('exam')){
    text="Try a 3-minute breathing break. Want to start a guided exercise?";
  } else if(lower.includes('sleep')){
    text="Sleep routines help. Would you like sleep hygiene tips?";
  }

  const inferredMood = inferMoodFromText(message);
  // Prefer mood inferred from the user message text; fall back to any provided mood context.
  const moodInfo = moodAdvice(inferredMood) || moodAdvice(mood);

  // Use mood-based response text when available, but keep fallback text as a safety.
  if (moodInfo?.moodText) {
    text = moodInfo.moodText;
  }

  const suggestions = [];
  if (moodInfo && Array.isArray(moodInfo.suggestions)) {
    suggestions.push(...moodInfo.suggestions);
  }

  // Add a few suggestion variations based on keywords in the message.
  if (lower.includes('stress')) {
    suggestions.push('Try a brief breathing exercise (inhale 4, hold 4, exhale 6).');
  }
  if (lower.includes('sleep')) {
    suggestions.push('Try setting a consistent bedtime and avoiding screens 30 minutes before sleeping.');
  }
  if (lower.includes('focus') || lower.includes('study') || lower.includes('exam')) {
    suggestions.push('Break tasks into small steps and reward yourself for each one you complete.');
  }

  // NOTE: replace with real LLM / intent classifier in production.
  res.json({
    text,
    urgent,
    moodText: moodInfo?.moodText || null,
    suggestions: suggestions.length > 0 ? suggestions : null
  });
});

module.exports = router;
