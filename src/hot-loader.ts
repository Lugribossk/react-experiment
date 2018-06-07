let exported = (module: any) => (component: any) => component;
if (process.env.NODE_ENV !== "production") {
    const {hot} = require("react-hot-loader");
    exported = hot;
}

export const hot = exported;
