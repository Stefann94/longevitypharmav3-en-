"use client";

import { useState } from 'react';
import styles from './ProductPage.module.css';

export default function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    // Dacă apăsăm pe aceeași întrebare, o închidem. Altfel, o deschidem pe cea nouă.
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      {faqs.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div key={index} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
            <button 
              className={styles.faqSummaryBtn} 
              onClick={() => toggleFAQ(index)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span className={styles.faqIcon}></span>
            </button>
            <div className={styles.faqAnswerWrapper}>
              <div className={styles.faqAnswerInner}>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
