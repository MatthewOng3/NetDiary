import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import collectionReducer from './collectionSlice'
import categoryReducer from './categorySlice'
import clusterReducer from './clusterSlice'


//Main store to store all reducers
export const store = configureStore({
	reducer: {
		user: userReducer,
		collection: collectionReducer,
		category: categoryReducer,
		cluster: clusterReducer
	}
})