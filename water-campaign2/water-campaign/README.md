# إعداد Firebase (Realtime Database)

1. Authentication ← Sign-in method ← Email/Password ← Enable.
2. Build ← Realtime Database ← Create Database ← اختاري موقع ← **Start in locked mode** ← Enable.
3. تبويب Rules ← الصقي محتوى `database.rules.json` ← Publish.
4. انسخي رابط القاعدة (فوق تبويب Data، يبدأ بـ https:// وينتهي بـ firebaseio.com) والصقيه في `firebase-config.js` مكان databaseURL.
5. Project settings ← Your apps ← Web ← انسخي بقية الإعدادات لنفس الملف.
6. الأدمن: Authentication ← Users ← Add user (إيميل + باسورد). انسخي الـ User UID.
   ثم Realtime Database ← Data ← اضغطي + جنب اسم القاعدة ← Name: `admins` وValue فاضي، ثم + داخله ← Name: الـ UID، Value: true.
7. Authentication ← Settings ← Authorized domains ← أضيفي USERNAME.github.io.
