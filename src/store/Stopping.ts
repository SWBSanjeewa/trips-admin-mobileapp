import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"



const Stopping = types.model({
  title: types.optional(types.string, ""),   // Lunch, Start 2nd Day, End 1st Day
  remarks: types.optional(types.string, ""),   //
  place: types.optional(types.string, ""),
  latitude: types.optional(types.number, 0.0),
  longitude: types.optional(types.number, 0.0),
  day: types.optional(types.string, "1"),
  time: types.optional(types.string, ""),
  waitingTime: types.optional(types.string, "15 mins"),
})
.actions((self) => ({
  reset() {
      console.log("self::"+self);
      self.place = "";
      self.latitude = 7.183527;
      self.longitude = 80.132246;
      self.time= "";
  },
  setTime(time) {
    self.time = time;
  },
  setDay(day) {
    self.day = day;
  },
  setWaitingTime(waitingTime) {
    self.waitingTime = waitingTime;
  },
  setTitle(title) {
    self.title = title;
  },
  setPlace(place) {
    self.place = place;
  },
  setLatitude(latitude) {
    self.latitude = latitude;
  },
  setLongitude(longitude) {
    self.longitude = longitude;
  }
})
);

export default Stopping;