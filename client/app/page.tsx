"use client";

import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useState,
} from "react";

function Card({ name, age }: { name: string; age: number }): ReactElement {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}
function StrangeCard({
  age,
  ...props
}: ComponentProps<typeof Card>): ReactElement {
  return <Card age={age * 2} {...props} />;
}

export default function Home(): ReactElement {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    console.log(count);
  }, []);
  return (
    <main>
      <h1>hello!</h1>
      <Card age={30} name="John" />
      <StrangeCard age={25} name="Jane" />
    </main>
  );
}
