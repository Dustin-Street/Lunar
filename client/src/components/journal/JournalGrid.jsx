import JournalCard from "./JournalCard";
import JournalCreateForm from "./JournalCreateForm";

/**
 * Grid layout component that displays all journals plus create form
 * Handles the responsive grid layout
 */
export default function JournalGrid({ journals, Delete, Edit, Create, Upload }) {
    return (

        //passing down from Journal Select -> journalCard
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 backdrop-blur-2xl place-items-center min-h-screen px-6 py-10 bg-[url(images/mountains.png)] bg-no-repeat bg-cover gap-10">
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
    );
}
