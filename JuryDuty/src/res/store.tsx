import { createStore, applyMiddleware,combineReducers } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'

const consoleMessages = (store: any) => (next: any) => (action: any) => {

	let result

	console.groupCollapsed(`dispatching action => ${action.type}`)

	result = next(action)

	console.log(store.getState())
	console.groupEnd()

	return result
}

// Combining two reducers into a single reducer
const mainReducer = combineReducers({
    reducer: reducer,

})

export default (initialState = {}) => {
	return applyMiddleware(thunk, consoleMessages)(createStore)(mainReducer, initialState)
}
