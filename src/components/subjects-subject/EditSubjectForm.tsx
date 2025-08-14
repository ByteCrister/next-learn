'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SubjectInput } from '@/types/types.subjects';
import { motion, Variants } from 'framer-motion';
import {
    Edit2 as PencilAltIcon,
    Hash as HashtagIcon,
    FileText as DocumentTextIcon,
} from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface EditSubjectFormProps {
    subjectForm: SubjectInput;
    setSubjectForm: React.Dispatch<React.SetStateAction<SubjectInput>>;
    onUpdate: () => void;
    onDelete: () => void;
    loading: boolean;
}

export default function EditSubjectForm({
    subjectForm,
    setSubjectForm,
    onUpdate,
    onDelete,
    loading,
}: EditSubjectFormProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-2xl mx-auto"
        >
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="px-6 py-4 border-b border-gray-200">
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                        Edit Subject
                    </CardTitle>
                </CardHeader>

                <CardContent className="px-6 py-6 space-y-6">

                    {/* Title Field */}
                    <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-md mb-1">
                            <PencilAltIcon className="w-3 h-3" /> Subject Title
                        </span>
                        <Input
                            id="subject-title"
                            value={subjectForm.title}
                            onChange={e => setSubjectForm({ ...subjectForm, title: e.target.value })}
                            className="w-full rounded-md border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>

                    {/* Code Field */}
                    <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-md mb-1">
                            <HashtagIcon className="w-3 h-3" /> Subject Code
                        </span>
                        <Input
                            id="subject-code"
                            value={subjectForm.code}
                            onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                            className="w-full rounded-md border-gray-300 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-md mb-1">
                            <DocumentTextIcon className="w-3 h-3" /> Subject Description
                        </span>
                        <Textarea
                            id="subject-description"
                            value={subjectForm.description}
                            onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })}
                            rows={4}
                            className="w-full rounded-md border-gray-300 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 resize-none"
                        />
                    </div>

                </CardContent>

                <CardFooter className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    {/* Update Button */}
                    <Button
                        onClick={onUpdate}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 
                   text-white font-medium shadow-sm hover:shadow-md
                   hover:from-indigo-500 hover:to-indigo-400
                   transition-all duration-200 hover:scale-[1.02]
                   disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Update
                    </Button>

                    {/* Delete Confirmation */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={loading}
                                className="px-5 py-2.5 rounded-md bg-gradient-to-r from-red-600 to-red-500 
                           text-white font-medium shadow-sm hover:shadow-md
                           hover:from-red-500 hover:to-red-400
                           transition-all duration-200 hover:scale-[1.02]
                           disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the subject and remove its data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Yes, Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>

            </Card>
        </motion.div>
    );
}
