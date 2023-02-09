const initialState = ['Jaideep']

const loadPosts = (state = [], action) => {
    switch (action.type) {
        case 'SET_POSTS':
            state = [...action.payload]
            return state;

        default:
            return state;
    }
}

export default loadPosts;