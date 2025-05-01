function ErrorPage() {
    return (
        <main className="main-background flex flex-col items-center">
            <h1 className="text-center">Page does not exist... </h1>
            <div className="max-w-sm mx-auto mt-4 text-center">
                <div className="w-[300px] mx-auto pb-[10px]">
                    <img src="../assets/error-page-cat-img.jpg" alt="" />
                </div>
                <h1>Please click on one of the valid links above.</h1>
            </div>
        </main>
    );
}

export default ErrorPage;