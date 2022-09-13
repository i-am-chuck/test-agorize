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

function dateDiff(from, to, unit) {
  let a = moment(to);
  let b = moment(from);
  return a.diff(b, unit)
}

Event.prototype.availabilities = function(fromDate, toDate) {

  eventList.forEach(event => {
    let start = date(event.recurring, event.startDate);
    let end = date(event.recurring, event.endDate);
    const status = event.opening ? 'disponnible' : 'occupé';
    const permanent = event.recurring ? 'tous les' : 'du';
    console.log(`Un créneau est ${status} ${permanent} ${start} jusqu'au ${end}`);
    console.log('- diff : ' + dateDiff(event.startDate, event.endDate,'minutes') + ' minutes\n')
  });

  let from = date(false, fromDate);
  let to = date(false, toDate);
  console.log(`Demande de dispo du ${from} au ${to}`);
  console.log('- diff : ' + dateDiff(fromDate, toDate,'days') + ' days\n');

  /* iterate days */

  const a = moment(fromDate);
  const b = moment(toDate);

  for (const d = moment(a); d.diff(b, 'days') <= 0; d.add(1, 'days')) {
    eventList.forEach(e => {
      if (d === moment(e.startDate)) {
        console.log('event ce jour')
      } else {
        console.log('pas d‘event ce jour')
      }
    })
  }

  /* todo - check in eack date if there is an event */
  /* todo - if no -> display unavailable */
  /* todo - if yes -> divide day in slots and display free and busy time */
  /* todo - test ? */
};

export { Event }
