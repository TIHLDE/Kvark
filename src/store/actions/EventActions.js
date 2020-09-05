export const actions = {
  ADD_EVENTS: 'EV_ADD_EVENTS',
  SET_EVENT_BY_ID: 'EV_SET_EVENT_BY_ID',
};

export const addEvents = (data) => (dispatch) => {
  if (data instanceof Array) {
    dispatch({ type: actions.ADD_EVENTS, payload: data.map(createEvent) });
  }
};

export const setEventById = (id, data) => (dispatch) => dispatch({ type: actions.SET_EVENT_BY_ID, payload: createEvent(data), id: id });

// --- SELECTORS ---
const getEventState = (state) => state.events;

export const getEvents = (state) => Object.values(getEventState(state).events);

export const getEventById = (id) => (state) => getEventState(state).events[id];

// --- Helper Methods ---
const createEvent = (event) => ({
  ...event,
  id: event.id,
  title: event.title,
  description: event.description,
  location: event.location,
  category: event.category,
  start: event.start,
  image: event.image,
  imageAlt: event.image_alt,
  expired: event.expired,
  priority: event.priority,
  signUp: event.signUp,
});
