# NutriSense

NutriSense is a full-stack nutrition-focused web application designed to help users make healthier food choices with a smooth and user-friendly experience.

## 🚀 Features

- User-friendly interface for nutrition-related interactions
- Full-stack architecture with separate client and server
- Database integration using Prisma
- Environment-based configuration for secure setup
- Scalable project structure for future enhancements

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, JavaScript
- **Database ORM:** Prisma

## 📁 Project Structure

```text
NutriSense/
├── client/          # Frontend application
├── server/          # Backend application / APIs
├── prisma/          # Prisma schema and migrations
├── .env.example     # Sample environment variables
├── package.json     # Project metadata and scripts
└── strip.js         # Utility / integration script
```

## ⚙️ Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/RupamCodes/NutriSense.git
cd NutriSense
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env` file from the sample:

```bash
cp .env.example .env
```

Then update the values in `.env` as needed.

### 4) Set up Prisma

If Prisma is configured in this project, run:

```bash
npx prisma generate
npx prisma migrate dev
```

### 5) Run the project

Use the scripts available in `package.json`.

Common examples:

```bash
npm run dev
```

or

```bash
npm start
```

> If scripts differ, check the exact commands in `package.json`.

## 🔮 Future Improvements

- Personalized nutrition recommendations
- Meal planning and tracking
- Authentication and user profiles
- Improved analytics and dashboards

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes
4. Push your branch
5. Open a Pull Request

## 📄 License

This project is currently unlicensed. You can add a license (e.g., MIT) based on your preference.
