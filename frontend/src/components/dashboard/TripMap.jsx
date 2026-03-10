import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '24px'
};

const center = {
    lat: 11.9404,
    lng: 108.4583 // Da Lat as default
};

const TripMap = ({ tripId }) => {
    // In a real app, you'd provide your API Key here
    // For now, let's show a beautiful placeholder if the key is missing
    const apiKey = "";

    if (!apiKey) {
        return (
            <div className="glass-card bg-slate-900 h-[600px] overflow-hidden relative flex items-center justify-center p-12 text-center group">
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-110"
                    alt="Map background"
                />
                <div className="relative z-10 max-w-md">
                    <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse text-primary border border-primary/30">
                        <MapPin size={40} />
                    </div>
                    <h3 className="text-3xl font-bold font-poppins text-white mb-4">Interactive Map</h3>
                    <p className="text-slate-400 font-inter mb-8 text-lg">
                        Visualise your trip locations and discover nearby restaurants, hotels, and tourist spots.
                    </p>
                    <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur rounded-xl text-white/60 text-sm font-medium border border-white/10 uppercase tracking-widest">
                        API Key Required for Live Maps
                    </div>
                </div>
            </div>
        );
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                styles: mapStyles // High-end minimal map styles
            }}
        >
            <Marker position={center} />
        </GoogleMap>
    ) : <div className="h-[600px] bg-slate-100 rounded-3xl animate-pulse" />;
};

const mapStyles = [
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7ec8e3"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
];

export default TripMap;
