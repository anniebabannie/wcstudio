import { Ollama } from "ollama";

const ollama = new Ollama({ 
  host: process.env.OLLAMA_APP_URL // either http://localhost:11434 or http://<your-app>.flycast on production
});

export default ollama;