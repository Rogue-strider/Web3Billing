// import { Router } from "express";
// import {
//   getNonce,
//   verifySignature,
//   refreshAccessToken,
//   logout,
// } from "../controllers/auth.controller.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// const router = Router();

// router.get("/nonce", asyncHandler(getNonce));
// router.post("/verify", asyncHandler(verifySignature));
// router.post("/refresh", asyncHandler(refreshAccessToken)); // ✅ ADD THIS
// router.post("/logout", asyncHandler(logout));

// export default router;




import { Router } from "express";
import {
  getNonce,
  verifySignature,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/nonce", asyncHandler(getNonce));
router.post("/verify", asyncHandler(verifySignature));
router.post("/refresh", asyncHandler(refreshAccessToken));
router.post("/logout", asyncHandler(logout));

// 🔥 ADD THIS
// router.get("/me", authenticate, (req, res) => {
//   res.json({ user: req.user });
// });

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
