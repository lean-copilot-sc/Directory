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

    // 1-40 Premium
    // 41-80 Executive
    // 81-100 Boutique

    for (let i = 1; i <= 100; i++) {
        let category: 'Premium' | 'Executive' | 'Boutique' = 'Boutique';
        if (i <= 40) category = 'Premium';
        else if (i <= 80) category = 'Executive';

        // Deterministic state based on index to ensure we have distribution
        const state = states[i % states.length];

        records.push({
            id: uuidv4(),
            ownerId: `owner-${Math.floor(Math.random() * 10)}`,
            category,
            name: `${category} Listing ${i}`,
            address: `${Math.floor(Math.random() * 999)} Luxury Blvd, ${state}`,
            image: `https://placehold.co/600x400/1a1a1a/D4AF37?text=${category}+${i}`,
            data: {
                "State_01": [state], // Checkbox implies array
                "Rating_01": parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
                "Amenities_01": ["Valet", "Wifi", "Pool"].filter(() => Math.random() > 0.5)
            }
        });
    }
    return records;
};

export const mockRecords = generateRecords();
