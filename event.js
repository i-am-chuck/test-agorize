import moment from "moment";

let eventList = [];

const Event = function(opening, recurring, startDate, endDate){
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;
  eventList.push(this);
};

function date(recurring, date) {
  let format = recurring ? 'dddd à HH:mm' : 'dddd Do MMMM YYYY à HH:mm';
  return moment(date).locale('fr').format(format)
}

Event.prototype.availabilities = function(fromDate, toDate) {

  eventList.forEach(event => {
    let start = date(event.recurring, event.startDate);
    let end = date(event.recurring, event.endDate);
    const status = event.opening ? 'disponnible' : 'occupé';
    const permanent = event.recurring ? 'tous les' : 'du';
    console.log(`Un créneau est ${status} ${permanent} ${start} jusqu'au ${end}`);
    let a = moment(event.endDate);
    let b = moment(event.startDate);
    let time = a.diff(b, 'minutes')
    console.log(time / 30)
    console.log(24*2)
  });

  let from = date(false, fromDate);
  let to = date(false, toDate);
  console.log(`Demande de dispo du ${from} au ${to}`);
};

export { Event }
