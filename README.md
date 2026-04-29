# FinanceOS 💰

Personal finance dashboard built with React, Vite, Tailwind CSS, and Recharts.

## Features

- 📊 Dashboard with KPIs, area chart, and donut chart
- 💳 Transaction management (add, delete, filter, search)
- 📈 Analytics with monthly comparison and category breakdown
- 📂 Excel import (.xlsx, .xls, .csv)
- 🌙 Dark / Light mode toggle
- 💱 Multi-currency support (MXN, USD, EUR, GBP, CAD)

## Tech Stack

| Tech | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| Recharts | Charts |
| xlsx | Excel import |
| Firebase | Database (coming soon) |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure
src/
├── context/
│ └── AppContext.jsx # Global state (theme, currency, transactions)
├── components/
│ ├── Sidebar.jsx # Navigation, currency selector, theme toggle
│ └── KPICard.jsx # Reusable KPI card component
├── pages/
│ ├── Dashboard.jsx # Main dashboard view
│ ├── Transactions.jsx # Transaction list and form
│ ├── Analytics.jsx # Charts and analytics
│ └── ImportExcel.jsx # Excel file import
└── index.css # Design tokens and global styles

