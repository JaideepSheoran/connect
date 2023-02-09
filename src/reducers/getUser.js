const initialState = {};

const getUser = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            state = {...action.payload }
            return state;

        default:
            return state;
    }
}

export default getUser;