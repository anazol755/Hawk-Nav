import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '609649471848-4hnfa63678d5hsimi14bqhrgc02ad4hc.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
// This component is used to add an event to Google Calendar.
const AddToCalendarButton = ({ event }) => {
    useEffect(() => {
        const initClient = () => {
            gapi.client
                .init({
                    clientId: CLIENT_ID,
                    scope: SCOPES,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                })
                .catch((err) => {
                    console.error("gapi client init error:", JSON.stringify(err, null, 2));
                });
        };
        gapi.load('client:auth2', initClient);
    }, []);

    const handleAddEvent = async () => {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            const user = authInstance.currentUser.get();

            if (!user.isSignedIn()) {
                await authInstance.signIn();
            }

            const eventBody = {
                summary: event.name,
                location: event.building,
                description: event.description,
                start: {
                    dateTime: new Date(event.date).toISOString(),
                    timeZone: 'America/New_York',
                },
                end: {
                    dateTime: new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString(),
                    timeZone: 'America/New_York',
                },
            };

            const request = gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: eventBody,
            });

            request.execute(async (res) => {
                if (res.error) {
                    console.error("Calendar API Error:", JSON.stringify(res.error, null, 2));
                    alert("Failed to add event: " + (res.error.message || "Unknown error"));
                } else {
                    alert("Event added to Google Calendar!");
                    console.log("Created event:", res);

                    // Save Google Calendar event ID to backend
                    await fetch(`${process.env.REACT_APP_API_URL}/api/events/${event._id}/google-event-id`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ googleEventId: res.id }),
                    });
                }
            });
        } catch (err) {
            console.error("OAuth or Calendar insert error:", JSON.stringify(err, null, 2));
            alert("Authentication or event creation failed.");
        }
    };

    return (
        <button
            onClick={handleAddEvent}
            style={{
                marginTop: '10px',
                padding: '5px 10px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#f44336',
                color: '#fff',
            }}
        >
            Add to Google Calendar
        </button>
    );
};

export default AddToCalendarButton;
