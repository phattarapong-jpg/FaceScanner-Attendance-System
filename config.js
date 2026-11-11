// ใส่ URL ของ Web App ที่ได้จากการ Deploy Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbw6qcHWLZt53ed8pTT-bRHIew7Wh9d7Czll1g10uwDsWq_iiqwXDQBiQpfgUO_88U1Oyw/exec';
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

async function api(action, data = {}) {
  // ไม่ตั้ง Content-Type เพื่อเลี่ยง CORS preflight
  const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action, ...data }) });
  return res.json();
}

async function loadModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  ]);
}
const detOpts = () => new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);

function toast(msg, type = 'info') {
  let w = document.querySelector('.toasts');
  if (!w) { w = document.createElement('div'); w.className = 'toasts'; document.body.appendChild(w); }
  const t = document.createElement('div');
  t.className = `toast glass ${type}`; t.textContent = msg; w.appendChild(t);
  setTimeout(() => t.classList.add('hide'), 3200);
  setTimeout(() => t.remove(), 3700);
}
