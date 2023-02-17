// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
async function getUser() {
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName')
        .get();
}

async function getEvents() {
    //ensure scope adds 'Calendars.read' to the scope array
    ensureScope('Calendars.read');
    const dateNow = new Date();
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 7);
    const query = `startDateTime=${dateNow.toISOString()}&endDateTime=${dateNextWeek.toISOString()}`;
  
    return await graphClient
    .api('/me/calendarView').query(query)
    .select('subject,start,end')
    .orderby(`start/DateTime`)
    .get();
  }

const meetingTimeSuggestionsResult = {
  attendees: [ 
    { 
      type: 'required',  
      emailAddress: { 
        name: 'Gabriela Georgieva',
        address: 'ggeorgieva@scottlogic.com' 
      }
    },
    {
    type: 'required',  
    emailAddress: { 
      name: 'Robin Watson',
      address: 'rwatson@scottlogic.com' 
    },
  }
  ],  
  locationConstraint: { 
    isRequired: false,  
    suggestLocation: false,  
    locations: [ 
      { 
        resolveAvailability: false,
        displayName: 'NCL Orange'
      } 
    ] 
  },  
  timeConstraint: {
    activityDomain: 'work', 
    timeSlots: [ 
      {
        start: { 
          dateTime: '2023-02-16T09:00:00',  
          timeZone: 'Pacific Standard Time' 
        },  
        end: { 
          dateTime: '2023-02-17T17:00:00',  
          timeZone: 'Pacific Standard Time' 
        } 
      } 
    ] 
  },  
  isOrganizerOptional: 'false',
  meetingDuration: 'PT1H',
  returnSuggestionReasons: 'true',
  minimumAttendeePercentage: '100'
};


async function getGEvents() {
    //ensure scope adds 'Calendars.read' to the scope array
    ensureScope('Calendars.read');
    const dateNow = new Date();
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 7);
    const query = `startDateTime=${dateNow.toISOString()}&endDateTime=${dateNextWeek.toISOString()}`;
  

return await graphClient
    .api('/me/findMeetingTimes')
	.post(meetingTimeSuggestionsResult);

}