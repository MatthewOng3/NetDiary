import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import collectionReducer from './collectionSlice'
import categoryReducer from './categorySlice'



// const rootReducer = combineReducers({
// 	user: userReducer,
// 	collection: collectionReducer,
// 	category: categoryReducer,
// });

// const resettableReducer = (state, action) => {
// 	if (action.type === RESET_ALL_STATES) {
// 	  state = undefined;
// 	} else if (action.type === RESET_USER) {
// 	  state.user = userReducer(undefined, {});
// 	}
// 	return rootReducer(state, action);
// };

// //Main store to store all reducers
// export const store = configureStore({
// 	reducer: resettableReducer
// })

// //Main store to store all reducers
export const store = configureStore({
	reducer: {
		user: userReducer,
		collection: collectionReducer,
		category: categoryReducer,
	}
})