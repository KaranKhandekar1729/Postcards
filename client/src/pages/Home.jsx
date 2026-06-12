import { Link } from "react-router-dom"

export default function Home () {

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="p-4 bg-amber-700 rounded-full">
                <Link to='/postcard/new'>Create new</Link>
            </div>
        </div>
    )
}