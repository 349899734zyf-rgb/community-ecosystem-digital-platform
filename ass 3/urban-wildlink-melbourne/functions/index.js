/**
 * functions/index.js
 * BR (E.1): Serverless Cloud Functions
 * Monash FIT5032 Assessment 3
 * 
 * Standard Firebase Cloud Functions 2nd Gen implementation.
 * Provides serverless back-end endpoints for biodiversity aggregation.
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK singleton
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Cloud Function 1: countSpecies (BR E.1)
 * Server-side calculation of catalog species count from Firestore
 */
exports.countSpecies = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const db = admin.firestore();
      const snapshot = await db.collection("plants").get();
      const count = snapshot.size;

      res.status(200).json({
        success: true,
        count: count,
        message: `Current registered species count in database: ${count}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error executing countSpecies Cloud Function:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

/**
 * Cloud Function 2: formatSpeciesName (Week 9 eFolio pattern)
 * Transforms botanical names to standard uppercase on server
 */
exports.formatSpeciesName = onRequest((req, res) => {
  cors(req, res, () => {
    const rawName = (req.query.name || (req.body && req.body.name) || "").toString();
    const formatted = rawName.trim().toUpperCase();

    res.status(200).json({
      success: true,
      original: rawName,
      formatted: formatted,
      length: formatted.length
    });
  });
});
