'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { restoreOriginalObjectId } from '@/utils/helpers/restoreOriginalObjectId';
import { CheckExamInput } from '@/types/types.exam';
import { getCheckExam, getCheckExamForm } from '@/utils/api/api.exams';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { AlertTriangle, CheckCircle2, FileText, Hash, ClipboardCheck, User } from 'lucide-react';
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore';

export default function JoinExamPage({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { setBreadcrumbs } = useBreadcrumbStore();

    const [form, setForm] = useState<CheckExamInput>({
        participantId: '',
        subjectCode: '',
        examCode: '',
        createdBy: ''
    });

    useEffect(() => {
        setIsLoading(true);
        try {
            const slug = params.slug;
            if (!slug.includes('-join-')) {
                setErrorMsg('Invalid route format');
                toast.error('Invalid route format');
                setIsLoading(false);
                return;
            }

            const [userPart, examPart] = slug.split('-join-');
            const restoredCreatedBy = restoreOriginalObjectId(userPart);
            const restoredExamId = restoreOriginalObjectId(examPart);

            (async () => {
                const res = await getCheckExam(restoredCreatedBy, restoredExamId);
                if ('message' in res) {
                    setErrorMsg(res.message || 'Exam verification failed');
                    toast.error(res.message || 'Exam verification failed');
                    setIsVerified(false);
                } else {
                    setIsVerified(true);
                    setForm((prev) => ({ ...prev, createdBy: restoredCreatedBy }));
                }
                setIsLoading(false);
            })();
        } catch (err) {
            const message = (err as AxiosError).message || 'Invalid ObjectId format';
            setErrorMsg(message);
            toast.error(message);
            setIsLoading(false);
        }
    }, [params.slug]);

    useEffect(() => {
        setBreadcrumbs([
            { label: "Home", href: "/" },
            { label: `Join Exam`, href: `/join-exam/${params.slug}` },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await getCheckExamForm(form);
        if ('message' in res) {
            toast.error(res.message || 'Form submission failed');
            setSubmitting(false);
        } else {
            toast.success('Exam check successful');
            router.push(`/join-exam/${params.slug}/to/${form.participantId}/${res.exam?.examCode}`);
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-lg p-6 space-y-4"
                >
                    <Skeleton className="h-8 w-1/2 bg-neutral-300" />
                    <Skeleton className="h-8 w-1/2 bg-neutral-300" />
                    <Skeleton className="h-10 w-full bg-neutral-200" />
                    <Skeleton className="h-10 w-full bg-neutral-200" />
                </motion.div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center p-6"
                >
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">
                        Verification Error
                    </h2>
                    <p className="text-gray-600">{errorMsg}</p>
                </motion.div>
            </div>
        );
    }

    if (!isVerified) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
            >
                <Card className="shadow-xl border border-slate-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                            <ClipboardCheck className="text-indigo-500" /> Join Exam
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Participant ID */}
                            <div>
                                <Label className="flex items-center gap-2 text-slate-600">
                                    <User className="w-4 h-4 text-indigo-400" /> Participant ID
                                </Label>
                                <Input
                                    name="participantId"
                                    value={form.participantId}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 border-slate-300 focus:border-indigo-400 focus:ring-indigo-300"
                                    placeholder="Enter your participant ID"
                                />
                            </div>

                            <div>
                                <Label className="flex items-center gap-2 text-slate-600">
                                    <FileText className="w-4 h-4 text-indigo-400" /> Subject Code
                                </Label>
                                <Input
                                    name="subjectCode"
                                    value={form.subjectCode}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 border-slate-300 focus:border-indigo-400 focus:ring-indigo-300"
                                    placeholder="Enter subject code"
                                />
                            </div>

                            <div>
                                <Label className="flex items-center gap-2 text-slate-600">
                                    <Hash className="w-4 h-4 text-indigo-400" /> Exam Code
                                </Label>
                                <Input
                                    name="examCode"
                                    value={form.examCode}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 border-slate-300 focus:border-indigo-400 focus:ring-indigo-300"
                                    placeholder="Enter exam code"
                                />
                            </div>

                            <Button
                                type="submit"
                                className={`w-full bg-gradient-to-r ${submitting ? 'from-indigo-600 to-purple-600' : 'from-indigo-500 to-purple-500'}  hover:from-indigo-600 hover:to-purple-600 text-white`}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
