import { useState, useEffect } from "react"



export default function JournalEntry() {
    //state for journal entry text area
    const [journalEntry, setJournalEntry] = useState("");
    const [borderColor, setBorderColor] = useState("gray-500");
    const [previousPage, setPreviousPage] = useState(false);

    //buttons text
    const nextButton = "Next";
    const previousButton = "Previous";
    const SaveButton = "Save";

    const toggleNextButton = () => {
        nextButton === '>';
    };

    const SaveEntry = () => {
        //save journal entry to database
        console.log("Journal Entry Saved:", journalEntry);
        setBorderColor("green-500");
    }

    const handleInputChange = (e) => {
        setJournalEntry(e.target.value);
    }

    const NextPage = () => {
        //render next page allowing user to select mood and tags - to be implemented
        //without refreshing the page, able to back previous journal entry page and edit entry
        //save journal entry to database with mood and tags
        
        setPreviousPage(true);
    }

    const illuminateBorder = () => {
        setBorderColor("blue-500");
        setTimeout(() => {
            setBorderColor("gray-500");
        }, 4000);
    }

    const PreviousPage = () => {
        //render previous journal entry page
        setPreviousPage(false);
    }



    return (

        <div className="flex flex-col items-center justify-items-center h-dvh bg-[url(/images/jou)] bg-no-repeat bg-cover">
            <h2 className="text-3xl font-semibold">Journal Entry</h2>
            <textarea onMouseEnter={illuminateBorder} name="journalEntry" id="journalEntry" className={`bg-neutral-100 border-3 border-${borderColor} 
            rounded-2xl w-[80vw] h-[80vh] text-2xl mt-20 lg:max-w-[55dvh]`} onChange={handleInputChange}>{journalEntry}</textarea>
            <div className="space-x-35 mx-5 mb-5  mt-5">
                {previousPage ? (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg transform transition duration-500 ease-in-out hover:scale-105 hover:bg-blue-700 hover: opacity-35 hover:opacity-85 shrink-0 md:{toggleNextButton} " onClick={PreviousPage}>{previousButton}</button>
                ) : null}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg transform transition duration-500 ease-in-out hover:scale-105 hover:bg-blue-700 hover: opacity-35 hover:opacity-85 shrink-0 md:{toggleNextButton} " onClick={SaveEntry}>{SaveButton}</button>

                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg transform transition duration-500 ease-in-out hover:scale-105 hover:bg-blue-700 hover: opacity-35 hover:opacity-85 shrink-0 md:{toggleNextButton} " onClick={NextPage}>{nextButton}</button>

            </div>


        </div>

    )
}