import express from 'express';
const router = express.Router();

router.get("/dashboard", (req, res) => {
    // Passa as mensagens de flash para o EJS
    res.render("dashboard", {
        success: req.flash('success'),
        error: req.flash('error')
    });
  });

export default router;
