import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

//------------ Resume storage (PDF only) -----------------------------------------------------------------------

const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'HireMind/resume',
            allowed_formats: ['pdf'],
            resource_type: 'raw', // required for PDFs
            public_id: `resume-${req.user._id}-${Date.now()}`,
        };
    },
});

//--------- ProfileImage Storage (Image only ) ------------------------------------------------------------------

const profileImageStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'HireMind/profileImage',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `image-${req.user._id}-${Date.now()}`,
            transformation: [{ width: 400, height: 400, crop: 'fill' }],
        };
    },
});


//------- File Filters ---------------------------------------------------------------

const pdfFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/pdf' ||
        file.originalname.toLowerCase().endsWith('.pdf')
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};


const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};


const companyLogoStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'HireMind/companyLogo',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `logo-${req.user.company || req.user._id}-${Date.now()}`,
            transformation: [{ width: 400, height: 400, crop: 'limit' }],
        };
    },
});

//---------- Multer instances --------------------------------------------

export const resumeUpload = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: pdfFilter,
}).single('resume');

 
export const profileImageUpload = multer({
    storage: profileImageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: imageFilter,
}).single('profileImage');

export const companyLogoUpload = multer({
    storage: companyLogoStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: imageFilter,
}).single('logo');


//---- Error handler wrapper --------------------------------------------

export const handleUpload = (uploadFn) => (req, res, next) => {
    uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};
