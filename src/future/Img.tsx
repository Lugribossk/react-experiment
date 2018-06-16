import * as React from "react";
import * as Promise from "bluebird";
import {createFetcher} from "./Fetcher";

const imageFetcher = createFetcher<string, string>(
    src =>
        new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(src);
            image.src = src;
        })
);

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

export default class Img extends React.Component<Props> {
    render() {
        const {src, ...rest} = this.props;
        return <img {...rest} src={imageFetcher.read(src)} />;
    }
}
