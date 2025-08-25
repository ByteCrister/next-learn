'use client';

import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Camera, Lock, PencilLine, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileForm, profileSchema } from '@/utils/auth/ProfileValidation';
import {
  MAX_IMAGE_BYTES,
  pickTargetMime,
  readFileAsImageBitmap,
  drawCompressedToDataUrl,
  detectHasAlphaByCanvas,
  isSupportedImageType,
} from '@/utils/helpers/profile-image-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CropModal from './CropModal';
import { updateUserImage } from '@/utils/api/api.user';

interface AppError {
  message: string;
  code?: string;
}

const DEFAULT_AVATAR = `/images/default-avatar.jpeg`;

interface PropTypes {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProfilePopover({ isOpen, setIsOpen }: PropTypes) {
  const {
    user,
    form,
    setFormField,
    updateUser,
    updateUserImage: UpdateImage,
    loadingUserUpdate,
    loadingDashboard: UiLoading,
  } = useDashboardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: form.name,
      currentPassword: '',
      newPassword: '',
    },
  });

  useEffect(() => {
    reset({ name: form.name, currentPassword: '', newPassword: '' });
  }, [form.name, reset]);

  // AlertDialog state
  const [alert, setAlert] = useState<{ open: boolean; title: string; desc?: string }>({
    open: false,
    title: '',
    desc: '',
  });

  // Local preview prioritizes the just-picked image; otherwise the saved user image
  const previewSrc = useMemo(() => form.image || user?.image || DEFAULT_AVATAR, [form.image, user?.image]);
  const [cropModal, setCropModal] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = ev.target.files?.[0];
      if (!file) return;

      // Size validation
      if (file.size > MAX_IMAGE_BYTES) {
        throw new Error('Selected file is too large. Please choose an image under 10 MB.');
      }

      // Type validation
      if (!isSupportedImageType(file.type)) {
        throw new Error('Unsupported image type. Please use JPEG, PNG, WebP, or AVIF.');
      }

      // Decode as ImageBitmap (faster and reliable); fallback handled inside helper
      const bitmap = await readFileAsImageBitmap(file);

      // Determine target format
      const hasAlpha = detectHasAlphaByCanvas(bitmap);
      const targetMime = pickTargetMime({ prefer: 'image/webp', fallback: 'image/jpeg', preserveAlpha: hasAlpha });

      // Compress and resize to max 1024px, quality 0.8
      const dataUrl = await drawCompressedToDataUrl(bitmap, {
        maxEdge: 1024,
        quality: 0.8,
        mime: targetMime,
      });

      // Store in form state for preview + submit
      // setFormField('image', dataUrl);
      setCropModal(dataUrl);
      setIsOpen(false);

      // Clear the input value to allow re-selecting the same file later
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const e = err as AppError;
      setAlert({
        open: true,
        title: 'Image upload failed',
        desc: e?.message || 'Please try another image.',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropSave = async (croppedDataUrl: string) => {
    try {
      const data = await updateUserImage(croppedDataUrl); // call your API

      // Check if the response has the updatedImage field
      if ('updatedImage' in data) {
        setFormField('image', data.updatedImage); // update local preview
        UpdateImage(data.updatedImage)
      } else if ('message' in data) {
        setAlert({
          open: true,
          title: 'Update Failed',
          desc: data.message,
        });
      }

      setCropModal(null); // close modal
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setAlert({
        open: true,
        title: 'Failed to Update Image',
        desc: message,
      });
    }
  };


  const onSubmit = async (data: ProfileForm) => {
    setFormField('name', data.name);
    setFormField('currentPassword', data.currentPassword || '');
    setFormField('newPassword', data.newPassword);
    await updateUser();
    setIsOpen(false);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {UiLoading ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-9 w-9 rounded-full bg-neutral-300" />
              <Skeleton className="h-5 w-20 rounded bg-neutral-400" />
            </div>
          ) : (
            <Button
              variant="ghost"
              className="ml-auto flex items-center gap-2 px-3 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Image
                src={user?.image ?? DEFAULT_AVATAR}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full border border-gray-200 dark:border-gray-600 object-cover shadow-sm"
              />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {user?.name || 'Profile'}
              </span>
            </Button>
          )}
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden"
        >
          {UiLoading ? (
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-32 rounded-md mx-auto" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
              <Skeleton className="h-10 w-full rounded-xl mt-2" />
            </div>
          ) : (
            <>
              {/* Header with avatar uploader */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                  <Image
                    src={previewSrc}
                    alt="Avatar"
                    width={72}
                    height={72}
                    className="h-18 w-18 rounded-full border-2 border-blue-500/20 object-cover shadow-md"
                    unoptimized
                  />

                  {/* Hover overlay edit icon */}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="absolute -top-1 -right-1 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow group-hover:opacity-100 opacity-90 transition-opacity"
                    aria-label="Change profile photo"
                  >
                    <PencilLine className="h-4 w-4 text-blue-600" />
                  </button>

                  {/* Subtle bottom overlay with camera on hover */}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="absolute inset-0 flex items-end justify-center rounded-full bg-black/0 group-hover:bg-black/20 transition-colors"
                    aria-label="Upload new avatar"
                  >
                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 px-2 py-1 text-[11px] font-medium text-gray-800 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-3.5 w-3.5" />
                      Change
                    </span>
                  </button>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Edit Profile
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your personal details
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <User className="mr-2 h-4 w-4 text-blue-500" />
                    Full Name
                  </label>
                  <Input
                    id="name"
                    disabled={loadingUserUpdate}
                    {...register('name')}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/40 rounded-lg"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Current Password */}
                <div className="space-y-1">
                  <label
                    htmlFor="currentPassword"
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Lock className="mr-2 h-4 w-4 text-blue-500" />
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    disabled={loadingUserUpdate}
                    {...register('currentPassword')}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/40 rounded-lg"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label
                    htmlFor="newPassword"
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Lock className="mr-2 h-4 w-4 text-blue-500" />
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    disabled={loadingUserUpdate}
                    {...register('newPassword')}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/40 rounded-lg"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 pt-5 border-t border-gray-300 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="rounded-md border-gray-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={loadingUserUpdate}
                    className="rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    {loadingUserUpdate ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* Alerts via shadcn AlertDialog */}
      <AlertDialog open={alert.open} onOpenChange={(open) => setAlert((a) => ({ ...a, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert.title || 'Notice'}</AlertDialogTitle>
            {alert.desc ? (
              <AlertDialogDescription>{alert.desc}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlert({ open: false, title: '', desc: '' })}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setAlert({ open: false, title: '', desc: '' })}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {cropModal && (
        <CropModal
          imageSrc={cropModal}
          onCancel={() => setCropModal(null)}
          onSave={handleCropSave}
        />
      )}

    </>
  );
}
