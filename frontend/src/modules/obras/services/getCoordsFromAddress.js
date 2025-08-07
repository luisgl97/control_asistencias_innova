import geocodingClient from "@/shared/service/apigoogle";


export async function getCoordsFromAddress(address) {
    try {
        const response = await geocodingClient.get('json', {
            params: { address }
        });

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            console.error('Geocoding error:', response.data.status);
            return null;
        }
    } catch (error) {
        console.error('Axios error:', error.message);
        return null;
    }
}
