export interface CommonEvent {
  shop_no: number;
  event_no: number;
  name: string;
  status: string; // T or F
  category_no: number;
  display_position?: string;
  content?: string;
  register_date: string;
}

export interface CommonEventLink {
  rel: string;
  href: string;
}

export interface CommonEventsResponse {
  commonevents: CommonEvent[];
  links: CommonEventLink[];
}

// POST and PUT requests use this wrapped structure
export interface CreateCommonEventRequest {
  shop_no?: number;
  request: {
    name: string;
    status: string; // T or F
    category_no: number;
    display_position?: "top_detail" | "side_image";
    content?: string;
  };
}

export interface UpdateCommonEventRequest {
  shop_no?: number;
  request: {
    name?: string;
    status?: string; // T or F
    category_no?: number;
    display_position?: "top_detail" | "side_image";
    content?: string;
  };
}

export interface CommonEventResponse {
  commonevent: CommonEvent;
}
