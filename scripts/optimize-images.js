const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function optimizeImages() {
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(publicDir, file);
      const outputPath = path.join(publicDir, file.replace(ext, '.webp'));
      
      try {
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
        
        console.log(`✅ Converted ${file} to WebP`);
      } catch (error) {
        console.error(`❌ Failed to convert ${file}:`, error.message);
      }
    }
  }
}

// Also create different sizes for responsive images
async function createResponsiveSizes() {
  const files = fs.readdirSync(publicDir);
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(publicDir, file);
      const baseName = path.basename(file, ext);
      
      for (const size of sizes) {
        const outputPath = path.join(publicDir, `${baseName}-${size}w.webp`);
        
        try {
          await sharp(inputPath)
            .resize(size, null, { withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);
          
          console.log(`✅ Created ${baseName}-${size}w.webp`);
        } catch (error) {
          console.error(`❌ Failed to create ${baseName}-${size}w.webp:`, error.message);
        }
      }
    }
  }
}

if (require.main === module) {
  console.log('🖼️  Optimizing images...');
  optimizeImages()
    .then(() => createResponsiveSizes())
    .then(() => console.log('✅ Image optimization complete!'))
    .catch(console.error);
}

module.exports = { optimizeImages, createResponsiveSizes };