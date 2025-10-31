# 🏷️ Freitas Outlet

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Freitas Outlet is a modern and responsive e-commerce application built with **Next.js 14**, **Prisma**, **Tailwind CSS**, and **Lucide React**.  
It was designed to display a dynamic shoe catalog with image galleries, animations, and database integration.

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the main page by modifying `app/page.tsx`.  
The page auto-updates as you edit the file.

---

## 🧱 Project Structure

```
freitas-outlet/
├── prisma/
│   └── schema.prisma          # Database models
├── public/
│   └── imgCalcados/           # Product images
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── components/
│   │   │   ├── header/        # Header and navigation
│   │   │   ├── contain/       # Product cards with carousel
│   │   │   └── footer/        # Footer section
│   │   └── action/
│   │       └── get-products.ts  # Fetch products from Prisma
│   └── styles/
│       └── globals.css
└── package.json
```

---

## 🧩 Technologies

- ⚙️ **Next.js 14** – App Router, Server Components & SEO optimization  
- 🧱 **Prisma ORM** – database modeling and querying  
- 🎨 **Tailwind CSS** – modern and responsive styling  
- 🖼️ **Lucide React** – beautiful icons for the UI  
- 💾 **SQLite / PostgreSQL** – database connection  

Example of a Prisma query:
```ts
const products = await prisma.product.findMany({
  include: { images: true },
});
```

---

## 🖥️ Features

✅ Product catalog with image galleries  
✅ Image carousel with navigation buttons and transition animations  
✅ Responsive and dark design  
✅ Database connection via Prisma ORM  
✅ Reusable and clean React components  

---

## ✨ Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)  
to automatically optimize and load [Geist](https://vercel.com/font),  
a new font family created by Vercel.

---

## 📚 Learn More

To learn more about Next.js, check out these resources:

- [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.  
- [Learn Next.js](https://nextjs.org/learn) – an interactive Next.js tutorial.  

You can also visit the [Next.js GitHub repository](https://github.com/vercel/next.js) – your feedback and contributions are welcome!

---

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), created by the same team behind Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 💡 Author

**Arthur Fellipe**  
Frontend & Full Stack Developer  
📧 [Your Email or GitHub Link]

---

🖤 Built with passion for sneakers, clean code, and Next.js.
