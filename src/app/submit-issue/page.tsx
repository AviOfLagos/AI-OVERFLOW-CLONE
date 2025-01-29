'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useIssueStore, IssueItem } from '@/store/issueStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  errorCode: z.string().optional(),
  screenshot: z.any().optional(),
});

type IssueSchema = z.infer<typeof issueSchema>;

export default function SubmitIssuePage() {
  const [formData, setFormData] = useState<IssueSchema>({
    title: '',
    description: '',
    errorCode: '',
    screenshot: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IssueSchema, string[]>>>({});
  const { addIssue } = useIssueStore();
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
    const result = issueSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    const newIssue: IssueItem = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      errorCode: formData.errorCode,
      screenshot: formData.screenshot ? URL.createObjectURL(formData.screenshot) : undefined,
      votes: 0,
    };

    addIssue(newIssue);
    router.push('/');
  };

  return (
    <div>
      <h1>Submit a New Issue</h1>
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
            accept="image/*"
            onChange={handleChange}
          />
          {errors.screenshot && <p>{errors.screenshot[0]}</p>}
        </div>
        <Button type="submit">Submit Issue</Button>
      </form>
    </div>
  );
}