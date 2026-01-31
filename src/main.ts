import { app, BrowserWindow, protocol } from 'electron';
import * as path from 'path';

app.whenReady().then(() => {

    protocol.registerBufferProtocol('dpdf', (request, callback) => {
        const url = request.url.replace('dpdf://', '');    // all urls start with dpdf://
        
        if (url === 'index.html') {
            const html = `
                <!doctype html>
                <html>
                    <body>
                        <h1>Loaded via dpdf:// protocol</h1>
                        <p>content from custom protocol handler</p>
                    </body>
                </html>
            `;

            callback({
                mimeType: 'text/html',
                data: Buffer.from(html)
            });
            return;
        }

        // default fallback
        callback({data: Buffer.from('Not found'), mimeType: 'text/plain' });
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('dpdf://index.html');
}