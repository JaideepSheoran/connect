import loadPosts from './getAllPosts';
import getUser from './getUser';

import { combineReducers } from "redux";

const rootReducer = combineReducers({
    loadPosts,
    getUser
});

export default rootReducer;