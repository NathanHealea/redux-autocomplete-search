import axios from "axios";
import deburr from "lodash/deburr";

export const FETCH_CARDS_BEGIN = "FETCH_CARDS_BEGIN";
export const FETCH_CARDS_SUCCESS = "FETCH_CARDS_SUCCESS";
export const FETCH_CARDS_FAILURE = "FETCH_CARDS_FAILURE";

function getCards(cardname) {
  console.log("getCards");
  return axios(`https://api.scryfall.com/cards/search?unique=prints&q=${encodeURI(deburr(cardname.trim()).toLowerCase().replace(/\s+/g, '-'))}`)
    ;
}

function fetchAdditionalCards(url) {
  return dispatch => {
    dispatch(fetchAdditionalCardsBegin())

    return axios(url)
      .then(response => {

      })
  }
}

export function fetchCards(cardname, page = 1) {
  return dispatch => {
    dispatch(fetchCardsBegin());

    return getCards(cardname)
      .then(response => {

        if (response.state === 200 && response.data.has_more) {
          dispatch(fetchAdditionalCards(response.data.next_page))
        } else {
          if (response.status === 200) {
            dispatch(fetchCardsSuccess(response.data.data));

          } else {
            dispatch(fetchCardsFailure("An unknown error occured"));
          }
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
