import React from "react/addons";
import expect from "unexpected";
import Route from "../../src/flux/Route";
import Router from "../../src/flux/Router";
import TestUtils from "../TestUtils";

class HasId extends React.Component {
    render() {
        return <div className="insideRoute">{this.props.id}</div>;
    }
}

describe("Route", () => {
    var component, componentNode;
    beforeEach(() => {
        Route.prototype.router = new Router();
    });

    describe("child component", () => {
        beforeEach(() => {
            component = TestUtils.React.renderIntoDocument(
                <div>
                    <Route path="test">
                        <div id="route"></div>
                    </Route>
                    <Route path="hasid/:id">
                        <HasId />
                    </Route>
                    <div id="unrelated"></div>
                </div>
            );
            componentNode = React.findDOMNode(component);
        });

        it("should be rendered if route matches.", () => {
            Route.getRouter().whenHashChange({newURL: "blah#test"});

            expect(componentNode.querySelectorAll("#route").length, "to be", 1);
        });

        it("should not be rendered if route does not match.", () => {
            expect(componentNode.querySelectorAll("#route").length, "to be", 0);
            expect(componentNode.querySelectorAll("#unrelated").length, "to be", 1);
        });

        it("should set route parameters as props on child.", () => {
            Route.getRouter().whenHashChange({newURL: "blah#hasid/12345"});

            expect(componentNode.querySelectorAll(".insideRoute").length, "to be", 1);
            var hasId = TestUtils.React.findRenderedComponentWithType(component, HasId);
            expect(hasId.props.id, "to be", "12345");
        });
    });
});