import JournalCreateForm from "./JournalCreateForm";

/**
 * Empty state component shown when user has no journals yet
 * Encourages user to create their first journal
 */
export default function EmptyState({ onCreate }) {
    return (
        <div className="grid items-center min-h-screen px-4 bg-[url(/images/journaldeepnight.jpg)] bg-cover bg-center gap-10">
            <div className="bg-gray-700/80 rounded-2xl p-6 max-w-3xl text-center text-white shadow-lg shadow-blue-200 justify-self-center border-2 border-blue-200">
                <p className=" md:text-2xl lg:text-3xl text-amber-100 font-serif text-center ">
                    Create a Journal to get started
                </p>
            </div>
            <JournalCreateForm
                onSubmit={onCreate}
                className="justify-self-center px-8 sm:px-12 md:px-20 py-20 md:max-w-md min-w-sm"
            />
        </div>
    );
}
