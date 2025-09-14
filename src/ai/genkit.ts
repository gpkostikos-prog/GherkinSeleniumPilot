
import {genkit, type Logger} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Define a no-op logger that performs no action for log messages.
const noOpLogger: Logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
};

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
  telemetry: {
    logger: noOpLogger,
    // By providing a no-op logger, we significantly reduce Genkit's log output.
    // Default instrumentation (if any when no explicit instrumentation plugin is provided)
    // will also use this no-op logger.
  },
});

