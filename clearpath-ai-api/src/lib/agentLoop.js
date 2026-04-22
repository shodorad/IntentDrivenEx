import { DATA_TOOLS, DATA_TOOL_NAMES, executeDataTool } from '../tools/dataTools.js';
import { UI_TOOLS, UI_TOOL_NAMES, UI_TOOL_TO_CARD_TYPE } from '../tools/uiTools.js';

const ALL_TOOLS = [...DATA_TOOLS, ...UI_TOOLS];
const MAX_ITERATIONS = 6; // safety cap — prevents runaway loops

/**
 * Run the agentic tool-use loop.
 *
 * Each iteration:
 *  1. Call Gemini with all tools available
 *  2. If LLM calls a data tool → execute it, feed result back, loop again
 *  3. If LLM calls UI tools → capture as cards[], acknowledge, loop again
 *  4. If LLM returns text with no tool calls → done, return final response
 *
 * @param {GoogleGenAI} ai         - Initialized GoogleGenAI instance
 * @param {string}      model      - Gemini model ID
 * @param {string}      systemPrompt
 * @param {Array}       messages   - Conversation history { role, content }
 * @param {object}      persona    - Current persona (for data tool execution)
 * @returns {Promise<{ message: string, cards: Array, followUp: Array }>}
 */
export async function runAgentLoop(ai, model, systemPrompt, messages, persona) {
  // Build Gemini-format conversation contents
  let contents = messages
    .filter(m => m.content?.trim())
    .map(m => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  let finalMessage = '';
  const capturedCards = [];

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: ALL_TOOLS }],
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) break;

    const parts      = candidate.content?.parts || [];
    const textParts  = parts.filter(p => p.text);
    const toolCalls  = parts.filter(p => p.functionCall);

    // Accumulate any text the model wrote this turn
    const turnText = textParts.map(p => p.text).join('').trim();
    if (turnText) finalMessage = turnText; // last text wins as final message

    // No tool calls → LLM is done
    if (toolCalls.length === 0) break;

    // Process tool calls
    const toolResults = [];

    for (const part of toolCalls) {
      const { name, args = {} } = part.functionCall;

      if (DATA_TOOL_NAMES.has(name)) {
        // Execute data tool → return real data to LLM
        const result = await executeDataTool(name, args, persona);
        toolResults.push({ name, response: result });

      } else if (UI_TOOL_NAMES.has(name)) {
        // Capture UI tool call as a card → no further data needed
        const cardType = UI_TOOL_TO_CARD_TYPE[name];
        capturedCards.push({
          type: cardType,
          data: args,
        });
        // Acknowledge to LLM so it can continue to generate message text
        toolResults.push({ name, response: { rendered: true } });

      } else {
        // Unknown tool — acknowledge safely
        toolResults.push({ name, response: { error: 'unknown tool' } });
      }
    }

    // Append model turn + tool results to conversation, then loop
    contents = [
      ...contents,
      candidate.content,
      {
        role: 'user',
        parts: toolResults.map(r => ({
          functionResponse: {
            name:     r.name,
            response: r.response,
          },
        })),
      },
    ];
  }

  // Parse followUp pills from message text if present (backward compat with static flows)
  // LLM in agentic mode sets followUp via the message text — kept simple here
  const followUp = extractFollowUp(finalMessage);
  const cleanMessage = stripFollowUpTag(finalMessage);

  return {
    message:  cleanMessage,
    cards:    capturedCards,
    followUp,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractFollowUp(text) {
  const match = text.match(/\[ACTION_PILLS\]([\s\S]*?)\[\/ACTION_PILLS\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[1]);
  } catch {
    return [];
  }
}

function stripFollowUpTag(text) {
  return text.replace(/\[ACTION_PILLS\][\s\S]*?\[\/ACTION_PILLS\]/g, '').trim();
}
