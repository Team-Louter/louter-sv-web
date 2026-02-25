import { useState, useEffect, useRef } from "react";

export function useKebab() {
    const [isKebabOpen, setIsKebabOpen] = useState(false);
    const kebabRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
                setIsKebabOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return { isKebabOpen, setIsKebabOpen, kebabRef };
}