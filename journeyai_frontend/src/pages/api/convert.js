import sharp from 'sharp';
import formidable from 'formidable-serverless'; // To handle file uploads

export const config = {
    api: {
        bodyParser: false, // Disable the default bodyParser
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Formidable to handle file upload
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parse error:', err);
            return res.status(500).json({ error: 'Error parsing the form' });
        }

        console.log('Received files:', files); // Log file details

        // File path of the uploaded HEIC image
        const filePath = files.file.filepath;

        try {
            // Use sharp to convert the image
            const data = await sharp(filePath)
                .toFormat('jpeg')
                .jpeg({ quality: 90 }) // Set the quality of the output JPEG
                .toBuffer();

            // Send the JPEG image back as a response
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(data);
        } catch (error) {
            console.error('Error converting image:', error);
            res.status(500).json({ error: 'Failed to convert image' });
        }
    });
}
