import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import { requireAuth } from '../../middlewares/require-auth';
import { currentUser } from '../../middlewares/currentuser';
import { Product } from '../../models/product';

const router = express.Router();

router.post(
  '/api/products',
  currentUser,
  requireAuth,
  [
    body('userId').isNumeric().withMessage('You must provide an userId'),
    body('name')
      .isLength({ min: 1, max: 148 })
      .withMessage('You must provide a name'),
    body('price').not().isEmpty().withMessage('You must provide a price'),
    body('description')
      .isLength({ min: 1, max: 500 })
      .withMessage('You must provide a valid description')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, price, description } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      userId: parseInt(req.currentUser!.id)
    });

    res.status(201).send(product);
  }
);

export { router as createProductRouter };