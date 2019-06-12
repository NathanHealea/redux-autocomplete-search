export const SET_SUGGESTIONS = "SET_SUGGESTIONS"


export function setSuggestions(suggestions){
  return {
    type: SET_SUGGESTIONS,
    payload: suggestions
  }
}