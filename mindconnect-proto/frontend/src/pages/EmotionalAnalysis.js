import React, { useEffect, useRef, useState } from 'react';
import Sentiment from 'sentiment';
import * as faceapi from 'face-api.js';

const sentiment = new Sentiment();
const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
const MODEL_URLS = [
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
];

function getFaceSuggestions(emotion) {
  const suggestions = {
    happy: [
      'You seem happy! Consider sharing your positivity with someone else.',
      'Keep a short gratitude list of what makes you smile today.',
      'Try a quick mindfulness check-in: notice 5 things you can see, hear, and feel.'
    ],
    neutral: [
      'You seem content. A short walk or stretching can keep your mind balanced.',
      'Take a moment to breathe deeply for 1 minute to refresh your focus.',
      'Write down one small goal you want to achieve today.'
    ],
    sad: [
      'It looks like you might be feeling down. Try a short breathing exercise or reach out to a friend.',
      'Listening to your favorite uplifting song can help shift your mood.',
      'Consider journaling one thing you appreciate about today.'
    ],
    angry: [
      'You seem upset. Pausing and taking a few deep breaths can help calm your mind.',
      'Try a quick physical release: stand up, stretch, or take a gentle walk.',
      'Write down what triggered your anger and one small action to move past it.'
    ],
    fearful: [
      'If you are feeling anxious, try grounding techniques like focusing on your senses.',
      'Take 3 slow breaths, counting each inhale and exhale to steady yourself.',
      'Remind yourself of one thing that is going well right now.'
    ],
    disgusted: [
      'Take a moment to identify what triggered this feeling and consider a calming activity like listening to music.',
      'Try a short breathing exercise to reset your nervous system.',
      'If it helps, write down what you can control in this moment.'
    ],
    surprised: [
      'You look surprised! Take a moment to breathe and process what happened.',
      'Reflect on whether the surprise feels positive or stressful, and take a small action to ground yourself.',
      'Try naming three things you’re grateful for right now.'
    ],
  };
  return suggestions[emotion] || ['Keep checking in with yourself; small steps like deep breathing can help reset your mood.'];
}

function getSentimentSuggestions(score) {
  if (score > 2) return [
    'Your sentiment is positive. Keep building on this by practicing gratitude.',
    'Set a small achievable goal for today to maintain your momentum.',
    'Share your good mood with someone or write down one success from today.'
  ];
  if (score > 0) return [
    'Your sentiment is slightly positive. Consider a quick mood-boosting activity like stretching or music.',
    'Try writing down one thing you appreciate about today.',
    'Take a short walk to keep your energy flowing.'
  ];
  if (score === 0) return [
    'Your sentiment is neutral. A short break or walk could help refresh your perspective.',
    'Try a 1-minute breathing exercise to provide a quick reset.',
    'List one thing you are looking forward to today.'
  ];
  if (score >= -2) return [
    'Your sentiment is slightly negative. Try a breathing exercise or write down one thing you are grateful for.',
    'Take a short pause and do a simple stretch to ease tension.',
    'Reach out to a friend or loved one for a quick check-in.'
  ];
  return [
    'Your sentiment is quite negative. If possible, take a moment to reach out to someone you trust.',
    'Try a calming practice like deep breathing or guided meditation for a few minutes.',
    'Consider writing down what’s bothering you and one small positive action you can take.'
  ];
}

export default function EmotionalAnalysis(){
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceStatus, setFaceStatus] = useState('Loading face models...');
  const [faceResult, setFaceResult] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textResult, setTextResult] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceResult, setVoiceResult] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(()=>{
    async function initFace() {
      setFaceStatus('Loading face detection models...');
      let loaded = false;
      for (const url of MODEL_URLS) {
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri(url);
          await faceapi.nets.faceExpressionNet.loadFromUri(url);
          setModelUrl(url);
          loaded = true;
          break;
        } catch (e) {
          // try next source
        }
      }
      if (!loaded) {
        setFaceStatus('Face analysis unavailable: failed to load models');
        return;
      }

      setFaceStatus('Face models loaded. Starting camera...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setFaceStatus('Camera started. Analyzing...');
        detectFace();
      } catch (err) {
        setFaceStatus('Camera access required for face analysis. Please allow camera access and refresh.');
      }
    }

    initFace();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, []);

  async function detectFace(){
    if (!videoRef.current) return;

    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
      const result = await faceapi.detectSingleFace(videoRef.current, options).withFaceExpressions();
      if (result) {
        const expressions = result.expressions;
        const best = Object.entries(expressions).sort((a,b)=>b[1]-a[1])[0];
        setFaceResult({ expression: best[0], confidence: best[1].toFixed(2) });
        setFaceStatus('Face detected.');

        if (canvasRef.current) {
          const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
          const resized = faceapi.resizeResults(result, dims);
          faceapi.draw.drawDetections(canvasRef.current, resized);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        }
      } else {
        setFaceStatus('No face detected. Please position your face in view.');
        setFaceResult(null);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    } catch (err) {
      setFaceStatus('Face detection failed: ' + (err.message || 'unknown error') + '.');
    }

    setTimeout(detectFace, 1200);
  }

  const analyzeText = () => {
    const res = sentiment.analyze(textInput || '');
    setTextResult(res);
  };

  const startVoice = () => {
    if (!SpeechRecognition) {
      setVoiceStatus('Voice recognition not supported in this browser.');
      return;
    }
    setVoiceStatus('Listening... speak now');
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setVoiceTranscript(transcript);
      const res = sentiment.analyze(transcript);
      setVoiceResult(res);
      setVoiceStatus('Voice captured.');
    };

    recog.onerror = (event) => {
      setVoiceStatus('Voice recognition error: ' + (event.error || 'unknown'));
    };

    recog.onend = () => {
      setVoiceStatus('Voice capture finished.');
    };

    recog.start();
    setRecognition(recog);
  };

  const stopVoice = () => {
    if (recognition) {
      recognition.stop();
      setVoiceStatus('Stopped.');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Emotional Analysis</h2>
      <p>This page provides basic emotional insight from face expressions, voice sentiment, and typed text. It is intended for demonstration and is not a medical assessment.</p>

      <div style={{display:'grid', gap:20, gridTemplateColumns:'1fr 1fr'}}>
        <section style={{border:'1px solid #ddd', borderRadius:8, padding:16}}>
          <h3>Face Emotion (Webcam)</h3>
          <div style={{position:'relative', width:320, height:240}}>
            <video ref={videoRef} width={320} height={240} style={{borderRadius:8}} autoPlay muted playsInline />
            <canvas ref={canvasRef} width={320} height={240} style={{position:'absolute', top:0, left:0}} />
          </div>
          <p style={{marginTop:8}}>{faceStatus}</p>
          {faceResult && (
            <div style={{marginTop:8}}>
              <strong>Detected:</strong> {faceResult.expression} <span style={{opacity:0.8}}>({faceResult.confidence})</span>
              <div style={{marginTop:8, padding:8, border:'1px solid #eee', borderRadius:6, background:'#fafafa'}}>
                <strong>Suggestions:</strong>
                <ul style={{margin: '8px 0 0 16px', padding:0}}>
                  {getFaceSuggestions(faceResult.expression).map((tip, idx) => (
                    <li key={idx} style={{marginBottom:4}}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section style={{border:'1px solid #ddd', borderRadius:8, padding:16}}>
          <h3>Voice Input Sentiment</h3>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button onClick={startVoice}>Start Listening</button>
            <button onClick={stopVoice}>Stop</button>
          </div>
          <p style={{marginTop:8}}>{voiceStatus}</p>
          {voiceTranscript && (
            <div style={{marginTop:8}}>
              <strong>Transcript:</strong> {voiceTranscript}
            </div>
          )}
          {voiceResult && (
            <div style={{marginTop:8}}>
              <strong>Sentiment:</strong> {voiceResult.score >= 0 ? 'Positive' : 'Negative'} (score: {voiceResult.score})
              <div>Comparative: {voiceResult.comparative.toFixed(2)}</div>
              <div>Keywords: {voiceResult.positive.join(', ') || 'none'} / {voiceResult.negative.join(', ') || 'none'}</div>
              <div style={{marginTop:8, padding:8, border:'1px solid #eee', borderRadius:6, background:'#fafafa'}}>
                <strong>Suggestions:</strong>
                <ul style={{margin: '8px 0 0 16px', padding:0}}>
                  {getSentimentSuggestions(voiceResult.score).map((tip, idx) => (
                    <li key={idx} style={{marginBottom:4}}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section style={{gridColumn:'1 / -1', border:'1px solid #ddd', borderRadius:8, padding:16}}>
          <h3>Text Sentiment Analysis</h3>
          <textarea
            value={textInput}
            onChange={(e)=>setTextInput(e.target.value)}
            placeholder="Type something about how you're feeling..."
            style={{width:'100%', height:120, padding:12, boxSizing:'border-box'}}
          />
          <div style={{marginTop:10}}>
            <button onClick={analyzeText}>Analyze Text</button>
          </div>
          {textResult && (
            <div style={{marginTop:10}}>
              <strong>Sentiment:</strong> {textResult.score >= 0 ? 'Positive' : 'Negative'} (score: {textResult.score})
              <div>Comparative: {textResult.comparative.toFixed(2)}</div>
              <div>Keywords: {textResult.positive.join(', ') || 'none'} / {textResult.negative.join(', ') || 'none'}</div>
              <div style={{marginTop:8, padding:8, border:'1px solid #eee', borderRadius:6, background:'#fafafa'}}>
                <strong>Suggestions:</strong>
                <ul style={{margin: '8px 0 0 16px', padding:0}}>
                  {getSentimentSuggestions(textResult.score).map((tip, idx) => (
                    <li key={idx} style={{marginBottom:4}}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
