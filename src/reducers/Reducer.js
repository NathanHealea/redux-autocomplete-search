import { SET_SEARCH, CLEAR_SEARCH } from "../actions/Search";
import {
  FETCH_CATALOG_BEGIN,
  FETCH_CATALOG_SUCCESS,
  FETCH_CATALOG_FAILURE
} from "../actions/Catalog";

import {
  FETCH_CARDS_BEGIN,
  FETCH_CARDS_SUCCESS,
  FETCH_CARDS_FAILURE
} from "../actions/Cards";

import { SET_SUGGESTIONS } from "../actions/Suggestions"

function search(state = "", action) {
  switch (action.type) {
    case SET_SEARCH:
      return action.payload;

    case CLEAR_SEARCH:
      return action.payload;

    default:
      return state;
  }
}

function catalog(
  state = {
    items: [],
    loading: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case FETCH_CATALOG_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CATALOG_SUCCESS:
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      return {
        ...state,
        loading: false,
        items: action.payload
      };

    case FETCH_CATALOG_FAILURE:
      // The request failed, but it did stop, so set loading to "false".
      // Save the error, and we can display it somewhere
      // Since it failed, we don't have items to display anymore, so set it empty.
      // This is up to you and your app though: maybe you want to keep the items
      // around! Do whatever seems right.
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };

    default:
      return state;
  }
}

function suggestions(
  state = [],
  action
) {
  switch (action.type) {
    case SET_SUGGESTIONS:
      return action.payload
    default:
      return state
  }
}

function cards(
  state = {
    items: [],
    loading: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case FETCH_CARDS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload
      };

    case FETCH_CARDS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };

    default:
      return state;
  }
}

export default function rootReducer(state = {}, action) {
  return {
    search: search(state.search, action),
    catalog: catalog(state.catalog, action),
    suggestions: suggestions(state.suggestions, action),
    cards: cards(state.results, action)
  };
}
