import React, { createContext, useReducer } from 'react';
import { ecomm } from '../api/ecomm';

export const Context = createContext(null);
Context.displayName = 'ProductsContext';

const productsActions = {
  isLoading: 'is_loading',
  error: 'error',
  cleanError: 'clean_error',
  fetchProducts: 'fetch_products',
  fetchProduct: 'fetch_product',
  createProduct: 'create_product',
  addToCart: 'add_to_cart',
  removeFromCart: 'remove_from_cart',
  addToWishlist: 'add_to_wishlist',
  createReview: 'create_review',
  updateReview: 'update_review',
  removeReview: 'remove_review'
};

const initialState = {
  products: [],
  product: null,
  cart: [],
  wishlist: null,
  error: [],
  isLoading: false
};

const productsReducer = (state, { type, payload }) => {
  switch (type) {
    case productsActions.isLoading:
      return { ...state, isLoading: true };
    case productsActions.error:
      return { ...state, isLoading: false, error: payload };
    case productsActions.cleanError:
      return { ...state, isLoading: false, error: state.error.slice(1) };
    case productsActions.fetchProducts:
      return { ...state, isLoading: false, products: payload, error: [] };
    case productsActions.fetchProduct:
      return { ...state, isLoading: false, product: payload, error: [] };
    case productsActions.createProduct:
      return {
        ...state,
        isLoading: false,
        products: state.products.concat(payload)
      };
    case productsActions.addToCart:
      return {
        ...state,
        cart: state.cart.concat(payload),
        products: state.products.map((product) => {
          return product.id === payload.productId
            ? { ...product, addedToCart: !product?.addedToCart }
            : product;
        })
      };
    case productsActions.removeFromCart:
      return { ...state, cart: state.cart.slice(1) };
    case productsActions.addToWishlist:
      return { ...state, wishlist: payload };
    case productsActions.createReview:
      return {
        ...state,
        product: {
          ...state.product,
          reviews: state.product.reviews.concat(payload)
        }
      };
    case productsActions.updateReview:
      return {
        ...state,
        product: {
          ...state.product,
          reviews: state.product.reviews.map((review) => {
            return review.id === payload.id
              ? {
                  ...review,
                  ...payload.data
                }
              : review;
          })
        }
      };
    case productsActions.removeReview:
      return {
        ...state,
        product: {
          ...state.product,
          reviews: state.product.reviews.filter(
            (review) => review.id !== payload
          )
        }
      };
    default:
      return state;
  }
};

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: productsActions.isLoading });
    try {
      const { data } = await ecomm.get('/api/products');
      dispatch({ type: productsActions.fetchProducts, payload: data });
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const fetchProduct = async (id) => {
    dispatch({ type: productsActions.isLoading });
    try {
      const { data } = await ecomm.get(`/api/products/${id}`);
      dispatch({ type: productsActions.fetchProduct, payload: data });
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const createProduct = async ({ name, price, description }) => {
    try {
      const { data } = await ecomm.post('/api/products', {
        name,
        price,
        description
      });
      dispatch({ type: productsActions.createProduct, payload: data });
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const addToCart = async (productId) => {
    try {
      const { data } = await ecomm.post('/api/cart', {
        productId,
        quantity: 1
      });

      dispatch({ type: productsActions.addToCart, payload: data });

      setTimeout(() => {
        dispatch({ type: productsActions.removeFromCart });
      }, 3000);
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const { data } = await ecomm.post('/api/wishlist', { productId });
      dispatch({ type: productsActions.addToWishlist, payload: data });
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const createReview = async ({ productId, title, comment, score }) => {
    try {
      const { data } = await ecomm.post('/api/reviews', {
        productId,
        title,
        comment,
        score
      });

      dispatch({ type: productsActions.createReview, payload: data });
    } catch (err) {
      dispatch({
        type: productsActions.error,
        payload: err.response.data.errors
      });

      setTimeout(() => {
        dispatch({ type: productsActions.cleanError });
      }, 3000);
    }
  };

  const updateReview = async (id, { title, comment, score }) => {
    try {
      const { data } = await ecomm.put(`/api/reviews/${id}`, {
        title,
        comment,
        score
      });

      dispatch({ type: productsActions.updateReview, payload: { id, data } });
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const removeReview = async (id) => {
    try {
      await ecomm.delete(`/api/reviews/${id}`);

      dispatch({ type: productsActions.removeReview, payload: id });
    } catch (err) {
      dispatch({ type: productsActions.error, payload: err });
    }
  };

  const actions = {
    fetchProducts,
    createProduct,
    fetchProduct,
    addToCart,
    addToWishlist,
    createReview,
    removeReview,
    updateReview
  };

  return (
    <Context.Provider value={{ state, ...actions }}>
      {children}
    </Context.Provider>
  );
};
