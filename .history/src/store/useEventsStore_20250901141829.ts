import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";

import {
  createEvent,
  updateEvent,
  getEvents,
  deleteEvent,
} from "@/utils/api/api.events";

import { VEvent } from "@/types/types.events";

interface EventsState {
  events: VEvent[];
  fetching: boolean;
  hasFetched: boolean;
  loading: boolean;

  fetchEvents: () => Promise<void>;
  createEventAction: (values: VEvent) => Promise<void>;
  updateEventAction: (id: string, values: VEvent) => Promise<boolean>;
  deleteEventAction: (id: string) => Promise<boolean>;
}

export const useEventsStore = create<EventsState>()(
  devtools((set, get) => ({
    events: [],
    fetching: false,
    loading: false,
    hasFetched: false,

    fetchEvents: async () => {
      if (get().hasFetched || get().fetching)
        return

      set({ fetching: true });
      try {
        const data = await getEvents();
        if ("message" in data) {
          toast.error(data.message);
        } else {
          // Process events and update their status based on current time
          const processedEvents = await Promise.all(
            data.map(async (evt) => {
              const processedEvent = {
                ...evt,
                start: new Date(evt.start ?? ''),
                end: new Date(evt.end ?? ''),
              };

              // Calculate the correct status based on current time
              const newStatus = calculateEventStatus(processedEvent);

              // If status has changed, update it in the database
              if (newStatus !== processedEvent.eventStatus) {
                const updatedEvent = { ...processedEvent, eventStatus: newStatus };
                await updateEvent(evt._id!, updatedEvent);
                return {
                  ...updatedEvent,
                  start: new Date(updatedEvent.start ?? ''),
                  end: new Date(updatedEvent.end ?? ''),
                };
              }

              return processedEvent;
            })
          );

          set({
            hasFetched: true,
            events: processedEvents,
          });
        }
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        set({ fetching: false });
      }
    },

    createEventAction: async (values) => {
      set({ loading: true });
      try {
        const result = await createEvent(values);
        if ("message" in result) {
          toast.error(result.message);
        } else {
          set((state) => ({
            events: [
              { ...result, start: new Date(result.start ?? ''), end: new Date(result.end ?? ''), _id: result._id },
              ...state.events,
            ],
          }));
          toast.success("Event created successfully");
        }
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        set({ loading: false });
      }
    },

    updateEventAction: async (id, values) => {
      set({ loading: true });
      try {
        const result = await updateEvent(id, values);
        if ("message" in result) {
          toast.error(result.message);
          return false;
        } else {
          set((state) => ({
            events: state.events.map((evt) =>
              evt._id === id
                ? {
                  ...result,
                  start: new Date(result.start ?? ''),
                  end: new Date(result.end ?? ''),
                  _id: result._id || id, // fallback id
                }
                : evt
            ),
          }));
          toast.success("Event updated successfully");
          return true;
        }
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        set({ loading: false });
      }
    },

    deleteEventAction: async (id) => {
      set({ loading: true });
      try {
        const result = await deleteEvent(id);
        if ("message" in result) {
          toast.error(result.message);
          return false;
        } else {
          set((state) => ({
            events: state.events.filter((evt) => evt._id !== id),
          }));
          toast.success("Event deleted successfully");
          return true;
        }
      } catch (err) {
        toast.error((err as Error).message);
        return false;
      } finally {
        set({ loading: false });
      }
    },
  }))
);
