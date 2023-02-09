import React, { useRef } from 'react';
import { products } from '../lib/products';
import NumberInput from './NumberInput';

interface Props {
  submitTarget: string;
  enabled: boolean;
}

export default function Products({ submitTarget, enabled }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form method='get' action={submitTarget} ref={formRef}>
      <div>
        {/* sol
        <div>
          {products.map(product => {
            return (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p >
                  <span>{product.priceSol} SOL</span>
                  {product.unitName && <span> /{product.unitName}</span>}
                </p>
                <div ='mt-1'>
                  <NumberInput name={product.id} formRef={formRef} />
                </div>
              </div>
            )
          })}

        </div> */}

        {/* usd */}
        <div>
          {products.map(product => {
            return (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>
                  {/* We updated the next line */}
                  <span>${product.priceUsd}</span>
                  {product.unitName && <span> /{product.unitName}</span>}
                </p>
                <div>
                  <NumberInput name={product.id} formRef={formRef} />
                </div>
              </div>
            )
          })}
        </div>

        <button
          disabled={!enabled}
        >
          Checkout
        </button>
      </div>
    </form>
  )
}
