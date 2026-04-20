# 📱 تطبيق الطالب (Student App) - English Platform

هذا التطبيق هو التطبيق المخصص للطلبة للمنصة التعليمية الخاصة بالأستاذ محمد الجندي.
تم بناءه باستخدام **Vue 3**, **Quasar**, وتم إعداده كليا ليكون **تطبيق هاتف (Mobile-First)** باستخدام **Capacitor**.

> ⚠️ **ملاحظة للمطورين**: هذا التطبيق لا يزال في المراحل الأولى من التطوير حالياً، وتم إعداد البنية التحتية له فقط وسيتم بناء الصفحات فيه بشكل تدريجي وموازٍ لتطور الـ Backend.

---

## 🛠️ أوامر التشغيل الأساسية

```bash
# تثبيت الحزم
npm install

# التشغيل في بيئة التطوير (يفتح على المنفذ 9001 عادة)
npm run dev

# بناء الويب
npm run build

# تشغيل نسخة الموبايل (Capacitor) للأندرويد
npx cap sync android
npx cap open android
```

---

## 📂 شرح الهيكل الحالي (Pages & Stores)

بنية تطبيق الطالب مبسطة جداً حالياً، وكل الملفات الخاصة بالكود توجد داخل مجلد `src/`. بناءً على قواعد المشروع (`SKILL.md`) فالتصميم للموبايل ومراعاة اللغة العربية (RTL).

### 📄 1. صفحات التطبيق (Pages - `src/pages/`)
وهي الملفات المسئولة عن واجهة المستخدم التي سيراها الطالب:

| اسم الملف | المسار (Route) | الوظيفة |
|---|---|---|
| **الرئيسية والمصادقة** |
| `auth/LoginPage.vue` | `/login` | تسجيل دخول الطالب برقم الهاتف والباسورد |
| `auth/RegisterPage.vue` | `/register` | إنشاء حساب جديد واختيار المرحلة الدراسية |
| `home/HomePage.vue` | `/` | الصفحة الرئيسية للطالب (Dashboard)، تحتوي على الإحصائيات، زر QR الحضور، وروابط سريعة لأقسام التطبيق |
| **المحتوى العلمي** |
| `content/SectionsPage.vue` | `/sections` | عرض الوحدات/الكورسات المتاحة للطالب |
| `content/LessonPage.vue` | `/lessons/:id` | عرض تفاصيل الدرس وتشغيل الفيديو عبر Bunny Stream |
| `content/MaterialsPage.vue` | `/materials` | استعراض وتحميل الملازم والملفات (PDFs) المرفوعة للسنة الدراسية |
| **الامتحانات والتدريب** |
| `exams/ExamsPage.vue` | `/exams` | قائمة الامتحانات المتاحة للطالب وحالته فيها |
| `exams/ExamPage.vue` | `/exams/:id` | بدء أو استئناف امتحان |
| `exams/QuestionBanksPage.vue`| `/question-banks` | تصفح بنوك الأسئلة المتاحة للتدريب |
| `exams/QuestionBankSolvePage.vue`| `/question-banks/:id` | نظام البطاقات للتدريب الفوري (إظهار الصح والخطأ والملاحظات) |
| **الملف الشخصي والحضور** |
| `profile/AttendancePage.vue` | `/attendance` | سجل حضور الطالب للحصص السنتر |
| `profile/CodesPage.vue` | `/codes` | شحن وعرض رصيد الأكواد للطالب |
| `profile/ProfilePage.vue` | `/profile` | الملف الشخصي للطالب وإعدادات الحساب |

### 🗃️ 2. المتاجر الذكية (Stores - `src/stores/`)
وهي المتاجر (Pinia) التي تُبقي بيانات التطبيق نشطة وتتصل بـ API الـ Backend:

| المتجر | الوظيفة |
|---|---|
| `auth.js` | إدارة الـ JWT Token وبيانات الطالب المسجل. |
| `student.js` | متجر شامل يحتوي على عدة تعريفات (Stores) مثل:<br>- `useStudentContentStore` (الدروس والفيديوهات)<br>- `useStudentExamsStore` (الامتحانات)<br>- `useStudentProfileStore` (الملف الشخصي والحضور والأكواد)<br>- `useStudentMaterialsStore` (الملازم والملفات)<br>- `useStudentQuestionBanksStore` (بنوك الأسئلة والتدريب) |

| `student.js` | متجر شامل يحتوي على عدة تعريفات (Stores) مثل:<br>- `useStudentContentStore` (الدروس والفيديوهات)<br>- `useStudentExamsStore` (الامتحانات)<br>- `useStudentProfileStore` (الملف الشخصي والحضور والأكواد)<br>- `useStudentMaterialsStore` (الملازم والملفات)<br>- `useStudentQuestionBanksStore` (بنوك الأسئلة والتدريب) |

---

## 🎨 التحديث التصميمي الشامل (UI/UX Premium Design)

تمت إعادة تصميم التطبيق بالكامل ليعطي إحساساً عصرياً مشابهاً لتطبيقات الموبايل الأصلية (Native-like):
1. **شريط التنقل (Bottom Navigation):** أصبح شريطاً عائماً (Floating) بخلفية زجاجية (Glassmorphism).
2. **الصفحة الرئيسية (Dashboard):** تصميم متداخل (Overlapping) مع قسم Hero علوي متدرج الألوان وأشكال متحركة (Animated Shapes).
3. **ألوان وخطوط:** اعتماد خط `Tajawal` كخط أساسي مع مجموعة ألوان حيوية (Vibrant & Pastel).
4. **دعم الـ SafeArea:** دعم كامل لـ `env(safe-area-inset)` ليناسب شاشات أجهزة الآيفون والأندرويد الحديثة (بدون تداخل مع النوتش).

---

## 🛡️ أنظمة الحماية والأمان (Security Plugins)

تم تزويد تطبيق الطالب بطبقة حماية تمنع تسريب المحتوى:
- **منع لقطات الشاشة (Anti-Screenshot):** تم تثبيت إضافة `@capacitor-community/privacy-screen` والتي تقوم بتسويد الشاشة (Black Screen) فور قيام الطالب بمحاولة أخذ Screenshot أو Screen Record داخل التطبيق.
- **تشفير الفيديوهات:** يعمل التطبيق مع فيديوهات Bunny Stream المشفرة بـ Token ولا يسمح بتشغيلها خارج نطاق التطبيق.

## 🏗️ طريقة إضافة صفحات أو خصائص مستقبلاً
عند البدء في إضافة محتوى طالب في هذا التطبيق يجب الإلتزام بالآتي:
1. **الالتزام بالقواعد (SKILL.md)**: الشاشات يجب أن تصمم بشكل Premium وأن يكون تفكير التصميم موجه حصراً للهاتف.
2. التواصل مع የـ Endpoints في الـ Backend والتي تبدأ حصرياً بـ `/api/student/` بدلاً من `/api/admin/` (والتي سيتم بناؤها تباعاً).
3. تحديث هذا الملف (`README.md`) وإدراج أسماء أي ملفات أو متاجر (Stores) أو صفحات (Pages) يتم إضافتها للمشروع.
