'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  profilePicture: string;
  username: string;
  techStack: string;
  shortBio: string;
  tools: string;
  techInterests: string;
}

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    profilePicture: user?.profilePicture || '',
    username: user?.username || '',
    techStack: user?.techStack?.join(', ') || '',
    shortBio: user?.shortBio || '',
    tools: user?.tools?.join(', ') || '',
    techInterests: user?.techInterests?.join(', ') || '',
  });
  const [preview, setPreview] = useState<string>(user?.profilePicture || '');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setFormData({ ...formData, profilePicture: base64data });
          setPreview(base64data);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setUser({
      ...user!,
      name: formData.name,
      profilePicture: formData.profilePicture,
      username: formData.username,
      techStack: formData.techStack.split(',').map((tech) => tech.trim()),
      shortBio: formData.shortBio,
      tools: formData.tools.split(',').map((tool) => tool.trim()),
      techInterests: formData.techInterests.split(',').map((interest) => interest.trim()),
    });

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
        </div>

        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
