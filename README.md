# Sonic Sight

> To bridge the gap between sound and sight.
>
> Sonic Sight provides real-time visual feedback on speech patterns and volume, empowering the deaf and hard-of-hearing community to speak with confidence. By turning sound waves into interactive visual data, we help users master their vocal presence and foster deeper connections with the world around them.

Status: Experimental — not production-ready (a friendly, rough-and-ready project / proof-of-concept).

Demo: https://github.com/harshrajgupta8084-a11y/Sonic-Sight

---

Table of contents
- [What is Sonic Sight?](#what-is-sonic-sight)
- [Why this exists](#why-this-exists)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [How to use](#how-to-use)
- [Development notes](#development-notes)
- [Accessibility considerations](#accessibility-considerations)
- [Contributing](#contributing)
- [Roadmap / TODOs](#roadmap--todos)
- [License](#license)
- [Contact](#contact)

## What is Sonic Sight?
Sonic Sight is a lightweight web-based visualizer that turns microphone input into real-time visual feedback: waveform, volume meters, and simple speech-pattern indicators. It aims to help people who are deaf or hard-of-hearing understand and practice vocal dynamics by exposing otherwise-hidden audio cues visually.

## Why this exists
Speaking with confidence often relies on hearing your own voice. Sonic Sight offers visual cues (volume, rhythm, peaks) so people can practice pacing, projection, and emphasis without relying on auditory feedback.

## Features
- Real-time waveform visualization of microphone input
- Instant volume/level meter
- Simple speech activity indicator (voiced vs silence)
- Browser-based — no server required
- Lightweight: primarily JavaScript, HTML, and CSS

## Tech stack
- JavaScript (visualizer & audio processing) — ~44% of the repo
- CSS (styles & animations) — ~38% of the repo
- HTML (UI shell) — ~17% of the repo
- Uses the Web Audio API for microphone capture and analysis

## Quick start

Clone the repo:
```bash
git clone https://github.com/harshrajgupta8084-a11y/Sonic-Sight.git
cd Sonic-Sight
```

Option A — static/open locally:
- Open `index.html` in your browser (prefer using a local server to avoid getUserMedia restrictions).

Option B — using a simple local server (recommended):
```bash
# If you have Python 3:
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Option C — if the project includes npm scripts (check package.json):
```bash
npm install
npm run start   # or npm run dev
```

Note: Browsers require HTTPS or localhost for microphone access. If testing on a remote host, use HTTPS.

## How to use
1. Open the app in a browser that supports the Web Audio API (Chrome, Edge, Firefox, Safari recent versions).
2. Allow microphone access when prompted.
3. Watch the waveform and volume meter respond to your voice.
4. Use the visual cues to practice louder/softer speaking, pacing, and emphasis.

Tip: Try speaking sustained vowels to see steady peaks, and short phrases to observe rhythm.

## Development notes
- Audio capture is handled via navigator.mediaDevices.getUserMedia and analyzed with an AnalyserNode.
- Visualization is done with Canvas for the waveform and simple DOM elements/CSS for meters.
- Performance tips:
  - Keep FFT size reasonable (e.g., 1024 or 2048).
  - Throttle drawing with requestAnimationFrame.
- If you encounter microphone permission issues, make sure your page is served over HTTPS or localhost.

## Accessibility considerations
- This project is designed to support the deaf and hard-of-hearing community; accessibility is a core goal.
- UI should be keyboard-accessible and include clear labels for interactive elements.
- Visualizations should use high-contrast colors and avoid relying on color alone to convey information.
- Future improvements: haptic/vibration hints on mobile, caption-like event markers, configurable color themes for colorblind users.

## Contributing
All contributions are welcome — bug fixes, accessibility improvements, or enhancements to the visualization/UX.

Suggested workflow:
1. Fork the repo.
2. Create a branch: `git checkout -b feat/my-feature`
3. Make changes and add tests if applicable.
4. Open a pull request describing your changes.

Please follow a&11y-first approach: document accessibility impact for UI/UX changes.

## Roadmap / TODOs
- [ ] Smoother RMS/volume smoothing to reduce jitter
- [ ] Add configurable sensitivity and visualization presets
- [ ] Add recording and playback for practice sessions
- [ ] Provide printable reports or session summaries
- [ ] Mobile-optimized UI and haptic feedback
- [ ] Unit tests for audio-processing helpers
- [ ] Internationalization and localization of UI text

## Troubleshooting
- No waveform showing:
  - Ensure microphone permissions were granted.
  - Check browser console for errors.
  - Confirm page is served over HTTPS or localhost.
- High CPU usage:
  - Reduce animation complexity or increase analyser FFT size.
  - Pause visualization when not needed.

## License
MIT — see LICENSE file.

## Contact
Project: [harshrajgupta8084-a11y/Sonic-Sight](https://github.com/harshrajgupta8084-a11y/Sonic-Sight)  
Maintainer: harshrajgupta8084-a11y

---

Disclaimer: This project is an experimental/proof-of-concept. It may be rough around the edges (hence the playful "trash project" label), but it's intended as a starting point for useful, accessible tools. If you'd like, I can also generate a shorter "Project summary" or a CONTRIBUTING.md and CODE_OF_CONDUCT to go with this README.
