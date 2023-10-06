export const GENERATION_INTERVAL_TIME = 1000;

/**
 * SET_INTERVAL constant is used to set interval and it is set in
 * the id property of the request.data property. TimeMs property must
 * also be set. Request.data example:
 *
 * {
 *      id: SET_INTERVAL,
 *      timeMs: 33
 * }.
 */
export const SET_INTERVAL = 1;

/**
 * CLEAR_INTERVAL constant is used to clear the interval and it is set in
 * the id property of the request.data property.
 *
 * {
 *      id: CLEAR_INTERVAL
 * }.
 */
export const CLEAR_INTERVAL = 2;

/**
 * INTERVAL_TIMEOUT constant is used as response and it is set in the id property.
 *
 * {
 *      id: INTERVAL_TIMEOUT
 * }.
 */
export const INTERVAL_TIMEOUT = 3;

export const RADIUS = 50;