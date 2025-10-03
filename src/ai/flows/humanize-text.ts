'use server';
/**
 * @fileOverview Instantly makes AI-generated text sound more natural and human-like.
 *
 * - humanizeText - A function that handles the text humanization process.
 * - HumanizeTextInput - The input type for the humanizeText function.
 * - HumanizeTextOutput - The return type for the humanizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HumanizeTextInputSchema = z.object({
  text: z
    .string()
    .describe('The text to make more human-like.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  humanizedText: z
    .string()
    .describe('The text after being rewritten to sound more natural and human.'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;

export async function humanizeText(input: HumanizeTextInput): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'humanizeTextPrompt',
  input: {schema: HumanizeTextInputSchema},
  output: {schema: HumanizeTextOutputSchema},
  prompt: `You are an expert in making text sound more natural and human.
  Rewrite the following text to make it sound less like AI and more like something a person would write.
  Focus on natural language, varying sentence structure, and a conversational tone.

Content: {{{text}}}`,
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
