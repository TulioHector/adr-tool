import { useEffect, useState } from 'react';

interface IndexedDBManager {
    add: (adr: ADR) => Promise<number | undefined>;
    remove: (id: number) => Promise<void>;
    get: (id: number) => Promise<ADR | undefined>;
    getAll: (page: number, limit: number) => Promise<ADR[]>;
    clearData: () => Promise<void>;
}

const useIndexedDB = (dbName: string): ((storeName: string) => IndexedDBManager) => {
    const [db, setDb] = useState<IDBDatabase | null>(null);

    useEffect(() => {
        const openDB = async (storeName: string) => {
            // if(storeName.length == 0) {
            //     return;
            // }
            const request = indexedDB.open(dbName, 1);
            
            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            };
            request.onsuccess = () => {
                setDb(request.result);
            };
            request.onerror = () => {
                console.error('Error opening IndexedDB database');
            };
        };
        openDB('');
    }, [dbName]);

    const createIndexedDBManager = (storeName: string): IndexedDBManager => {
        const add = async (adr: ADR): Promise<number | undefined> => {
            if (!db) {
                console.error('Database not opened');
                return;
            }

            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.add(adr);

            return new Promise<number>((resolve, reject) => {
                request.onsuccess = (event) => {
                    resolve((event.target as IDBRequest).result as number);
                };
                request.onerror = () => {
                    reject();
                };
            });
        };

        const remove = async (id: number) => {
            if (!db) {
                console.error('Database not opened');
                return;
            }

            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.delete(id);

            return new Promise<void>((resolve, reject) => {
                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = () => {
                    reject();
                };
            });
        };

        const clearData = async (): Promise<void> => {
            if (!db) {
                console.error('Database not opened');
                return;
            }
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const countRequest = store.count();
            countRequest.onsuccess = function () {
                console.log(`Number of records before clear: ${countRequest.result}`);
            };
            store.clear();
            const clearRequest = store.count();
            clearRequest.onsuccess = function () {
                console.log(`Number of records after clear: ${clearRequest.result}`);
            };

            return new Promise((resolve, reject) => {
                tx.oncomplete = () => {
                    console.log("Transaction complete");
                    resolve();
                };
                tx.onerror = () => {
                    console.error("Transaction error");
                    reject();
                };
            });
        }

        const get = async (id: number): Promise<ADR | undefined> => {
            if (!db) {
                console.error('Database not opened');
                return;
            }

            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(id);

            return new Promise((resolve, reject) => {
                tx.oncomplete = () => {
                    resolve(request.result);
                };
                tx.onerror = () => {
                    reject();
                };
            });
        };

        const getAll = async (page: number, limit: number): Promise<ADR[]> => {
            if (!db) {
                console.error('Database not opened');
                return [];
            }

            return new Promise((resolve, reject) => {
                try{
                    const tx = db.transaction(storeName, 'readonly');
                    const store = tx.objectStore(storeName);
                    const request = store.getAll();
    
                    request.onsuccess = () => {
                        const result = request.result;
                        const start = (page - 1) * limit;
                        const end = start + limit;
                        resolve(result.slice(start, end));
                    };
    
                    request.onerror = () => {
                        reject(request.error);
                    };
                }catch(e){
                    console.error("getAll error:", e)
                    return [];
                }
                
            });
        };
        return { add, remove, get, getAll, clearData };
    }

    return createIndexedDBManager;
};

export default useIndexedDB;
