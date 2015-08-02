import React from "react";
import _ from "lodash";
import EndpointStore from "./EndpointStore";
import StatusIo from "./source/StatusIo";
import AwsRss from "./source/AwsRss";
import TutumService from "./source/TutumService";
import Indicator from "./Indicator";

var tutum = new StatusIo("Tutum", "http://status.tutum.co", "536beeeafd254d60080002ae");
var cloudfront = new AwsRss("CloudFront", "cloudfront");
var ec2UsEast = new AwsRss("EC2 US East", "ec2-us-east-1");
//var productionTutum = new TutumService("Production (Tutum service)", null, null, null);

var sources = [tutum, cloudfront, ec2UsEast/*, productionTutum*/];

export default class StatusDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.responseStore = new EndpointStore(sources);

        this.state = {
            statuses: this.responseStore.getResponses()
        };

        this.responseStore.onResponse(() => this.setState({statuses: this.responseStore.getResponses()}));
    }

    renderStatus(status) {
        return (
            <Indicator key={status.title} {...status} />
        );
    }

    render() {
        return (
            <div>
                {_.map(this.state.statuses, status =>this.renderStatus(status))}
            </div>
        );
    }
}