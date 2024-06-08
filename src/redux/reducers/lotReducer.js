// redux/reducers/lotReducer.js
const initialState = {
    lotNumber: ''
  };
  
  const lotReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_LOT_NUMBER':
        return {
          ...state,
          lotNumber: action.payload
        };
      default:
        return state;
    }
  };
  
  export default lotReducer;
  