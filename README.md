# Lenormand Reading Assistant | 雷诺曼读牌助手

AI-powered Lenormand card reading with camera recognition and multi-language support (Chinese, English, Korean).

## 🚀 Quick Start - Run Locally

### Prerequisites
- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or bun

### Installation & Running

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install
# or if you have bun installed:
bun install

# 3. Start the development server
npm run dev
# or with bun:
bun dev

# 4. Open your browser
# The app will automatically open at http://localhost:8080
```

That's it! The app should now be running locally. 🎉

### Troubleshooting

**Port already in use?**
```sh
# Kill the process using port 8080
# On Mac/Linux:
lsof -ti:8080 | xargs kill -9
# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Dependencies not installing?**
```sh
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment issues?**
- Make sure you're using Node.js 18 or higher: `node --version`
- The `.env` file is auto-generated, don't edit it manually

## 📝 Project Info

**URL**: https://lovable.dev/projects/645caa32-be26-405a-be8a-ac3873c7a75d

## ✏️ How to Edit

### Use Lovable (Recommended)
Visit [Lovable Project](https://lovable.dev/projects/645caa32-be26-405a-be8a-ac3873c7a75d) and start prompting. Changes are automatically committed.

### Use Your IDE
Clone the repo, make changes, and push. Changes sync with Lovable automatically.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/645caa32-be26-405a-be8a-ac3873c7a75d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
