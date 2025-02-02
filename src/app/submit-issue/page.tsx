// src/app/submit-issue/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IssueSchema } from '@/schemas/issue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/cloudinary';
import { supabase } from '@/utils/auth';

export default function SubmitIssuePage() {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    error_code: string;
    screenshot: File | null;
  }>({
    title: '',
    description: '',
    error_code: '',
    screenshot: null,
  });

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;
    if (name === 'screenshot' && files) {
      setFormData({ ...formData, screenshot: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let screenshot_url = '';

    // Upload screenshot to Cloudinary if provided
    if (formData.screenshot) {
      try {
        const response = await uploadImage(formData.screenshot);
        screenshot_url = response.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors({ screenshot: 'Failed to upload image' });
        return;
      }
    }

    // Validate form data using IssueSchema
    const result = IssueSchema.safeParse({
      title: formData.title,
      description: formData.description,
      error_code: formData.error_code,
      screenshot_url: screenshot_url || undefined,
    });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      const formattedErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, value]) => {
        formattedErrors[key] = value?.[0] || 'Invalid value';
      });
      setErrors(formattedErrors);
      return;
    }

    // Insert new issue into Supabase
    const { error } = await supabase.from('issues').insert({
      title: formData.title,
      description: formData.description,
      error_code: formData.error_code,
      screenshot_url: screenshot_url || null,
      created_at: new Date(),
    });

    if (error) {
      console.error('Error submitting issue:', error);
      setErrors({ submit: 'Failed to submit issue' });
      return;
    }

    alert('Issue submitted successfully!');
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit a New Issue</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full"
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="error_code" className="block text-gray-700 mb-2">
            Error Code
          </label>
          <Input
            name="error_code"
            value={formData.error_code}
            onChange={handleChange}
            className="w-full"
          />
          {errors.error_code && <p className="text-red-500">{errors.error_code}</p>}
        </div>
        <div>
          <label htmlFor="screenshot" className="block text-gray-700 mb-2">
            Screenshot
          </label>
          <Input
            name="screenshot"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {errors.screenshot && <p className="text-red-500">{errors.screenshot}</p>}
        </div>
        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          Submit Issue
        </Button>
      </form>
    </div>
  );
}