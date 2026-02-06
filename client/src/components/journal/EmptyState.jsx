import JournalCreateForm from "./JournalCreateForm";

/**
 * Empty state component shown when user has no journals yet
 * Encourages user to create their first journal
 */
export default function EmptyState({ onCreate }) {
    return (
        <div className="grid items-center min-h-screen px-4 bg-[url(images/mountains.png)] bg-no-repeat bg-cover gap-10">
            <h1 className="text-2xl text-amber-100 justify-self-center text-center">
                Create a new journal to get started
            </h1>
            <JournalCreateForm 
                onSubmit={onCreate}
                className="justify-self-center px-8 sm:px-12 md:px-20 py-20 md:max-w-md min-w-sm"
            />
        </div>
    );
}
