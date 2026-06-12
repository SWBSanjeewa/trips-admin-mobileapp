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
  time: types.string
})
.actions((self) => ({
  setTime(time) {
    self.time = time;
  }
})
);

const StoppingPlace = types.model({
  place: types.optional(types.string, ""),
  latitude: types.optional(types.string, ""),
  longitude: types.optional(types.string, ""),
})
.actions((self) => ({
  setPlace(place,latitude,longitude) {
    self.place = place;
    self.latitude = latitude;
    self.longitude = longitude;
  }
})
);



const Timetable = types.model({
  stoppings: types.array(Stopping),
  runningNumber: types.string // Galle - Makumbura M1 G1 SLTB
})
.actions((self) => ({
  setName(name){
    this.name= name;
  },
  setMobileNumber(mobileNumber){
    this.mobileNumber=mobileNumber;
  },
  reset(){
    
  },
}))

const Route = types.model({
  runningDays: types.string,
  timetableType: types.optional(types.string, "SelectedDays"),  // SelectedDays, SelectedDates
  selectedDaysTimetables: types.array(Timetable),
  selectedDatesTimetables: types.array(Timetable)
})


const NewRouteVirtualBusStore = types
  .model({
    objectId: types.optional(types.string, ""),
    title: types.optional(types.string, ""),  // Colombo to Kandy
    routeNo: types.optional(types.string, ""),   // 636 Kandy matale (via Wattegama)
    operator: types.optional(types.string, ""),   // SLTB, Private, Combined
    transportAuthority: types.optional(types.string, ""),   // NTC, CP-TSA, SP-RPSA
    typeOfService: types.optional(types.string, ""),   // Normal, Luxury, Super Luxury
    stoppingPlaces: types.array(StoppingPlace),
    journey: types.optional(Route, {
      runningDays: "2,3,4,5,6",
      selectedDaysTimetables: [],
      selectedDatesTimetables: []
    }),
    returnJourney: types.optional(Route, {
      runningDays: "2,3,4,5,6",
      selectedDaysTimetables: [],
      selectedDatesTimetables: []
    }),
    
  })
  .actions((self) => ({
    reset() {
      console.log("self::"+self);
      self.objectId = "";
      self.title = "";
      self.routeNo = "";
      self.operator = "";
      self.transportAuthority = "";
      self.typeOfService = "";
      self.stoppingPlaces= StoppingPlace[0];
    },
    populate(bus) {
      self.objectId = bus._id;
      self.title = bus.title;
      self.routeNo = bus.routeNo;
    },
    setTitle(title) {
      self.title = title;
    },
    setRouteNo(routeNo) {
      self.routeNo = routeNo;
    },
    setObjectId(objectId) {
      self.objectId = objectId;
    },
    setOperator(operator) {
      self.operator = operator;
    },
    setTransportAuthority(transportAuthority) {
      self.transportAuthority = transportAuthority;
    },
    setTypeOfService(typeOfService) {
      self.typeOfService = typeOfService;
    },
    addStoppingPlace(place,latitude,longitude){
      self.stoppingPlaces.push({
        place,
        latitude,
        longitude
      })
    },
    addStoppingPlaceAtIndex(place,latitude,longitude,index){
      self.stoppingPlaces.splice(index, 0, {place,latitude,longitude});
    },
    getIndex(stoppingPlace){
      return self.stoppingPlaces.findIndex(q => q === stoppingPlace);
    },
    getStopping(index){
      return self.stoppingPlaces[index];
    },
    deleteStoppingPlaceByIndex(index){
      //const s = self.stoppings.find(s => s === stopping);
      self.stoppingPlaces.remove(self.stoppingPlaces[index]);
    },
    deleteStoppingPlaceByPlace(place){
       const stoppingPlace = self.stoppingPlaces.find(p => p.place === place);
       self.stoppingPlaces.remove(stoppingPlace);
    }
  }))
  .views((self) => ({
    
  })
);

export default NewRouteVirtualBusStore;