import React, { useState } from 'react';
import { submitScreening } from '../api';

const phq = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself',
  'Trouble concentrating',
  'Moving or speaking slowly or being fidgety',
  'Thoughts that you would be better off dead',
];

const gad = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

// Simple, educational versions (not official copyrighted items)
const ghq = [
  'Have you recently been able to concentrate on what you are doing?',
  'Have you recently lost much sleep over worry?',
  'Have you recently felt constantly under strain?',
  'Have you recently felt you could not overcome your difficulties?',
  'Have you recently been feeling unhappy or depressed?',
  'Have you recently been losing confidence in yourself?',
  'Have you recently felt you are a worthless person?',
  'Have you recently been able to enjoy your normal day‑to‑day activities?',
];

const bdi = [
  'How often have you felt sad or low in mood?',
  'How often have you lost interest in people or activities?',
  'How often have you felt tired or had little energy?',
  'How often have you felt guilty or like a failure?',
  'How often have you had difficulty concentrating?',
  'How often have you had negative thoughts about yourself or the future?',
  'How often have you had changes in sleep (too much or too little)?',
  'How often have you had changes in appetite (more or less than usual)?',
  'How often have you had thoughts that life is not worth living?',
];

// Very short, high‑level personality / distress screener inspired by MMPI style domains
const mmpiShort = [
  'I often feel that people are against me.',
  'I sometimes have trouble controlling my temper.',
  'I worry a lot about my health.',
  'I prefer to be alone rather than with other people.',
  'I sometimes feel like I am losing control of my thoughts or actions.',
  'I find it hard to trust others.',
  'I feel nervous or tense in many situations.',
  'I feel sad or empty much of the time.',
  'I feel confident and satisfied with myself. (reverse‑scored)',
];

const tools = [
  { id: 'PHQ9', name: 'PHQ‑9 (Depression)', questions: phq },
  { id: 'GAD7', name: 'GAD‑7 (Anxiety)', questions: gad },
  { id: 'GHQ', name: 'GHQ (General Health, short)', questions: ghq },
  { id: 'BDI', name: 'Depression – BDI‑style short screener', questions: bdi },
  { id: 'MMPI', name: 'Personality / Distress – MMPI‑style short screener', questions: mmpiShort },
];

export default function Screening() {
  const [toolId, setToolId] = useState('PHQ9');
  const [answers, setAnswers] = useState(Array(phq.length).fill(0));
  const [loading, setLoading] = useState(false);

  const currentTool = tools.find((t) => t.id === toolId) || tools[0];
  const questions = currentTool.questions;

  const changeTool = (id) => {
    const nextTool = tools.find((t) => t.id === id) || tools[0];
    setToolId(id);
    setAnswers(Array(nextTool.questions.length).fill(0));
  };

  const handle = (i, v) => {
    const a = [...answers];
    a[i] = parseInt(v);
    setAnswers(a);
  };

  const submit = async () => {
    try {
      setLoading(true);
      const res = await submitScreening(toolId, answers);
      alert(`Tool: ${currentTool.name}\nScore: ${res.score}\nCategory: ${res.category}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-title">🧪 Screening Tools</div>
      <div className="card">
        <h3>Select a screening tool</h3>
        <p style={{ color: '#718096', fontSize: '0.95rem' }}>
          These self‑report tools give an indication of how you have been feeling recently. They are not
          a diagnosis. For any serious concerns, please talk to a mental health professional.
        </p>
        <select
          value={toolId}
          onChange={(e) => changeTool(e.target.value)}
          className="task-select"
          style={{ maxWidth: 320, marginTop: 10 }}
        >
          {tools.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <h3>{currentTool.name}</h3>
        <p style={{ color: '#718096', fontSize: '0.95rem', marginBottom: 16 }}>
          Think about how often you have experienced each item over the past 2 weeks.
        </p>
        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4 }}>
              {i + 1}. {q}
            </div>
            <select
              value={answers[i]}
              onChange={(e) => handle(i, e.target.value)}
              className="task-select"
              style={{ maxWidth: 260 }}
            >
              <option value={0}>Not at all (0)</option>
              <option value={1}>Several days (1)</option>
              <option value={2}>More than half the days (2)</option>
              <option value={3}>Nearly every day (3)</option>
            </select>
          </div>
        ))}
        <button className="button" onClick={submit} disabled={loading}>
          {loading ? 'Submitting...' : `Submit ${currentTool.name}`}
        </button>
      </div>
    </div>
  );
}
