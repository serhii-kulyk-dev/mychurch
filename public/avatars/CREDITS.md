# Обличчя в демо-екранах

Вісім портретів із Unsplash. Головний критерій — усмішка і денне
світло: темні «художні» портрети в кружечку 24 px виглядають похмуро,
і перший набір саме через це й переробили. Різний вік, чотири
чоловіки й чотири жінки. Ліцензія Unsplash дозволяє
комерційне використання без дозволу й без обов'язкової згадки автора —
згадка тут для нас: щоб знати, що і звідки, і мати чим замінити.

Кадр робить сам Unsplash (`fit=facearea&facepad=3.2`), далі 192×192,
насиченість −8 %, webp. Замінити одне обличчя — це один `curl`:

```
https://images.unsplash.com/<photo-slug>?w=384&h=384&fit=facearea&facepad=3.2&q=85&fm=jpg
```

Фото на білому тлі не беремо: у білій картці голова «висить» без краю.
Стать і вік кожного фото прописані в `AVATAR_LOOKS`
(`src/components/shared/person-avatar.tsx`) — звідти їх бере `lookFor(ім'я)`.
Міняючи фото, міняй і ці поля.

| файл | роль | автор | сторінка |
| --- | --- | --- | --- |
| a1.webp | чоловік, ~25 | Nicolas Horn | https://unsplash.com/photos/MTZTGvDsHFY |
| a2.webp | жінка, ~25 | Tessa Edmiston | https://unsplash.com/photos/CLgGgEtnD6Y |
| a3.webp | чоловік, ~22 | Alireza Npa | https://unsplash.com/photos/OYG4USKsPX8 |
| a4.webp | чоловік, ~45 | Kam Star | https://unsplash.com/photos/Lol1HZqfgiA |
| a5.webp | жінка, ~28 | Jonathan Cooper | https://unsplash.com/photos/uPjEyv7Pgx4 |
| a6.webp | жінка, ~65 | Vidak | https://unsplash.com/photos/vsfbqZ1YOnU |
| a7.webp | чоловік, ~60 | Christian Buehner | https://unsplash.com/photos/g_0aZYewvyg |
| a8.webp | жінка, ~50 | Murat Ts. | https://unsplash.com/photos/QF0_XKNG9hc |

Це живі люди, які не мають стосунку до жодної церкви. Тому:

- обличчя стоять тільки в демо-екранах продукту, поруч з вигаданими
  іменами, і ніде не подані як наші клієнти, свідчення чи амбасадори;
- відгуки, цитати й фото церкви-амбасадора — окремі, справжні й з
  атрибуцією (`public/ambassadors`);
- дітей у цьому наборі немає навмисно: у демо дитина в сім'ї показана
  літерою, а не чужим обличчям.
