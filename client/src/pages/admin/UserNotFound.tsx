// UserNotFound.js

const UserNotFound = () => {
    return (
        <>
            <table className="w-full  text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                        <th scope="col" className="px-6 py-4">Username</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Created</th>
                        <th scope="col" className="px-6 py-4">Updated</th>
                        <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                </thead>
            </table>
            <div className="flex items-center justify-center h-screen">

                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">User Not Found</h1>
                </div>
            </div>
        </>
    );
};

export default UserNotFound;
