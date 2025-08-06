import React, { useEffect, useState } from 'react';

interface MatrixChar {
  id: number;
  char: string;
  x: number;
  animationDelay: number;
}

const MatrixBackground = () => {
  const [matrixChars, setMatrixChars] = useState<MatrixChar[]>([]);

  useEffect(() => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
    const newMatrixChars: MatrixChar[] = [];

    for (let i = 0; i < 50; i++) {
      newMatrixChars.push({
        id: i,
        char: chars[Math.floor(Math.random() * chars.length)],
        x: Math.random() * 100,
        animationDelay: Math.random() * 3,
      });
    }

    setMatrixChars(newMatrixChars);
  }, []);

  return (
    <div className="matrix-bg">
      {matrixChars.map((char) => (
        <div
          key={char.id}
          className="matrix-char"
          style={{
            left: `${char.x}%`,
            animationDelay: `${char.animationDelay}s`,
            fontSize: `${Math.random() * 20 + 10}px`,
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

export default MatrixBackground;