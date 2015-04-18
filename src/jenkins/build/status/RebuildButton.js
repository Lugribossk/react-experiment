import React from "react/addons";
import {Button, ModalTrigger} from "react-bootstrap";
import TriggerIntegrationTest from "../../TriggerIntegrationTest";
import BuildUtils from "../BuildUtils";
import Mixins from "../../../util/Mixins";

export default class RebuildButton extends React.Component {
    render() {
        var params = this.props.build.getParameters();
        return (
            <ModalTrigger modal={<TriggerIntegrationTest
                changelog={params.CHANGELOG}
                packagePath={params.PACKAGE_PATH}
                repoBranches={BuildUtils.getRepoBranches(params)} />}>
                <Button style={{float: "right"}}>
                    Rebuild
                </Button>
            </ModalTrigger>
        );
    }
}

Mixins.add(RebuildButton.prototype, [React.addons.PureRenderMixin]);