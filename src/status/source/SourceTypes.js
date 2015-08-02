// Register all Source subclasses so they can be instantiated from the configuration.
import AwsRss from "./AwsRss";
import DropwizardHealthcheck from "./DropwizardHealthcheck";
import Message from "./Message";
import StatusCode from "./StatusCode";
import StatusIo from "./StatusIo";
import TutumService from "./TutumService";

export default [AwsRss, DropwizardHealthcheck, Message, StatusCode, StatusIo, TutumService];