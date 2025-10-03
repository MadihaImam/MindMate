'use server';
/**
 * @fileOverview Extracts key points or keywords from content.
 *
 * - extractKeywords - A function that handles the keyword extraction process.
 * - ExtractKeywordsInput - The input type for the extractKeywords function.
 * - ExtractKeywordsOutput - The return type for the extractKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeywordsInputSchema = z.object({
  content: z
    .string()
    .describe('The content from which to extract key points or keywords.'),
});
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z
    .string()
    .describe('The extracted key points or keywords from the content.'),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;

export async function extractKeywords(input: ExtractKeywordsInput): Promise<ExtractKeywordsOutput> {
  return extractKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeywordsPrompt',
  input: {schema: ExtractKeywordsInputSchema},
  output: {schema: ExtractKeywordsOutputSchema},
  prompt: `You are an expert in identifying key points and keywords from text.

  Extract the key points and keywords from the following content.  Return the keywords as a comma separated list.

Content: {{{content}}}`,
});

const extractKeywordsFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
