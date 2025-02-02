// src/schemas/issue.ts

import { z } from 'zod';

export const IssueSchema = z.object({
  title: z.string().min(15).max(150),
  description: z.string().min(50),
  error_code: z.string().regex(/AIERR-\d{4}/),
  screenshot_url: z.string().url().optional(),
});