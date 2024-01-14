import React, { ReactNode } from 'react';

interface DataProps {
    data: { [key: string]: any };
}

const DataRenderer: React.FC<DataProps> = ({ data }) => {
    const keyStyle = { color: 'gray' };

    const renderValue = (value: any, parentKey?: string): ReactNode => {
        if (Array.isArray(value)) {
            return (
                <div>
                    {value.map((item, index) => (
                        <div key={`${parentKey}-${index}`}>
                            {Object.entries(item).map(([innerKey, val]) => (
                                <div key={`${parentKey}-${innerKey}-${index}`}>
                                    <span style={keyStyle}>{innerKey}:</span> {String(val)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }
        return <>{String(value)}</>;
    };

    const renderContent = (key: string, value: any): ReactNode => {
        return (
            <div key={key} style={{ marginTop: '10px' }}>
                <span style={keyStyle}>{key}:</span> {renderValue(value, key)}
            </div>
        );
    };

    return <div>{Object.entries(data).map(([key, value]) => renderContent(key, value))}</div>;
};

export default DataRenderer;
