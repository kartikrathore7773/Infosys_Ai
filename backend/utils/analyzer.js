import Sentiment from "sentiment";
import nlp from "compromise";

const sentimentDetector = new Sentiment();

const toScore = (raw) => {
  const normalized = Math.max(-1, Math.min(1, raw / 5));
  return Number(normalized.toFixed(3));
};

export function analyzeContent(text) {
  const sanitized = text.trim();
  const words = sanitized.split(/\s+/).filter(Boolean);
  const sentences = sanitized.split(/[.!?]+/).filter(Boolean);
  const readability = Math.min(
    100,
    Math.round((sentences.length / Math.max(words.length, 1)) * 1000),
  );

  const ndoc = nlp(sanitized);
  const tokens = ndoc
    .terms()
    .out("array")
    .map((token) => token.toLowerCase().replace(/[^a-z]/g, ""))
    .filter(Boolean);

  const freq = tokens.reduce((acc, token) => {
    acc[token] = (acc[token] || 0) + 1;
    return acc;
  }, {});

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({
      keyword,
      density: Number(((count / Math.max(tokens.length, 1)) * 100).toFixed(2)),
    }));

  const sentimentResult = sentimentDetector.analyze(sanitized);
  const sentimentScore = toScore(sentimentResult.score);
  const sentimentLabel =
    sentimentScore > 0.1
      ? "Positive"
      : sentimentScore < -0.1
        ? "Negative"
        : "Neutral";

  const engagement = Math.min(
    100,
    Math.round((sentimentScore + 1) * 40 + Math.min(words.length, 300) / 6),
  );

  const suggestions = [];
  if (readability < 60)
    suggestions.push("Use shorter sentences for better readability.");
  if (sentimentLabel === "Neutral")
    suggestions.push("Add emotionally engaging words.");
  if (engagement < 60)
    suggestions.push("Include a call-to-action or storytelling elements.");

  return {
    metrics: {
      readability,
      sentiment: {
        label: sentimentLabel,
        score: sentimentScore,
      },
      keywords,
      engagement,
    },
    suggestions,
    tokens: tokens.length,
    sentences: sentences.length,
  };
}
