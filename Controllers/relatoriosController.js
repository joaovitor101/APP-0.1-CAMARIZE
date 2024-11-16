import express from 'express';
const router = express.Router();



router.get("/rel_periodo", (req, res) => {
    // Passa as mensagens de flash para o EJS
    res.render("rel_periodo", {
        success: req.flash('success'),
        error: req.flash('error')
    });
  });

  router.get("/rel_individual", (req, res) => {
    // Passa as mensagens de flash para o EJS
    res.render("rel_individual", {
        success: req.flash('success'),
        error: req.flash('error')
    });
  });

  router.get("/rel_geral", (req, res) => {
    // Passa as mensagens de flash para o EJS
    res.render("rel_geral", {
        success: req.flash('success'),
        error: req.flash('error')
    });
  });
  export default router;