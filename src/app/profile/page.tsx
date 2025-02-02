// src/app/profile/page.tsx

'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getSession, supabase } from '@/utils/auth';
import { User } from '@/types/user';
import { uploadImage, CloudinaryUploadResponse } from '@/lib/cloudinary';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  shortBio: z.string().optional(),
  techStack: z.string().optional(),
  tools: z.string().optional(),
  techInterests: z.string().optional(),
  profilePicture: z.string().url().optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<ProfileSchema>({
    name: '',
    username: '',
    shortBio: '',
    techStack: '',
    tools: '',
    techInterests: '',
    profilePicture: '',
  });
  const [preview, setPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session && session.user && session.user.email) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        const currentUser: User = {
          id: session.user.id,
          name: profile.name || '',
          email: session.user.email,
          username: profile.username || '',
          profilePicture: profile.avatar_url || '/default-avatar.png',
          techStack: profile.tech_stack || [],
          shortBio: profile.short_bio || '',
          tools: profile.tools || [],
          techInterests: profile.tech_interests || [],
        };

        setUser(currentUser);
        setFormData({
          name: currentUser.name,
          username: currentUser.username || '',
          profilePicture: currentUser.profilePicture || '',
          techStack: currentUser.techStack?.join(', ') || '',
          shortBio: currentUser.shortBio || '',
          tools: currentUser.tools?.join(', ') || '',
          techInterests: currentUser.techInterests?.join(', ') || '',
        });
        setPreview(currentUser.profilePicture || '/default-avatar.png');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        // Upload image to Cloudinary
        uploadImage(file)
          .then((response: CloudinaryUploadResponse) => {
            setFormData({ ...formData, profilePicture: response.secure_url });
            setPreview(response.secure_url);
          })
          .catch((error: Error) => {
            console.error('Error uploading image:', error);
          });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form data
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      const formattedErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, value]) => {
        formattedErrors[key] = value?.[0] || '';
      });
      setErrors(formattedErrors);
      return;
    }

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Update profile in Supabase
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: formData.name,
      username: formData.username,
      avatar_url: formData.profilePicture,
      short_bio: formData.shortBio,
      tech_stack: formData.techStack ? formData.techStack.split(',').map((tech) => tech.trim()) : [],
      tools: formData.tools ? formData.tools.split(',').map((tool) => tool.trim()) : [],
      tech_interests: formData.techInterests
        ? formData.techInterests.split(',').map((interest) => interest.trim())
        : [],
      updated_at: new Date(),
    });

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="space-y-2">
          <Label className="text-gray-700">Profile Picture</Label>
          <div className="flex items-center space-x-4">
            {preview ? (
              <Image
                src={preview}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
            )}
            <input type="file" name="profilePicture" accept="image/*" onChange={handleChange} />
          </div>
          {errors.profilePicture && <p className="text-red-500">{errors.profilePicture}</p>}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-700">
            Username
          </Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>

        {/* Short Bio */}
        <div className="space-y-2">
          <Label htmlFor="shortBio" className="text-gray-700">
            Short Bio
          </Label>
          <Textarea
            id="shortBio"
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
            className="w-full"
          />
          {errors.shortBio && <p className="text-red-500">{errors.shortBio}</p>}
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <Label htmlFor="techStack" className="text-gray-700">
            Tech Stack (comma-separated)
          </Label>
          <Input
            id="techStack"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="w-full"
          />
          {errors.techStack && <p className="text-red-500">{errors.techStack}</p>}
        </div>

        {/* Tools */}
        <div className="space-y-2">
          <Label htmlFor="tools" className="text-gray-700">
            Tools I Use (comma-separated)
          </Label>
          <Input
            id="tools"
            name="tools"
            value={formData.tools}
            onChange={handleChange}
            className="w-full"
          />
          {errors.tools && <p className="text-red-500">{errors.tools}</p>}
        </div>

        {/* Tech Interests */}
        <div className="space-y-2">
          <Label htmlFor="techInterests" className="text-gray-700">
            Tech Interests (comma-separated)
          </Label>
          <Input
            id="techInterests"
            name="techInterests"
            value={formData.techInterests}
            onChange={handleChange}
            className="w-full"
          />
          {errors.techInterests && <p className="text-red-500">{errors.techInterests}</p>}
        </div>

        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
