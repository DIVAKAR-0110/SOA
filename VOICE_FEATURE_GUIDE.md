# Voice Input Feature Implementation Guide

## Overview
The complaint form now includes a fully functional voice input feature that provides voice prompts asking users to speak for each form field. The system uses both Web Speech API for speech recognition and SpeechSynthesis API for text-to-speech.

## How It Works

### 1. **Voice Prompts**
When a user clicks the microphone button for any form field, the system:
- **First**: Speaks a prompt asking the user to provide input (e.g., "Please say the city name")
- **Then**: Listens for the user's voice input
- **Finally**: Processes the transcribed text and fills the form field

### 2. **Supported Languages**
The voice prompts are available in three languages:
- **English (en-IN)**: "Please say the city name"
- **Tamil (ta-IN)**: "நகர பெயர் சொல்லவும்" (Please say the city name)
- **Hindi (hi-IN)**: "कृपया शहर का नाम बताएं" (Please say the city name)

### 3. **Form Fields with Voice Input**

#### Location Information Section
- **City**: "Please say the city name"
- **Street**: "Please say the street or locality"
- **Address**: "Please say the door number or address"
- **Landmark**: "Please say the landmark"

#### Complaint Information Section
- **Complaint Title**: "Please say the complaint title"
- **Description**: "Please describe your complaint"

#### Additional Details Section
- **Priority**: "Please say the priority level"
- **Contact Time**: "Please say your preferred contact time"

## Technical Implementation

### Key Components

#### 1. **speakPrompt Function**
```javascript
const speakPrompt = useCallback((fieldName) => {
  // Retrieves the appropriate prompt based on field name and language
  // Uses SpeechSynthesisUtterance to speak the prompt
  // Automatically handles language switching
}, [language]);
```

**Features:**
- Cancels any existing speech before speaking
- Uses appropriate language based on user's language setting
- Configurable speech rate (0.9x) and pitch (1.0)

#### 2. **startListening Function**
```javascript
const startListening = useCallback((fieldName) => {
  // 1. Speaks the prompt for the field
  // 2. Waits for speech to finish
  // 3. Starts listening for user's voice input
  // 4. Processes the transcript
}, [speechSupported, createRecognition, stopListening, speakPrompt]);
```

**Sequence:**
1. User clicks microphone button
2. `speakPrompt(fieldName)` is called
3. System waits for `speechsynthesis.onend` event
4. Speech recognition starts automatically
5. User speaks
6. `handleTranscript()` processes the result

#### 3. **Voice Prompts in i18n.js**
```javascript
voicePrompts: {
  city: 'Please say the city name',
  street: 'Please say the street or locality',
  address: 'Please say the door number or address',
  landmark: 'Please say the landmark',
  name: 'Please say your name',
  title: 'Please say the complaint title',
  description: 'Please describe your complaint',
  priority: 'Please say the priority level',
  contact_time: 'Please say your preferred contact time',
}
```

## User Experience Flow

1. **User clicks microphone button** on any form field
2. **System speaks a prompt** asking for input (e.g., "Please say the city name")
3. **User waits for prompt to finish** then speaks their response
4. **System listens** to the user's voice
5. **Transcribed text** is automatically filled into the form field
6. **User can edit** the field manually if needed

## Browser Compatibility

### Required APIs
- **Web Speech API**: For speech recognition
  - Supported in Chrome, Edge, Safari (partial)
  - May require HTTPS in production

- **SpeechSynthesis API**: For text-to-speech
  - Supported in all modern browsers
  - Supported on desktop and mobile platforms

### Supported Browsers
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Safari 14.1+
- ✅ Firefox (partial support)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Configuration Options

### Speech Synthesis Settings (in ComplaintForm.jsx)
```javascript
utterance.lang = language || 'en-IN';  // Language
utterance.rate = 0.9;                   // Speech rate (0.1 - 10)
utterance.pitch = 1;                    // Pitch (0 - 2)
utterance.volume = 1;                   // Volume (0 - 1)
```

### Speech Recognition Settings (in ComplaintForm.jsx)
```javascript
rec.lang = language || 'en-IN';         // Language
rec.interimResults = false;             // Only final results
rec.maxAlternatives = 1;                // Only best match
```

## Error Handling

The implementation includes comprehensive error handling:

1. **Browser Support Check**: 
   - Checks for SpeechRecognition API availability
   - Alerts user if not supported

2. **Runtime Errors**:
   - Catches and logs speech synthesis errors
   - Catches and logs recognition errors
   - User-friendly error alerts

3. **State Management**:
   - Cleans up recognition objects properly
   - Removes event listeners to prevent memory leaks
   - Resets listening state on completion

## Testing the Feature

### Quick Test Steps
1. Open the complaint form
2. Click the microphone button next to "City"
3. Wait for the prompt: "Please say the city name"
4. Speak clearly: "City A"
5. Verify the city field is filled with "City A"
6. Repeat for other fields

### Language Testing
1. Change language to Tamil or Hindi
2. Click microphone button
3. Listen for prompt in selected language
4. Form should accept input in that language setting

## Files Modified

1. **ComplaintForm.jsx**
   - Added `utteranceRef` state
   - Added `speakPrompt` function with TTS
   - Updated `startListening` to speak prompts first
   - Integrated speech end listener for proper sequencing

2. **i18n.js**
   - Added `voicePrompts` object for each language
   - English prompts (en-IN)
   - Tamil prompts (ta-IN)
   - Hindi prompts (hi-IN)

## Future Enhancements

Potential improvements:
1. Add visual feedback during speech synthesis (animated speaker icon)
2. Add user preference toggle for voice prompts
3. Add confirmation prompt: "I heard [text], is this correct?"
4. Add voice commands for form submission
5. Support for additional languages
6. Adjustable speech rate/pitch settings
7. Voice feedback for successful field submission

## Troubleshooting

### Microphone not working
- Check browser permissions for microphone access
- Try in private/incognito mode
- Restart browser
- Use HTTPS in production

### Prompt not heard
- Check system volume
- Check browser speaker settings
- Try different voice in system text-to-speech settings

### Text not recognized
- Speak more clearly
- Reduce background noise
- Check language setting matches your speech language
- Try shorter, simpler phrases

### Recognition stops immediately
- Check microphone permissions
- Try reloading the page
- Use a supported browser (Chrome recommended)
