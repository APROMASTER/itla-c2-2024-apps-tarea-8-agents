import { Drivers, Storage } from "@ionic/storage";
import { useEffect, useRef, useState } from "react";
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { isPlatform } from "@ionic/react";

export function useStorage() {
    const [store, setStore] = useState<Storage>();
    const dbName = 'security-db';
    const isStorageInitialized = useRef(false);

    useEffect(() => {
        const initStorage = async () => {
            const newStore = new Storage({
                name: dbName,
                driverOrder: [CordovaSQLiteDriver, Drivers.IndexedDB, Drivers.LocalStorage]
            });
            if (!isPlatform("desktop")) {
                await newStore.defineDriver(CordovaSQLiteDriver);
            }

            const store = await newStore.create();
            setStore(store);

            // Disparar evento de inicialización
            if (!isStorageInitialized.current) {
                isStorageInitialized.current = true;
                Promise.resolve().then(() => {
                    window.dispatchEvent(new Event('storageInitialized'));
                });
            }
        };
            initStorage();
        }, [])

    const storageGet = async (databaseKey: string) => {
        return await store?.get(databaseKey) || [];
    }

    function storageSet(databaseKey: string, data: any[]) {
        store?.set(databaseKey, data);
    }

    return {
        storageGet,
        storageSet,
    }
}