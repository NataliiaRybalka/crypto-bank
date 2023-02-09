import React, { useState } from 'react';

interface Props {
  name: string,
  formRef: React.RefObject<HTMLFormElement>,
}

export default function NumberInput({ name, formRef }: Props) {
  const [number, setNumber] = useState(0)

  function decrement() {
    setNumber(n => n > 0 ? n - 1 : 0)
  }

  function increment() {
    setNumber(n => n + 1)
  }

  function handleKeyboard(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      formRef.current?.submit();
    }
  }

  return (
    <div>
      <button
        type='button'
        tabIndex={-1}
        onClick={decrement}
        onKeyDown={handleKeyboard}
      >
        <span>−</span>
      </button>
      <input
        type='number'
        name={name}
        value={number}
        onChange={e => setNumber(Number(e.target.value))}
        min={0}
      />
      <button
        type='button'
        tabIndex={-1}
        onClick={increment}
        onKeyDown={handleKeyboard}
      >
        <span>+</span>
      </button>
    </div>
  )
}
