import { useState, useEffect } from "react";

const languages = {
  en: "English",
  hi: "Hindi",
  fr: "French",
  es: "Spanish",
  de: "German"
};

const speechLangs = {
  en: "en-US",
  hi: "hi-IN",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE"
};

export default function App() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };

  const translateText = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${source}|${target}`
      );

      const data = await res.json();

      setTranslated(
        data.responseData?.translatedText ||
          "Translation unavailable"
      );
    } catch (error) {
      console.error(error);
      alert("Translation failed");
    }

    setLoading(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      speechLangs[source] || "en-US";

    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      alert("Speech recognition error");
    };
  };

  const speakTranslation = () => {
    if (!translated) return;

    const utterance =
      new SpeechSynthesisUtterance(
        translated
      );

    utterance.lang =
      speechLangs[target] || "en-US";

    speechSynthesis.speak(utterance);
  };

  const swapLanguages = () => {
    const tempSource = source;
    const tempText = text;

    setSource(target);
    setTarget(tempSource);

    setText(translated);
    setTranslated(tempText);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(
        translated
      );
      alert("Copied Successfully!");
    } catch {
      alert("Copy failed");
    }
  };

  const clearAll = () => {
    setText("");
    setTranslated("");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
        darkMode
          ? "bg-slate-900"
          : "bg-slate-100"
      }`}
    >
      <div
        className={`shadow-xl rounded-2xl p-6 w-full max-w-4xl transition-all duration-300 ${
          darkMode
            ? "bg-slate-800 text-white"
            : "bg-white text-black"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          🌐 Language Translator
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            {darkMode
              ? "☀ Light Mode"
              : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
            className={`border p-3 rounded-lg ${
              darkMode
                ? "bg-slate-700 text-white border-slate-600"
                : "bg-white text-black"
            }`}
          >
            {Object.entries(languages).map(
              ([code, lang]) => (
                <option
                  key={code}
                  value={code}
                >
                  {lang}
                </option>
              )
            )}
          </select>

          <button
            onClick={swapLanguages}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            ⇄ Swap
          </button>

          <select
            value={target}
            onChange={(e) =>
              setTarget(e.target.value)
            }
            className={`border p-3 rounded-lg ${
              darkMode
                ? "bg-slate-700 text-white border-slate-600"
                : "bg-white text-black"
            }`}
          >
            {Object.entries(languages).map(
              ([code, lang]) => (
                <option
                  key={code}
                  value={code}
                >
                  {lang}
                </option>
              )
            )}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">
              Input Text
            </h2>

            <textarea
              rows="10"
              value={text}
              placeholder="Type or Speak..."
              onChange={(e) =>
                setText(e.target.value)
              }
              className={`w-full border p-3 rounded-lg ${
                darkMode
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-white text-black"
              }`}
            />

            <div className="flex flex-wrap gap-3 mt-3">
              <button
                onClick={startListening}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                🎤 Speak
              </button>

              <button
                onClick={clearAll}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                🗑 Clear
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">
              Translation
            </h2>

            <textarea
              rows="10"
              value={translated}
              readOnly
              placeholder="Translated text appears here..."
              className={`w-full border p-3 rounded-lg ${
                darkMode
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-gray-50 text-black"
              }`}
            />

            <div className="flex flex-wrap gap-3 mt-3">
              <button
                onClick={speakTranslation}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                🔊 Listen
              </button>

              <button
                onClick={copyText}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                📋 Copy
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={translateText}
            disabled={loading}
            className="bg-blue-700 text-white px-8 py-3 rounded-xl text-lg"
          >
            {loading
              ? "Translating..."
              : "Translate"}
          </button>
        </div>
      </div>
    </div>
  );
}