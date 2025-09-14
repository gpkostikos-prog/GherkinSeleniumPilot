
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-test-cases.ts';
import '@/ai/flows/convert-manual-to-gherkin.ts';
import '@/ai/flows/convert-gherkin-to-test-script.ts';
import '@/ai/flows/admin-create-user.ts';
