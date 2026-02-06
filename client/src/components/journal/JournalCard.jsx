import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HoverButton from "../layout/HoverButton";

/**
 * Individual journal card component
 * Displays a single journal with edit and delete actions
 * Memoized to prevent re-renders when other journals update
 */
function JournalCard({ journal, onDelete, onEdit }) {
    const navigate = useNavigate();
    
    // Memoize callbacks to prevent recreation
    const handleDelete = useCallback(() => {
        onDelete(journal._id);
    }, [onDelete, journal._id]);
    
    const handleEdit = useCallback(() => {
        onEdit(journal._id);
    }, [onEdit, journal._id]);
    
    const handleNavigate = useCallback(() => {
        navigate(`/journalOverview/${journal._id}`);
    }, [navigate, journal._id]);

    return (
        <div 
            className="grid relative place-items-center group border-4 bg-opacity-75 border-blue-200 bg-linear-to-r from-gray-600 via-gray-700 to-gray-800 px-12 py-48 text-amber-100 font-medium rounded-lg w-full max-w-xs sm:max-w-sm hover:shadow-2xl hover:shadow-blue-400 transition-shadow"
        >
            <h3 className="mb-6 text-lg sm:text-xl">{journal.title}</h3>
            <button
                onClick={handleNavigate}
                className="flex flex-col items-center"
            ></button>
            <HoverButton 
                position="left" 
                colorBefore="red-400" 
                colorAfter="white" 
                buttonText='Delete' 
                onClick={handleDelete} 
            />
            <HoverButton 
                position="right" 
                colorBefore="blue-400" 
                colorAfter="white" 
                buttonText='Edit' 
                onClick={handleEdit} 
            />
        </div>
    );
}

// Memoize component - only re-render if journal, onDelete, or onEdit changes
export default memo(JournalCard);
