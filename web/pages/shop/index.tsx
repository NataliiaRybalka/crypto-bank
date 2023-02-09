import React from 'react';
import Products from '../../components/Products';

export default function ShopPage() {
  return (
    <div>
      <Products submitTarget='/shop/checkout' enabled={true} />    </div>
  )
}
