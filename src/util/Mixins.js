import _ from "lodash";

export default {
    add: function (context, mixins) {
        // TODO this is terrible and will break if the same method is used in different mixins
        _.forEach(mixins, (mixin) => {
            _.assign(context, mixin);
        });
    }
}