
document.getElementById('open')?.addEventListener('click', async () => {
    try {
        console.log("index.ts, Open button clicked");
        const file = await window.deadpdf.openFile();

        if (file) {
            console.log(`Opened file: ${file}`);
        }
    } catch (err) {
        console.error("Error opening file:", err);
    }
});




