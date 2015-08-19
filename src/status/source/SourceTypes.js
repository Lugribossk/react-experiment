import AwsRss from "./AwsRss";
import DropwizardHealthcheck from "./DropwizardHealthcheck";
import Message from "./Message";
import StatusCode from "./StatusCode";
import StatusIo from "./StatusIo";
import TutumService from "./TutumService";
import VsoBuild from "./VsoBuild";

// Register all Source subclasses so they can be instantiated from the configuration.
export default [
    AwsRss,
    DropwizardHealthcheck,
    Message,
    StatusCode,
    StatusIo,
    TutumService,
    VsoBuild
];