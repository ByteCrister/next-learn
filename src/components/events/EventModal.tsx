'use client';

import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useEventsStore } from '@/store/useEventsStore';
import { VEvent } from '@/types/types.events';

interface Props { initial?: Partial<VEvent>; isOpen: boolean; onClose: Dispatch<SetStateAction<boolean>> }

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  start: Yup.date().required('Start date is required'),
  end: Yup.date()
    .min(Yup.ref('start'), 'End must be after start')
    .required('End date is required'),
  allDay: Yup.boolean(),
});

export function EventModal({ initial, isOpen, onClose }: Props) {
  const isEdit = Boolean(initial && initial._id);
  const { createEventAction, updateEventAction, buttonLoading } = useEventsStore();

  const defaults: VEvent = {
    title: initial?.title || '',
    start: initial?.start ? new Date(initial.start) : new Date(),
    end: initial?.end ? new Date(initial.end) : new Date(),
    allDay: initial?.allDay ?? false,
    description: initial?.description || '',
  };

  async function handleSubmit(values: VEvent) {
    const payload = {
      ...values,
      start: values.start instanceof Date ? values.start.toISOString() : values.start,
      end: values.end instanceof Date ? values.end.toISOString() : values.end,
    };

    if (isEdit) {
      await updateEventAction(initial!._id!, payload);
    } else {
      await createEventAction(payload);
    }
    onClose(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button
          className={`
            ${isEdit ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : gradients.primaryBtn}
            ${textOnGradient}
            hover:opacity-90
            transition-all duration-300 ease-in-out
            px-5 py-2
            rounded-lg shadow-md hover:shadow-lg
          `}
        >
          {isEdit ? 'Edit Event' : 'Add Event'}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-transparent shadow-none p-0 border-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-md mx-auto max-h-[90vh] overflow-y-auto 
            bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl 
            shadow-2xl"
        >
          {/* Header */}
          <div className={`w-full py-4 px-6 ${gradients.header} rounded-t-2xl`}>
            <DialogTitle className={`text-xl font-semibold ${textOnGradient}`}>
              {isEdit ? 'Edit Event' : 'New Event'}
            </DialogTitle>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6 text-gray-900">
            <Formik
              initialValues={{
                ...defaults,
                start: defaults.start ? new Date(defaults.start) : new Date(),
                end: defaults.end ? new Date(defaults.end) : new Date(),
              }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Live Preview */}
                  <div className="bg-white/40 backdrop-blur-sm rounded-md p-4 text-center shadow-inner">
                    <p className="text-sm text-gray-700">Selected Time</p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {values.start && values.end ? (
                        <>
                          {format(values.start, values.allDay ? 'PPP' : 'PPPp')}
                          <span className="mx-1 text-indigo-600">—</span>
                          {format(values.end, values.allDay ? 'PPP' : 'PPPp')}
                        </>
                      ) : (
                        <span className="text-gray-500">No date selected</span>
                      )}
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-gray-800 font-medium">Title</Label>
                    <Field
                      as={Input}
                      id="title"
                      name="title"
                      placeholder="Event title"
                      className={`${ringOnFocus} mt-1 text-gray-900 placeholder-gray-400`}
                    />
                    <ErrorMessage
                      name="title"
                      component="p"
                      className="mt-1 text-red-500 text-sm"
                    />
                  </div>

                  {/* Date Picker */}
                  <div>
                    <Label htmlFor="date" className="text-gray-800 font-medium">Date</Label>
                    <DatePicker
                      id="date"
                      selected={values.start}
                      onChange={(d: Date | null) => {
                        if (d) {
                          const newStart = new Date(d);
                          newStart.setHours(values.start.getHours(), values.start.getMinutes());
                          const newEnd = new Date(d);
                          newEnd.setHours(values.end.getHours(), values.end.getMinutes());
                          setFieldValue('start', newStart);
                          setFieldValue('end', newEnd);
                        }
                      }}
                      dateFormat="PPP"
                      className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white/70 ${ringOnFocus}`}
                    />
                    <ErrorMessage
                      name="start"
                      component="p"
                      className="mt-1 text-red-500 text-sm"
                    />
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
                    <Label htmlFor="allDay" className="text-gray-800">All Day</Label>
                  </div>

                  {/* Time Pickers */}
                  {!values.allDay && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime" className="text-gray-800 font-medium">Start Time</Label>
                        <DatePicker
                          id="startTime"
                          selected={values.start}
                          onChange={(t: Date | null) => {
                            if (t) {
                              const newStart = new Date(values.start);
                              newStart.setHours(t.getHours(), t.getMinutes());
                              setFieldValue('start', newStart);
                            }
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Start"
                          dateFormat="p"
                          className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white/70 ${ringOnFocus}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="endTime" className="text-gray-800 font-medium">End Time</Label>
                        <DatePicker
                          id="endTime"
                          selected={values.end}
                          onChange={(t: Date | null) => {
                            if (t) {
                              const newEnd = new Date(values.end);
                              newEnd.setHours(t.getHours(), t.getMinutes());
                              setFieldValue('end', newEnd);
                            }
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="End"
                          dateFormat="p"
                          className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white/70 ${ringOnFocus}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-gray-800 font-medium">Description</Label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Brief notes…"
                      className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white/70 
                        text-gray-900 placeholder-gray-400 ${ringOnFocus}`}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => onClose(false)}
                      className={`${gradients.secondaryBtn} ${textOnGradient} px-4 py-2 rounded-lg shadow hover:shadow-md`}
                    >
                      Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={buttonLoading}
                        className={`${gradients.primaryBtn} ${textOnGradient} px-4 py-2 rounded-lg shadow hover:shadow-md`}
                      >
                        {buttonLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}
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

export const gradients = {
  header: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  primaryBtn: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  secondaryBtn: 'bg-gradient-to-r from-gray-400 to-gray-600',
};

export const textOnGradient = 'text-white';
export const ringOnFocus = 'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
