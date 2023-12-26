import express, { Router } from "express";

const router: Router = express.Router();

router.get('/:id', (req, res) => {
    res.json({
        "response": req.params.id
    })
});

export default router;