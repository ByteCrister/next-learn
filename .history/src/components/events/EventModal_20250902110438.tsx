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
import { Calendar, Clock, Edit, FileText, Plus, RotateCcw, Save, Tag, Trash, CheckCircle, Circle, AlertCircle, MapPin, Users, Bell, Eye, X } from 'lucide-react';
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
    // Only validate future date for new events, not for editing existing events
    if (!isEdit && new Date(values.start).getTime() <= Date.now()) {
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
              className={`flex items-center gap-2 ${gradients.primaryBtn} ${textOnGradient} px-5 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl hover:opacity-90 transition-all`}
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
            {/* Enhanced Header */}
            <div className="relative w-full py-6 px-6 rounded-t-2xl overflow-hidden">
              {/* Background with gradient and pattern */}
              <div className={`absolute inset-0 ${gradients.header}`}></div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full"></div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-12 right-12 w-2 h-2 bg-white rounded-full"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon based on mode */}
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    {isEdit && mode === 'view' ? (
                      <Eye size={20} className="text-white" />
                    ) : isEdit ? (
                      <Edit size={20} className="text-white" />
                    ) : (
                      <Plus size={20} className="text-white" />
                    )}
                  </div>

                  <div>
                    <DialogTitle className={`text-xl md:text-2xl font-bold tracking-wide ${textOnGradient} mb-1`}>
                      {isEdit && mode === 'view' ? 'View Event' : isEdit ? 'Edit Event' : 'Create New Event'}
                    </DialogTitle>
                    <p className="text-white/80 text-sm font-medium">
                      {isEdit && mode === 'view'
                        ? 'Review event details and tasks'
                        : isEdit
                        ? 'Update event information'
                        : 'Plan your next event'
                      }
                    </p>
                  </div>
                </div>

                {/* Right side: Status indicator and Close button */}
                <div className="flex items-center gap-3">
                  {/* Status indicator */}
                  {isEdit && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                        <div className={`w-2 h-2 rounded-full ${
                          mode === 'view' ? 'bg-green-400' : 'bg-pink-400'
                        }`}></div>
                        <span className="text-white text-xs font-medium">
                          {mode === 'view' ? 'Read Only' : 'Editable'}
                        </span>
                      </div>
                  )}

                  {/* Enhanced Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onClose(false)}
                    aria-label="Close dialog"
                    className="p-2 bg-transparent rounded-xl hover:bg-white/30 transition-all duration-200 group"
                  >
                    <X size={18} className="text-white group-hover:text-red-500 transition-colors duration-200" />
                  </motion.button> 
                </div>
              </div>
            </div>

            {/* Form */}
            <div
              className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <Formik initialValues={defaults} validationSchema={schema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Enhanced Date/Time Preview */}
                    {values.start && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-5 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-neutral-800 dark:via-neutral-750 dark:to-neutral-700 rounded-2xl shadow-lg border border-indigo-100 dark:border-neutral-600"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
                              {format(toDate(values.start), 'EEEE')}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-300">
                              {format(toDate(values.start), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                              {values.allDay ? 'All Day Event' : 'Scheduled Time'}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-300">
                              {values.allDay
                                ? '24 hours'
                                : `${format(toDate(values.start), 'p')} – ${format(
                                  computeEnd(toDate(values.start), values.durationMinutes),
                                  'p'
                                )} (${values.durationMinutes} min)`}
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-3 right-3 opacity-20">
                          <Bell className="w-6 h-6 text-indigo-500" />
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced Title Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md">
                          <FileText size={14} className="text-white" />
                        </div>
                        <Label htmlFor="title" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Event Title
                        </Label>
                      </div>
                      <Field
                        id="title"
                        name="title"
                        placeholder="Enter a descriptive event title..."
                        disabled={mode === 'view'}
                        className={`${ringOnFocus} w-full border-2 border-neutral-200 dark:border-neutral-600 rounded-xl px-4 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all duration-200 ${mode === 'view' ? 'cursor-not-allowed opacity-75' : 'hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500'}`}
                      />
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="text-red-500 text-xs mt-1 flex items-center gap-1"
                      >
                        {(msg) => (
                          <>
                            <AlertCircle size={12} />
                            {msg}
                          </>
                        )}
                      </ErrorMessage>
                    </motion.div>

                    {/* Enhanced Date & Time Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                          <Calendar size={14} className="text-white" />
                        </div>
                        <Label htmlFor="start" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Start Date & Time
                        </Label>
                      </div>
                      <DatePicker
                        id="start"
                        selected={toDate(values.start)}
                        onChange={(d) => mode === 'edit' && d && setFieldValue('start', d)}
                        showTimeSelect
                        minDate={new Date()}
                        dateFormat="PPPp"
                        disabled={mode === 'view'}
                        className={`${ringOnFocus} w-full border-2 border-neutral-200 dark:border-neutral-600 rounded-xl px-4 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-all duration-200 ${mode === 'view' ? 'cursor-not-allowed opacity-75' : 'hover:border-purple-300 dark:hover:border-purple-500 focus:border-purple-500'}`}
                      />
                      <ErrorMessage
                        name="start"
                        component="p"
                        className="text-red-500 text-xs mt-1 flex items-center gap-1"
                      >
                        {(msg) => (
                          <>
                            <AlertCircle size={12} />
                            {msg}
                          </>
                        )}
                      </ErrorMessage>
                    </motion.div>

                    {/* Enhanced All Day Toggle */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                          <Bell size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            All Day Event
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            Event spans the entire day
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={values.allDay}
                          onChange={(e) => mode === 'edit' && setFieldValue('allDay', e.target.checked)}
                          disabled={mode === 'view'}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 ${mode === 'view' ? 'cursor-not-allowed opacity-50' : ''}`}></div>
                      </label>
                    </motion.div>

                    {/* Enhanced Duration Section */}
                    {!values.allDay && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md">
                            <Clock size={14} className="text-white" />
                          </div>
                          <Label htmlFor="durationMinutes" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Duration
                          </Label>
                        </div>
                        <div className="relative">
                          <Field
                            id="durationMinutes"
                            type="number"
                            min={1}
                            name="durationMinutes"
                            placeholder="60"
                            disabled={mode === 'view'}
                            className={`${ringOnFocus} w-full border-2 border-neutral-200 dark:border-neutral-600 rounded-xl px-4 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all duration-200 pr-12 ${mode === 'view' ? 'cursor-not-allowed opacity-75' : 'hover:border-cyan-300 dark:hover:border-cyan-500 focus:border-cyan-500'}`}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                            min
                          </div>
                        </div>
                        <ErrorMessage
                          name="durationMinutes"
                          component="p"
                          className="text-red-500 text-xs mt-1 flex items-center gap-1"
                        >
                          {(msg) => (
                            <>
                              <AlertCircle size={12} />
                              {msg}
                            </>
                          )}
                        </ErrorMessage>
                      </motion.div>
                    )}

                    {/* Enhanced Description Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-r from-teal-500 to-green-500 rounded-md">
                          <FileText size={14} className="text-white" />
                        </div>
                        <Label htmlFor="description" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Description
                        </Label>
                      </div>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Add any additional details about your event..."
                        disabled={mode === 'view'}
                        className={`${ringOnFocus} w-full border-2 border-neutral-200 dark:border-neutral-600 rounded-xl px-4 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all duration-200 resize-none ${mode === 'view' ? 'cursor-not-allowed opacity-75' : 'hover:border-teal-300 dark:hover:border-teal-500 focus:border-teal-500'}`}
                      />
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
                        {values.description?.length || 0}/500 characters
                      </div>
                    </motion.div>

                    {/* Enhanced Tasks Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md">
                            <Tag size={14} className="text-white" />
                          </div>
                          <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Tasks ({values.tasks.length})
                          </Label>
                        </div>
                        {values.tasks.length > 0 && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {values.tasks.filter(task => task.isComplete).length} / {values.tasks.length} completed
                          </div>
                        )}
                      </div>

                      <FieldArray name="tasks">
                        {({ remove, push }) => (
                          <div className="space-y-3">
                            {values.tasks.map((task, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-4 border-2 rounded-xl space-y-3 transition-all duration-200 ${
                                  task.isComplete
                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md'
                                }`}
                              >
                                {/* Task Status Indicator */}
                                <div className="absolute top-3 right-3">
                                  {task.isComplete ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-neutral-400" />
                                  )}
                                </div>

                                {/* Task Title */}
                                <div className="pr-8">
                                  <Field
                                    name={`tasks.${index}.title`}
                                    placeholder="Enter task title..."
                                    disabled={mode === 'view'}
                                    className={`w-full text-sm font-medium border-0 bg-transparent px-0 py-1 focus:ring-0 focus:outline-none ${
                                      task.isComplete
                                        ? 'text-neutral-500 dark:text-neutral-400 line-through'
                                        : 'text-neutral-900 dark:text-neutral-100'
                                    } ${mode === 'view' ? 'cursor-not-allowed' : ''}`}
                                  />
                                  <ErrorMessage
                                    name={`tasks.${index}.title`}
                                    component="p"
                                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                                  >
                                    {(msg) => (
                                      <>
                                        <AlertCircle size={10} />
                                        {msg}
                                      </>
                                    )}
                                  </ErrorMessage>
                                </div>

                                {/* Task Description */}
                                <Field
                                  as="textarea"
                                  name={`tasks.${index}.description`}
                                  placeholder="Add task details..."
                                  disabled={mode === 'view'}
                                  rows={2}
                                  className={`w-full text-sm border-0 bg-transparent px-0 py-1 focus:ring-0 focus:outline-none resize-none ${
                                    task.isComplete
                                      ? 'text-neutral-400 dark:text-neutral-500'
                                      : 'text-neutral-600 dark:text-neutral-300'
                                  } ${mode === 'view' ? 'cursor-not-allowed' : ''}`}
                                />

                                {/* Task Actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-700">
                                  <label className="flex items-center space-x-2 text-xs cursor-pointer group">
                                    <Field
                                      type="checkbox"
                                      name={`tasks.${index}.isComplete`}
                                      disabled={mode === 'view' || !(isEdit && new Date(values.start).getTime() <= Date.now())}
                                      className="w-4 h-4 text-green-500 bg-neutral-100 border-neutral-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                                    />
                                    <span className={`transition-colors ${
                                      mode === 'view' || !(isEdit && new Date(values.start).getTime() <= Date.now())
                                        ? "text-neutral-400 dark:text-neutral-500"
                                        : "text-neutral-600 dark:text-neutral-300 group-hover:text-green-600 dark:group-hover:text-green-400"
                                    }`}>
                                      {task.isComplete ? 'Completed' : 'Mark as complete'}
                                    </span>
                                  </label>

                                  {values.tasks.length > 1 && mode === 'edit' && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() => remove(index)}
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 h-auto"
                                    >
                                      <Trash size={14} />
                                    </Button>
                                  )}
                                </div>
                              </motion.div>
                            ))}

                            {mode === 'edit' && (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const lastTask = values.tasks[values.tasks.length - 1];

                                    // Require at least a title before adding another task
                                    if (!lastTask.title.trim()) {
                                      toast.warning("Please fill in the current task before adding another one.");
                                      return;
                                    }

                                    push({ title: '', description: '', isComplete: false });
                                  }}
                                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-950/20 py-3 rounded-xl transition-all duration-200"
                                >
                                  <Plus size={16} />
                                  <span>Add New Task</span>
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    </motion.div>
                    {/* Actions */}
                    {mode === 'edit' && (
                      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-neutral-800">
                    {/* Cancel */}
                    <Button
                      variant="outline"
                      onClick={() => onClose(false)}
                      aria-label="Close dialog"
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
                            className={`flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold ${gradients.primaryBtn} text-white shadow-md hover:shadow-xl hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
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
      
      <style jsx global>{`
        /* Hide the default Chadcn UI Dialog close button */
        .hide-dialog-close-button button[aria-label="Close"],
        .hide-dialog-close-button [data-radix-dialog-close],
        .hide-dialog-close-button button[data-radix-dialog-close],
        
      `}</style>

    </>
  );
}

// Gradient & style helpers
export const gradients = {
  header: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700',
  primaryBtn: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700',
  secondaryBtn: 'bg-gradient-to-r from-slate-500 to-slate-600',
};

export const textOnGradient = 'text-white';
export const ringOnFocus =
  'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 outline-none transition';
