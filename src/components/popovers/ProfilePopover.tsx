'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Lock, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileForm, profileSchema } from '@/utils/auth/ProfileValidation';

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
    userUpdateLoading,
    loading: UiLoading,
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

  const onSubmit = async (data: ProfileForm) => {
    setFormField('name', data.name);
    setFormField('currentPassword', data.currentPassword || '');
    setFormField('newPassword', data.newPassword);
    await updateUser();
    setIsOpen(false);
  };

  return (
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
              src={user?.image || '/no-avatar.png'}
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
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <Image
                src={user?.image || '/no-avatar.png'}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full border-2 border-blue-500/20 object-cover shadow-md"
              />
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
                  disabled={userUpdateLoading}
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
                  disabled={userUpdateLoading}
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
                  disabled={userUpdateLoading}
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
                  disabled={userUpdateLoading}
                  className={`
      rounded-md 
      bg-blue-600 text-white 
      hover:bg-blue-700 
      disabled:bg-blue-400 disabled:cursor-not-allowed
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    `}
                >
                  {userUpdateLoading ? 'Saving…' : 'Save'}
                </Button>
              </div>

            </form>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
