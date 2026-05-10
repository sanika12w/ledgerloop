/*
  Central pricing table for AI tools

  Used by audit engine to:
  - compare current vs cheaper plans
  - estimate savings
  - detect overpaying subscriptions

  Values are monthly USD estimates.
*/

export const TOOL_PRICING = {

  Cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 60,
  },

  "GitHub Copilot": {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },

  Claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30,
    Enterprise: 60,
    "API Direct": 25,
  },

  ChatGPT: {
    Plus: 20,
    Team: 30,
    Enterprise: 60,
    "API Direct": 25,
  },

  "Anthropic API": {
    "API Direct": 30,
  },

  "OpenAI API": {
    "API Direct": 30,
  },

  Gemini: {
    Pro: 20,
    Ultra: 50,
    API: 25,
  },

  Windsurf: {
    Free: 0,
    Pro: 15,
    Teams: 30,
    Enterprise: 50,
  },
};