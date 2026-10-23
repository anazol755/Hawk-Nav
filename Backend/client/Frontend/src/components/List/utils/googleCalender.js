import { gapi } from 'gapi-script';

export const cancelEventOnGoogleCalendar = async (googleEventId) => {
    try {
        const authInstance = gapi.auth2.getAuthInstance();
        const user = authInstance.currentUser.get();

        if (!user.isSignedIn()) {
            await authInstance.signIn();
        }

        await gapi.client.calendar.events.patch({
            calendarId: 'primary',
            eventId: googleEventId,
            resource: {
                status: 'cancelled',
            },
        });

        alert("Event marked as canceled on Google Calendar.");
    } catch (err) {
        console.error("Error canceling Google Calendar event:", JSON.stringify(err, null, 2));
        alert("Failed to cancel event on Google Calendar.");
    }
};