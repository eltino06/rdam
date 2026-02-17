import React, { useState, useEffect, useRef } from 'react';

interface AddressHelperProps {
    onSelect: (address: string) => void;
    defaultValue?: string;
}

interface NominatimResult {
    display_name: string;
    place_id: number;
}

export const AddressAutocomplete: React.FC<AddressHelperProps> = ({ onSelect, defaultValue = '' }) => {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 3 && isOpen) {
                searchAddress(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    useEffect(() => {
        // Click outside to close
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    const searchAddress = async (q: string) => {
        setIsLoading(true);
        try {
            // Limitamos a Argentina para que sea más relevante (viewbox opcional)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    q
                )}&countrycodes=ar&limit=5`
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (address: string) => {
        setQuery(address);
        onSelect(address);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    if (!isOpen && e.target.value.length > 1) setIsOpen(true);
                    onSelect(e.target.value); // Permitimos escritura manual también
                }}
                onFocus={() => query.length > 1 && setIsOpen(true)}
                placeholder="Escribí tu dirección (Calle 123, Ciudad)..."
                style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.3s',
                }}
            />

            {isLoading && (
                <div style={{ position: 'absolute', right: '12px', top: '14px', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {isOpen && suggestions.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#1e293b',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        marginTop: '8px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        listStyle: 'none',
                        padding: '0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {suggestions.map((item) => (
                        <li
                            key={item.place_id}
                            onClick={() => handleSelect(item.display_name)}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            {item.display_name}
                        </li>
                    ))}
                    <div style={{ padding: '8px', textAlign: 'right', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                        Powered by OpenStreetMap
                    </div>
                </ul>
            )}
        </div>
    );
};
