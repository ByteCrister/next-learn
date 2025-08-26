'use client';

import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useExamStore } from '@/store/useExamStore';
import { FileText, Tag, Hash, RefreshCw } from 'lucide-react';
import { generateShortUUID } from '../exams/CreateExamDialog';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/useDashboardStore';

const schema = Yup.object().shape({
    title: Yup.string()
        .min(5, 'Title must be at least 5 characters')
        .required('Title is required'),
    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required'),
    subjectCode: Yup.string().required('Subject code is required'),
    examCode: Yup.string().required('Exam code is required'),
});

// framer-motion variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1
        },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const MotionForm = motion.create(Form);

export default function ExamQAction() {
    const router = useRouter();
    const { create, loading } = useExamStore();
    const { updateCounts } = useDashboardStore()

    const initialValues = {
        title: '',
        description: '',
        subjectCode: '',
        examCode: generateShortUUID(),
    };

    const handleSubmit = async (values: typeof initialValues) => {
        const isNew = await create(values);

        if (isNew) {
            updateCounts('subjectsCount', '+')
            router.push(`/subjects/${isNew}`);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <MotionForm
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/** Exam Title */}
                    <motion.div variants={fieldVariants}>
                        <Label className="flex items-center gap-2">
                            {errors.title && touched.title ? (
                                <>
                                    <FileText size={18} className="text-red-500" />
                                    <span className="text-red-500">{errors.title}</span>
                                </>
                            ) : (
                                <>
                                    <Tag size={18} className="text-indigo-500" />
                                    Exam Title
                                </>
                            )}
                        </Label>
                        <Field
                            name="title"
                            placeholder="Enter exam title"
                            className={`
                mt-1 w-full px-3 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${errors.title && touched.title ? 'border-red-500' : 'border-gray-300'}
              `}
                        />
                    </motion.div>

                    {/** Description */}
                    <motion.div variants={fieldVariants}>
                        <Label className="flex items-center gap-2">
                            {errors.description && touched.description ? (
                                <>
                                    <FileText size={18} className="text-red-500" />
                                    <span className="text-red-500">{errors.description}</span>
                                </>
                            ) : (
                                <>
                                    <FileText size={18} className="text-indigo-500" />
                                    Description
                                </>
                            )}
                        </Label>
                        <Field
                            as="textarea"
                            name="description"
                            rows={3}
                            placeholder="Brief description…"
                            className={`
                mt-1 w-full px-3 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${errors.description && touched.description
                                    ? 'border-red-500'
                                    : 'border-gray-300'}
              `}
                        />
                    </motion.div>

                    {/** Subject Code */}
                    <motion.div variants={fieldVariants}>
                        <Label className="flex items-center gap-2">
                            {errors.subjectCode && touched.subjectCode ? (
                                <>
                                    <Hash size={18} className="text-red-500" />
                                    <span className="text-red-500">{errors.subjectCode}</span>
                                </>
                            ) : (
                                <>
                                    <Hash size={18} className="text-indigo-500" />
                                    Subject Code
                                </>
                            )}
                        </Label>
                        <Field
                            name="subjectCode"
                            placeholder="e.g. MATH101"
                            className={`
                mt-1 w-full px-3 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${errors.subjectCode && touched.subjectCode
                                    ? 'border-red-500'
                                    : 'border-gray-300'}
              `}
                        />
                    </motion.div>

                    {/** Exam Code */}
                    <motion.div variants={fieldVariants}>
                        <Label className="flex items-center gap-2">
                            <Hash size={18} className="text-indigo-500" /> Exam Code
                        </Label>
                        <Field
                            name="examCode"
                            placeholder="Auto-generated exam code"
                            readOnly
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                    </motion.div>

                    {/** Submit Button */}
                    <motion.div
                        variants={fieldVariants}
                        className="pt-4 flex justify-center"
                    >
                        <Button
                            type="submit"
                            disabled={loading || isSubmitting}
                            className="w-full max-w-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg overflow-hidden"
                        >
                            <motion.span
                                className="flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {loading || isSubmitting ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" /> Creating…
                                    </>
                                ) : (
                                    'Create Exam'
                                )}
                            </motion.span>
                        </Button>
                    </motion.div>
                </MotionForm>
            )}
        </Formik>
    );
}
