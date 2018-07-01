let exported = (module: any) => (component: any) => component;
if (process.env.NODE_ENV !== "production") {
    // tslint:disable-next-line:no-shadowed-variable no-require-imports no-var-requires
    const {hot} = require("react-hot-loader");
    exported = hot;
}

export const hot = exported;
