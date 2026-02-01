# Voice Input Feature - Visual Flow Diagram

## User Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPLAINT FORM                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Location Information                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ City / Area / Zone  [           ] [🎤]  ← User clicks microphone  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  Street / Locality   [           ] [🎤]                                  │
│  Door No / Address   [           ] [🎤]                                  │
│  Landmark            [           ] [🎤]                                  │
│                                                                           │
│  Complaint Information                                                   │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Complaint Title  [              ] [🎤]                             │ │
│  │ Description      [                ] [🎤]                           │ │
│  │                  [  Please describe  ]                             │ │
│  │                  [  your complaint  ]                              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  Additional Details                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Priority    [Normal ▼] [🎤]    Contact Time  [Morning ▼] [🎤]    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│                          [Register Complaint]                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Technical Flow - What Happens When User Clicks Mic Button

```
User clicks 🎤 button for "City" field
        ↓
   startListening('city') called
        ↓
   ┌─────────────────────────────┐
   │  PHASE 1: SPEAK PROMPT      │
   ├─────────────────────────────┤
   │ speakPrompt('city')         │
   │ ↓                           │
   │ Get labels from i18n        │
   │ labels.voicePrompts.city    │
   │ = "Please say the city name"│
   │ ↓                           │
   │ Create SpeechSynthesis      │
   │ utterance                   │
   │ ↓                           │
   │ window.speechSynthesis      │
   │ .speak(utterance)           │
   │ ↓                           │
   │ 🔊 "Please say the city     │
   │    name" (speaks aloud)     │
   └─────────────────────────────┘
        ↓
   ┌─────────────────────────────┐
   │  PHASE 2: WAIT FOR SPEECH   │
   │           TO END            │
   ├─────────────────────────────┤
   │ addEventListener('end',     │
   │   handleSpeechEnd)          │
   │ ↓                           │
   │ Wait for speechSynthesis    │
   │ to finish speaking          │
   │ (~2-3 seconds)              │
   └─────────────────────────────┘
        ↓
   ┌─────────────────────────────┐
   │  PHASE 3: LISTEN            │
   ├─────────────────────────────┤
   │ rec.start()                 │
   │ ↓                           │
   │ User speaks: "City A"       │
   │ 🎤                          │
   │ ↓                           │
   │ rec.onresult event fires    │
   │ ↓                           │
   │ transcript = "City A"       │
   │ ↓                           │
   │ handleTranscript('city',    │
   │   'City A')                 │
   └─────────────────────────────┘
        ↓
   ┌─────────────────────────────┐
   │  PHASE 4: PROCESS & FILL    │
   ├─────────────────────────────┤
   │ Parse transcript            │
   │ ↓                           │
   │ Set formData.city           │
   │ = 'City A'                  │
   │ ↓                           │
   │ Form field updates          │
   │ ✓ City / Area / Zone        │
   │   [City A]                  │
   └─────────────────────────────┘
        ↓
   Ready for next field!
```

## Language & Voice Prompt System

```
┌──────────────────────────────────────────────────────────────────┐
│                  MULTILINGUAL VOICE SYSTEM                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Sets Language in UI                                        │
│         ↓                                                         │
│  Language: en-IN (English)                                       │
│         ↓                                                         │
│  speakPrompt('city') → formLabels['en-IN']                       │
│                       .voicePrompts.city                         │
│                       = "Please say the city name"               │
│                                                                   │
│  ──────────────────────────────────────────────────────────────  │
│                                                                   │
│  Language: ta-IN (Tamil)                                         │
│         ↓                                                         │
│  speakPrompt('city') → formLabels['ta-IN']                       │
│                       .voicePrompts.city                         │
│                       = "நகர பெயர் சொல்லவும்"                  │
│                                                                   │
│  ──────────────────────────────────────────────────────────────  │
│                                                                   │
│  Language: hi-IN (Hindi)                                         │
│         ↓                                                         │
│  speakPrompt('city') → formLabels['hi-IN']                       │
│                       .voicePrompts.city                         │
│                       = "कृपया शहर का नाम बताएं"                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Form Fields & Their Voice Prompts

```
┌─────────────────────────────────────────────────────────────────┐
│              FORM SECTIONS & VOICE PROMPTS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SECTION 1: LOCATION INFORMATION                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ City          → "Please say the city name"               │  │
│  │ Street        → "Please say the street or locality"      │  │
│  │ Address       → "Please say the door number or address"  │  │
│  │ Landmark      → "Please say the landmark"                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  SECTION 2: COMPLAINT INFORMATION                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Title         → "Please say the complaint title"         │  │
│  │ Description   → "Please describe your complaint"         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  SECTION 3: ADDITIONAL DETAILS                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Priority      → "Please say the priority level"          │  │
│  │ Contact Time  → "Please say your preferred contact time" │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Smart Text Processing Examples

```
┌─────────────────────────────────────────────────────────────────┐
│              INTELLIGENT SPEECH-TO-TEXT HANDLING                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CITY FIELD (Smart City Matching)                               │
│  ────────────────────────────────────────────────────────────   │
│  User says: "City A"     → Form gets: "City A"  ✓               │
│  User says: "city a"     → Form gets: "City A"  ✓ (auto-match)  │
│  User says: "Zone 1"     → Form gets: "Zone 1"  ✓ (matches db)  │
│  User says: "zone one"   → Form gets: "Zone 1"  ✓ (normalized)  │
│                                                                  │
│  PRIORITY FIELD (Semantic Mapping)                              │
│  ────────────────────────────────────────────────────────────   │
│  User says: "Normal"     → Form gets: "Normal"  ✓               │
│  User says: "High"       → Form gets: "High"    ✓               │
│  User says: "Emergency"  → Form gets: "Emergency" ✓             │
│  User says: "urgent"     → Form gets: "High"    ✓ (mapped)      │
│                                                                  │
│  CONTACT TIME FIELD                                             │
│  ────────────────────────────────────────────────────────────   │
│  User says: "Morning"    → Form gets: "Morning"     ✓           │
│  User says: "afternoon"  → Form gets: "Afternoon"   ✓           │
│  User says: "evening"    → Form gets: "Evening"     ✓           │
│  User says: "pm"         → Form gets: "Afternoon"   ✓ (mapped)  │
│                                                                  │
│  DESCRIPTION FIELD (Append Multiple Phrases)                    │
│  ────────────────────────────────────────────────────────────   │
│  User says 1st time: "pothole on main street"                   │
│  User says 2nd time: "near market"                              │
│  Form gets: "pothole on main street near market" ✓              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   ERROR HANDLING CHAIN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User clicks Mic                                                │
│       ↓                                                          │
│  ┌─ speechSupported check                                       │
│  │  ├─ FALSE → Alert: "Not supported in your browser"           │
│  │  └─ TRUE → Continue                                          │
│  ↓                                                              │
│  ┌─ SpeechRecognition available                                 │
│  │  ├─ FALSE → Alert: "Not available"                           │
│  │  └─ TRUE → Continue                                          │
│  ↓                                                              │
│  ┌─ Speech Synthesis                                            │
│  │  ├─ Error → Log warning, continue                            │
│  │  └─ Success → User hears prompt                              │
│  ↓                                                              │
│  ┌─ Recognition Start                                           │
│  │  ├─ Error → Alert & reset state                              │
│  │  └─ Success → Listen for speech                              │
│  ↓                                                              │
│  ┌─ Speech Recognition                                          │
│  │  ├─ Error → Alert & stop listening                           │
│  │  ├─ No Result → Timeout & retry                              │
│  │  └─ Success → Process transcript                             │
│  ↓                                                              │
│  ┌─ Update Form Field                                           │
│  │  ├─ Parse special fields → Map to correct values             │
│  │  └─ Fill form automatically                                  │
│  ↓                                                              │
│  Ready for Next Field ✓                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    COMPLAINT FORM COMPONENT                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ State Variables                                              │
│  │  ├─ formData (all form fields)                                │
│  │  ├─ listeningField (which field is listening)                 │
│  │  ├─ lastTranscript (last heard text)                          │
│  │  ├─ speechSupported (browser capability)                      │
│  │  └─ errors (validation errors)                                │
│  │                                                               │
│  ├─ Refs                                                         │
│  │  ├─ recognitionRef (SpeechRecognition instance)               │
│  │  └─ utteranceRef (SpeechSynthesisUtterance instance)          │
│  │                                                               │
│  ├─ Functions                                                    │
│  │  ├─ speakPrompt(fieldName)                                    │
│  │  │  └─ Uses SpeechSynthesis API                              │
│  │  ├─ startListening(fieldName)                                │
│  │  │  └─ Calls speakPrompt → waits → starts recognition        │
│  │  ├─ stopListening()                                          │
│  │  │  └─ Stops recognition & cleans up                         │
│  │  ├─ handleTranscript(name, text)                             │
│  │  │  └─ Parses & fills form field                             │
│  │  └─ createRecognition(fieldName)                             │
│  │     └─ Creates SpeechRecognition instance                    │
│  │                                                               │
│  └─ Rendering                                                   │
│     └─ For each form field with voice support:                  │
│        ├─ <input/select/textarea>                               │
│        └─ <button class="voice-btn" onClick={...}>🎤</button>    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow - From Speech to Form Field

```
                    User Speaks
                        ↓
        ┌───────────────────────────────┐
        │   SPEECH RECOGNITION API      │
        │  (Web Speech Recognition)     │
        │  ├─ Start listening            │
        │  ├─ Capture audio from mic     │
        │  ├─ Convert to text (STT)      │
        │  └─ Return transcript          │
        └───────────────────────────────┘
                        ↓
                "City A" (transcript)
                        ↓
        ┌───────────────────────────────┐
        │   HANDLE TRANSCRIPT           │
        │  ├─ Trim whitespace            │
        │  ├─ Normalize (lowercase)      │
        │  └─ Determine field type       │
        └───────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │   SMART FIELD PARSING         │
        │  For 'city' field:             │
        │  ├─ Match against options      │
        │  │  ['City A', 'City B']       │
        │  ├─ Find closest match         │
        │  └─ Return matched value       │
        └───────────────────────────────┘
                        ↓
                 "City A" (validated)
                        ↓
        ┌───────────────────────────────┐
        │   UPDATE REACT STATE          │
        │  setFormData(prev => ({        │
        │    ...prev,                    │
        │    city: 'City A'              │
        │  }))                           │
        └───────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │   RE-RENDER FORM              │
        │  <input value="City A" />      │
        └───────────────────────────────┘
                        ↓
            Form Field Filled! ✓
```

## Browser Compatibility

```
┌─────────────────────────────────────────────────────────────┐
│         SPEECH API BROWSER SUPPORT MATRIX                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser         │  Recognition  │  Synthesis  │  Status    │
│  ─────────────────────────────────────────────────────────   │
│  Chrome          │      ✅       │      ✅     │  Optimal   │
│  Edge            │      ✅       │      ✅     │  Optimal   │
│  Safari          │      ✅       │      ✅     │  Good      │
│  Firefox         │      ✅       │      ✅     │  Good      │
│  Mobile Chrome   │      ✅       │      ✅     │  Good      │
│  Mobile Safari   │      ✅       │      ✅     │  Good      │
│  IE/Legacy       │      ❌       │      ❌     │  Unsupported│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Note**: All diagrams represent the actual implementation in the ComplaintForm component.
