"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Field, DirectoryRecord, SystemConfig, Role } from './types';
import { formSchema, mockRecords, systemConfig as initialConfig } from './mockData';

interface User {
    role: Role;
    id: string;
    name: string;
}

interface DirectoryContextType {
    schema: Field[];
    records: DirectoryRecord[];
    config: SystemConfig;
    user: User;
    updateSchema: (newSchema: Field[]) => void;
    addRecord: (record: DirectoryRecord) => void;
    updateRecord: (record: DirectoryRecord) => void;
    deleteRecord: (id: string) => void;
    importRecords: (newRecords: DirectoryRecord[]) => void;
    updateConfig: (newConfig: SystemConfig) => void;
    resetConfig: () => void;
    switchUser: (role: Role) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
    // Initialize state with mock data
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [schema, setSchema] = useState<Field[]>(formSchema);
    const [records, setRecords] = useState<DirectoryRecord[]>(mockRecords);
    const [config, setConfig] = useState<SystemConfig>(initialConfig);

    // Auth State (Mock)
    const [user, setUser] = useState<User>({ role: 'Admin', id: 'admin-1', name: 'Super Admin' });

    const [isInitialized, setIsInitialized] = useState(false);

    // Update theme attribute on root element
    useEffect(() => {
        console.log('Applying theme:', theme);
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    // Loading from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('luxe_theme') as 'light' | 'dark' | null;
        const savedSchema = localStorage.getItem('luxe_schema');
        const savedRecords = localStorage.getItem('luxe_records');
        const savedConfig = localStorage.getItem('luxe_config');

        if (savedTheme) {
            console.log('Restoring theme from storage:', savedTheme);
            setTheme(savedTheme);
        }
        if (savedSchema) setSchema(JSON.parse(savedSchema));
        if (savedRecords) setRecords(JSON.parse(savedRecords));
        if (savedConfig) setConfig(JSON.parse(savedConfig));
        setIsInitialized(true);
    }, []);

    // Persisting to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('luxe_theme', theme);
        }
    }, [theme, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('luxe_schema', JSON.stringify(schema));
        }
    }, [schema, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('luxe_records', JSON.stringify(records));
        }
    }, [records, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('luxe_config', JSON.stringify(config));
        }
    }, [config, isInitialized]);


    const updateSchema = (newSchema: Field[]) => {
        setSchema(newSchema);
    };

    const addRecord = (record: DirectoryRecord) => {
        setRecords(prev => [record, ...prev]);
    };

    const updateRecord = (updatedRecord: DirectoryRecord) => {
        setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    };

    const deleteRecord = (id: string) => {
        setRecords(prev => prev.filter(r => r.id !== id));
    };

    const importRecords = (newRecords: DirectoryRecord[]) => {
        setRecords(prev => [...newRecords, ...prev]);
    };

    const updateConfig = (newConfig: SystemConfig) => {
        setConfig(newConfig);
    };

    const resetConfig = () => {
        setConfig(initialConfig);
        localStorage.removeItem('luxe_config');
    };

    const switchUser = (role: Role) => {
        if (role === 'Admin') setUser({ role: 'Admin', id: 'admin-1', name: 'Super Admin' });
        if (role === 'Owner') setUser({ role: 'Owner', id: 'owner-1', name: 'John Doe' }); // Matches mock data ownerId usually
        if (role === 'User') setUser({ role: 'User', id: 'user-1', name: 'Guest User' });
    };

    const toggleTheme = () => {
        console.log('Toggling theme from', theme);
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <DirectoryContext.Provider value={{
            schema,
            records,
            config,
            user,
            theme,
            updateSchema,
            addRecord,
            updateRecord,
            deleteRecord,
            importRecords,
            updateConfig,
            resetConfig,
            switchUser,
            toggleTheme
        }}>
            {children}
        </DirectoryContext.Provider>
    );
}

export function useDirectory() {
    const context = useContext(DirectoryContext);
    if (context === undefined) {
        throw new Error('useDirectory must be used within a DirectoryProvider');
    }
    return context;
}
