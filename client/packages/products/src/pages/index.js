import React, { useEffect, useState } from 'react';
import Product from '../components/product';
import { ecomm } from '../../api/ecomm';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await ecomm.get('/api/products');

      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
};

export default Products;
