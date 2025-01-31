'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod';
import { useIssueStore, IssueItem } from '@/store/issueStore';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  errorCode: z.string().optional(),
  screenshot: z.any().optional(),
});

type IssueSchema = z.infer<typeof issueSchema>;

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { addIssue } = useIssueStore();
  const router = useRouter();

  const [formData, setFormData] = useState<IssueSchema>({
    title: '',
    description: '',
    errorCode: '',
    screenshot: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IssueSchema, string[]>>>({});
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFormData({ ...formData, screenshot: files[0] });
        setPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = issueSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<Record<keyof IssueSchema, string[]>>);
      return;
    }

    const newIssue: IssueItem = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      errorCode: formData.errorCode,
      screenshot: formData.screenshot ? URL.createObjectURL(formData.screenshot) : undefined,
      votes: 0,
      authorName: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
    };

    addIssue(newIssue);
    onClose();
    router.push('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogClose asChild>
            <button className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-200">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="What's your issue about?"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-200">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white h-32"
              placeholder="Describe your issue in detail..."
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="errorCode" className="text-gray-200">
              Error Code (optional)
            </Label>
            <Input
              id="errorCode"
              name="errorCode"
              value={formData.errorCode || ''}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Paste your error code here"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Screenshot (optional)</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <input
                type="file"
                name="screenshot"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="max-h-40 rounded"
                  />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-400">Click to upload screenshot</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Issue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueModal;
