export const SET_SEARCH = "SET_SEARCH";
export const CLEAR_SEARCH = "CLEAR_SEARCH";

export function setSearch(value) {
  return {
    type: SET_SEARCH,
    payload: value
  };
}

export function clearSearch() {
  return {
    type: CLEAR_SEARCH,
    payload: ""
  };
}
