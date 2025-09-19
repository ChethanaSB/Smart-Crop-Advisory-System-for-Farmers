import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FarmerChatbotStats from "./FarmerChatbotStats";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import SuccessStories from "./SuccessStories";
import {
  MessageCircle,
  X,
  Menu,
  Sprout,
  Bot,
  Upload,
  Mic,
  Send,
  Square,
  Volume2,
} from "lucide-react";

function HomeIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Fastbots AI");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Plant Disease Prediction states
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Kannada Chatbot states
  const [kannadaChatMessages, setKannadaChatMessages] = useState([]);
  const [kannadaUserInput, setKannadaUserInput] = useState("");
  const [kannadaLoading, setKannadaLoading] = useState(false);

  // Speech assistant states
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  // Use a ref to hold the final transcription
  const transcriptionRef = useRef("");

  // IMPORTANT: Replace with your actual Google API Key
  const API_KEY = "AIzaSyCaXh4Y8JPYGMwsKwrFHa-j_dyu9LYg4Gk";

  // Initialize Speech APIs on component mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    } else {
      console.warn("Speech Synthesis API not supported in this browser.");
    }

    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "kn-IN";
      setSpeechRecognition(recognition);
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleVoiceInputKannada = () => {
    if (!speechRecognition) return;

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
      if (transcriptionRef.current.trim()) {
        handleKannadaChatSubmit(transcriptionRef.current.trim());
      }
    } else {
      speechRecognition.lang = "kn-IN";

      speechRecognition.onstart = () => {
        setIsListening(true);
        transcriptionRef.current = "";
        setKannadaUserInput("");
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      speechRecognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setKannadaUserInput(finalTranscript + interimTranscript);
        transcriptionRef.current = finalTranscript;
      };

      speechRecognition.start();
    }
  };

  const handleVoiceOutput = (text, langCode = "kn-IN") => {
    if (speechSynthesis && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find((voice) =>
        voice.lang.startsWith(langCode)
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = langCode;

      speechSynthesis.speak(utterance);
    }
  };

  const handleDiseasePrediction = async () => {
    if (!file) {
      alert("Please upload a plant image first!");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const base64 = await toBase64(file);

      const prompt = `
You are a skilled plant pathologist.
Analyze the uploaded plant image and provide:
- Plant name
- Disease (if any)
- Causes
- Prevention & Treatment methods
Respond in ${language}.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: base64,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received from model.";

      setResult(botReply);
      handleVoiceOutput(botReply, "kn-IN");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = "Failed to connect to Google Gemini API.";
      setResult(errorMessage);
      handleVoiceOutput(errorMessage, "kn-IN");
    } finally {
      setLoading(false);
    }
  };

  const handleKannadaChatSubmit = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    const newChatHistory = [...kannadaChatMessages, userMessage];
    setKannadaChatMessages(newChatHistory);
    setKannadaUserInput("");
    setKannadaLoading(true);

    try {
      const chatHistoryForAPI = newChatHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              ...chatHistoryForAPI,
              {
                role: "user",
                parts: [{ text: "Respond exclusively in Kannada." }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "ಕ್ಷಮಿಸಿ, ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.";

      const botMessage = { role: "model", text: botReply };
      setKannadaChatMessages((prevMessages) => [...prevMessages, botMessage]);
      handleVoiceOutput(botReply, "kn-IN");
    } catch (error) {
      console.error("Kannada Chat Error:", error);
      const errorMessage = "ಸಂಪರ್ಕ ದೋಷ, ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.";
      setKannadaChatMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: errorMessage },
      ]);
      handleVoiceOutput(errorMessage, "kn-IN");
    } finally {
      setKannadaLoading(false);
    }
  };

  const formatOutput = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.map((line, idx) => {
      if (line.toLowerCase().startsWith("plant name")) {
        return (
          <p key={idx} className="text-purple-700 font-bold">
            Plant Name:{" "}
            <span className="font-normal text-black">
              {line.replace(/Plant Name:/i, "").trim()}
            </span>
          </p>
        );
      }
      if (line.toLowerCase().startsWith("disease")) {
        return (
          <p key={idx} className="text-purple-700 font-bold">
            Disease:{" "}
            <span className="font-normal text-black">
              {line.replace(/Disease:/i, "").trim()}
            </span>
          </p>
        );
      }
      if (line.toLowerCase().startsWith("causes")) {
        return (
          <p key={idx} className="text-purple-700 font-bold mt-2">
            Causes:
          </p>
        );
      }
      if (line.toLowerCase().startsWith("prevention")) {
        return (
          <p key={idx} className="text-purple-700 font-bold mt-2">
            Prevention and Treatment:
          </p>
        );
      }
      if (line.toLowerCase().startsWith("disclaimer")) {
        return (
          <p key={idx} className="text-purple-700 font-bold mt-2">
            Disclaimer:{" "}
            <span className="italic text-gray-700 font-normal">
              {line.replace(/Disclaimer:/i, "").trim()}
            </span>
          </p>
        );
      }
      if (line.startsWith("-") || line.startsWith("*")) {
        return (
          <li key={idx} className="ml-6 list-disc text-black">
            {line.replace(/^[-*]\s*/, "").trim()}
          </li>
        );
      }
      return <p key={idx}>{line}</p>;
    });
  };

  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FarmerChatbotStats />
      <FeaturesSection />
      <SuccessStories />
      <Footer />

      {/* Floating Bot + Speech Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        {/* Chatbot Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        >
          <MessageCircle size={28} />
        </button>

        {/* Speech Floating Button */}
        <button
          onClick={() => {
            let textToRead = "";

            if (
              selectedModel === "Kannada Chatbot" &&
              kannadaChatMessages.length > 0
            ) {
              textToRead = kannadaChatMessages.map((msg) => msg.text).join(" ");
            } else if (
              selectedModel === "Plant Disease Prediction" &&
              result
            ) {
              textToRead = result;
            }

            if (textToRead.trim()) {
              handleVoiceOutput(textToRead, "kn-IN");
            } else {
              // 🔊 Long Kannada intro about crops, weather, market
              const defaultIntro =
                "ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಕೃಷಿಕರಿಗೆ ಸಹಾಯ ಮಾಡಲು ರೂಪಿಸಲಾಗಿದೆ. " +
                "ಇಲ್ಲಿ ಜೋಳ, ಅಕ್ಕಿ, ಗೋಧಿ, ಕಬ್ಬು, ಕಾಫಿ ಮತ್ತು ಹತ್ತಿ ಬೆಳೆಗಳ ಕುರಿತ ಮಾಹಿತಿ ಲಭ್ಯವಿದೆ. " +
                "ಪ್ರತಿ ಬೆಳೆಗಾಗಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ, " +
                "ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ತಡೆಗಟ್ಟುವ ಮಾರ್ಗಗಳ ಬಗ್ಗೆ ವಿವರಗಳನ್ನು ಪಡೆಯಬಹುದು. " +
                "ಇದರಿಂದ ರೈತರು ಸಮಯಕ್ಕೆ ತಕ್ಕ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು." + "ಆಗ್ರೋಸೇಜ್ ರೈತರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಒಂದು ಸಮಗ್ರ ಡಿಜಿಟಲ್ ವೇದಿಕೆಯಾಗಿದ್ದು, ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ತಂತ್ರಜ್ಞಾನವನ್ನು ಬಳಸಿಕೊಂಡು ಬೆಳೆ ರೋಗಗಳನ್ನು ನಿಖರವಾಗಿ ಪತ್ತೆಹಚ್ಚಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ರೈತರು ತಮ್ಮ ಫೋನ್‌ ಮೂಲಕ ರೋಗಪೀಡಿತ ಬೆಳೆಯ ಚಿತ್ರವನ್ನು ತೆಗೆದು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದರೆ, ಅದು ತಕ್ಷಣವೇ ರೋಗದ ಹೆಸರು ಮತ್ತು ಅದನ್ನು ತಡೆಗಟ್ಟಲು ಅಗತ್ಯವಾದ ಪರಿಹಾರ ಕ್ರಮಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ಈ ವೇದಿಕೆಯು ಕನ್ನಡ ಸೇರಿದಂತೆ ಹಲವು ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದ್ದು, ರೈತರು ಧ್ವನಿ ಆಧಾರಿತ ಚಾಟ್‌ಬಾಟ್ ವೈಶಿಷ್ಟ್ಯದ ಮೂಲಕ ತಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಮಾತನಾಡಿಯೇ ಕೇಳಬಹುದು ಮತ್ತು ಧ್ವನಿ ರೂಪದಲ್ಲಿಯೇ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಬಹುದು. ಇದರ ಜೊತೆಗೆ, ಆಗ್ರೋಸೇಜ್ ನಿಮ್ಮ ಪ್ರದೇಶದ ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಸಮಗ್ರ ಕೃಷಿ ನಿರ್ವಹಣೆ ಸಲಹೆಗಳು ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣದ ಬಗ್ಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ. ಈ ಎಲ್ಲ ವೈಶಿಷ್ಟ್ಯಗಳಿಂದಾಗಿ, ಇದು ರೈತರಿಗೆ ತಮ್ಮ ಬೆಳೆಗಳ ಉತ್ಪಾದಕತೆ ಮತ್ತು ಲಾಭವನ್ನು ಹೆಚ್ಚಿಸಲು ಒಂದು ಪ್ರಬಲ ಡಿಜಿಟಲ್ ಸಾಧನವಾಗಿದೆ.";
              handleVoiceOutput(defaultIntro, "kn-IN");
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        >
          <Volume2 size={28} />
        </button>
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-purple-600 text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold">{selectedModel}</h2>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Model Selection Dropdown */}
        {isModelMenuOpen && (
          <div className="absolute top-14 right-0 w-64 bg-white shadow-lg border rounded-md z-[10000]">
            <button
              onClick={() => {
                setSelectedModel("Fastbots AI");
                setIsModelMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full p-3 hover:bg-purple-100 text-left"
            >
              <Bot size={18} /> Fastbots AI
            </button>
            <button
              onClick={() => {
                setSelectedModel("Plant Disease Prediction");
                setIsModelMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full p-3 hover:bg-purple-100 text-left"
            >
              <Sprout size={18} /> Plant Disease Prediction
            </button>
            <button
              onClick={() => {
                setSelectedModel("Kannada Chatbot");
                setIsModelMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full p-3 hover:bg-purple-100 text-left"
            >
              <Mic size={18} /> Kannada Chatbot
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-col h-[calc(100%-60px)] p-3 overflow-y-auto">
          {selectedModel === "Fastbots AI" && (
            <iframe
              style={{ width: "100%", height: "100%", border: "none" }}
              src="https://app.fastbots.ai/embed/cmfjuk57u07nrqv1kh1wj43ed"
              title="Fastbots Chat"
            ></iframe>
          )}

          {selectedModel === "Plant Disease Prediction" && (
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Upload Plant Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded"
              />

              <label className="font-semibold">Select Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border p-2 rounded"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Tamil</option>
                <option>Bengali</option>
                <option>Kannada</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={handleDiseasePrediction}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2 flex-grow"
                  disabled={loading}
                >
                  <Upload size={18} />
                  {loading ? "Analyzing..." : "Predict Disease"}
                </button>
              </div>

              {result && (
                <div className="mt-3 flex flex-col gap-3">
                  {file && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Uploaded Plant"
                      className="max-h-60 object-contain rounded border self-center"
                    />
                  )}
                  <div className="p-4 border rounded bg-gray-50 text-sm leading-relaxed text-left space-y-2">
                    {formatOutput(result)}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedModel === "Kannada Chatbot" && (
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {kannadaChatMessages.length === 0 && (
                  <div className="text-center text-gray-500 italic">
                    ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? (How can I help you?)
                  </div>
                )}
                {kannadaChatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[80%] flex items-center justify-between gap-2 ${
                        msg.role === "user"
                          ? "bg-purple-200 text-right"
                          : "bg-gray-200 text-left"
                      }`}
                    >
                      <span>{msg.text}</span>
                      {msg.role === "model" && (
                        <button
                          onClick={() => handleVoiceOutput(msg.text, "kn-IN")}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <Volume2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {kannadaLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl max-w-[80%] bg-gray-200 text-left animate-pulse">
                      ...
                    </div>
                  </div>
                )}
              </div>
              <div className="flex p-4 border-t bg-white">
                <button
                  onClick={handleVoiceInputKannada}
                  className={`p-2 rounded-full mr-2 ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {isListening ? <Square size={24} /> : <Mic size={24} />}
                </button>
                <input
                  type="text"
                  value={kannadaUserInput}
                  onChange={(e) => setKannadaUserInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleKannadaChatSubmit(kannadaUserInput);
                    }
                  }}
                  placeholder="ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ..."
                  className="flex-grow p-2 border rounded-full"
                  disabled={kannadaLoading || isListening}
                />
                <button
                  onClick={() => handleKannadaChatSubmit(kannadaUserInput)}
                  className="bg-purple-600 text-white p-2 rounded-full ml-2"
                  disabled={kannadaLoading || isListening}
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeIndex;
