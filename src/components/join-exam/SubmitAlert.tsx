'use client';

import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
interface PropTypes { canSubmit: boolean | undefined; submitting: boolean; handleSubmit: (statusOverride?: "in-progress" | "submitted" | "late" | "expired" | undefined) => Promise<void>; }
const SubmitAlert = ({ canSubmit, submitting, handleSubmit }: PropTypes) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    disabled={!canSubmit || submitting}
                    className="rounded-lg px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    {submitting ? "Submitting..." : "Submit answers"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to submit your answers? <br />
                        You won&apos;t be able to change them afterwards.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => handleSubmit()}
                        className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Yes, Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default SubmitAlert