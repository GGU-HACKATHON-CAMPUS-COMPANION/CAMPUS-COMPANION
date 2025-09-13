# Campus Companion Backend

## Deployment Instructions

### Environment Variables Required:
```
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

### Deploy to Heroku:
```bash
heroku create campus-companion-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=your_frontend_url
git push heroku main
```

### Deploy to Vercel:
```bash
vercel --prod
```

### Deploy to Railway:
```bash
railway login
railway new
railway add
railway deploy
```

### Local Development:
```bash
npm install
npm run dev
```

### Production:
```bash
npm start
```