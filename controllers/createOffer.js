var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const multer = require('multer');

var db = require('../models/db_controller');
const { check, validationResult } = require('express-validator');

// Multer setup (for parsing multipart/form-data)
const upload = multer();


router.post(
    "/createOffer",
    upload.none(),
    [
        // Validation rules
        check("title").notEmpty().withMessage("Title is required"),
        check("min-rate").isInt({ min: 0 }).withMessage("Minimum Interest Rate must be non-negative"),
        check("min-start-date").isDate().withMessage("Enter a valid start date for Minimum Term Length"),
        check("min-end-date").isDate().withMessage("Enter a valid end date for Minimum Term Length"),
        check('min-end-date').custom((value, { req }) => {
            const startDate = new Date(req.body['min-start-date']);
            const endDate = new Date(value);
    
            if (startDate >= endDate) {
                throw new Error('Minimum Term Length End Date must be later than Minimum Term Length Start Date');
            }
            return true;
        }).withMessage('Minimum Term Length End Date must be later than Minimum Term Length Start Date'),
        check("max-start-date").isDate().withMessage("Enter a valid start date for Maximum Term Length"),
        check("max-end-date").isDate().withMessage("Enter a valid end date for Maximum Term Length"),
        check('max-end-date').custom((value, { req }) => {
            const startDate = new Date(req.body['max-start-date']);
            const endDate = new Date(value);
    
            if (startDate >= endDate) {
                throw new Error('Maximum Term Length End Date must be later than Minimum Term Length Start Date');
            }
            return true;
        }).withMessage('Minimum Term Length End Date must be later than Minimum Term Length Start Date'),
        check("description").notEmpty().withMessage("Description is required"),
        check("category").isIn(["finance", "real-estate", "business", "other"]).withMessage("Invalid category selected"),
        check("min-amount").isInt({ min: 1 }).withMessage("Minimum loan amount must be greater than 0"),
        check("max-amount").isInt({ min: 1 }).withMessage("Maximum loan amount must be greater than 0"),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                error: errors.array()[0].msg,
            });
        }

        const {
            title,
            "min-rate": minRate,
            "min-start-date": minStartDate,
            "min-end-date": minEndDate,
            "max-start-date": maxStartDate,
            "max-end-date": maxEndDate,
            description,
            category,
            "min-amount": minAmount,
            "max-amount": maxAmount,
        } = req.body;

        Lemail = req.session.email;
        try {
            const result = await db.createLoanOffer({
                title,
                minRate,
                minStartDate,
                minEndDate,
                maxStartDate,
                maxEndDate,
                description,
                category,
                minAmount,
                maxAmount,
                Lemail,
            });

            if (result.status === "error") {
                return res.status(400).json({
                    status: "error",
                    error: result.message,
                });
            }

            res.json({
                status: "success",
                message: "Loan post created successfully!",
            });
        } catch (err) {
            console.error("Error saving loan post:", err);
            res.status(500).json({
                status: "error",
                error: "Internal server error. Please try again later.",
            });
        }
    }
);

module.exports = router;