import React, { useContext, useEffect } from 'react';
import ProductItem from '../components/cart-item';
import { Context } from '../context/cart-context';
import { sum } from '../utils/sum';

const Cart = () => {
  const { state, fetchItems } = useContext(Context);

  useEffect(() => {
    fetchItems();
  }, []);

  if (state.isLoading) return 'Loading...';
  if (state.items.length === 0) return 'No products added to the cart';

  return (
    <div className="flex flex-wrap">
      <table className="table-auto w-full lg:w-8/12 w-full">
        <thead>
          <tr>
            {['product details', 'quantity', 'price', 'total'].map((title) => (
              <th
                key={title}
                className="px-6 py-3 text-gray-500 font-medium capitalize">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.items.map((item) => (
            <ProductItem key={item.id} {...item} />
          ))}
        </tbody>
      </table>
      {/* Total */}
      <div className="lg:w-4/12 w-full bg-gray-100 p-3 flex justify-between flex-col">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="flex justify-between font-semibold uppercase">
          <p>Total cost</p>
          <p>${sum(state.items).toFixed(2)}</p>
        </div>
        <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;