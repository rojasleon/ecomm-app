import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import { requireAuth } from '../../middlewares/require-auth';
import { currentUser } from '../../middlewares/currentuser';
import { Product } from '../../models/product';

const router = express.Router();

router.put(
  '/api/products/:id',
  currentUser,
  requireAuth,
  [
    body('name')
      .isLength({ min: 1, max: 148 })
      .withMessage('You must provide a name'),
    body('price').isFloat({ gt: 0 }).withMessage('You must provide a price'),
    body('description')
      .isLength({ min: 1, max: 500 })
      .withMessage('You must provide a valid description'),
    body('wishlisted')
      .isBoolean()
      .withMessage('You must provide a boolean value for wishlisted')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, price, description, wishlisted } = req.body;
    const { id } = req.params;

    await Product.update(
      {
        name,
        price,
        description,
        wishlisted
      },
      { where: { id, userId: req.currentUser!.id }, returning: true }
    );

    res.sendStatus(204);
  }
);

export { router as updateProductsRouter };
