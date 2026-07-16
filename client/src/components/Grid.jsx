const features = [
    {
        title: "Customize right from the envelope",
        body: "Drag and drop stickers, upload pictures and use from a variety of fonts to make it truly yours",
        span: "sm:col-span-2",
        image: "https://res.cloudinary.com/docidcbkt/image/upload/v1784194767/envelope-uploads/5a1b61e2cb641c6a4add00ffeee80851.png",
    },
    {
        title: "Edit on your phone",
        body: "Don't let anything stop you! Create and edit from anywhere",
        span: "sm:col-span-1",
        image: "https://res.cloudinary.com/docidcbkt/image/upload/v1784197404/envelope-uploads/6f3d5d3bc84f9aec9eb085777df2f55d.png",
    },
    {
        title: "Share it anywhere",
        body: "Send a private link over chat or email, or just copy and paste it.",
        span: "sm:col-span-1",
        image: "https://res.cloudinary.com/docidcbkt/image/upload/v1784197485/envelope-uploads/aa7c55f749ae240f4f21a3602419f4d4.png",
    },
    {
        title: "Customize your interactive letter",
        body: "No limits to what you can do! Change colors, choose from available backgrounds or upload your own!",
        span: "sm:col-span-2",
        image: "https://res.cloudinary.com/docidcbkt/image/upload/v1784194951/envelope-uploads/903aeb2a955187d32eff4bfc056e7a99.png"
    },
];

export default function Grid() {
    return (
        <div className="w-full mx-auto px-6 sm:px-8 md:px-16 lg:px-32 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((f) => (
                    <div
                        key={f.title}
                        className={`${f.span} bg-[#ffffff] rounded-xl p-4 flex flex-col`}
                    >
                        <div className="w-full rounded-sm sm:rounded-lg overflow-hidden bg-[#F5EEE0] mb-4">
                            <img
                                src={f.image}
                                alt={f.title}
                                className="w-full h-auto"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="font-serif font-semibold text-lg sm:text-xl md:text-2xl text-[#33302B] mb-2 leading-snug">
                            {f.title}
                        </h3>
                        <p className="font-system text-sm md:text-base text-[#62615d] leading-relaxed max-w-[62ch]">
                            {f.body}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}