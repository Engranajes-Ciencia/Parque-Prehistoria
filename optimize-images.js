import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, 'public', 'assets');

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 80;

async function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  }

  return arrayOfFiles;
}

async function optimizeImages() {
  console.log('--- Starting Image Optimization ---');
  const files = await getAllFiles(ASSETS_DIR);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

  console.log(`Found ${imageFiles.length} images.`);

  for (const file of imageFiles) {
    const stats = fs.statSync(file);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    // Only optimize if > 200KB to avoid wasting time on small icons
    if (stats.size < 200 * 1024) continue;

    console.log(`Processing: ${path.relative(ASSETS_DIR, file)} (${sizeInMB} MB)`);
    
    const ext = path.extname(file).toLowerCase();
    const tempFile = file + '.tmp';

    try {
      let pipeline = sharp(file).resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true
      });

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9, palette: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: QUALITY });
      }

      await pipeline.toFile(tempFile);

      const newStats = fs.statSync(tempFile);
      const newSizeInMB = (newStats.size / (1024 * 1024)).toFixed(2);
      
      if (newStats.size < stats.size) {
        fs.unlinkSync(file);
        fs.renameSync(tempFile, file);
        console.log(`  Success: ${sizeInMB} MB -> ${newSizeInMB} MB`);
      } else {
        fs.unlinkSync(tempFile);
        console.log(`  Skipped: Optimization did not reduce size.`);
      }
    } catch (err) {
      console.error(`  Error processing ${file}:`, err.message);
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
  }
  console.log('--- Optimization Complete ---');
}

optimizeImages();
