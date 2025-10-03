'use server';

import { z } from 'zod';
import { rewriteContent } from '@/ai/flows/rewrite-content';
import { summarizeText } from '@/ai/flows/summarize-text';
import { extractKeywords } from '@/ai/flows/extract-keywords';
import { humanizeText } from '@/ai/flows/humanize-text';
import { generateContent } from '@/ai/flows/generate-content';

const actionSchema = z.object({
  text: z.string().optional(),
  prompt: z.string().optional(),
  mode: z.enum(['summarize', 'rewrite', 'extract', 'humanize', 'generate']),
  tone: z.string().optional(),
});

type AiActionResult = {
  success: boolean;
  data?: string;
  error?: string;
  mode?: z.infer<typeof actionSchema>['mode'];
};

export async function runAiAction(
  prevState: AiActionResult,
  formData: FormData
): Promise<AiActionResult> {
  const rawData = {
    text: formData.get('text'),
    prompt: formData.get('prompt'),
    mode: formData.get('mode'),
    tone: formData.get('tone'),
  };

  const validation = actionSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }
  
  const { text, mode, tone, prompt } = validation.data;

  try {
    if (mode === 'summarize' || mode === 'extract' || mode === 'humanize') {
       if (!text || text.length < 10) {
        return { success: false, error: 'Please enter at least 10 characters.' };
      }
    }

    let resultData = '';

    if (mode === 'summarize') {
      const result = await summarizeText({ text: text! });
      resultData = result.summary;
    } else if (mode === 'extract') {
      const result = await extractKeywords({ content: text! });
      resultData = result.keywords;
    } else if (mode === 'humanize') {
      const result = await humanizeText({ text: text! });
      resultData = result.humanizedText;
    } else if (mode === 'rewrite') {
      if (!text || text.length < 10) {
        return { success: false, error: 'Please enter at least 10 characters.' };
      }
      if (!tone) {
        return { success: false, error: 'A tone is required for rewriting.' };
      }
      const result = await rewriteContent({ text, tone });
      resultData = result.rewrittenText;
    } else if (mode === 'generate') {
      if (!prompt || prompt.length < 5) {
        return { success: false, error: 'Please enter a prompt with at least 5 characters.' };
      }
      const result = await generateContent({ prompt });
      resultData = result.generatedContent;
    } else {
      return { success: false, error: 'Invalid AI mode selected.' };
    }
    
    return { success: true, data: resultData, mode };

  } catch (e) {
    console.error(e);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
