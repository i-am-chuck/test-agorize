import moment from "moment";

let eventList = [];

const Event = function(id, opening, recurring, startDate, endDate){
  this.id = id;
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;
  eventList.push(this);
};

Event.prototype.availabilities = function(fromDate, toDate) {

  title('Résumé de la demande')
  displayEvents()
  displayAvailabilityPeriod(fromDate, toDate)

  title('Affichage des dispos')
  displayAvailabilities(fromDate, toDate)

  /* todo - methods simplify moment formats */
  /* todo - clean log sentences */
};

function title(text) {
  console.log('\n')
  console.log('--------------------------------')
  console.log(text)
  console.log('--------------------------------')
  console.log('\n')
}

function displayDate(recurring, date) {
  let format = recurring ? 'dddd à HH:mm' : 'dddd Do MMMM YYYY à HH:mm';
  return moment(date).locale('fr').format(format)
}

function displayEvents() {
  eventList.forEach(event => {
    let start = displayDate(event.recurring, event.startDate);
    let end = displayDate(event.recurring, event.endDate);
    const status = event.opening ? 'disponnible' : 'occupé';
    const permanent = event.recurring ? 'tous les' : 'du';
    console.log(`Un créneau est ${status} ${permanent} ${start} jusqu'au ${end}`);
    /*console.log('- diff : ' + _dateDiff(event.startDate, event.endDate,'minutes') + ' minutes\n')*/
  });
}

function displayAvailabilityPeriod(fromDate, toDate) {
  let from = displayDate(false, fromDate);
  let to = displayDate(false, toDate);
  console.log(`Demande de dispo du ${from} au ${to}`);
  /*console.log('- diff : ' + _dateDiff(fromDate, toDate,'days') + ' days\n');*/
}

function minutesFromMidnight(date) {
  let midnight = moment(date).startOf('day');
  let minutesFromMidnight = moment(date).diff(midnight, 'minutes');
  return minutesFromMidnight
}

function displayAvailabilities(fromDate, toDate) {

  const from = moment(fromDate);
  const to = moment(toDate);

  for (const day = from; day.diff(to, 'day') <= 0; day.add(1, 'day')) {

    /* display day */
    console.log(day.locale('fr').format('dddd Do MMMM YYYY'))

    const eventsOfDay = eventList.filter(i => moment(i.startDate).locale('fr').format('dddd') === day.locale('fr').format('dddd'))
    const eventsOfDate = eventList.filter(i => moment(i.startDate).locale('fr').format('dddd Do MMMM') === day.locale('fr').format('dddd Do MMMM'))

    if (eventsOfDay.length || eventsOfDate.length) {

      let eventIds = []
      const allEventsToday = eventsOfDay.concat(eventsOfDate)
      allEventsToday.forEach(event => {
        if (!eventIds.includes(event.id)) eventIds.push(event.id)
      })

      let eventsToday = []
      eventIds.forEach(id => {
        let event = eventList.find(e => e.id === id)
        eventsToday.push(event)
      })

      eventsToday.forEach(event => {
        if (event.opening) {
          console.log('- créneau dispo')
          console.log(moment(event.startDate).locale('fr').format('HH:mm'))
          console.log(minutesFromMidnight(event.startDate))
          console.log(moment(event.endDate).locale('fr').format('HH:mm'))
          console.log(minutesFromMidnight(event.endDate))

          let daySlots = []
          let countSlots = 0
          for (let h = 0; h < 24; h++) {
            for (let hh = 0; hh < 2; hh++) {
              countSlots++
              daySlots.push({slot: countSlots, busy: false, hour: h+':'+hh*30})
            }
          }
          console.log(daySlots)
        }
      })



    } else {

      console.log('- Il n‘y a aucun évènement ce jour')

    }

    console.log('\n')
  }
}

function _dateDiff(from, to, unit) {
  let a = moment(to);
  let b = moment(from);
  return a.diff(b, unit)
}

export { Event }
