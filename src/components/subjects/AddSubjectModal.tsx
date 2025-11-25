"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import { useRouter } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { encodeId } from "@/utils/helpers/IdConversion";

export default function AddSubjectModal() {
  const { addSubject, loadingSubCrud } = useSubjectStore();
  const {updateCounts} = useDashboardStore();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !code.trim()) {
      setError("Title and code are required.");
      return;
    }
    const newId = await addSubject({ title, code, description });
    if (newId) {
      setOpen(false);
      updateCounts('subjectsCount', '+');
      router.push(`/subjects/${encodeId(encodeURIComponent(newId))}`);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogPrimitive.Trigger
        className="
          inline-flex items-center gap-2
          bg-indigo-600 hover:bg-indigo-700
          text-white font-medium
          px-5 py-2 rounded-md
          shadow-sm
          transition
        "
        aria-label="Add new subject"
      >
        <AiOutlinePlus size={18} />
        Add Subject
      </DialogPrimitive.Trigger>

      {/* Modal */}
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {open && (
            <>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/30"
                />
              </DialogPrimitive.Overlay>

              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className="
                    fixed top-1/2 left-1/2
                    w-full max-w-lg
                    -translate-x-1/2 -translate-y-1/2
                    bg-white dark:bg-gray-800
                    rounded-lg
                    shadow-lg
                    ring-1 ring-black/10 dark:ring-white/20
                    focus:outline-none
                  "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      New Subject
                    </DialogPrimitive.Title>

                    <DialogPrimitive.Close asChild>
                      <button
                        aria-label="Close modal"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                      >
                        ✕
                      </button>
                    </DialogPrimitive.Close>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    <div>
                      <label
                        htmlFor="subject-title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                        className="
                          mt-1 block w-full
                          bg-gray-50 dark:bg-gray-700
                          border border-gray-300 dark:border-gray-600
                          rounded-md
                          px-3 py-2
                          text-gray-900 dark:text-gray-100
                          placeholder-gray-400 dark:placeholder-gray-500
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          transition
                        "
                        placeholder="Enter subject title"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject-code"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject-code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="
                          mt-1 block w-full
                          bg-gray-50 dark:bg-gray-700
                          border border-gray-300 dark:border-gray-600
                          rounded-md
                          px-3 py-2
                          text-gray-900 dark:text-gray-100
                          placeholder-gray-400 dark:placeholder-gray-500
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          transition
                        "
                        placeholder="Enter subject code"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject-desc"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="subject-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="
                          mt-1 block w-full
                          bg-gray-50 dark:bg-gray-700
                          border border-gray-300 dark:border-gray-600
                          rounded-md
                          px-3 py-2
                          text-gray-900 dark:text-gray-100
                          placeholder-gray-400 dark:placeholder-gray-500
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          transition
                          resize-none
                        "
                        placeholder="Optional description"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm" role="alert">
                        {error}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <DialogPrimitive.Close asChild>
                        <button
                          type="button"
                          className="
                            px-4 py-2
                            bg-white dark:bg-gray-700
                            text-gray-700 dark:text-gray-200
                            border border-gray-300 dark:border-gray-600
                            rounded-md
                            hover:bg-gray-100 dark:hover:bg-gray-600
                            transition
                          "
                          disabled={loadingSubCrud}
                        >
                          Cancel
                        </button>
                      </DialogPrimitive.Close>
                      <button
                        type="submit"
                        className="
                          px-5 py-2
                          bg-indigo-600
                          text-white
                          rounded-md
                          shadow-sm
                          hover:bg-indigo-700
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
                          transition
                          disabled:opacity-50
                        "
                        disabled={loadingSubCrud}
                      >
                        {loadingSubCrud ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
