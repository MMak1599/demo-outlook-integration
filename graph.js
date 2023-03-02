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

//Hits API for showing a user's calendar
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


  //Body of request for finding a meeting time 
const meetingTimeSuggestionsResult = {
  attendees: [ 
    { 
      type: 'required',  
      emailAddress: { 
        name: 'Alex Wilber',
        address: 'AlexW@r8w0.onmicrosoft.com' 
      }
    },
    {
    type: 'required',  
    emailAddress: { 
      name: 'Diego Siciliani',
      address: 'DiegoS@r8w0.onmicrosoft.com' 
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
  
//Calls post request for finding meeting time
return await graphClient
    .api('/me/findMeetingTimes')
	.post(meetingTimeSuggestionsResult);

}


//Body of request for creating a calendar event
const sendEmail = {
  message: {
    subject: 'Outlook Integration',
    body: {
      contentType: 'Text',
      content: 'This is a test.'
    },
    toRecipients: [
      {
        emailAddress: {
          address: 'mmak@scottlogic.com'
        }
      }
    ],
    attachments: [
     {
      "@odata.type": "#microsoft.graph.itemAttachment",
      "name": "Test Event", 
      "item": {
        "@odata.type": "microsoft.graph.event",
        "subject": "Test",
        "body": {
          "contentType": "HTML",
          "content": "Calendar test"
        },
        "start": {
          "dateTime": "2023-02-24T17:00:00",
          "timeZone": "Pacific Standard Time"
        },
        "end": {
          "dateTime": "2023-02-24T18:00:00",
          "timeZone": "Pacific Standard Time"
        }
      }
     }
    ]
  },
  saveToSentItems: 'false'
};

async function sendInv(){
  ensureScope('Mail.Send');
    return await graphClient
      .api('/me/sendMail')
      .post(sendEmail);
}


const calEvent = {
  subject: 'Lunch',
  body: {
    contentType: 'HTML',
    content: 'Does this time work?'
  },
  start: {
      dateTime: '2023-03-01T09:00:00',
      timeZone: 'Europe/London'
  },
  end: {
      dateTime: '2023-03-01T10:00:00',
      timeZone: 'Europe/London'
  },
  location: {
      displayName: 'Social Hub'
  },
  attendees: [
    {
      emailAddress: {
        address: 'mmak@scottlogic.com',
        name: 'Max Mak'
      },
      type: 'required'
    }
  ]
};

async function sendCalInv(){
  ensureScope('Calendars.ReadWrite');
    return await graphClient
      .api('/me/calendar/events')
      .post(calEvent);
}
