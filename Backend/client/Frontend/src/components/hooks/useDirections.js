import { useRef } from 'react';

const useDirections = ({ mapInstance, mapApi }) => {
    const directionsRendererRef = useRef(null);

    const drawRoute = (origin, destination) => {
        if (!mapInstance || !mapApi || !origin || !destination) {
            alert("Missing map, API, or coordinates.");
            return;
        }

        const directionsService = new mapApi.DirectionsService();

        // Create the renderer if it doesn’t exist
        if (!directionsRendererRef.current) {
            directionsRendererRef.current = new mapApi.DirectionsRenderer({ suppressMarkers: false });
            directionsRendererRef.current.setMap(mapInstance);
        }

        directionsService.route(
            {
                origin,
                destination,
                travelMode: mapApi.TravelMode.WALKING,
            },
            (result, status) => {
                if (status === mapApi.DirectionsStatus.OK) {
                    directionsRendererRef.current.setDirections(result);
                } else {
                    alert('Failed to get directions: ' + status);
                }
            }
        );
    };

    const clearRoute = () => {
        if (directionsRendererRef.current) {
            directionsRendererRef.current.set('directions', null);
        }
    };

    return { drawRoute, clearRoute };
};

export default useDirections;
