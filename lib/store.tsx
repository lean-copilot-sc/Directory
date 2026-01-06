"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Modal, ModalType } from '@/components/ui/Modal';
import { Field, DirectoryRecord, SystemConfig, Role, User } from './types';
import { formSchema, mockRecords, systemConfig as initialConfig, mockUsers } from './mockData';

interface DirectoryContextType {
    schema: Field[];
    records: DirectoryRecord[];
    config: SystemConfig;
    user: User | null;
    users: User[];
    updateSchema: (newSchema: Field[]) => void;
    addRecord: (record: DirectoryRecord) => void;
    updateRecord: (record: DirectoryRecord) => void;
    deleteRecord: (id: string) => void;
    importRecords: (newRecords: DirectoryRecord[]) => void;
    updateConfig: (newConfig: SystemConfig) => void;
    resetConfig: () => void;
    switchUser: (role: Role) => void;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    showAlert: (title: string, description: string, type?: 'info' | 'success' | 'warning' | 'danger', onConfirm?: () => void) => void;
    showConfirm: (title: string, description: string, onConfirm: () => void, type?: 'info' | 'success' | 'warning' | 'danger') => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
    // Initialize state with mock data
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [schema, setSchema] = useState<Field[]>(formSchema);
    const [records, setRecords] = useState<DirectoryRecord[]>(mockRecords);
    const [config, setConfig] = useState<SystemConfig>(initialConfig);
    const [users, setUsers] = useState<User[]>(mockUsers);

    // Auth State (Mock)
    const [user, setUser] = useState<User | null>(null);

    const [isInitialized, setIsInitialized] = useState(false);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: ModalType;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        type: 'info'
    });

    // Dynamic Theme Injection Engine
    useEffect(() => {
        if (!config) return;

        const root = document.documentElement;

        // Helper to convert HEX to RGB
        const hexToRgb = (hex: string) => {
            if (!hex) return { r: 0, g: 0, b: 0 };
            const cleanHex = hex.replace('#', '');
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            return { r, g, b };
        };

        // Helper for contrast (YIQ)
        const getContrastColor = (hex: string) => {
            const { r, g, b } = hexToRgb(hex);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#09090B' : '#FFFFFF';
        };

        // Inject Primary
        const primaryRgb = hexToRgb(config.primaryColor);
        root.style.setProperty('--primary', config.primaryColor);
        root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        root.style.setProperty('--primary-foreground', getContrastColor(config.primaryColor));

        // Inject Surface (Secondary)
        root.style.setProperty('--surface', config.colorSecondary);
        root.style.setProperty('--surface-highlight', `${config.colorSecondary}CC`); // 80% opacity

        // Inject Background
        root.style.setProperty('--background', config.colorBackground);
        root.style.setProperty('--foreground', getContrastColor(config.colorBackground));

        // Dynamic Muted Color (softened foreground)
        const fgColor = getContrastColor(config.colorBackground);
        root.style.setProperty('--muted', fgColor === '#FFFFFF' ? '#A1A1AA' : '#52525B');

        if (config.borderRadius) {
            root.style.setProperty('--radius', config.borderRadius);
        }

    }, [config]);

    // Update theme attribute on root element (Legacy support for light/dark toggle, now refined by config)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    // Loading from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('luxe_theme') as 'light' | 'dark' | null;
        const savedSchema = localStorage.getItem('luxe_schema');
        const savedRecords = localStorage.getItem('luxe_records');
        const savedConfig = localStorage.getItem('luxe_config');
        const savedUsers = localStorage.getItem('luxe_users');
        const savedUser = localStorage.getItem('luxe_current_user');

        if (savedTheme) {
            console.log('Restoring theme from storage:', savedTheme);
            setTheme(savedTheme);
        }
        if (savedSchema) setSchema(JSON.parse(savedSchema));
        if (savedRecords) setRecords(JSON.parse(savedRecords));
        if (savedConfig) {
            // Merge with initialConfig to ensure new fields are present
            const parsed = JSON.parse(savedConfig);
            setConfig({ ...initialConfig, ...parsed });
        }
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedUser) setUser(JSON.parse(savedUser));
        else {
            // Default to admin for initial dev experience if no one logged in
            setUser(mockUsers[0]);
        }
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

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('luxe_users', JSON.stringify(users));
        }
    }, [users, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('luxe_current_user', JSON.stringify(user));
        }
    }, [user, isInitialized]);


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
        const targetUser = users.find(u => u.role === role);
        if (targetUser) setUser(targetUser);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            if (!foundUser.isActive) return false;
            setUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const addUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        // If updating the current user, sync it
        if (user?.id === updatedUser.id) setUser(updatedUser);
    };

    const deleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        if (user?.id === id) setUser(null);
    };

    const toggleTheme = () => {
        console.log('Toggling theme from', theme);
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const showAlert = (title: string, description: string, type: ModalType = 'success', onConfirm?: () => void) => {
        setModal({
            isOpen: true,
            title,
            description,
            type,
            onConfirm
        });
    };

    const showConfirm = (title: string, description: string, onConfirm: () => void, type: ModalType = 'warning') => {
        setModal({
            isOpen: true,
            title,
            description,
            type,
            onConfirm
        });
    };

    return (
        <DirectoryContext.Provider value={{
            schema,
            records,
            config,
            user,
            users,
            theme,
            updateSchema,
            addRecord,
            updateRecord,
            deleteRecord,
            importRecords,
            updateConfig,
            resetConfig,
            switchUser,
            login,
            logout,
            addUser,
            updateUser,
            deleteUser,
            toggleTheme,
            showAlert,
            showConfirm
        }}>
            {children}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                description={modal.description}
                type={modal.type}
                onConfirm={modal.onConfirm ? () => {
                    modal.onConfirm?.();
                    setModal(prev => ({ ...prev, isOpen: false }));
                } : undefined}
                showCancel={!!modal.onConfirm}
                confirmText={modal.onConfirm ? 'Confirm' : 'OK'}
            />
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
