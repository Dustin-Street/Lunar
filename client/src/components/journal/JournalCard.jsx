import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoverButton from "../layout/HoverButton";

/**
 * Individual journal card component
 * Displays a single journal with edit and delete actions
 * Memorized to prevent re-renders when other journals update
 */
function JournalCard({ journal, onDelete, onEdit, onImageUpload }) {
    const [InTitleEdit, setInTitleEdit] = useState(false)
    const [inCustomize, setInCustomize] = useState(false)
    const [showError, setShowError] = useState(false);
    const [inChangeState, setInChangeState] = useState(false)
    const [title, setTitle] = useState('');


    //customization elements that can be editted my cutomization button click
    const [image, setImage] = useState('')
    const [border, setborder] = useState('')


    const navigate = useNavigate();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleEdit()
        }
    };

    // Memoize callbacks to prevent recreation
    const handleDelete = useCallback(() => {
        onDelete(journal._id);
    }, [onDelete, journal._id]);

    //go into edit state on first edit button click
    const handleEditState = useCallback(() => {
        setTitle(journal.title)
        setInTitleEdit(true);


    }, [journal.title]);

    //leave edit state on cancel click
    const handleLeaveEditState = useCallback(() => {
        setInTitleEdit(false);
    })

    //submit edit to backend on second button click
    const handleEdit = useCallback(() => {
        if (title.trim() === '') {
            setShowError(true);
            return;
        }
        onEdit(journal._id, title)
        setInTitleEdit(false)
    }, [onEdit, journal._id, title])


    const handleNavigate = useCallback(() => {
        navigate(`/journalOverview/${journal._id}`);
    }, [navigate, journal._id]);


    //customize state logic  Entering and exiting Customization view like edit state but should also include options
    // to change journal background and border color and then submit those changes to the backend with the uploadImage
    // function passed down from useJournals Hook and then to JournalCard as prop and then called here in handleImageChange
    //  function with the new image value and journal id as parameters
    const handleCustomizeStateEnter = useCallback(() => {
        setTitle(journal.title)
        setImage(journal.image)
        setborder(journal.border)
        setInCustomize(true);
    }, [journal.title, journal.image, journal.border])

    const handleCustomizeStateLeave = useCallback(() => {

        setInCustomize(false);
    }, [journal.title, journal.image, journal.border])

    // not  implemented yet on the server side backend schema needs to be updated to include image and border properties for journals
    // and then the uploadImage function needs to be passed down from useJournals Hook and then to JournalCard as prop and then
    // called here in handleImageChange function with the new image value and journal id as parameters
    //image change logic request // needs to be passed down from useJournals Hook and then to JournalCard as prop 
    const handleImageChange = useCallback(() => {
        setImage(journal.image)

        return;
    })



    return (
        <div
            className="grid relative place-items-center group border-4 bg-opacity-75
             border-blue-200 bg-linear-to-r from-gray-600 via-gray-700 to-gray-800 px-12 py-48
             text-amber-100 font-medium rounded-lg w-full max-w-xs sm:max-w-sm hover:shadow-2xl
             hover:shadow-blue-400 transition-shadow"
            {...(!InTitleEdit && { onClick: handleNavigate })}
        >

            <h3 className="mb-6 text-lg sm:text-xl">{InTitleEdit ? <input
                name="title"
                type="text"
                value={title}
                onChange={(e) => {
                    setShowError(false)
                    setTitle(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder={journal.title}
                className={`
                    bg-neutral-100 rounded-lg mb-4 px-4 py-2 text-black text-center 
                    w-full outline-none transition-all duration-300
                    ${showError
                        ? 'border-4 border-red-500 animate-pulse'
                        : 'border-2 border-transparent focus:border-blue-400'}
                `}
            /> : journal.title}</h3>


            <div name="interactionButtons" className='md:group-hover:opacity-100 md:opacity-10 transition-opacity duration-2200 ease-out group-hover:duration-300 group-hover:ease-in' >

                {inCustomize ?

                    //Journal Navigation
                    <HoverButton
                        position="top"
                        colorBefore="green-400"
                        colorAfter="white"
                        buttonText='Save'
                        onClick={handleCustomizeStateLeave}
                    />
                     :
                      <HoverButton
                        position="top"
                        colorBefore="gray-500"
                        colorAfter="blue-500"
                        buttonText='Customize'
                        onClick={handleCustomizeStateEnter}
                    />}



                {InTitleEdit ?

                    //Delete / cancel  
                    <HoverButton
                        position="left"
                        colorBefore="red-400"
                        colorAfter="white"
                        buttonText='Cancel'
                        onClick={handleLeaveEditState}
                    /> : <HoverButton
                        position="left"
                        colorBefore="red-400"
                        colorAfter="white"
                        buttonText='Delete'
                        onClick={handleDelete}
                    />}


                {InTitleEdit ?
                    //Edit / Set name

                    <HoverButton
                        position="right"
                        colorBefore="blue-400"
                        colorAfter="white"
                        buttonText='Set Name'
                        onClick={handleEdit}
                    /> : <HoverButton
                        position="right"
                        colorBefore="blue-400"
                        colorAfter="white"
                        buttonText='Edit'
                        onClick={handleEditState}
                    />}

            </div>

        </div>
    );
}

// Memoize component - only re-render if journal, onDelete, or onEdit changes
export default memo(JournalCard);
