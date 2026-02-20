import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
export default function ExportPage() {
    const [panels, setPanels] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Fetch panels data
        const fetchPanels = async () => {
            // Replace with your actual API endpoint
            const response = await fetch('/api/panels');
            const data = await response.json();
            setPanels(data);
        };
        fetchPanels();
    }, []);

    const handlePrevious = () => {
        setCurrentIndex(Math.max(0, currentIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex(Math.min(panels.length - 1, currentIndex + 1));
    };

    const handleExport = () => {
        // Export logic here
        console.log('Exporting panel:', panels[currentIndex]);
    };

    return (
        <div className="export-page">
            <h1>Export Panels</h1>
            {panels.length > 0 && (
                <div className="panel-viewer">
                    <div className="panel-display">{panels[currentIndex]?.content}</div>
                    <div className="controls">
                        <button onClick={handlePrevious}><ChevronLeft /></button>
                        <span>{currentIndex + 1} / {panels.length}</span>
                        <button onClick={handleNext}><ChevronRight /></button>
                        <button onClick={handleExport}><Download /> Export</button>
                    </div>
                </div>
            )}
        </div>
    );
}