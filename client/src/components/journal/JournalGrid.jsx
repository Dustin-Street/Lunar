import JournalCard from "./JournalCard";
import JournalCreateForm from "./JournalCreateForm";

/**
 * Grid layout component that displays all journals plus create form
 * Handles the responsive grid layout
 */
export default function JournalGrid({ journals, Delete, Edit, Create, Upload }) {
    return (

        //passing down from Journal Select -> journalCard
       <div className="fixed inset-0 bg-[url('/images/journaldeepnight2.jpg')] bg-cover bg-center bg-no-repeat backdrop-blur-lg">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center px-6 py-10 gap-10 overflow-y-auto h-screen">
   {journals.map(journal => (
                <JournalCard 
                    key={journal._id}
                    journal={journal}
                    onDelete={Delete}
                    onEdit={Edit}
                    onImageUpload={Upload}
                />
            ))}
            <JournalCreateForm 
                onSubmit={Create}
                className="self-center"
            />
</div>
       </div>



           
        
    );
}
