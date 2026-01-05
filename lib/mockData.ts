import { v4 as uuidv4 } from 'uuid';
import { DirectoryRecord, Field, SystemConfig } from './types';

export const systemConfig: SystemConfig = {
    settingId: "Global",
    logo: "https://placehold.co/200x50/D4AF37/000000?text=LUXE",
    heroImage: "https://toolset.com/wp-content/uploads/2020/05/toolset-homepage-hero-section-example.png",
    heroText: "Exclusive Listings",
    primaryColor: "#1A1A1A",
    accentColor: "#D4AF37",
    defaultLayout: "Grid",
    anonymousAccess: true
};

export const formSchema: Field[] = [
    {
        id: "State_01",
        name: "State",
        type: "choice-checkbox",
        navigable: true,
        filterable: true,
        options: ["Gujarat", "Maharashtra", "Rajasthan"],
        group: "Location Details"
    },
    {
        id: "Rating_01",
        name: "Rating",
        type: "number",
        sortable: true,
        group: "Performance"
    },
    {
        id: "Amenities_01",
        name: "Amenities",
        type: "choice-checkbox",
        options: ["Wifi", "Parking", "Pool", "Gym", "Valet"],
        filterable: true,
        group: "Features"
    }
];

const states = ["Gujarat", "Maharashtra", "Rajasthan"];

const generateRecords = (): DirectoryRecord[] => {
    const records: DirectoryRecord[] = [];
    const amenitiesList = ["Valet", "Wifi", "Pool", "Gym", "Parking"];

    for (let i = 1; i <= 100; i++) {
        let category: 'Premium' | 'Executive' | 'Boutique' = 'Boutique';
        if (i <= 40) category = 'Premium';
        else if (i <= 80) category = 'Executive';

        const state = states[i % states.length];

        // Deterministic Amenities based on index
        const amenities = amenitiesList.filter((_, index) => (i + index) % 3 === 0);

        records.push({
            id: `record-${i}`, // Deterministic ID
            ownerId: `owner-${(i % 5) + 1}`, // Deterministic Owner
            category,
            name: `${category} Listing ${i}`,
            address: `${100 + i} Luxury Blvd, ${state}`,
            image: `https://placehold.co/600x400/1a1a1a/D4AF37?text=${category}+${i}`,
            data: {
                "State_01": [state],
                "Rating_01": parseFloat((4.0 + (i % 10) / 10).toFixed(1)), // Deterministic Rating 4.0-4.9
                "Amenities_01": amenities
            }
        });
    }
    return records;
};

export const mockRecords = generateRecords();
