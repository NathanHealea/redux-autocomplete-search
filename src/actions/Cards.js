import axios from 'axios';
import deburr from 'lodash/deburr';
import update from 'immutability-helper';

export const FETCH_CARDS_BEGIN = 'FETCH_CARDS_BEGIN';
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS';
export const FETCH_CARDS_FAILURE = 'FETCH_CARDS_FAILURE';

const CARD_LIST = [];

function getCards(cardname) {
  return axios.get(
    `https://api.scryfall.com/cards/search?unique=prints&q=${encodeURI(
      `!"${deburr(cardname).toLowerCase()}"`
      // .replace(/\s+/g, '-')
    )}`
  );
}

async function getAdditionalCards(url, dispatch) {
  let cards = [];
  let response = null;

  try {
    response = await axios.get(url);
  } catch (error) {
    dispatch(fetchCardsFailure(error));
  }

  if (response.status !== 200) {
    dispatch(fetchCardsFailure(response.status));
  }

  if (response.data.has_more) {
    try {
      cards = await getAdditionalCards(response.data.next_page, dispatch);
    } catch (error) {
      dispatch(fetchCardsFailure(error));
    }
  }

  return update(cards, { $push: response.data.data });
}

export function fetchCards(cardname) {
  return dispatch => {
    dispatch(fetchCardsBegin());

    return getCards(cardname)
      .then(response => {
        if (response.status !== 200) {
          dispatch(fetchCardsFailure(response.status));
        }

        if (response.data.has_more) {
          getAdditionalCards(response.data.next_page, dispatch)
            .then(cards => {
              dispatch(
                fetchCardsSuccess(update(cards, { $push: response.data.data }))
              );
            })
            .catch(error => {
              dispatch(fetchCardsFailure(error));
            });
        } else {
          dispatch(fetchCardsSuccess(response.data.data));
        }
      })
      .catch(error => {
        dispatch(fetchCardsFailure(error));
      });
  };
}

export const fetchCardsBegin = () => ({
  type: FETCH_CARDS_BEGIN
});

export const fetchCardsSuccess = products => ({
  type: FETCH_CARDS_SUCCESS,
  payload: products
});

export const fetchCardsFailure = error => ({
  type: FETCH_CARDS_FAILURE,
  payload: error
});
