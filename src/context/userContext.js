const { createContext } = require("react");

const userContext = createContext({
    user: {},
    setUser: () => {}
});

export default userContext;