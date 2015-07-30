import React from "react";
import EndpointStore from "./EndpointStore";
import StatusIo from "./StatusIo";
import AwsRss from "./AwsRss";

var tutum = {
    url: "https://api.status.io/1.0/status/51f6f2088643809b7200000d"
};
var cloudfront = {
    rss: "http://status.aws.amazon.com/rss/cloudfront.rss"
};
var ec2UsEast1 = {
    rss: "http://status.aws.amazon.com/rss/ec2-us-east-1.rss"
};

export default class StatusDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.responses = new EndpointStore([tutum, cloudfront, ec2UsEast1]);

        this.responses.onResponse(() => this.forceUpdate());
    }

    render() {
        return (
            <div>
                <StatusIo title="Tutum" url="http://status.tutum.co" response={this.responses.getResponse(tutum)} />
                <AwsRss title="CloudFront US" response={this.responses.getResponse(cloudfront)} />
                <AwsRss title="EC2 US East" response={this.responses.getResponse(ec2UsEast1)} />
            </div>
        );
    }
}