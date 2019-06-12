import axios from "axios";

export const FETCH_CATALOG_BEGIN = "FETCH_CATALOG_BEGIN";
export const FETCH_CATALOG_SUCCESS = "FETCH_CATALOG_SUCCESS";
export const FETCH_CATALOG_FAILURE = "FETCH_CATALOG_FAILURE";

function getCatalog() {
  console.log("getCatalog");
  return axios("https://api.scryfall.com/catalog/card-names");
}

export function fetchCatalog() {
  return dispatch => {
    dispatch(fetchCatalogBegin());

    return getCatalog()
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchCatalogSuccess(response.data.data));
        } else {
          dispatch(fetchCatalogFailure("An unknown error occured"));
        }
      })
      .catch(error => {
        dispatch(fetchCatalogFailure(error));
      });
  };
}

export const fetchCatalogBegin = () => ({
  type: FETCH_CATALOG_BEGIN
});

export const fetchCatalogSuccess = products => ({
  type: FETCH_CATALOG_SUCCESS,
  payload: products
});

export const fetchCatalogFailure = error => ({
  type: FETCH_CATALOG_FAILURE,
  payload: error
});
