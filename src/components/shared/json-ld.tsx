/* Серверний компонент: рендерить JSON-LD у розмітку сторінки.
   Дані — наші власні об'єкти зі src/lib/schema.ts, тому єдине, від чого
   треба захиститись, — це послідовність "</" усередині рядків. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
