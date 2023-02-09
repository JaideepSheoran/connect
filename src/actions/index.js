export const nextPost = (curr) => {
    return {
        type: "NEXT_POST",
        payload: curr
    }
};


export const prevPost = (curr) => {
    return {
        type: "PREV_POST",
        payload: curr
    }
}

export const setUserPosts = (array) => {
    return {
        type: 'SET_POSTS',
        payload: array
    }
}