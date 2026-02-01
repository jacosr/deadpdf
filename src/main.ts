import { app, BrowserWindow, protocol } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import JSZip from 'jszip';
import { get } from 'http';


let zip: JSZip | null = null;


app.whenReady().then(() => {

    protocol.registerBufferProtocol('dpdf', (request, callback) => {
        const url = request.url.replace('dpdf://', '');    // all urls start with dpdf://
        
        // try to load from zip
        getFileFromZip(url).then((data) => {
            if (data) {

                callback({
                    mimeType: getMimeType(url),
                    data: data  
                });
                return;
            }
        });

        // default fallback
        callback({
            data: Buffer.from(`Not found: ${url}`), 
            mimeType: 'text/plain' 
        });
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

  // Load the zip file into memory at startup
  const zipFilePath = "C:\Users\twakj\source\repos\jacosr\deadpdf\testform\testform.dpdf";
  loadZipIntoMemory(zipFilePath);

  win.loadURL('dpdf://index.html');
}

async function loadZipIntoMemory(filePath: string) {
    const buffer = fs.readFileSync(filePath);
    zip = await JSZip.loadAsync(buffer);
}

async function getFileFromZip(filePath: string): Promise<Buffer | null> {
    if (!zip) return null;

    const file = zip.file(filePath);
    if (!file) return null;

    const data = await file.async('uint8array');
    return Buffer.from(data);
}

function getMimeType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        default:
            return 'application/octet-stream';
    }
}



