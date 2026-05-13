import React from "react";

export const renderContent = (content: string): JSX.Element => {
    const MAX_HEIGHT = 55;
    if (content.length > MAX_HEIGHT) {
        return (
            <>
                {content.substring(0, MAX_HEIGHT)}...
            </>
        );
    }
    return <>{content}</>;
};

export const truncateLabel = (label: string): string => {
    const maxLength = 30;
    if (label.length > maxLength) {
        return label.substring(0, maxLength) + '...';
    }
    return label;
    // categories: chartLabel.map(label => truncateLabel(label)),
};