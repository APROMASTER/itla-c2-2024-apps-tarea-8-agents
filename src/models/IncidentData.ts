import { useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";
import { PhotoData } from "../hooks/usePhotoGallery";
import { AudioData } from "../hooks/useAudio";

export interface Incident {
    id: string,
    title: string,
    description: string,
    date: string,
    photo: PhotoData,
    audio: AudioData,
}

export const defaultIncident: Incident = { 
    id: "", 
    title: "", 
    description: "", 
    date: new Date().toLocaleDateString(), 
    photo: { filepath: "", webviewPath: "" }, 
    audio: {name: "", filepath: "", webviewPath: ""} 
};

export function IncidentData() {
    const {storageGet, storageSet} = useStorage();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const DB_KEY = 'app-incident';

    const loadIncidents = async () => {
        setIncidents(await storageGet(DB_KEY));
        console.log("Incidents loaded");
    }

    useEffect(() => {
        loadIncidents();
    }, [])

    const createIncident = async (eventToCreate: Incident) => {
        const newEvent = {
            id: self.crypto.randomUUID(),
            title: eventToCreate.title,
            description: eventToCreate.description,
            date: eventToCreate.date,
            photo: eventToCreate.photo,
            audio: eventToCreate.audio
        }

        const updatedIncidents = [...incidents, newEvent];
        setIncidents(updatedIncidents);
        storageSet(DB_KEY, updatedIncidents);
    }

    const readIncident = async(id: string) : Promise<Incident> => {
        return [...incidents].filter(event => event.id === id)[0];
    }

    const updateIncident = async (eventToUpdate: Incident) => {
        const toUpdate = [...incidents];
        let event = incidents.filter(event => event.id === eventToUpdate.id)[0];
        event.date = eventToUpdate.date;
        event.title = eventToUpdate.title;
        event.description = eventToUpdate.description;
        event.photo = eventToUpdate.photo;
        setIncidents(toUpdate);
        return storageSet(DB_KEY, toUpdate);
    }

    const deleteIncident = async(id: string) => {
        const toUpdate = [...incidents].filter(event => event.id !== id);
        setIncidents(toUpdate);
        return storageSet(DB_KEY, toUpdate);
    }

    const deleteAll = async() => {
        setIncidents([]);
        return storageSet(DB_KEY, []);
    }

    return {
        loadIncidents,
        incidents,
        createIncident,
        readIncident,
        updateIncident,
        deleteIncident,
        deleteAll
    }
}