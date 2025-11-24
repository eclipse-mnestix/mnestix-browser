import React from 'react';
import * as MuiIcons from '@mui/icons-material';
import Image from 'next/image';

/**
 * Props for the DynamicIcon component
 */
interface DynamicIconProps {
    /**
     * Name of the Material-UI icon or base64 image data
     */
    iconName?: string;
    /**
     * Fallback icon if the specified icon is not found
     */
    fallback?: React.ReactElement;
}

/**
 * Component that dynamically renders a Material-UI icon based on its name
 * or displays an image if a base64 string is provided
 */
export function DynamicIcon({ iconName, fallback }: DynamicIconProps) {
    if (!iconName) {
        return fallback || null;
    }

    // Check if it's a base64 image
    if (iconName.startsWith('data:image/')) {
        return <Image src={iconName} alt="icon" width={24} height={24} style={{ objectFit: 'contain' }} />;
    }

    // Try to find the icon in Material-UI icons
    const IconComponent = (MuiIcons as Record<string, React.ComponentType>)[iconName];

    if (IconComponent) {
        return <IconComponent />;
    }

    // Return fallback if icon not found
    return fallback || null;
}
