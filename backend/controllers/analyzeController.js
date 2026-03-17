import { analyzeContent } from "../utils/analyzer.js";

export const handleAnalyze = (req, res) => {
  const text = (req.body || {}).text || "";
  if (!text.trim()) {
    return res.status(400).json({ error: "No text provided" });
  }

  const payload = analyzeContent(text);
  res.json(payload);
};
