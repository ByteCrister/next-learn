// src/components/SubjectQAction.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    AiOutlineEdit,
    AiOutlineNumber,
    AiOutlineInfoCircle,
    AiOutlineExclamationCircle,
    AiOutlineReload,
    AiOutlinePlus
} from "react-icons/ai";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubjectStore } from "@/store/useSubjectsStore";
import { useDashboardStore } from "@/store/useDashboardStore";

type SubjectFormValues = {
    title: string;
    code: string;
    description: string;
};

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, when: "beforeChildren" } },
};

const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SubjectQAction() {
    const { addSubject, loadingSubCrud } = useSubjectStore();
    const { updateCounts } = useDashboardStore();
    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, touchedFields } } = useForm<SubjectFormValues>({
        defaultValues: { title: "", code: "", description: "" },
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    const onSubmit: SubmitHandler<SubjectFormValues> = async (data) => {
        const newId = await addSubject(data);
        if (newId) {
            reset();
            updateCounts('subjectsCount', '+');
            toast.success("Subject created successfully");
            router.push(`/subjects/${newId}`);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            {/* Title */}
            <motion.div variants={fieldVariants} className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                    {errors.title && touchedFields.title ? (
                        <>
                            <AiOutlineExclamationCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-500">{errors.title.message}</span>
                        </>
                    ) : (
                        <>
                            <AiOutlineEdit className="w-5 h-5 text-indigo-500" />
                            Title
                        </>
                    )}
                </Label>
                <div className="relative">
                    <Input
                        id="title"
                        placeholder="Enter subject title"
                        className="w-full pl-10 transition-shadow duration-300 focus:shadow-outline-indigo"
                        {...register("title", {
                            required: "Title is required",
                            minLength: { value: 3, message: "At least 3 characters" },
                            maxLength: { value: 50, message: "Max 50 characters" },
                        })}
                    />
                    <AiOutlineEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </motion.div>


            {/* Code */}
            <motion.div variants={fieldVariants} className="space-y-2 mt-4">
                <Label htmlFor="code" className="flex items-center gap-2">
                    {errors.code && touchedFields.code ? (
                        <>
                            <AiOutlineExclamationCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-500">{errors.code.message}</span>
                        </>
                    ) : (
                        <>
                            <AiOutlineNumber className="w-5 h-5 text-indigo-500" />
                            Subject Code
                        </>
                    )}
                </Label>
                <div className="relative">
                    <Input
                        id="code"
                        placeholder="e.g. MATH101"
                        className="w-full pl-10 transition-shadow duration-300 focus:shadow-outline-indigo"
                        {...register("code", {
                            required: "Code is required",
                            minLength: { value: 2, message: "At least 2 characters" },
                            maxLength: { value: 10, message: "Max 10 characters" },
                        })}
                    />
                    <AiOutlineNumber className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={fieldVariants} className="space-y-2 mt-4">
                <Label htmlFor="description" className="flex items-center gap-2">
                    {errors.description && touchedFields.description ? (
                        <>
                            <AiOutlineExclamationCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-500">{errors.description.message}</span>
                        </>
                    ) : (
                        <>
                            <AiOutlineInfoCircle className="w-5 h-5 text-indigo-500" />
                            Description
                        </>
                    )}
                </Label>
                <Textarea
                    id="description"
                    placeholder="Optional"
                    className="w-full transition-shadow duration-300 focus:shadow-outline-indigo"
                    {...register("description", {
                        maxLength: { value: 300, message: "Max 300 characters" },
                    })}
                />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fieldVariants} className="mt-6 flex justify-center">
                <Button
                    type="submit"
                    disabled={isSubmitting || loadingSubCrud}
                    className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                    <motion.span className="flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {isSubmitting || loadingSubCrud ? (
                            <>
                                <AiOutlineReload className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <AiOutlinePlus className="w-5 h-5" />
                                Create Subject
                            </>
                        )}
                    </motion.span>
                </Button>
            </motion.div>
        </motion.form>
    );
}
