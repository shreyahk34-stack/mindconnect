import React from 'react';

function getLatestMood() {
  try {
    const raw = localStorage.getItem('moodHistory');
    if (!raw) return null;
    const history = JSON.parse(raw);
    if (!Array.isArray(history) || history.length === 0) return null;
    return history[0].mood || null;
  } catch {
    return null;
  }
}

function getDietPlanForMood(mood) {
  if (!mood || !mood.label) {
    return {
      title: 'Track your mood to get a tailored food plan',
      description:
        'Once you log today’s mood in the Mood Tracker, we will suggest meals that support your energy, focus and emotional balance.',
      tips: [
        'Eat regular meals (3 main + 1–2 snacks) to keep blood sugar stable',
        'Include fruits / vegetables at least twice a day',
        'Drink water regularly through the day',
      ],
      dayPlan: [],
    };
  }

  const label = mood.label.toLowerCase();

  if (label === 'happy' || label === 'calm') {
    return {
      title: 'You seem in a good mood – fuel your brain for performance 🧠',
      description:
        'Use this energy for focused study with balanced meals that keep your concentration high.',
      tips: [
        'Aim for balanced plates: complex carbs + protein + healthy fats',
        'Avoid heavy junk food that can make you sleepy during study',
        'Keep a bottle of water near you while working',
      ],
      dayPlan: [
        {
          meal: 'Breakfast',
          ideas:
            'Oats with milk/curd, nuts and banana OR whole‑wheat toast with peanut butter and fruit',
        },
        {
          meal: 'Lunch',
          ideas:
            'Rice/roti with dal, vegetables and a small salad; add curd for gut health',
        },
        {
          meal: 'Evening snack',
          ideas:
            'Handful of nuts + fruit OR yoghurt with seeds OR chana/sprouts',
        },
        {
          meal: 'Dinner',
          ideas:
            'Light but balanced: roti/rice with dal/rajma/chole and cooked vegetables',
        },
      ],
    };
  }

  if (label === 'neutral') {
    return {
      title: 'Neutral mood – keep things steady and simple 😊',
      description:
        'Choose simple, familiar foods that keep your energy stable without too much effort.',
      tips: [
        'Try not to skip meals, even if you are “just not hungry”',
        'Prepare or choose foods that are easy to digest',
        'Add at least one colourful fruit or vegetable in the day',
      ],
      dayPlan: [
        {
          meal: 'Breakfast',
          ideas:
            'Idli/dosa/poha/upma with chutney OR simple bread + eggs/cheese + fruit',
        },
        {
          meal: 'Lunch',
          ideas:
            'Home‑style thali: dal, rice/roti, simple sabzi; avoid very oily options',
        },
        {
          meal: 'Snack',
          ideas: 'Fruit, buttermilk, coconut water or roasted chana',
        },
        {
          meal: 'Dinner',
          ideas:
            'Khichdi, pulao with veggies, or stuffed roti with curd for a light finish',
        },
      ],
    };
  }

  if (label === 'sad' || label === 'depressed') {
    return {
      title: 'Low mood – be kind to yourself with gentle nutrition 💙',
      description:
        'On sad / low days, focus on small, doable meals that prevent you from skipping food.',
      tips: [
        'Eat something, even if it is a small portion – your brain needs fuel',
        'If cooking feels hard, choose easy options (bananas, nuts, curd, simple sandwiches)',
        'Avoid depending only on sugary snacks – they cause energy crashes later',
      ],
      dayPlan: [
        {
          meal: 'Easy breakfast',
          ideas:
            'Banana + handful of nuts OR curd with sugar and fruit OR a simple sandwich',
        },
        {
          meal: 'Comfort lunch',
          ideas:
            'Khichdi, curd rice, dal‑chawal or any soft, home‑style food you like',
        },
        {
          meal: 'Snack',
          ideas:
            'Fruit, boiled corn, or a glass of milk; keep it very simple and reachable',
        },
        {
          meal: 'Light dinner',
          ideas:
            'Dal soup + toast, upma/poha, or leftover lunch in a small portion',
        },
      ],
    };
  }

  if (label === 'anxious') {
    return {
      title: 'Feeling anxious – choose foods that calm, not spike ⚖️',
      description:
        'Anxiety can get worse with too much caffeine, sugar and long gaps between meals.',
      tips: [
        'Avoid too much coffee/energy drinks before exams or study',
        'Prefer warm, cooked meals over only snacks',
        'Add magnesium‑rich options like nuts, seeds, leafy veggies when you can',
      ],
      dayPlan: [
        {
          meal: 'Breakfast',
          ideas:
            'Warm options like upma/poha/idli or oats with milk and a few nuts',
        },
        {
          meal: 'Mid‑morning',
          ideas:
            'Fruit or buttermilk to avoid long gaps and stabilize blood sugar',
        },
        {
          meal: 'Lunch',
          ideas:
            'Balanced thali with dal, sabzi, roti/rice; avoid very spicy, very oily food',
        },
        {
          meal: 'Evening',
          ideas:
            'Herbal tea, nuts, or sprouts instead of high‑sugar packaged snacks',
        },
        {
          meal: 'Dinner',
          ideas:
            'Light, early dinner: khichdi, veg pulao or roti with simple dal/sabzi',
        },
      ],
    };
  }

  return {
    title: 'General balanced plan for today',
    description:
      'Even if your mood is mixed, a regular eating pattern helps your mind and body cope better.',
    tips: [
      '3 main meals + 1–2 small snacks',
      'Half the plate veggies + one quarter protein + one quarter carbs (when possible)',
      'Water regularly through the day',
    ],
    dayPlan: [],
  };
}

const DietPlanner = () => {
  const mood = getLatestMood();
  const plan = getDietPlanForMood(mood);

  return (
    <div className="card diet-planner">
      <h3>🍎 Mood‑Based Diet Planner</h3>
      {mood ? (
        <p className="diet-mood-line">
          Latest mood detected: <span className="diet-mood-pill">{mood.emoji} {mood.label}</span>
        </p>
      ) : (
        <p className="diet-mood-line">
          No mood tracked yet today. Log your mood on the dashboard for a personalized food plan.
        </p>
      )}

      <h4 className="diet-title">{plan.title}</h4>
      <p className="diet-description">{plan.description}</p>

      {plan.tips && plan.tips.length > 0 && (
        <div className="diet-section">
          <h5>Key tips for today</h5>
          <ul className="diet-list">
            {plan.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {plan.dayPlan && plan.dayPlan.length > 0 && (
        <div className="diet-section">
          <h5>Sample day plan</h5>
          <div className="diet-grid">
            {plan.dayPlan.map((block, idx) => (
              <div key={idx} className="diet-block">
                <div className="diet-block-meal">{block.meal}</div>
                <div className="diet-block-ideas">{block.ideas}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="diet-note">
        This planner is educational and not a medical prescription. If you have health conditions or
        eating‑related concerns, please consult a doctor or nutritionist.
      </p>
    </div>
  );
};

export default DietPlanner;




