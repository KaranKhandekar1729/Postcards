import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function MyEnvelopes() {
    const [envelopes, setEnvelopes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleDelete = async (envelopeId) => {
        if (!window.confirm('Delete this envelope?')) return;

        try {
            const response = await fetch(`/api/envelope/${envelopeId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Unable to delete envelope');
            }

            setEnvelopes((current) => current.filter((envelope) => envelope._id !== envelopeId));
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchEnvelopes = async () => {
            try {
                const response = await fetch('/api/envelope', {
                    credentials: 'include',
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Unable to load envelopes');

                setEnvelopes(data.data ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnvelopes();
    }, []);

    return (
        <main className="min-h-screen bg-[#f1f1f1] px-6 py-10 sm:px-10 sm:py-14">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <div>
                        <Link to="/" className="font-system text-sm text-[#62615d] hover:text-[#24231D]">
                            Back home
                        </Link>
                        <h1 className="mt-3 font-serif text-4xl font-medium text-[#33302B] sm:text-5xl">My envelopes</h1>
                    </div>
                </div>

                {loading && <p className="font-system text-[#62615d]">Loading your envelopes...</p>}
                {error && <p className="font-system text-red-600">{error}</p>}

                {!loading && !error && envelopes.length === 0 && (
                    <div className="rounded-xl bg-white px-6 py-12 text-center">
                        <p className="font-serif text-2xl text-[#33302B]">No envelopes yet</p>
                        <p className="mt-2 font-system text-sm text-[#62615d]">Create your first digital letter from the home page.</p>
                    </div>
                )}

                {!loading && !error && envelopes.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {envelopes.map((envelope) => (
                            <div
                                key={envelope._id}
                                className="group relative overflow-hidden rounded-xl bg-white transition-transform hover:-translate-y-1"
                            >
                                <Link to={`/envelope/${envelope.slug}`}>
                                    <div
                                        className="h-40 bg-cover bg-center"
                                        style={{ backgroundImage: envelope.background }}
                                    />
                                    <div className="p-5">
                                        <h2 className="font-serif text-2xl text-[#33302B] group-hover:underline">{envelope.title}</h2>
                                        <p className="mt-2 font-system text-sm text-[#62615d]">To {envelope.to}</p>
                                        <p className="font-system text-sm text-[#62615d]">From {envelope.from}</p>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    title="Delete envelope"
                                    aria-label={`Delete ${envelope.title}`}
                                    onClick={() => handleDelete(envelope._id)}
                                    className="absolute right-3 top-3 rounded-md bg-white/90 p-2 text-[#62615d] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}