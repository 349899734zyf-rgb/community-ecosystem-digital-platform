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

/**
 * Cloud Function 3: seedInitialPlants (Admin Seeder)
 * Automatically seeds 12 indigenous Victorian plant species into Firestore
 */
exports.seedInitialPlants = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const db = admin.firestore();
      const initialPlants = [
        { name: "Golden Wattle", category: "Wattle", stock: 15, ecologicalBenefit: "Attracts native pollinators & bird nesting" },
        { name: "Silver Banksia", category: "Banksia", stock: 8, ecologicalBenefit: "Essential winter nectar for Honeyeaters" },
        { name: "Common Everlasting", category: "Wildflower", stock: 25, ecologicalBenefit: "Butterfly host plant for Clayton clay soils" },
        { name: "Blackwood", category: "Wattle", stock: 12, ecologicalBenefit: "Soil stabilization & nitrogen fixing" },
        { name: "Kangaroo Grass", category: "Grass", stock: 40, ecologicalBenefit: "Drought-tolerant native grassland groundcover" },
        { name: "Spiny-headed Mat-rush", category: "Grass", stock: 30, ecologicalBenefit: "Erosion control for creek embankments" },
        { name: "Sweet Bursaria", category: "Shrub", stock: 18, ecologicalBenefit: "Crucial nectar source for Copper Butterflies" },
        { name: "Woolly Tea-tree", category: "Shrub", stock: 10, ecologicalBenefit: "Wetland buffer & native micro-bat shelter" },
        { name: "Prickly Moses", category: "Wattle", stock: 14, ecologicalBenefit: "Dense protective thickets for small passerine birds" },
        { name: "Hop Goodenia", category: "Wildflower", stock: 22, ecologicalBenefit: "Ground level biodiversity & native hoverfly forage" },
        { name: "Chocolate Lily", category: "Wildflower", stock: 16, ecologicalBenefit: "Fragrant Indigenous wildflower & pollinator host" },
        { name: "Austral Indigo", category: "Shrub", stock: 12, ecologicalBenefit: "Attracts Blue-banded Bees with vibrant purple blooms" }
      ];

      const batch = db.batch();
      initialPlants.forEach((plant, idx) => {
        const docRef = db.collection("plants").doc(`plant-${idx + 1}`);
        batch.set(docRef, { ...plant, updatedAt: new Date().toISOString() }, { merge: true });
      });
      await batch.commit();

      res.status(200).json({
        success: true,
        message: `Successfully seeded ${initialPlants.length} plant species into Firestore!`,
        count: initialPlants.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error seeding plants:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

