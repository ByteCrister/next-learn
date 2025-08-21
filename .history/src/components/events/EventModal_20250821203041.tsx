'use client';

import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { format, addMinutes } from 'date-fns';
import { useEventsStore } from '@/store/useEventsStore';
import { VEvent } from '@/types/types.events';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, FileText, Tag } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  initial?: Partial<VEvent>;
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
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
});



export function EventModal({ initial, isOpen, onClose }: Props) {
  const isEdit = Boolean(initial && initial._id);
  const { createEventAction, updateEventAction, loading } = useEventsStore();

  const defaults: VEvent = {
    title: initial?.title || '',
    start: initial?.start ? new Date(initial.start) : new Date(),
    durationMinutes: initial?.durationMinutes ?? 60,
    allDay: initial?.allDay ?? false,
    description: initial?.description || '',
  };

  async function handleSubmit(values: VEvent) {
    if (new Date(values.start).getTime() <= Date.now()) {
      alert('Please select a date and time in the future.');
      return;
    }

    const payload: VEvent = {
      ...values,
      start: values.start instanceof Date ? values.start.toISOString() : values.start,
    };

    if (isEdit) {
      await updateEventAction(initial!._id!, payload);
    } else {
      await createEventAction(payload);
    }
    onClose(false);
  }


  const computeEnd = (start: Date, durationMinutes: number) => addMinutes(start, durationMinutes);
  const toDate = (d: string | Date): Date => (d instanceof Date ? d : new Date(d));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button
          className={`px-5 py-2 rounded-xl font-medium tracking-wide shadow-lg transition-all duration-300 ${isEdit ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : gradients.primaryBtn
            } ${textOnGradient} hover:shadow-xl hover:scale-[1.02]`}
        >
          {isEdit ? 'Edit Event' : 'Add Event'}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-transparent p-0 border-none shadow-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-lg w-full mx-auto max-h-[90vh] overflow-y-auto bg-white backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className={`w-full py-4 px-6 ${gradients.header} rounded-t-2xl`}>
            <DialogTitle className={`text-lg md:text-xl font-semibold ${textOnGradient}`}>
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6 text-gray-900">
            <Formik initialValues={defaults} validationSchema={schema} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Date/Time Preview Bar */}
                  {values.start && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 rounded-t-2xl">
                      <Calendar className="text-indigo-500 w-6 h-6" />
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {format(toDate(values.start), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {values.allDay
                            ? 'All Day'
                            : `${format(toDate(values.start), 'p')} - ${format(
                              computeEnd(toDate(values.start), values.durationMinutes),
                              'p'
                            )}`}
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-gray-800 font-medium flex items-center gap-2">
                      <Tag size={16} /> Title
                    </Label>
                    <Field
                      id="title"
                      name="title"
                      placeholder="Event title"
                      className={`${ringOnFocus} mt-1 text-gray-900 px-3 py-2 rounded-lg border border-gray-300 w-full`}
                    />
                    <ErrorMessage name="title" component="p" className="mt-1 text-red-500 text-sm" />
                  </div>

                  {/* Date Picker */}
                  <div>
                    <Label htmlFor="start" className="text-gray-800 font-medium flex items-center gap-2">
                      <Calendar size={20} /> Date
                    </Label>
                    <DatePicker
                      id="start"
                      selected={toDate(values.start)}
                      onChange={(d: Date | null) => d && setFieldValue('start', d)}
                      showTimeSelect
                      minDate={new Date()}
                      minTime={
                        toDate(values.start)?.toDateString() === new Date().toDateString()
                          ? new Date() // today → now
                          : new Date(new Date().setHours(0, 0, 0, 0)) // start of day
                      }
                      maxTime={new Date(new Date().setHours(23, 59, 59, 999))} // end of day
                      dateFormat="PPPp"
                      className={`${ringOnFocus} mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 h-[42px]`}
                      wrapperClassName="w-full"
                    />
                    <ErrorMessage name="start" component="p" className="mt-1 text-red-500 text-sm" />
                  </div>

                  {/* All Day Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      id="allDay"
                      type="checkbox"
                      checked={values.allDay}
                      onChange={(e) => setFieldValue('allDay', e.target.checked)}
                      className="h-4 w-4 text-indigo-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="allDay" className="text-gray-800">
                      All Day Event
                    </Label>
                  </div>

                  {/* Duration */}
                  {!values.allDay && (
                    <div>
                      <Label
                        htmlFor="durationMinutes"
                        className="text-gray-800 font-medium flex items-center gap-2"
                      >
                        <Clock size={16} /> Duration (minutes)
                      </Label>
                      <Field
                        id="durationMinutes"
                        type="number"
                        min={1}
                        name="durationMinutes"
                        className={`${ringOnFocus} mt-1 w-full px-3 py-2 rounded-lg border border-gray-300`}
                      />
                      <ErrorMessage
                        name="durationMinutes"
                        component="p"
                        className="mt-1 text-red-500 text-sm"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-gray-800 font-medium flex items-center gap-2"
                    >
                      <FileText size={16} /> Description
                    </Label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Brief notes…"
                      className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white/70`}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => onClose(false)}
                      className={`${gradients.secondaryBtn} ${textOnGradient} px-4 py-2 rounded-lg shadow hover:shadow-md transition-all`}
                    >
                      Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        className={`${gradients.primaryBtn} ${textOnGradient} px-4 py-2 rounded-lg shadow hover:shadow-md transition-all`}
                      >
                        {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}
                      </Button>
                    </motion.div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Gradient & style helpers
export const gradients = {
  header: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  primaryBtn: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  secondaryBtn: 'bg-gradient-to-r from-gray-400 to-gray-600',
};
export const textOnGradient = 'text-white';
export const ringOnFocus =
  'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 outline-none transition';
