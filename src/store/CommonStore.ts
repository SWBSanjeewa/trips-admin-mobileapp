import { remove } from "mobx";
import { types } from "mobx-state-tree";

const CommonStore = types
  .model({
    userId: types.optional(types.string, ""),
    routeType: types.optional(types.string, ""),
  })
  .actions((self) => ({
    reset() {
      self.userId = "";
      self.routeType = "";
    },
    populate(common) {
      self.userId = common.userId;
      self.routeType = common.routeType;
    },
    setRouteType(routeType) {
      self.routeType = routeType;
    },
    setUserId(userId) {
      self.userId = userId;
    },
  }));
  

export default CommonStore;