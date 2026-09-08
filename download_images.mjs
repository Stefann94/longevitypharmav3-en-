import fs from 'fs';
import https from 'https';

const categories = {
    'extracte': 'plant,extract,bottle',
    'antioxidanti': 'berries,supplement,bottle',
    'focus': 'brain,supplement,bottle',
    'colagen': 'collagen,powder,bottle',
    'probiotice': 'probiotics,gut,bottle',
    'omega3': 'fish,oil,pills',
    'longevitate': 'antiaging,supplement',
    'energie': 'energy,supplement,bottle',
    'imunitate': 'immunity,supplement,bottle',
    'vitamine': 'vitamins,pills,bottle',
    'inima': 'heart,supplement,bottle',
    'somn-stres': 'sleep,supplement,bottle'
};

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    let globalIndex = 1;
    for (const [cat, keywords] of Object.entries(categories)) {
        for (let i = 1; i <= 3; i++) {
            const fileName = `${cat}_${i}.jpg`;
            const dest = `./public/images/${fileName}`;
            const url = `https://loremflickr.com/600/600/${keywords}?lock=${globalIndex}`;
            console.log(`Downloading ${fileName} for category ${cat}...`);
            try {
                await downloadImage(url, dest);
            } catch (err) {
                console.error(`Failed to download ${fileName}:`, err);
            }
            globalIndex++;
        }
    }
    console.log('Toate cele 36 de imagini au fost descarcate cu succes!');
}

run();
