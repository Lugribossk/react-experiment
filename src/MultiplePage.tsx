import React from "react";
import Promise from "bluebird";
import {Card, Loader} from "semantic-ui-react";
import {createFetcher} from "./suspense/Fetcher";
import Placeholder from "./suspense/Placeholder";

const productFetcher = createFetcher((n: number) => Promise.delay(n * 1000, `Test ${n}`));

const ProductCard: React.FunctionComponent<{n: number}> = ({n}) => {
    const name = productFetcher.read(n);
    return (
        <Card>
            <Card.Content style={{minHeight: 100}}>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>Test</Card.Meta>
                <Card.Description>Blah blah blah blah blah</Card.Description>
            </Card.Content>
        </Card>
    );
};

const LoadingCard = () => (
    <Card>
        <Card.Content style={{minHeight: 100}}>
            <Card.Description>
                <Loader active />
            </Card.Description>
        </Card.Content>
    </Card>
);

export default class MultiplePage extends React.Component<{}> {
    render() {
        return (
            <Card.Group>
                {[1, 2, 3, 4, 4, 10].map((n, i) => (
                    <Placeholder key={i} fallback={<LoadingCard />}>
                        <ProductCard n={n} />
                    </Placeholder>
                ))}
            </Card.Group>
        );
    }
}
