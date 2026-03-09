import { useState, useEffect } from 'react';
import type { EventInput } from '@fullcalendar/core';
import { getEvent } from '@/api/Event';
import { formatEvents } from '@/utils/formatEvent';

export const useEvent = () => {
  const [eventsInfo, setEventsInfo] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getEventInfo = async () => {
    setIsLoading(true);
    try {
      const data = await getEvent();
      setEventsInfo(formatEvents(data));
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEventInfo();
  }, []);

  return { eventsInfo, setEventsInfo, isLoading };
};