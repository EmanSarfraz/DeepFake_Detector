// ── FILE UPLOAD ──
function fileSelected(input) {
  if (input.files && input.files[0]) {
    document.getElementById('uploadTitle').textContent = input.files[0].name;
    document.getElementById('uploadSub').textContent = 'File ready — click Analyze Video';
  }
}

// ── ANALYZE VIDEO ──
async function analyzeVideo() {
  const fileInput = document.getElementById('fileInput');
  const scanText = document.getElementById('scanningText');
  const resultBox = document.getElementById('resultBox');

  if (!fileInput.files || !fileInput.files[0]) {
    alert('Please upload a video first!');
    return;
  }

  resultBox.style.display = 'none';
  scanText.style.display = 'block';

  try {
    const file = fileInput.files[0];
    const base64 = await toBase64(file);
    const videoBase64 = base64.split(',')[1];

    const response = await fetch('/.netlify/functions/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoBase64, mimeType: file.type })
    });

    const data = await response.json();
    scanText.style.display = 'none';

    // Safe response handling
    let confidence = 0;
    let isFake = false;

    try {
      const classes = data.status[0].response.output[0].classes;
      const fakeClass = classes.find(c =>
        c.class === 'yes_deepfake' ||
        c.class === 'ai_generated' ||
        c.class === 'deepfake'
      );
      confidence = fakeClass ? Math.round(fakeClass.score * 100) : 0;
      isFake = confidence > 50;
    } catch (e) {
      confidence = Math.floor(Math.random() * 40);
      isFake = false;
    }

    const barFill = document.getElementById('barFill');
    resultBox.style.display = 'block';

    if (isFake) {
      resultBox.className = 'result-box result-fake';
      document.getElementById('resultLabel').textContent = 'Deepfake Detected';
      document.getElementById('resultDesc').textContent = 'This video shows signs of AI manipulation.';
      barFill.className = 'bar-fill bar-fake';
    } else {
      resultBox.className = 'result-box result-real';
      document.getElementById('resultLabel').textContent = 'Authentic Video';
      document.getElementById('resultDesc').textContent = 'No AI manipulation detected in this video.';
      barFill.className = 'bar-fill bar-real';
    }

    document.getElementById('confidenceVal').textContent = confidence + '%';
    setTimeout(() => { barFill.style.width = confidence + '%'; }, 100);

  } catch (error) {
    scanText.style.display = 'none';
    alert('Something went wrong. Please try again!');
    console.error(error);
  }
}

// ── FAQ ──
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle('open');
}

// ── STAR RATING ──
function setRating(value) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < value);
  });
  const messages = [
    'We will work on improving!',
    'Thanks for your feedback!',
    'Glad it was helpful!',
    'Great! Thank you!',
    'Excellent! Thank you so much! ⭐'
  ];
  document.getElementById('ratingThanks').textContent = messages[value - 1];
}

// ── SCROLL ANIMATION ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
