 'use server';

/**
 * @fileOverview A content rewriting AI agent that allows users to rewrite text in different tones.
 *
 * - rewriteContent - A function that handles the content rewriting process.
 * - RewriteContentInput - The input type for the rewriteContent function.
 * - RewriteContentOutput - The return type for the rewriteContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteContentInputSchema = z.object({
  text: z.string().describe('The text to rewrite.'),
  tone: z
    .string()
    .describe(
      'The tone of the rewritten text (e.g., professional, casual, formal, informal).' 
    ),
});
export type RewriteContentInput = z.infer<typeof RewriteContentInputSchema>;

const RewriteContentOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten text.'),
});
export type RewriteContentOutput = z.infer<typeof RewriteContentOutputSchema>;

export async function rewriteContent(input: RewriteContentInput): Promise<RewriteContentOutput> {
  return rewriteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteContentInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an AI content rewriting tool. Please rewrite the following text in a {{{tone}}} tone:

{{{text}}}`,
});

const rewriteContentFlow = ai.defineFlow(
  {
    name: 'rewriteContentFlow',
    inputSchema: RewriteContentInputSchema,
    outputSchema: RewriteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
