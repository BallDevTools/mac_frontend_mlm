# MML
# สำหรับ repository ที่มีอยู่แล้ว
git add .
git commit -m "Prepare for deployment"
git push origin main

# หากต้องการ deploy ไปยัง branch เฉพาะ (เช่น production)
git checkout -b production
git merge main
git push origin production

# หากใช้ Heroku
git push heroku main

# หากใช้ GitHub Pages
git subtree push --prefix dist origin gh-pages