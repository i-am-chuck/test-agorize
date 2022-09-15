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
};

function title(text) {
  console.log('\n')
  console.log('--------------------------------')
  console.log(text)
  console.log('--------------------------------')
  console.log('\n')
}

function displayDate(type, date) {
  let format = ''
  if (type === 'day-hour') format = 'dddd à HH:mm'
  if (type === 'date-hour') format = 'dddd Do MMMM YYYY à HH:mm'
  if (type === 'date') format = 'dddd Do MMMM YYYY'
  return moment(date).locale('fr').format(format)
}

function convertDate(type, date) {
  let format = ''
  if (type === 'day') format = 'dddd'
  if (type === 'date') format = 'dddd Do MMMM'
  return date.locale('fr').format(format)
}

function displayEvents() {
  eventList.forEach(event => {
    const displayDateType = event.recurring ? 'day-hour' : 'date-hour';
    let start = displayDate(displayDateType, event.startDate);
    let end = displayDate(displayDateType, event.endDate);
    const status = event.opening ? 'disponnible' : 'occupé';
    const permanent = event.recurring ? 'tous les' : 'du';
    console.log(`Un créneau est ${status} ${permanent} ${start} jusqu'au ${end}`);
  });
}

function displayAvailabilityPeriod(fromDate, toDate) {
  let from = displayDate('date-hour', fromDate);
  let to = displayDate('date-hour', toDate);
  console.log(`Demande de dispo du ${from} au ${to}`);
}

function minutesFromMidnight(date) {
  let midnight = moment(date).startOf('day');
  return moment(date).diff(midnight, 'minutes')
}

function slotRange(from, to) {
  let start = (minutesFromMidnight(from) / 30) + 1
  let end = (minutesFromMidnight(to) / 30) + 1
  let slots = []
  for (let i = start; i < end; i++) { slots.push(i) }
  return slots
}

function displayAvailabilities(fromDate, toDate) {

  const from = moment(fromDate);
  const to = moment(toDate);

  for (const day = from; day.diff(to, 'day') <= 0; day.add(1, 'day')) {

    console.log(displayDate('date', day))

    const eventsOfDay = eventList.filter(i => convertDate('day', moment(i.startDate)) === convertDate('day', day))
    const eventsOfDate = eventList.filter(i => convertDate('date', moment(i.startDate)) === convertDate('date', day))

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

      let daySlots = []
      let countSlots = 0
      for (let h = 0; h < 24; h++) {
        for (let hh = 0; hh < 2; hh++) {
          countSlots++
          daySlots.push({slot: countSlots, available: false, hour: h + ':' + hh * 30})
        }
      }

      eventsToday.forEach(event => {
        const slotsToUpdate = slotRange(event.startDate, event.endDate)
        slotsToUpdate.forEach(slot => {
          let slotToUpdate = daySlots.findIndex(i => i.slot === slot)
          daySlots[slotToUpdate].available = event.opening
        })
      })

      console.log('- Voici les créneaux dispos ce jour')

      daySlots.forEach(slot => {
        if (slot.available) console.log('-- ' + slot.hour)
      })

      console.log('\n')

    } else {

      console.log('- Il n‘y a aucune dispo ce jour\n')

    }
  }
}

export { Event }
