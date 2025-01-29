'use client';

import { useState, Suspense } from 'react';
import { z } from 'zod';
import { useErrorStore, ErrorItem } from '@/store/errorStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const errorSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  errorCode: z.string().optional(),
  screenshot: z.any().optional(),
});

type ErrorSchema = z.infer<typeof errorSchema>;

export default function SubmitErrorPage() {
  const [formData, setFormData] = useState<ErrorSchema>({
    title: '',
    description: '',
    errorCode: '',
    screenshot: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ErrorSchema, string[]>>>({});
  const { addError } = useErrorStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'screenshot' && files) {
      setFormData({ ...formData, screenshot: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = errorSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    const newError: ErrorItem = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      // Add errorCode and screenshot handling as needed
    };

    addError(newError);
    router.push('/');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>Submit a New Error</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p>{errors.title[0]}</p>}
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p>{errors.description[0]}</p>}
          </div>
          <div>
            <label htmlFor="errorCode">Error Code</label>
            <Textarea
              name="errorCode"
              value={formData.errorCode}
              onChange={handleChange}
            />
            {errors.errorCode && <p>{errors.errorCode[0]}</p>}
          </div>
          <div>
            <label htmlFor="screenshot">Screenshot</label>
            <Input
              name="screenshot"
              type="file"
              onChange={handleChange}
            />
            {errors.screenshot && <p>{errors.screenshot[0]}</p>}
          </div>
          <Button type="submit">Submit Error</Button>
        </form>
      </div>
    </Suspense>
  );
}