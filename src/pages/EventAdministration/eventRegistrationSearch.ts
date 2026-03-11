import { z } from 'zod';

export const eventRegistrationDefaultValues = {
  has_attended: '',
  year: '',
  study: '',
  has_allergy: '',
  search: '',
  has_paid: '',
  allow_photo: '',
} as const;

export const eventRegistrationSchema = z.object({
  has_attended: z.string().optional().default(eventRegistrationDefaultValues.has_allergy),
  year: z.string().optional().default(eventRegistrationDefaultValues.year),
  study: z.string().optional().default(eventRegistrationDefaultValues.study),
  has_allergy: z.string().optional().default(eventRegistrationDefaultValues.has_allergy),
  search: z.string().optional().default(eventRegistrationDefaultValues.search),
  has_paid: z.string().optional().default(eventRegistrationDefaultValues.has_paid),
  allow_photo: z.string().optional().default(eventRegistrationDefaultValues.allow_photo),
});

export type EventRegistrationSearch = z.infer<typeof eventRegistrationSchema>;
