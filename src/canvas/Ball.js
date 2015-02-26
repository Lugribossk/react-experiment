import _ from "lodash";
import ball from "./ball.png";

export default class Ball {
    constructor(top, left) {
        this.id = _.uniqueId("ball");
        this.top = top || 0;
        this.left = left || 0;
    }

    update() {
        var speed = 1;
        if (this.left === 180 && this.top !== 0) {
            this.top -= speed;
        } else if (this.top === 0 && this.left !== 0) {
            this.left -= speed;
        } else if (this.top === 180) {
            this.left += speed;
        } else if (this.left === 0) {
            this.top += speed;
        }
    }

    getImage() {
        return ball;
    }
}
