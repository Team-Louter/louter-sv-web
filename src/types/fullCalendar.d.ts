declare module '@fullcalendar/react' {
  import { Component } from 'react';
  export default class FullCalendar extends Component<any> {}
}

declare module '@fullcalendar/daygrid' {
  const dayGridPlugin: any;
  export default dayGridPlugin;
}

declare module '@fullcalendar/interaction' {
  const interactionPlugin: any;
  export default interactionPlugin;
}

declare module '@fullcalendar/core' {
  export interface DateSelectArg {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    allDay: boolean;
    view: any;
  }
  
  export interface EventClickArg {
    event: EventApi;
    el: HTMLElement;
    jsEvent: MouseEvent;
    view: any;
  }
  
  export interface EventApi {
    title: string;
    start: Date | null;
    end: Date | null;
    allDay: boolean;
    extendedProps?: {
      assignees?: string[];
      description?: string;
      [key: string]: any;
    };
    remove: () => void;
  }
  
  export interface EventInput {
    title: string;
    date?: string;
    start?: string;
    end?: string;
    allDay?: boolean;
    extendedProps?: {
      assignees?: string[];
      description?: string;
      [key: string]: any;
    };
  }
}

export type CalendarProps = {
readOnly?: boolean;
}

export interface EventDetailCardProps {
event: import('@fullcalendar/core').EventApi | null;
position: { x: number; y: number };
onClose: () => void;
}