import Header from './Header';

const Homepage = () => {
    return (
        <div className="container mx-auto min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mt-16">
                    Dobrodošli
                </h1>
            </main>
        </div>
    );
};

export default Homepage;