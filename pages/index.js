import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [result2, setResult2] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    setResult("Q：" + animalInput);
    setAnimalInput("");
    setResult2("Wait...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: animalInput }),
    });
    const data = await response.json();
    setResult2("A：" + data.result);
  }

  return (
    <div>
      <Head>
        <title>Ask</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Ask your question</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an question"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Ask" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.result}>{result2}</div>
      </main>
    </div>
  );
}
