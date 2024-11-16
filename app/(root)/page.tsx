import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";

export type StartupCardType = {
    _id: number; // Or string if _id is a MongoDB ObjectId
    _createdAt: Date; // Creation date of the post
    views: number; // Number of views
    author: {
        authorId: number | string; // ID of the author
        name: string; // Name of the author
    };
    title: string; // Title of the post
    category: string; // Category of the startup
    image: string; // Image URL
    description: string; // Description of the post
};

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const query = (await searchParams).query;

    const posts: StartupCardType[] = [
        {
            _id: 1,
            _createdAt: new Date(),
            views: 55,
            author: { authorId: 1, name: "Osama" },
            description: "This is a description",
            image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
            category: "Robots",
            title: "we Robots",
        },
    ];
    return (
        <>
            <section className="pink_container">
                <h1 className="heading">
                    Pitch Your Startup, <br /> Connect With Entrepreneurs
                </h1>
                <p className="sub-heading !max-w-3xl">
                    Submit Ideas, Vote On Pitches, And Get Noticed In Virtual
                    Competitions.
                </p>
                <SearchForm query={query} />
            </section>

            <section className="section_container">
                <p className="text-30-semibold">
                    {query ? `Search results for "${query}"` : "All Startups"}
                </p>
                <ul className="mt-7 card_grid">
                    {posts.length > 0 ? (
                        posts.map((post: StartupCardType) => (
                            <StartupCard key={post?._id} post={post} />
                        ))
                    ) : (
                        <p className="no-results">No startups found</p>
                    )}
                </ul>
            </section>
        </>
    );
}
