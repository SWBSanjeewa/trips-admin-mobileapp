import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"

/*
id: String,
   routeNumber: String, //Eg: Colombo - Kandy 01
   title: String,
   stoppings: [String],
   vehicleType: String, // Luxury, Semi-Luxury, Normal,
   timetableType: String,
   distance: String,
   runningTime: String,
   timetableType: String,  //whether it is everyday, odd-even etc
   everyDayTimetable: Timetable,
   oddDayTimetable: Timetable,
   evenDayTimetable: Timetable,
   selectedDayTimetables: [Timetable],
   selectedDateTimetables: [Timetable],   // 2
   countryCode: String,

   journey: [Journey],
    returnJourney: [Journey],
    runningDays: [String],
    validUntil: Date


    const Journey = new Schema({ 
    start: String,
    end: String,
    transportServiceType: String,  //SLTB, PVT
    roadType: String,  // ExpressWay, Normal
    depot: String,
    ntcNumber: String,
    busRunningNumber: String,
    busRegistrationNumber: String,
    stoppings: [Stopping]
});

   */
const Stopping = types.model({
  place: types.optional(types.string, ""),
  latitude: types.optional(types.number, 0.0),
  longitude: types.optional(types.number, 0.0),
  plusDays: types.optional(types.number, 0.0),
  time: types.string,
})
.actions((self) => ({
  setTime(time) {
    self.time = time;
  }
})
);

const Journey = types.model({
  start: types.optional(types.string, ""), 
  startTime: types.string,
  startTimePlusDays: types.optional(types.string, ""),
  end: types.optional(types.string, ""),
  endTime: types.string,
  endTimePlusDays: types.optional(types.string, ""),
  distance: types.optional(types.string, ""),
  transportServiceType: types.optional(types.string, ""),  //SLTB, PVT
  roadType: types.optional(types.string, ""),     // ExpressWay, Normal
  depot: types.optional(types.string, ""),
  ntcNumber: types.optional(types.string, ""),
  busRunningNumber: types.optional(types.string, ""),
  busRegistrationNumber: types.optional(types.string, ""),
  stoppings: types.array(Stopping),
})
.actions((self) => ({
  
  setStart(start){
    this.start= start;
  },
  setEnd(end){
    this.end=end;
  },
  reset(){
    self.start="";
    self.end="";
  },
}))


const Timetable = types.model({
  journey: types.array(Journey),
  returnJourney: types.array(Journey),
  runningDays: types.optional(types.string, "")
})
.actions((self) => ({
  addDriver(name, mobileNumber){
      self.name=name;
      self.mobileNumber=mobileNumber;
  },
  setName(name){
    this.name= name;
  },
  setMobileNumber(mobileNumber){
    this.mobileNumber=mobileNumber;
  },
  reset(){
    self.name="";
    self.mobileNumber="";
  },
}))


const NewRouteVirtualBusStore = types
  .model({
    id: types.optional(types.string, ""),
    objectId: types.optional(types.string, ""),
    routeNumber: types.optional(types.string, ""),  //01
    title: types.optional(types.string, ""),   //Colombo-Kandy
    stoppings: types.array(Stopping),
    vehicleType: types.optional(types.string, "Highway"),    // Highway, Highway-Luxury, Luxury, Semi-Luxury, Normal, Semi-Luxury & Normal
    timetableType: types.optional(types.string, "Everyday"),  // Everyday, OddEven, SelectedDays, SelectedDates
    everyDayTimetable: types.optional(Timetable, {
    }),
    oddDayTimetable: types.optional(Timetable, {
    }),
    evenDayTimetable: types.optional(Timetable, {
    }),
    selectedDayTimetables: types.array(Timetable),
    selectedDateTimetables: types.array(Timetable)
  })
  .actions((self) => ({
    reset() {
      console.log("self::"+self);
      self.id = "";
      self.objectId = "";
      self.routeNumber = "";
      self.title = "";
      self.stoppings= String[0];
      self.everyDayTimetable = null;
      self.oddDayTimetable = null;
      self.evenDayTimetable = null;
      self.selectedDayTimetables = Timetable[0];
      self.selectedDateTimetables = Timetable[0];
    },
    populate(bus) {
      self.id = bus.id;
      self.objectId = bus._id;
      self.title = bus.title;
    },
    setId(id) {
      self.id = id;
    },
    setObjectId(objectId) {
      self.objectId = objectId;
    },
    setVehicleType(vehicleType) {
      self.vehicleType = vehicleType;
    },
    addStopping(place,latitude,longitude,time){
      self.stoppings.push({
        place,
        latitude,
        longitude,
        time
      })
    },
    addStoppingAtIndex(place,latitude,longitude,time,index){
      self.stoppings.splice(index, 0, {place,latitude,longitude,time});
    },
    getIndex(stopping){
      return self.stoppings.findIndex(q => q === stopping);
    },
    getStopping(index){
      return self.stoppings[index];
    },
    deleteStopping(index){
      //const s = self.stoppings.find(s => s === stopping);
      self.stoppings.remove(self.stoppings[index]);
    }
  }))
  .views((self) => ({
    getPassengers() {
      return self.passengers.length;
    }
  })
);

export default NewRouteVirtualBusStore;