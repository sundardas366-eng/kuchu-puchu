# 🌹 Will you be my Valentine? - Interactive Proposal Website

A pixel-perfect, interactive Valentine proposal website inspired by the viral video format from **AskYourValentine.com** and **The Cipher Dev**.

---

## ✨ Features Included

1. **Exact Visual Match**:
   - Soft pastel pink/peach romantic gradient background with floating roses 🌹, glowing hearts 💖, and twinkling sparkles ✨.
   - Elegant header with `QUESTION` dropdown and custom `❤️ by [Name]` author pill.
   - Glassmorphic rounded white proposal card with soft drop shadows and rounded borders.
   - The iconic brown bear holding a red rose with floating hearts illustration.

2. **Playful Interactive Mechanics**:
   - **Runaway "No" Button (⚡ Toggleable)**: When the recipient tries to hover or touch "No", it playfully darts away to random safe spots on the screen!
   - **Funny Speech Bubbles**: Shows cute messages whenever "No" dodges ("*Nice try! 😉*", "*Are you sure? 🥺*", "*Pookie please! 🙏*", "*Error 404: 'No' not found! 😂*").
   - **Expanding "Yes" Button**: With every failed attempt to click "No", the green *"Yes! Absolutely! 💖"* button grows larger and pulses!
   - **Bear Reactions**: The bear momentarily looks sad/pleading when "No" is approached, then returns to smiling with the rose.

3. **Celebration & Confetti Explosion**:
   - Full-screen colorful confetti burst and floating hearts when *"Yes!"* is clicked.
   - Cute animated hugging & kissing bears (`bear-celebrate.gif`).
   - Romantic love note & date promise card.
   - One-click **"Send Confirmation on WhatsApp"** button so they can message you their answer immediately!

4. **🎵 Audio & Song System (As Requested)**:
   - Built-in soothing romantic music box melody (`assets/audio/default-music.wav`).
   - **YouTube Integration**: Click the 🎵 icon at the top to paste any YouTube romantic song link (e.g. your crush's favorite song). It will stream and play in the background automatically!
   - **MP3 / Local Audio Support**: You can paste an MP3 link or drop your own song into `assets/audio/song.mp3`.
   - Dedicated mute/play toggle (🔊) with animated sound wave equalizer.

5. **Personalized Link Generation**:
   - Customize recipient and sender names with URL parameters:
     - `index.html?to=Ananya&from=Rahul`
   - Built-in **Share Modal** generates custom links and copies them with one click, or shares directly to WhatsApp.

---

## 🚀 How to Run the Website

### Option 1: Direct Double Click
Simply double-click [`index.html`](file:///d:/KUCHU%20PUCHU/index.html) to open it in Chrome, Edge, Safari, or Firefox!

### Option 2: Live Local Server
If you have Python or VS Code Live Server:
```bash
# In PowerShell:
cd "d:\KUCHU PUCHU"
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 📂 Project Structure

```
d:\KUCHU PUCHU\
├── index.html              # Main webpage with proposal card & modals
├── style.css               # Pixel-perfect CSS styling & animations
├── script.js               # Runaway physics, sound engine, confetti & sharing
├── README.md               # Documentation & guide
└── assets\
    ├── images\
    │   ├── bear-proposal.png   # The original brown bear holding a red rose
    │   ├── bear-celebrate.gif  # Hugging & kissing celebration bear GIF
    │   ├── bear-sad.gif        # Sad/pleading bear reaction GIF
    │   ├── bear-happy.gif      # Happy bear sticker
    │   └── reference.jpg       # Reference screenshot from Facebook reel
    └── audio\
        └── default-music.wav   # Soothing romantic music box tune
```

---

## 💌 Adding Your Own Song Later

When you are ready to add your YouTube song or custom music:
1. Open the website.
2. Click the **🎵** icon in the top right corner.
3. Paste your **YouTube Link** or **MP3 URL**.
4. Click **Play**! The song is automatically saved and linked.

