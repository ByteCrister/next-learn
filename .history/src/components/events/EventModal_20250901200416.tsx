'use client';

import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { format, addMinutes } from 'date-fns';
import { useEventsStore } from '@/store/useEventsStore';
import { VEvent, VTask } from '@/types/types.events';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Edit, FileText, Plus, RotateCcw, Save, Tag, Trash } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { DeleteEventAlert } from './DeleteEventAlert';
import { useDashboardStore } from '@/store/useDashboardStore';

interface Props {
  initial?: Partial<VEvent>;
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  mode?: 'view' | 'edit';
}

const schema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .required('Title is required'),
  start: Yup.date()
    .required('Start date is required')
    .test('is-future', 'Event must be in the future', (value) => {
      if (!value) return false;
      return value.getTime() > Date.now();
    }),
  durationMinutes: Yup.number()
    .min(1, 'Duration must be at least 1 minute')
    .required('Duration is required'),
  allDay: Yup.boolean(),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters')
    .nullable(),
  tasks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .required('Task title is required')
        .min(1, 'Task title cannot be empty'),
      description: Yup.string()
        .nullable(),
      isComplete: Yup.boolean()
    })
  )
});

export default function EventModal({ initial, isOpen, onClose, mode = 'edit' }: Props) {
  const isEdit = Boolean(initial && initial._id);
  const { createEventAction, updateEventAction, deleteEventAction, loading } = useEventsStore();
  const { updateEventInDashboard, deleteEventFromDashboard } = useDashboardStore();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const defaults: VEvent = {
    _id: initial?._id,
    title: initial?.title || '',
    start: initial?.start ? new Date(initial.start) : new Date(),
    durationMinutes: initial?.durationMinutes ?? 60,
    allDay: initial?.allDay ?? false,
    description: initial?.description || '',
    tasks:
      initial?.tasks ||
      ([{ title: '', description: '', isComplete: false }] as VTask[]),
    eventStatus: initial?.eventStatus ?? 'upcoming',
    currentStatus: initial?.currentStatus ?? 'upcoming',
    createdAt: initial?.createdAt || new Date().toISOString(),
    updatedAt: initial?.updatedAt || new Date().toISOString(),
  };

  async function handleSubmit(values: VEvent) {
    if (new Date(values.start).getTime() <= Date.now()) {
      alert('Please select a date/time in the future.');
      return;
    }
    const payload: VEvent = {
      ...values,
      start:
        values.start instanceof Date ? values.start.toISOString() : values.start,
    };
    if (isEdit) {
      await updateEventAction(initial!._id!, payload);
      updateEventInDashboard(initial!._id!, payload);
    } else {
      await createEventAction(payload);
    }
    onClose(false);
  }

  const handleDelete = async () => {
    if (!initial?._id) return;
    const success = await deleteEventAction(initial._id);
    if (success) {
      deleteEventFromDashboard(initial!._id!);
      setIsConfirmOpen(false); // close confirm modal first
      onClose(false); // then close event modal
    }
  };

  const computeEnd = (start: Date, duration: number) => addMinutes(start, duration);
  const toDate = (d: string | Date) => (d instanceof Date ? d : new Date(d));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {!isEdit && (<DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className={`flex items-center gap-2 ${isEdit
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                : gradients.primaryBtn
                } ${textOnGradient} px-5 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl hover:opacity-90 transition-all`}
            >
              {isEdit ? <><Edit size={16} /> Edit Event</> : <><Plus size={16} /> Add Event</>}
            </Button>
          </motion.div>
        </DialogTrigger>)}

        {isOpen && (
          <DialogContent className="p-0 border-none shadow-none max-h-[90vh]">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-w-xl w-full mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            >
            {/* Header */}
            <div className={`w-full py-5 px-6 ${gradients.header} rounded-t-2xl`}>
              <DialogTitle
                className={`text-xl md:text-2xl font-semibold tracking-wide ${textOnGradient}`}
              >
                {isEdit && mode === 'view' ? 'View Event' : isEdit ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </div>

            {/* Form */}
            <div
              className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <Formik initialValues={defaults} validationSchema={schema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Date/Time Preview */}
                    {values.start && (
                      <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl shadow-sm">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                          {format(toDate(values.start), 'EEEE, MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-300">
                          {values.allDay
                            ? 'All Day'
                            : `${format(toDate(values.start), 'p')} – ${format(
                              computeEnd(toDate(values.start), values.durationMinutes),
                              'p'
                            )}`}
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                        <FileText size={16} /> Title
                      </Label>
                      <Field
                        id="title"
                        name="title"
                        placeholder="Event title"
                        disabled={mode === 'view'}
                        className={`${ringOnFocus} w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-50 dark:bg-neutral-800`}
                      />
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="start"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Calendar size={16} /> Start Date & <Clock size={16} />
                      </Label>
                      <DatePicker
                        id="start"
                        selected={toDate(values.start)}
                        onChange={(d) => mode === 'edit' && d && setFieldValue('start', d)}
                        showTimeSelect
                        minDate={new Date()}
                        dateFormat="PPPp"
                        disabled={mode === 'view'}
                        className={`${ringOnFocus} w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-50 dark:bg-neutral-800`}
                      />
                      <ErrorMessage
                        name="start"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* All Day Toggle */}
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.allDay}
                        onChange={(e) => mode === 'edit' && setFieldValue('allDay', e.target.checked)}
                        disabled={mode === 'view'}
                        className="accent-purple-500"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        All Day Event
                      </span>
                    </label>

                    {/* Duration */}
                    {!values.allDay && (
                      <div className="space-y-2">
                        <Label htmlFor="durationMinutes" className="text-sm font-medium">
                          Duration (minutes)
                        </Label>
                        <Field
                          id="durationMinutes"
                          type="number"
                          min={1}
                          name="durationMinutes"
                          disabled={mode === 'view'}
                          className={`${ringOnFocus} w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-50 dark:bg-neutral-800`}
                        />
                        <ErrorMessage
                          name="durationMinutes"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={3}
                        disabled={mode === 'view'}
                        className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-50 dark:bg-neutral-800"
                      />
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Tag size={16} /> Tasks
                      </Label>
                      <FieldArray name="tasks">
                        {({ remove, push }) => (
                          <div className="space-y-4">
                            {values.tasks.map((task, index) => (
                              <div
                                key={index}
                                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-2 bg-neutral-50 dark:bg-neutral-800 shadow-sm"
                              >
                                <Field
                                  name={`tasks.${index}.title`}
                                  placeholder="Task title"
                                  disabled={mode === 'view'}
                                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900"
                                />
                                <ErrorMessage
                                  name={`tasks.${index}.title`}
                                  component="p"
                                  className="text-red-500 text-xs"
                                />
                                <Field
                                  as="textarea"
                                  name={`tasks.${index}.description`}
                                  placeholder="Description"
                                  disabled={mode === 'view'}
                                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900"
                                />
                                {/* ✅ Completed checkbox - only editable if event started & isEdit & not in view mode */}
                                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                                  <Field
                                    type="checkbox"
                                    name={`tasks.${index}.isComplete`}
                                    disabled={mode === 'view' || !(isEdit && new Date(values.start).getTime() <= Date.now())}
                                  />
                                  <span className={mode === 'view' || !(isEdit && new Date(values.start).getTime() <= Date.now())
                                    ? "text-neutral-400 dark:text-neutral-500"
                                    : ""}>
                                    Completed
                                  </span>
                                </label>

                                {values.tasks.length > 1 && mode === 'edit' && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                    size="sm"
                                    className="rounded-lg px-3 py-1 hover:opacity-90 transition"
                                  >
                                    <Trash size={14} /> Remove
                                  </Button>
                                )}
                              </div>
                            ))}
                            {mode === 'edit' && (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  const lastTask = values.tasks[values.tasks.length - 1];

                                  // Require at least a title before adding another task
                                  if (!lastTask.title.trim()) {
                                    toast.warning("Please fill in the current task before adding another one.");
                                    return;
                                  }

                                  push({ title: '', description: '', isComplete: false });
                                }}
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 px-4 py-2 hover:opacity-90 transition"
                              >
                                <Plus size={14} /> <span>Add Task</span>
                              </Button>
                            )}

                          </div>
                        )}
                      </FieldArray>
                    </div>
                    {/* Actions */}
                    {mode === 'edit' && (
                      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-neutral-800">
                        {/* Cancel */}
                        <Button
                          variant="outline"
                          onClick={() => onClose(false)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900
                 text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md
                 hover:from-gray-200 hover:to-gray-300 dark:hover:from-neutral-700 dark:hover:to-neutral-800
                 active:scale-95 transition-all duration-200"
                        >
                          <RotateCcw size={16} />
                          Cancel
                        </Button>

                        {/* Delete */}
                        {isEdit && (
                          <Button
                            type='button'
                            variant="destructive"
                            onClick={() => setIsConfirmOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600
                   text-white font-semibold shadow-md hover:shadow-lg
                   hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200"
                          >
                            <Trash size={16} />
                            Delete
                          </Button>
                        )}

                        {/* Primary */}
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                          <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   text-white shadow-md hover:shadow-xl hover:brightness-105
                   disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {loading ? (
                              'Saving…'
                            ) : isEdit ? (
                              <>
                                <Save size={16} />
                                Save Changes
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                Create Event
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
            </motion.div>
          </DialogContent>
        )}
      </Dialog>

      <DeleteEventAlert
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </>
  );
}

// Gradient & style helpers
export const gradients = {
  header: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  primaryBtn: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  secondaryBtn: 'bg-gradient-to-r from-gray-400 to-gray-600',
};

export const textOnGradient = 'text-white';
export const ringOnFocus =
  'focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 outline-none transition';