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
  
  export interface Assignee {
    userId: number;
    userEmail: string;
    userName: string;
  }

  export interface EventInput {
    title: string;
    date?: string;
    start?: string;
    scheduleId: number;
    end?: string;
    color: string;
    allDay?: boolean;
    extendedProps?: {
      assignees?: Assignee[];
      description?: string;
      [key: string]: any;
    };
  }
}

export type Event = {
  "title": string,
  "content": string,
  "startDate": string,
  "endDate": string,
  "scheduleId": number,
  "color": string,
  "users": {
      "userId": number,
      "userEmail": string,
      "userName": string
    }[]
}

export type ServerEvent = {
  "title": string,
  "content": string,
  "startDate": string,
  "endDate": string,
  "color": string,
  "scheduleTarget": string,
  "generations": number[],
  "userIds": number[]
}