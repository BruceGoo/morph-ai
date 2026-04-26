# Morph AI - 部署指南

## 快速部署到 Vercel

### 1. 准备工作

确保你已经有以下账号和服务：
- GitHub 账号
- Vercel 账号
- PostgreSQL 数据库（推荐 Neon 或 Supabase）
- Stripe 账号
- PayPal 开发者账号
- Replicate API 密钥
- Cloudflare R2 存储桶

### 2. 部署步骤

#### 2.1 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### 2.2 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量（见下方）

#### 2.3 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Replicate AI
REPLICATE_API_TOKEN=your_replicate_token

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET_NAME=morph-ai-images
CLOUDFLARE_PUBLIC_URL=https://your-bucket.r2.dev

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_xxx

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=P-xxx
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=P-xxx

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

#### 2.4 部署数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 推送数据库 schema
npx prisma db push

# 创建管理员账号（可选）
# 在部署后通过注册页面创建账号，然后在数据库中手动将 role 改为 ADMIN
```

### 3. 配置 Webhook

#### Stripe Webhook

1. 访问 Stripe Dashboard → Developers → Webhooks
2. 添加端点：`https://your-domain.vercel.app/api/payment/stripe/webhook`
3. 选择事件：
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. 复制 Webhook 签名密钥到 `STRIPE_WEBHOOK_SECRET`

#### PayPal Webhook

1. 访问 PayPal Developer Dashboard → Webhooks
2. 添加 Webhook URL：`https://your-domain.vercel.app/api/payment/paypal/webhook`
3. 选择事件类型：
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.UPDATED`

### 4. 配置 Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
5. 添加授权重定向 URI：
   - `https://your-domain.vercel.app/api/auth/callback/google`
6. 复制 Client ID 和 Client Secret

### 5. 配置 Cloudflare R2

1. 登录 Cloudflare Dashboard
2. 创建 R2 存储桶
3. 生成 API 令牌（权限：R2 读写）
4. 配置公共访问（可选）或使用预签名 URL

### 6. 配置 Replicate

1. 访问 [replicate.com](https://replicate.com)
2. 创建账号并获取 API token
3. 添加到环境变量

## 本地开发

### 使用 Docker Compose

```bash
# 启动数据库和应用
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 手动启动

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 启动开发服务器
npm run dev
```

## 生产环境优化

### 1. 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_generation_user_id ON "Generation"("userId");
CREATE INDEX idx_generation_created_at ON "Generation"("createdAt");
CREATE INDEX idx_generation_category ON "Generation"("category");
CREATE INDEX idx_like_user_generation ON "Like"("userId", "generationId");
```

### 2. 缓存策略

在 `next.config.ts` 中配置：

```typescript
const nextConfig = {
  images: {
    domains: ['your-bucket.r2.dev'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: true,
  },
}
```

### 3. CDN 配置

- 使用 Cloudflare CDN 加速静态资源
- 配置图片 CDN（R2 自带 CDN）
- 启用 Vercel Edge Network

### 4. 监控和日志

推荐工具：
- **Sentry**: 错误追踪
- **LogRocket**: 用户会话回放
- **Vercel Analytics**: 性能监控
- **Prisma Pulse**: 数据库监控

## 安全检查清单

- [ ] 所有环境变量已正确配置
- [ ] 数据库连接使用 SSL
- [ ] Webhook 签名验证已启用
- [ ] CORS 策略已配置
- [ ] Rate limiting 已启用
- [ ] 敏感数据已加密
- [ ] 定期备份数据库
- [ ] 启用 HTTPS（Vercel 自动）
- [ ] 配置 CSP 头部

## 性能优化

### 图片优化

```typescript
// 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Generated"
  width={800}
  height={800}
  quality={85}
  loading="lazy"
/>
```

### API 缓存

```typescript
// 在 API 路由中添加缓存头
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 格式
   - 确认数据库服务器可访问
   - 检查防火墙规则

2. **AI 生成失败**
   - 验证 REPLICATE_API_TOKEN
   - 检查 API 配额
   - 查看 Replicate 日志

3. **支付失败**
   - 验证 Webhook 配置
   - 检查 API 密钥
   - 查看 Stripe/PayPal 日志

4. **图片上传失败**
   - 检查 R2 凭据
   - 验证存储桶权限
   - 检查文件大小限制

## 扩展性建议

### 水平扩展

- 使用 Vercel 的自动扩展
- 配置数据库连接池
- 使用 Redis 缓存（可选）

### 队列系统

对于大量 AI 生成请求，考虑使用：
- **Upstash Redis**: 消息队列
- **Inngest**: 后台任务
- **BullMQ**: 作业队列

## 监控指标

关键指标：
- API 响应时间
- AI 生成成功率
- 支付转化率
- 用户留存率
- 错误率
- 数据库查询性能

## 备份策略

### 数据库备份

```bash
# 每日自动备份
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 上传到 S3/R2
aws s3 cp backup_$(date +%Y%m%d).sql s3://backups/
```

### 代码备份

- 使用 Git 版本控制
- 定期推送到 GitHub
- 创建发布标签

## 成本优化

### 估算月度成本

- **Vercel Pro**: $20/月
- **数据库 (Neon)**: $19-69/月
- **Cloudflare R2**: $0.015/GB 存储
- **Replicate**: 按使用量计费
- **Stripe**: 2.9% + $0.30/交易
- **PayPal**: 2.9% + $0.30/交易

### 节省成本建议

1. 使用 Cloudflare R2 替代 AWS S3（便宜 10 倍）
2. 优化 AI 模型调用（使用更快的模型）
3. 实施缓存策略减少数据库查询
4. 使用 Vercel 的免费额度

## 联系支持

如有问题，请联系：
- Email: support@morph.ai
- GitHub Issues: [项目地址]
- Discord: [社区链接]
