'use server';

/**
 * @fileOverview An intelligent event filter for camera motion detection.
 *
 * - filterEvents - A function that filters motion detection events based on their relevance.
 * - FilterEventsInput - The input type for the filterEvents function.
 * - FilterEventsOutput - The return type for the filterEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterEventsInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('A description of the motion detection event.'),
  cameraName: z.string().describe('The name of the camera.'),
});
export type FilterEventsInput = z.infer<typeof FilterEventsInputSchema>;

const FilterEventsOutputSchema = z.object({
  isRelevant: z
    .boolean()
    .describe(
      'Whether the event is relevant and requires review (e.g., person approaching).
      Irrelevant events include things like swaying trees.'
    ),
  reason: z.string().describe('The reason for the relevance determination.'),
});
export type FilterEventsOutput = z.infer<typeof FilterEventsOutputSchema>;

export async function filterEvents(input: FilterEventsInput): Promise<FilterEventsOutput> {
  return filterEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterEventsPrompt',
  input: {schema: FilterEventsInputSchema},
  output: {schema: FilterEventsOutputSchema},
  prompt: `You are an intelligent security system that filters motion detection events
to identify potentially important events that require review.

Given the following event description and camera name, determine if the event is
relevant (e.g., a person approaching) or irrelevant (e.g., swaying trees).

Event Description: {{{eventDescription}}}
Camera Name: {{{cameraName}}}

Based on your determination, set the isRelevant field to true or false, and
provide a brief reason for your decision.

Consider that the motion sensor might be overly sensitive and triggered by things
like swaying trees or animals.
`,
});

const filterEventsFlow = ai.defineFlow(
  {
    name: 'filterEventsFlow',
    inputSchema: FilterEventsInputSchema,
    outputSchema: FilterEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
