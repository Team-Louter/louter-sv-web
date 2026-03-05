import { useState, useEffect } from 'react';
import type { EventInput } from '@fullcalendar/core';
import { getEvent } from '@/api/Event';
import { formatEvents } from '@/utils/formatEvent';

export const useEvent = () => {
  const [eventsInfo, setEventsInfo] = useState<EventInput[]>([]);

  const getEventInfo = async () => {
    try {
      const data = await getEvent();
      setEventsInfo(formatEvents(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEventInfo();
  }, []);

  return { eventsInfo, setEventsInfo };
};