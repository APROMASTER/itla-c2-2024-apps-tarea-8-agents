import { useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";

export interface Example {
    id: string,
    name: string
}

export function ExampleData() {
    const {storageGet, storageSet} = useStorage();
    // CHANGE "collection" ONLY
    const [collection, setCollection] = useState<Example[]>([]);
    const DB_KEY = 'app-example';

    useEffect(() => {
        const initEvents = async () => {
            setCollection(await storageGet(DB_KEY));
        }
        initEvents();
    }, [])

    // CHANGE METHOD NAME
    const createData = async (dataToCreate: Example) => {
        const newData = {
            // CHANGE THE MAPPING
            id: self.crypto.randomUUID(),
            name: dataToCreate.name,
        }

        const updatedCollection = [...collection, newData];
        setCollection(updatedCollection);
        storageSet(DB_KEY, updatedCollection);
    }

    // CHANGE METHOD NAME
    const readData = async(id: string) : Promise<Example> => {
        return [...collection].filter(data => data.id === id)[0];
    }

    // CHANGE METHOD NAME
    const updateData = async (dataToUpdate: Example) => {
        const collectionUpdated = [...collection];
        let data = collection.filter(data => data.id === dataToUpdate.id)[0];
        
        // CHANGE THE MAPPING
        data.name = dataToUpdate.name;


        setCollection(collectionUpdated);
        return storageSet(DB_KEY, collectionUpdated);
    }

    // CHANGE METHOD NAME
    const deleteData = async(id: string) => {
        const toUpdate = [...collection].filter(event => event.id !== id);
        setCollection(toUpdate);
        return storageSet(DB_KEY, toUpdate);
    }

    return {
        collection,
        createData,
        readData,
        updateData,
        deleteData
    }
}