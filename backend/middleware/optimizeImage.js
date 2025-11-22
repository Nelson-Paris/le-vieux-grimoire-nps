const sharp = require('sharp');
const fs = require('fs');

module.exports = async (req, res, next) => {
    if (!req.file) return next(); // crash si modification sans cette ligne testé 

    const originalPath = req.file.path; // cf multer-config
    const originalName = req.file.filename; // cf multer-config
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')); // début de chaine au dernier point sécurise si point dans le nom de l'image
    const outputFilename = `${baseName}.webp`; // passage en webp
    const outputPath = `images/${outputFilename}`;

    try {
        await sharp(originalPath)
            .resize(400)
            .webp({ quality: 70 })
            .toFile(outputPath);

        fs.unlinkSync(originalPath);

        req.file.filename = outputFilename; // update des données
        req.file.path = outputPath;

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
