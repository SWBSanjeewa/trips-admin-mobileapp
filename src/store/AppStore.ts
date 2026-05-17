import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"
import NewRouteVirtualBusStore from "./RouteBusStore";
import TourStore from "./TourStore";
import StoppingStore from "./Stopping";





const User = types.model({
  name: types.optional(types.string, ""),
  mobileNumber: types.optional(types.string, ""),
  accessToken: types.optional(types.string, ""),
  countryCode: types.optional(types.string, ""),
  role: types.optional(types.string, ""),
  defaultTransportService: types.optional(types.string, ""),
})
.actions((self) => ({
  setMobileNumber(mobileNumber){
      self.mobileNumber=mobileNumber;
  },  
  setName(name){
    self.name=name;
  }, 
  setAccessToken(accessToken){
    self.accessToken=accessToken;
  }, 
  setRole(role){
    self.role=role;
  }, 
  setCountryCode(countryCode){
    self.countryCode=countryCode;
  }, 
  setDefaultTransportService(defaultTransportService){
    self.defaultTransportService=defaultTransportService;
  }, 
  reset(){
    self.name="";
    self.mobileNumber="";
    self.role="";
    self.countryCode=""
  }, 
}))

const Driver = types.model({
  name: types.optional(types.string, ""),
  mobileNumber: types.optional(types.string, ""),
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


const Owner = types.model({
  name: types.optional(types.string, ""),
  mobileNumber: types.optional(types.string, ""),
})
.actions((self) => ({
  addOwner(name, mobileNumber){
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


const Vehicle = types.model({
  vehicleType: types.optional(types.string, "Van"),
  id: types.optional(types.string, ""),
  title: types.optional(types.string, ""),
  regNumber: types.optional(types.string, ""),
  noOfSeats: types.optional(types.string, ""),
  photos: types.array(types.string),
})
.actions((self) => ({
  addVehicle(id, title, regNumber, vehicleType, noOfSeats){
      self.id=id;
      self.title=title;
      self.regNumber=regNumber;
      self.vehicleType=vehicleType;
      self.noOfSeats=noOfSeats;  
  },
  setTitle(title){
    self.title= title;
  },
  setId(id){
    self.id= id;
  },
  setRegNumber(regNumber){
    self.regNumber=regNumber;
  },
  setVehicleType(vehicleType) {
    self.vehicleType = vehicleType;
  },
  setNoOfSeats(noOfSeats){
    self.noOfSeats=noOfSeats;
  },
  reset(){
    self.title="";
    self.regNumber="";
    self.photos= String[0];
  },
  addPhoto(photo){
      self.photos.push(photo);
  },
  getPhoto(index){
    return self.photos[index];
  },
  deletePhoto(index){
    self.photos.remove(self.photos[index]);
  },
}))

const Watcher = types.model({
  name: types.optional(types.string, ""),
  mobileNumber: types.optional(types.string, ""),
})
.actions((self) => ({
  addWatcher(name, mobileNumber){
      self.name=name;
      self.mobileNumber=mobileNumber;  
  },
  updateName(name){
    self.name=name;
  },
}))


const Passenger = types.model({
  name: types.optional(types.string, ""),
  mobileNumber: types.optional(types.string, ""),
  journeyStart: types.optional(types.string, ""),
  journeyStartLatitude: types.optional(types.number, 0.0),
  journeyStartLongitude: types.optional(types.number, 0.0),
  journeyEnd: types.optional(types.string, ""),
  journeyEndLatitude: types.optional(types.number, 0.0),
  journeyEndLongitude: types.optional(types.number, 0.0),
  returnJourneyStart: types.optional(types.string, ""),
  returnJourneyStartLatitude: types.optional(types.number, 0.0),
  returnJourneyStartLongitude: types.optional(types.number, 0.0),
  returnJourneyEnd: types.optional(types.string, ""),
  returnJourneyEndLatitude: types.optional(types.number, 0.0),
  returnJourneyEndLongitude: types.optional(types.number, 0.0),
  journeyWeekdays: types.optional(types.string, "2,3,4,5,6"),
  returnJourneyWeekdays: types.optional(types.string, "2,3,4,5,6"),
  watchers: types.array(Watcher),
})
.actions((self) => ({
  addPassenger(name, mobileNumber, journeyStart, journeyStartLatitude, journeyStartLongitude,journeyEnd,journeyEndLatitude, journeyEndLongitude,returnJourneyStart, returnJourneyStartLatitude, returnJourneyStartLongitude,returnJourneyEnd,returnJourneyEndLatitude, returnJourneyEndLongitude,journeyWeekdays,returnJourneyWeekdays, watchers){
      self.name=name;
      self.mobileNumber=mobileNumber;

      self.journeyStart=journeyStart;
      self.journeyStartLatitude=journeyStartLatitude;
      self.journeyStartLongitude=journeyStartLongitude;

      self.journeyEnd=journeyEnd;
      self.journeyEndLatitude=journeyEndLatitude;
      self.journeyEndLongitude=journeyEndLongitude;

      self.returnJourneyStart=returnJourneyStart;
      self.returnJourneyStartLatitude=returnJourneyStartLatitude;
      self.returnJourneyStartLongitude=returnJourneyStartLongitude;

      self.returnJourneyEnd=returnJourneyEnd;
      self.returnJourneyEndLatitude=returnJourneyEndLatitude;
      self.returnJourneyEndLongitude=returnJourneyEndLongitude;


      self.journeyWeekdays=journeyWeekdays;
      self.returnJourneyWeekdays=returnJourneyWeekdays;

      self.watchers = watchers;
     
     
  },
  updateName(name){
    self.name=name;
  },
  addWatcher(name, mobileNumber){
    self.watchers.push({
      name,
      mobileNumber
    })
  },
  findWatcher(mobileNumber){
    const watcher = self.watchers.find(p => p.mobileNumber === mobileNumber);
    return watcher;
  },
  deleteWatcher(mobileNumber){
    const watcher = self.watchers.find(p => p.mobileNumber === mobileNumber);
    self.watchers.remove(watcher);
  },
  updateWatcher(name, mobileNumber){
    const watcher = self.watchers.find(p => p.mobileNumber === mobileNumber);
    watcher.mobileNumber=mobileNumber;
    watcher.name=name;
  },
  updateJourneyStart(journey, latitude, longitude){
    self.journeyStart=journey;
    self.journeyStartLatitude=latitude;
    self.journeyStartLongitude=longitude;
  },
  updateJourneyEnd(journey, latitude, longitude){
    self.journeyEnd=journey;
    self.journeyEndLatitude=latitude;
    self.journeyEndLongitude=longitude;
  },
  updateReturnJourneyStart(journey, latitude, longitude){
    self.returnJourneyStart=journey;
    self.returnJourneyStartLatitude=latitude;
    self.returnJourneyStartLongitude=longitude;
  },
  updateReturnJourneyEnd(journey, latitude, longitude){
    self.returnJourneyEnd=journey;
    self.returnJourneyEndLatitude=latitude;
    self.returnJourneyEndLongitude=longitude;
  },
  updateRegularInfo(name, mobileNumber,journeyWeekdays,returnJourneyWeekdays){
    self.name=name;
    self.mobileNumber=mobileNumber;
    self.journeyWeekdays=journeyWeekdays;
    self.returnJourneyWeekdays=returnJourneyWeekdays;
  },
  reset(){
    self.name="";
    self.mobileNumber="";

    self.journeyStart="";
    self.journeyStartLatitude=0.0;
    self.journeyStartLongitude=0.0;

    self.journeyEnd="";
    self.journeyEndLatitude=0.0;
    self.journeyEndLongitude=0.0;

    self.returnJourneyStart="";
    self.returnJourneyStartLatitude=0.0;
    self.returnJourneyStartLongitude=0.0;

    self.returnJourneyEnd="";
    self.returnJourneyEndLatitude=0.0;
    self.returnJourneyEndLongitude=0.0;

    self.watchers = Watcher[0];
  },
  
  
}))



const Stopping = types.model({
  place: types.optional(types.string, ""),
  latitude: types.optional(types.number, 0.0),
  longitude: types.optional(types.number, 0.0),
  time: types.string,
})
.actions((self) => ({
  setTime(time) {
    self.time = time;
  }
})
);


const StoppingPlace = types.model({
  place: types.optional(types.string, "")
})
.actions((self) => ({
  setPlace(place) {
    self.place = place;
  }
})
);


const Route = types.model({
  stoppings: types.array(Stopping),
  runningDays: types.string,
  live: types.optional(types.boolean, false)
})



const NewBusStore = types
  .model({
    id: types.optional(types.string, ""),
    objectId: types.optional(types.string, ""),
    transportServiceId: types.optional(types.string, ""),
    transportServiceName: types.optional(types.string, ""),
    transportServiceThemeColor: types.optional(types.string, "#142169"),
    drivers: types.array(Driver),
    vehicleType: types.optional(types.string, "Van"),
    routeType: types.optional(types.string, "staff-service"),
    registrationNumber: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    stoppings: types.array(StoppingPlace),
    noOfSeats: types.optional(types.string, ""),
    countryCode: types.optional(types.string, ""),
    passengers: types.array(Passenger),
    photos: types.array(types.string),
    journey: types.optional(Route, {
      stoppings: [],
      runningDays: "2,3,4,5,6",
      live: false
    }),
    returnJourney: types.optional(Route, {
      stoppings: [],
      runningDays: "2,3,4,5,6",
      live: false
    }),
  })
  .actions((self) => ({
    reset() {
      console.log("self::"+self);
      self.id = "";
      self.objectId = "";
      self.vehicleType = "";
      self.routeType = "";
      self.registrationNumber = "";
      self.title = "";
      self.description = "";
      self.noOfSeats = "";
      self.stoppings= String[0];
      self.drivers = Driver[0];
      self.passengers = Passenger[0];
      self.photos = String[0];
      self.journey.stoppings = Stopping[0];
      self.returnJourney.stoppings = Stopping[0];
      self.journey.live=false;
      self.returnJourney.live=false;
      self.transportServiceId = "";
      self.transportServiceName = "";
      self.transportServiceThemeColor = "#142169";
      self.countryCode="";
      
    },
    populate(bus) {
      self.id = bus.id;
      self.objectId = bus._id;
      self.registrationNumber = bus.registrationNumber;
      self.title = bus.title;
      self.description = bus.description;
      self.vehicleType = bus.vehicleType;
      self.routeType = bus.routeType;
      self.drivers = bus.drivers;
      //self.owners = bus.owners;
      self.noOfSeats = bus.noOfSeats;
      self.countryCode = bus.countryCode;
      //self.passengers = bus.passengers;
      self.photos = bus.photos;
      self.transportServiceId = bus.transportServiceId;
      self.transportServiceName = bus.transportServiceName;
      self.transportServiceThemeColor = bus.transportServiceThemeColor;
      
      //self.journey.stoppings = bus.journey.stoppings;
      //self.returnJourney = bus.returnJourney;
    },
    setId(id) {
      self.id = id;
    },
    setObjectId(objectId) {
      self.objectId = objectId;
    },
    setCountryCode(countryCode) {
      self.countryCode = countryCode;
    },
    setTransportServiceId(transportServiceId) {
      self.transportServiceId = transportServiceId;
    },
    setTransportServiceName(transportServiceName) {
      self.transportServiceName = transportServiceName;
    },
    setTransportServiceThemeColor(transportServiceThemeColor) {
      self.transportServiceThemeColor = transportServiceThemeColor;
    },
    setVehicleType(vehicleType) {
      self.vehicleType = vehicleType;
    },
    setRouteType(routeType) {
      self.routeType = routeType;
    },
    setTitle(title) {
      self.title = title;
    },
    setRegistrationNumber(registrationNumber) {
      self.registrationNumber = registrationNumber;
    },
    setDescription(description) {
      self.description = description;
    },
    setNoOfSeats(noOfSeats) {
      self.noOfSeats = noOfSeats;
    },
    addPhoto(photo){
      self.photos.push(photo);
      console.log("No of photo:"+self.photos.length);
    },
    getPhoto(index){
      console.log("getPhotos No of photo:"+self.photos.length);
      console.log("GetPhotos index:"+index);
      return self.photos[index];
    },
    deletePhoto(index){
      console.log("No of photo before deletion:"+self.photos.length);
      console.log("GetPhotos index:"+index);
      self.photos.remove(self.photos[index]);
      console.log("No of photo after deletion:"+self.photos.length);
    },

    /*
    addStopping(stopping){
      self.stoppings.push(stopping);
    },
    addStoppingAtIndex(stopping,index){
      self.stoppings.splice(index, 0, stopping);
    },
    getIndex(stopping){
      return self.stoppings.findIndex(q => q === stopping);
    },
    getStopping(index){
      return self.stoppings[index];
    },
    deleteStopping(stopping){
      const s = self.stoppings.find(s => s === stopping);
      self.stoppings.remove(s);
    },

    place: types.optional(types.string, ""),
  latitude: types.optional(types.number, 0.0),
  longitude: types.optional(types.number, 0.0),
  time: types.string,

    */
    addStopping(place){
      console.log("Adding place::#"+place);
      self.stoppings.push({
        place
      })
    },
    addStoppingAtIndex(place,index){
      console.log("Adding place::#"+place+" index:"+index);
      self.stoppings.splice(index, 0, {place});
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
    },
   
    addPassenger1(name, mobileNumber){
     
      self.passengers.push({
        name,
        mobileNumber
      })
    },
    addPassenger(name, mobileNumber, journeyStart, journeyStartLatitude, journeyStartLongitude,journeyEnd,journeyEndLatitude, journeyEndLongitude,returnJourneyStart, returnJourneyStartLatitude, returnJourneyStartLongitude,returnJourneyEnd,returnJourneyEndLatitude, returnJourneyEndLongitude,journeyWeekdays,returnJourneyWeekdays, watchers){
     
      self.passengers.push({
      name,
      mobileNumber,
      journeyStart,
      journeyStartLatitude,
      journeyStartLongitude,

      journeyEnd,
      journeyEndLatitude,
      journeyEndLongitude,

      returnJourneyStart,
      returnJourneyStartLatitude,
      returnJourneyStartLongitude,

      returnJourneyEnd,
      returnJourneyEndLatitude,
      returnJourneyEndLongitude,


      journeyWeekdays,
      returnJourneyWeekdays,

      watchers
     
    })
      
  },
    addPassengerMore(name, mobileNumber, journeyStart, journeyStartLatitude, journeyStartLongitude,journeyEnd,journeyEndLatitude, journeyEndLongitude,returnJourneyStart, returnJourneyStartLatitude, returnJourneyStartLongitude,returnJourneyEnd,returnJourneyEndLatitude, returnJourneyEndLongitude,journeyWeekdays,returnJourneyWeekdays){
      console.log("Saving passenger::::::"+journeyStartLatitude+","+journeyStartLongitude);
      self.passengers.push({
        name,
        mobileNumber,
        journeyStart,
        journeyStartLatitude,
        journeyStartLongitude,
        journeyEnd,
        journeyEndLatitude,
        journeyEndLongitude,
        returnJourneyStart,
        returnJourneyStartLatitude,
        returnJourneyStartLongitude,
        returnJourneyEnd,
        returnJourneyEndLatitude,
        returnJourneyEndLongitude,
        journeyWeekdays,
        returnJourneyWeekdays
      })
    },
    updatePassenger(name, mobileNumber, journeyStart, journeyStartLatitude, journeyStartLongitude,journeyEnd,journeyEndLatitude, journeyEndLongitude,returnJourneyStart, returnJourneyStartLatitude, returnJourneyStartLongitude,returnJourneyEnd,returnJourneyEndLatitude, returnJourneyEndLongitude,journeyWeekdays,returnJourneyWeekdays){
      const passenger = self.passengers.find(p => p.mobileNumber === mobileNumber);

      passenger.mobileNumber=mobileNumber;
      passenger.name=name;
      passenger.journeyStart=journeyStart;
      passenger.journeyStartLatitude=journeyStartLatitude;
      passenger.journeyStartLongitude=journeyStartLongitude;

      passenger.journeyEnd=journeyEnd;
      passenger.journeyEndLatitude=journeyEndLatitude;
      passenger.journeyEndLongitude=journeyEndLongitude;

      passenger.returnJourneyStart=returnJourneyStart;
      passenger.returnJourneyStartLatitude=returnJourneyStartLatitude;
      passenger.returnJourneyStartLongitude=returnJourneyStartLongitude;

      passenger.returnJourneyEnd=returnJourneyEnd;
      passenger.returnJourneyEndLatitude=returnJourneyEndLatitude;
      passenger.returnJourneyEndLongitude=returnJourneyEndLongitude;
      
      passenger.journeyWeekdays=journeyWeekdays;
      passenger.returnJourneyWeekdays=returnJourneyWeekdays;
    },
    addPassengerAtIndex(name, mobileNumber, journeyStart, journeyStartLatitude, journeyStartLongitude,journeyEnd,journeyEndLatitude, journeyEndLongitude,returnJourneyStart, returnJourneyStartLatitude, returnJourneyStartLongitude,returnJourneyEnd,returnJourneyEndLatitude, returnJourneyEndLongitude,journeyWeekdays,returnJourneyWeekdays,index){
      console.log("Saving:"+journeyWeekdays+","+journeyStartLongitude);
      self.passengers.splice(index, 0, {
        name,
        mobileNumber,
        journeyStart,
        journeyStartLatitude,
        journeyStartLongitude,
        journeyEnd,
        journeyEndLatitude,
        journeyEndLongitude,
        returnJourneyStart,
        returnJourneyStartLatitude,
        returnJourneyStartLongitude,
        returnJourneyEnd,
        returnJourneyEndLatitude,
        returnJourneyEndLongitude,
        journeyWeekdays,
        returnJourneyWeekdays
      })
    },
    findPassenger(mobileNumber){
      const passenger = self.passengers.find(p => p.mobileNumber === mobileNumber);
      return passenger;
    },
    findJourneyPassengerForDay(dayOfTheWeek){
      
      const passengersLocal=[];
      self.passengers.map(function(passenger, index){
        if(passenger.journeyWeekdays.indexOf(dayOfTheWeek) > 0)
          passengersLocal.push(passenger);
      })
      console.log("### findJourneyPassengerForDay dayOfTheWeek"+dayOfTheWeek+" size:"+passengersLocal.length);
      return passengersLocal;
    },
    deletePassenger(mobileNumber){
      const passenger = self.passengers.find(p => p.mobileNumber === mobileNumber);
      self.passengers.remove(passenger);
    },
    addDriver(name, mobileNumber){
      console.log("addDriver:::"+name+","+mobileNumber);
      self.drivers.push({
        name,
        mobileNumber
      })
    },
    findDriver(mobileNumber){
      const driver = self.drivers.find(p => p.mobileNumber === mobileNumber);
      return driver;
    },
    deleteDriver(mobileNumber){
      const driver = self.drivers.find(p => p.mobileNumber === mobileNumber);
      self.drivers.remove(driver);
    },
    updateDriver(name, mobileNumber){
      console.log("updateDriver:::"+mobileNumber);
      const driver = self.drivers.find(p => p.mobileNumber === mobileNumber);
      driver.mobileNumber=mobileNumber;
      driver.name=name;
    },
    /*
    addOwner(name, mobileNumber){
      self.owners.push({
        name,
        mobileNumber
      })
    },
    findOwner(mobileNumber){
      const owner = self.owners.find(p => p.mobileNumber === mobileNumber);
      return owner;
    },
    deleteOwner(mobileNumber){
      const owner = self.owners.find(p => p.mobileNumber === mobileNumber);
      self.owners.remove(owner);
    },
    updateOwner(name, mobileNumber){
      const owner = self.owners.find(p => p.mobileNumber === mobileNumber);
      owner.mobileNumber=mobileNumber;
      owner.name=name;
    },
    */
    setJourneyLive(live){
      self.journey.live = live;
    },
    setJourneyRunningDays(runningDays){
      self.journey.runningDays = runningDays;
    },
    addJourneyStopping(place,latitude, longitude,time){
      console.log("storing:"+place+","+latitude);
      self.journey.stoppings.push({
        place,
        latitude,
        longitude,
        time,
      })
    },
    updateJourneyStopping(oldLatitude, oldLongitude,place,latitude, longitude,time){
      const oldStopping = self.journey.stoppings.find(s => s.latitude === oldLatitude && s.longitude === oldLongitude);
      oldStopping.latitude = latitude;
      oldStopping.longitude = longitude;
      oldStopping.place = place;
      oldStopping.time = time;
    },
    deleteJourneyStopping(stopping){
      self.journey.stoppings.remove(stopping);
    },
    deleteJourneyStoppingById(latitude, longitude){
      const stopping = self.journey.stoppings.find(s => s.latitude === latitude && s.longitude === longitude);
      console.log("####"+stopping.latitude+","+stopping.longitude);
      self.journey.stoppings.remove(stopping);
    },
    addJourneyStoppingAtIndex(place,latitude, longitude,index,time){
      self.journey.stoppings.splice(index, 0, {
        place,
        latitude,
        longitude,
        time,
      });
    },
    setReturnJourneyLive(live){
      self.returnJourney.live = live;
    },
    setReturnJourneyRunningDays(runningDays){
      self.returnJourney.runningDays = runningDays;
    },
    addReturnJourneyStopping(place,latitude, longitude,time){
      console.log("storing:"+place+","+latitude);
      self.returnJourney.stoppings.push({
        place,
        latitude,
        longitude,
        time,
      })
    },
    updateReturnJourneyStopping(oldLatitude, oldLongitude,place,latitude, longitude,time){
      console.log("length::"+ self.returnJourney.stoppings.length);
      console.log("latitude::"+ latitude);
      console.log("oldLatitude::"+ oldLatitude);
      const oldStopping = self.returnJourney.stoppings.find(s => s.latitude === oldLatitude && s.longitude === oldLongitude);
      oldStopping.latitude = latitude;
      oldStopping.longitude = longitude;
      oldStopping.place = place;
      oldStopping.time = time;
    },
    deleteReturnStopping(stopping){
      self.returnJourney.stoppings.remove(stopping);
    },
    deleteReturnJourneyStoppingById(latitude, longitude){
      const stopping = self.returnJourney.stoppings.find(s => s.latitude === latitude && s.longitude === longitude);
      self.returnJourney.stoppings.remove(stopping);
    },
    addReturnJourneyStoppingAtIndex(place,latitude, longitude,index,time){
      self.returnJourney.stoppings.splice(index, 0, {
        place,
        latitude,
        longitude,
        time,
      });
    }
  }))
  .views((self) => ({
    getPassengers() {
      return self.passengers.length;
    }
  })
);

const BusStopping = types.model({
  place: types.optional(types.string, ""),
  latitude: types.optional(types.string, ""),
  longitude: types.optional(types.string, ""),
  time: types.string,
})
.actions((self) => ({
  setTime(time) {
    self.time = time;
  }
})
);

const Bus = types
  .model({
    id: types.optional(types.string, ""),
    objectId: types.optional(types.string, ""),
    transportServiceId: types.optional(types.string, ""),
    transportServiceName: types.optional(types.string, ""),
    transportServiceThemeColor: types.optional(types.string, "#142169"),
    vehicleType: types.optional(types.string, "Van"),
    routeType: types.optional(types.string, "staff-service"),
    registrationNumber: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    stoppings: types.array(BusStopping),
    photos: types.array(types.string),
    journeyStartLatitude: types.optional(types.string, ""),
    journeyStartLongitude: types.optional(types.string, ""),
    returnJourneyStartLatitude: types.optional(types.string, ""),
    returnJourneyStartLongitude: types.optional(types.string, ""),
  })
  .actions((self) => ({
    reset() {
      console.log("self::"+self);
      self.id = "";
      self.objectId = "";
      self.vehicleType = "";
      self.routeType = "";
      self.registrationNumber = "";
      self.title = "";
      self.description = "";
      self.stoppings= String[0];
      self.photos = String[0];
      self.transportServiceId = "";
      self.transportServiceName = "";
      self.transportServiceThemeColor = "#142169";  
      self.transportServiceId = "";
      self.transportServiceName = "";
      self.transportServiceId = "";
      self.transportServiceName = "";
      self.journeyStartLatitude = "";
      self.journeyStartLongitude= "";
      self.returnJourneyStartLatitude= "";
      self.returnJourneyStartLongitude= "";
    },
    populate(bus) {
      self.id = bus.id;
      self.objectId = bus._id;
      self.registrationNumber = bus.registrationNumber;
      self.title = bus.title;
      self.description = bus.description;
      self.vehicleType = bus.vehicleType;
      self.routeType = bus.routeType;
      self.photos = bus.photos;
      self.transportServiceId = bus.transportServiceId;
      self.transportServiceName = bus.transportServiceName;
      self.transportServiceThemeColor = bus.transportServiceThemeColor;
      self.journeyStartLatitude = bus.journeyStartLatitude;
      self.journeyStartLongitude= bus.journeyStartLongitude;
      self.returnJourneyStartLatitude= bus.returnJourneyStartLatitude;
      self.returnJourneyStartLongitude= bus.returnJourneyStartLongitude;
    },
  }))
  .views((self) => ({
  })
);

const TransportService = types.model({
  id: types.optional(types.string, ""),
  name: types.optional(types.string, ""),
  address: types.optional(types.string, ""),
  officeNumber: types.optional(types.string, ""),
  themeColor: types.optional(types.string, "#142169"),
  drivers: types.array(Driver),
  owners: types.array(Owner),
  vehicles: types.array(Vehicle),
  countryCode: types.optional(types.string, "")
})
.actions((self) => ({
  populate(transportService) {
    self.name = transportService.name;
    self.id = transportService._id;
    self.address = transportService.address;
    self.officeNumber = transportService.officeNumber;
    self.themeColor = transportService.themeColor;
    self.drivers = transportService.drivers;
    self.owners = transportService.owners;
    self.vehicles = transportService.vehicles;
    self.countryCode = transportService.countryCode;
  },
  addTransportService(name, address, officeNumber, themeColor){
      self.name=name;
      self.address=address;
      self.officeNumber=officeNumber;
      self.themeColor=themeColor;
  },
  setName(name){
    self.name= name;
  },
  setCountryCode(countryCode){
    self.countryCode= countryCode;
  },
  setAddress(address){
    self.address= address;
  },
  setOfficeNumber(officeNumber){
    self.officeNumber=officeNumber;
  },
  setThemeColor(themeColor){
    self.themeColor=themeColor;
  },
  addDriver(name, mobileNumber){
    console.log("addDriver:::"+name+","+mobileNumber);
    self.drivers.push({
      name,
      mobileNumber
    })
  },
  findDriver(mobileNumber){
    const driver = self.drivers.find(p => p.mobileNumber === mobileNumber);
    return driver;
  },
  deleteDriver(mobileNumber){
    const driver = self.drivers.find(p => p.mobileNumber === mobileNumber);
    self.drivers.remove(driver);
  },
  updateDriver(name, mobileNumber){
    console.log("updateDriver:::"+mobileNumber);
    const driver = self.drivers.find(p => p.mobileNumber === mobileNumber);
    driver.mobileNumber=mobileNumber;
    driver.name=name;
  },
  addOwner(name, mobileNumber){
    self.owners.push({
      name,
      mobileNumber
    })
  },
  findOwner(mobileNumber){
    const owner = self.owners.find(p => p.mobileNumber === mobileNumber);
    return owner;
  },
  deleteOwner(mobileNumber){
    const owner = self.owners.find(p => p.mobileNumber === mobileNumber);
    self.owners.remove(owner);
  },
  updateOwner(name, mobileNumber){
    const owner = self.owners.find(p => p.mobileNumber === mobileNumber);
    owner.mobileNumber=mobileNumber;
    owner.name=name;
  },
  addVehicle(id, title, regNumber, vehicleType, noOfSeats){
    self.vehicles.push({
      id,
      title,
      regNumber,
      vehicleType,
      noOfSeats
    })
  },
  findVehicle(id){
    const vehicle = self.vehicles.find(p => p.id === id);
    return vehicle;
  },
  addVehiclePhoto(id, photo){
      const vehicle = self.vehicles.find(p => p.id === id);
      vehicle.photos.push(photo);
  },

  deleteVehiclePhoto(id, name){
    const vehicle = self.vehicles.find(p => p.id === id);
    const photo = vehicle.photos.find(p => p === name);
    vehicle.photos.remove(photo);
  },
  //vehicleType: types.optional(types.string, "Van"),
  //title: types.optional(types.string, ""),
  //regNumber: types.optional(types.string, ""),
  //noOfSeats: types.optional(types.string, ""),
  //photos: types.array(types.string),
  
  deleteVehicle(title){
    const vehicle = self.vehicles.find(p => p.title === title);
    self.vehicles.remove(vehicle);
  },
  updateVehicle(title, regNumber){
    const vehicle = self.vehicles.find(p => p.title === title);
    vehicle.regNumber=regNumber;
  },
  reset(){
    self.id="";
    self.name="";
    self.address="";
    self.officeNumber="";
    self.drivers = Driver[0];
    self.owners = Owner[0];
    self.vehicles = Vehicle[0];
  },
}))

const SearchContext = types.model({
  type: types.optional(types.string, ""),
  transportServiceName: types.optional(types.string, "Any"),
  from: types.optional(types.string, ""),
  to: types.optional(types.string, ""),
  routeTypeIndex: types.optional(types.string, "1"),
  close: types.optional(types.boolean, false),
})
.actions((self) => ({
  populate(searchContext) {
    self.type = searchContext.type;
    self.transportServiceName = searchContext.transportServiceName;
    self.from = searchContext.from;
    self.to = searchContext.to;

  },
  reset(){
    self.type = "Any";
    self.transportServiceName = "Any";
    self.from = "";
    self.to = "";
    self.routeTypeIndex="1"
  },
  setClose(close){
    self.close= close;
  },
  setType(type){
    self.type= type;
  },
  setRouteTypeIndex(index){
    self.routeTypeIndex= index;
  },
  setTransportServiceName(transportServiceName){
    self.transportServiceName= transportServiceName;
  },
  setFrom(from){
    self.from= from;
  },
  setTo(to){
    self.to=to;
  },

}))


const Busses = types.model({
  busses: types.array(Bus),
})
.actions((self) => ({
  addBus(id,objectId,transportServiceId,transportServiceName,transportServiceThemeColor,vehicleType,routeType,registrationNumber,title,description,stoppings,photos,journeyStartLatitude,journeyStartLongitude,returnJourneyStartLatitude,returnJourneyStartLongitude){
    console.log("::"+title);
      self.busses.push({
      id,objectId,transportServiceId,transportServiceName,transportServiceThemeColor,vehicleType,routeType,registrationNumber,title,description,stoppings,photos,journeyStartLatitude,journeyStartLongitude,returnJourneyStartLatitude,returnJourneyStartLongitude
    })
  },
  reset(){
    self.busses = Bus[0];
  }
}))




const Tours = types.model({
  tours: types.array(TourStore),
})
.actions((self) => ({
  addTour(id,objectId,transportServiceId,transportServiceName,transportServiceThemeColor,vehicleType,title,remarks,stoppingsPlaces,stoppings,noOfSeats,noOfDays,countryCode,photos,schedules,confirmationStartsBefore,confirmationFinishBefore){
    console.log("::"+title);
    self.tours.push({
      id,objectId,transportServiceId,transportServiceName,transportServiceThemeColor,vehicleType,title,remarks,stoppingsPlaces,stoppings,noOfSeats,noOfDays,countryCode,photos,schedules,confirmationStartsBefore,confirmationFinishBefore
    })
  },
  reset(){
    self.tours = TourStore[0];
  }
}))



const defaultBus = NewBusStore.create({
  title: "Title"
})

const AppStore = types.model("App", {
  user: types.optional(User, {
    name: ""
  }),
  searchContext: types.optional(SearchContext, {
    type: ""
  }),
  bus: types.optional(NewBusStore, {
    title: ""
  }),
  routeBus: types.optional(NewRouteVirtualBusStore, {
    title: ""
  }),
  tour: types.optional(TourStore, {
    title: ""
  }),
  stopping: types.optional(StoppingStore, {
    title: ""
  }),
  transportService: types.optional(TransportService, {
    name: ""
  }),
  wipPassenger: types.optional(Passenger, {
    name: ""
  }),
  wipDriver: types.optional(Driver, {
    name: ""
  }),
  vehicle: types.optional(Vehicle, {
    title: ""
  }),
  journeyPassengers: types.array(Passenger),
  
  busses: types.optional(Busses, {
  }),

  tours: types.optional(Tours, {
  })
  
});

export default AppStore;