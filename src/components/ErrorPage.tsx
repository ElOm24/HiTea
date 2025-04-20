function ErrorPage() {
    return (
        <main className="main-background">
            <header>Page does not exist... </header>
            <div className="max-w-sm mx-auto mt-4">
                <div className="w-[300px] pb-[10px]">
                    <img src="../assets/error-page-cat-img.jpg" alt="" />
                </div>
                <h1>Please click on one of the valid links above.</h1>
            </div>
        </main>
    );
}

export default ErrorPage;
