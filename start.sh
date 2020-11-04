cd frontend
npm run build
mv -i build ../backend/
cd ..
cd backend
node ./src/index.js