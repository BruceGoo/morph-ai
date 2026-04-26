# Morph AI - AI 图片变身平台

基于 Next.js 构建的 AI 图片变换 Web 应用，支持平行宇宙、AI 恶搞、瞬间换装三大功能，集成 Stripe + PayPal 双支付渠道，支持中英文切换。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js (App Router + Turbopack) |
| 语言 | TypeScript |
| 数据库 | SQLite（开发）/ 可切换 PostgreSQL（生产） |
| ORM | Prisma |
| 认证 | NextAuth.js v5 |
| 支付 | Stripe + PayPal |
| AI | Replicate（Flux Schnell 模型） |
| 存储 | Cloudflare R2 / AWS S3 |
| 样式 | Tailwind CSS + Framer Motion |

---

## 项目结构

```
morph-ai/
├── app/                          # Next.js App Router 页面
│   ├── page.tsx                  # 首页
│   ├── layout.tsx                # 根布局（SessionProvider + ConfigProvider）
│   ├── globals.css               # 全局样式
│   ├── create/page.tsx           # 创作页面（上传图片 + 选模板 + 生成）
│   ├── community/page.tsx        # 社区画廊
│   ├── pricing/page.tsx          # 定价页面
│   ├── settings/page.tsx         # 用户设置
│   ├── auth/
│   │   ├── signin/page.tsx       # 登录页
│   │   └── signup/page.tsx       # 注册页
│   ├── admin/
│   │   ├── page.tsx              # 管理员概览（统计数据）
│   │   ├── users/page.tsx        # 用户管理
│   │   └── payments/page.tsx     # 支付记录管理
│   └── api/                      # API 路由
│       ├── auth/[...nextauth]/   # NextAuth 处理器
│       ├── auth/signup/          # 邮箱注册接口
│       ├── generate/             # AI 图片生成接口
│       ├── community/
│       │   ├── feed/             # 社区动态
│       │   └── like/             # 点赞
│       ├── payment/
│       │   ├── stripe/           # Stripe 结账 + Webhook
│       │   └── paypal/           # PayPal 订阅
│       └── admin/
│           ├── stats/            # 统计数据
│           ├── users/            # 用户管理
│           ├── payments/         # 支付记录
│           └── payment-config/   # 支付配置（管理员切换支付渠道）
│
├── components/
│   ├── header.tsx                # 全局导航（含语言切换、用户菜单）
│   └── ui/button.tsx             # UI 基础组件
│
├── lib/
│   ├── auth.ts                   # ★ NextAuth v5 配置（登录逻辑在这里）
│   ├── stripe.ts                 # ★ Stripe 配置 + 订阅套餐定义
│   ├── paypal.ts                 # ★ PayPal 配置 + 订阅接口封装
│   ├── ai-service.ts             # Replicate AI 调用（Flux Schnell）
│   ├── storage.ts                # Cloudflare R2 / S3 文件上传
│   ├── prompts.ts                # AI 生成提示词模板
│   ├── prisma.ts                 # Prisma 客户端单例
│   ├── config-context.tsx        # 全局配置 Context（主题 + 语言）
│   ├── themes.ts                 # 主题配置
│   ├── i18n.ts                   # 中英文翻译文本
│   └── utils.ts                  # 工具函数
│
├── prisma/
│   ├── schema.prisma             # 数据库模型定义
│   └── seed.ts                   # 初始数据脚本
│
├── .env                          # 环境变量（不提交 Git）
├── .env.example                  # 环境变量模板
├── next.config.ts                # Next.js 配置
├── Dockerfile                    # Docker 部署
├── docker-compose.yml            # Docker Compose
└── DEPLOYMENT.md                 # 部署文档
```

---

## 环境变量配置

复制模板文件并填写：

```bash
cp .env.example .env
```

### 完整 `.env` 说明

```env
# ── AI 生成 ──────────────────────────────────
REPLICATE_API_TOKEN=         # Replicate API Key，用于调用 Flux Schnell 图片生成
OPENAI_API_KEY=              # 备用（暂未使用）

# ── 数据库 ────────────────────────────────────
DATABASE_URL=file:./dev.db   # 开发用 SQLite；生产改为 PostgreSQL 连接串

# ── 图片存储（Cloudflare R2 / AWS S3）─────────
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET_NAME=morph-ai-images
CLOUDFLARE_PUBLIC_URL=       # 存储桶公开访问地址

# ── 登录认证 ──────────────────────────────────
NEXTAUTH_URL=http://localhost:3000   # 本地开发地址；部署时改为正式域名
NEXTAUTH_SECRET=                     # 随机字符串，用于加密 JWT（必填）
GOOGLE_CLIENT_ID=                    # Google OAuth 客户端 ID
GOOGLE_CLIENT_SECRET=                # Google OAuth 客户端 Secret

# ── Stripe 支付 ───────────────────────────────
STRIPE_SECRET_KEY=                   # Stripe 后端密钥（sk_...）
STRIPE_PUBLISHABLE_KEY=              # Stripe 前端公钥（pk_...）
STRIPE_WEBHOOK_SECRET=               # Stripe Webhook 签名密钥（whsec_...）
STRIPE_PRICE_PRO_MONTHLY=            # Pro 月付 Price ID（price_...）
STRIPE_PRICE_PRO_YEARLY=             # Pro 年付 Price ID（price_...）

# ── PayPal 支付 ───────────────────────────────
PAYPAL_CLIENT_ID=                    # PayPal 应用 Client ID
PAYPAL_CLIENT_SECRET=                # PayPal 应用 Secret
PAYPAL_MODE=sandbox                  # sandbox（测试）| live（生产）
PAYPAL_PLAN_PRO_MONTHLY=             # PayPal 月付订阅计划 ID（P-...）
PAYPAL_PLAN_PRO_YEARLY=              # PayPal 年付订阅计划 ID（P-...）

# ── 管理员 ────────────────────────────────────
ADMIN_EMAIL=admin@morph.ai           # 该邮箱注册后自动获得 ADMIN 权限
```

---

## 登录配置

配置文件：`lib/auth.ts`

支持两种登录方式：

### 1. 邮箱 + 密码
无需额外配置，注册接口在 `app/api/auth/signup/route.ts`，密码使用 bcrypt 加密存储。

### 2. Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 客户端，回调地址填：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
3. 将 Client ID 和 Secret 填入 `.env`

登录页地址：`/auth/signin`，注册页：`/auth/signup`

---

## 支付配置

### Stripe 配置步骤

1. 注册 [Stripe](https://dashboard.stripe.com/) 账号
2. 在 Dashboard → Products 中创建订阅产品，生成 **Price ID**
3. 在 Dashboard → Developers → API Keys 获取密钥
4. 设置 Webhook：
   - 端点：`https://你的域名/api/payment/stripe/webhook`
   - 监听事件：`checkout.session.completed`、`customer.subscription.updated`
5. 将所有密钥填入 `.env`

### PayPal 配置步骤

1. 注册 [PayPal Developer](https://developer.paypal.com/) 账号
2. 创建应用，获取 Client ID 和 Secret
3. 在 PayPal Dashboard → Subscriptions 中创建订阅计划，获取 **Plan ID**
4. 将配置填入 `.env`，`PAYPAL_MODE` 测试阶段用 `sandbox`

### 管理员切换支付渠道

登录管理员账号后访问 `/admin/payments`，可在 Stripe 和 PayPal 之间切换默认支付渠道，无需修改代码。

---

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入必要配置

# 3. 初始化数据库
npx prisma generate
npx prisma db push

# 4. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 数据库模型

| 模型 | 说明 |
|------|------|
| `User` | 用户信息、订阅状态、使用量 |
| `Account` | OAuth 账号关联（NextAuth） |
| `Session` | 会话（NextAuth） |
| `Generation` | AI 生成记录（含原图/结果图/模板） |
| `Like` | 点赞记录 |
| `Comment` | 评论 |
| `Payment` | 支付记录（Stripe / PayPal） |
| `SystemConfig` | 系统配置（支付渠道等） |

---

## 订阅套餐

| | Free | Pro | Enterprise |
|---|---|---|---|
| 每日生成次数 | 5 次 | 无限 | 无限 |
| 图片质量 | 720p | 4K | 4K |
| 水印 | 有 | 无 | 无 |
| 月付价格 | 免费 | $19.99 | 定制 |
| 年付价格 | 免费 | $199.99 | 定制 |

---

## 管理员功能

访问 `/admin`（需要 ADMIN 角色）：

- **概览**：总用户数、生成次数、收入统计
- **用户管理** `/admin/users`：查看、封禁用户
- **支付记录** `/admin/payments`：查看所有交易记录
- **支付配置**：在线切换 Stripe / PayPal

设置管理员：在 `.env` 中配置 `ADMIN_EMAIL`，该邮箱注册后自动获得管理员权限。

---

## 部署

### Vercel（推荐）

```bash
# 推送代码到 GitHub 后，在 Vercel 导入项目
# 在 Vercel 控制台添加所有环境变量
# 将 DATABASE_URL 改为 PostgreSQL 连接串（推荐 PlanetScale / Neon）
```

### Docker

```bash
docker build -t morph-ai .
docker run -p 3000:3000 --env-file .env morph-ai

# 或使用 docker-compose
docker-compose up -d
```

---

## 支持

- 邮件：support@morph.ai
- 销售咨询：sales@morph.ai
