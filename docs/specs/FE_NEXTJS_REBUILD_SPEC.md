# Đặc tả tái xây dựng Frontend bằng Next.js

## 1. Mục đích tài liệu

Tài liệu này là đặc tả đủ để xây lại frontend của website portfolio kiến trúc **180 Studio** bằng Next.js và TypeScript mà không cần lần lại source React cũ.

Phạm vi gồm:

- Website công khai: trang chủ, danh sách dự án, chi tiết dự án, About, header/footer.
- Khu quản trị: đăng nhập/đăng xuất, bảo vệ route, quản lý slideshow trang chủ, logo, hồ sơ About và CRUD/sắp xếp dự án.
- Hợp đồng API mà frontend cần dùng với backend NestJS mới.
- Quy tắc hiển thị, trạng thái tải/lỗi, upload ảnh, bảo mật, SEO, responsive và tiêu chí nghiệm thu.

Nguồn khảo sát: toàn bộ `Architecture/frontend/src`, route/controller/model của backend cũ và metadata schema PostgreSQL thực tế. Không coi các lỗi kỹ thuật trong source cũ là nghiệp vụ phải giữ.

## 2. Tóm tắt sản phẩm và nghiệp vụ cần giữ

Website có hai vùng:

1. **Public portfolio**: khách truy cập xem slideshow ảnh kiến trúc ở trang chủ, danh sách dự án theo thứ tự ưu tiên, chi tiết dự án song ngữ và hồ sơ studio.
2. **CMS cho admin**: một quản trị viên đăng nhập bằng email/mật khẩu để quản lý nội dung.

Các quy tắc cốt lõi:

- Chỉ có một logo đang hoạt động.
- Chỉ có một hồ sơ About đang hoạt động.
- Trang chủ hiển thị nhiều ảnh slideshow theo thứ tự.
- Danh sách dự án sắp xếp `priority` tăng dần.
- Mỗi dự án có một ảnh bìa, một bản chi tiết và một danh sách ảnh gallery có thứ tự.
- Nội dung ý tưởng dự án có tiếng Anh và tiếng Việt.
- Route admin chỉ dành cho role `admin`.
- Token xác thực nằm trong cookie `HttpOnly`; frontend không lưu token trong localStorage.

## 3. Các quyết định khi tái xây dựng

| Hạng mục | Source cũ | Bản Next.js mới |
|---|---|---|
| Framework | Create React App, JavaScript | Next.js App Router, TypeScript |
| Render public | CSR sau khi mount | Server render cho dữ liệu đầu trang; Client Component chỉ cho slideshow, popup và form |
| API chi tiết dự án | 3 request riêng | 1 request trả project + detail + images |
| Route chi tiết | `/detail/:id` | `/projects/[id]`; giữ redirect từ URL cũ |
| About | `/about_us` | `/about`; giữ redirect từ URL cũ |
| Upload ảnh | Cloudinary unsigned, hard-code cloud/preset | Gọi API upload có bảo vệ của NestJS; không để secret/preset trong client |
| Sửa dự án | Xóa rồi tạo mới, làm đổi ID | `PATCH`, giữ ID và cập nhật nguyên tử |
| Auth | Kiểm tra `/me` hoàn toàn ở client | Protected admin layout kiểm tra session ở server, client xử lý tương tác |
| Kiểu response | Không thống nhất | Envelope thống nhất `{ data, meta? }` và `{ error }` |

## 4. Nền tảng kỹ thuật đề xuất

- Next.js App Router và TypeScript strict.
- CSS Modules hoặc Tailwind CSS; chỉ chọn một chiến lược chính. Không cần mang Bootstrap sang nếu đã tái hiện đủ layout.
- React Hook Form + Zod cho form admin.
- `next/image` cho ảnh nội dung, khai báo remote image host phù hợp.
- Toast cho phản hồi thao tác; dialog xác nhận có hỗ trợ bàn phím.
- API client dùng `fetch`, tự gắn `credentials: "include"`, timeout và chuẩn hóa lỗi.
- Có ESLint, formatter, unit test và end-to-end test.

Không khóa tài liệu vào một phiên bản package cụ thể; khi khởi tạo hãy dùng các phiên bản ổn định tương thích với nhau.

## 5. Cấu trúc thư mục mục tiêu

```text
src/
  app/
    (public)/
      layout.tsx
      page.tsx                       # /
      projects/page.tsx              # /projects
      projects/[id]/page.tsx         # /projects/:id
      about/page.tsx                 # /about
      not-found.tsx
      error.tsx
    admin/
      login/page.tsx
      (protected)/
        layout.tsx
        page.tsx                     # dashboard
        projects/page.tsx
        projects/new/page.tsx
        projects/[id]/edit/page.tsx
        site/home/page.tsx
        site/logo/page.tsx
        site/about/page.tsx
    layout.tsx
    globals.css
  components/
    public/
      site-header.tsx
      site-footer.tsx
      home-slideshow.tsx
      project-card.tsx
      project-gallery.tsx
      image-lightbox.tsx
      about-profile.tsx
    admin/
      admin-header.tsx
      project-form.tsx
      image-uploader.tsx
      sortable-image-list.tsx
      confirm-dialog.tsx
    shared/
      full-screen-loader.tsx
      empty-state.tsx
      error-state.tsx
  lib/
    api/
      client.ts
      public.ts
      auth.ts
      admin.ts
      contracts.ts
    auth/session.ts
    env.ts
    validation/project.ts
    validation/about.ts
  types/domain.ts
```

Tên thư mục có thể đổi nhưng phải giữ ranh giới public/admin, API, domain type và validation.

## 6. Sơ đồ route

### 6.1 Public

| URL mục tiêu | Quyền | Nội dung | Dữ liệu |
|---|---|---|---|
| `/` | Công khai | Slideshow toàn màn hình | logo + home slides |
| `/projects` | Công khai | Lưới dự án | project summaries |
| `/projects/[id]` | Công khai | Hero, metadata, gallery, mô tả EN/VI | full project detail |
| `/about` | Công khai | Hồ sơ studio/cá nhân | about profile |
| URL khác | Công khai | Trang 404 có link về `/` | không |

Redirect vĩnh viễn để giữ link cũ:

- `/detail/:id` → `/projects/:id`
- `/about_us` → `/about`

Tab `Contact` hiện chưa có nghiệp vụ hoặc dữ liệu thật. Không tạo trang giả. Có thể ẩn tab hoặc trỏ tới vùng liên hệ trong `/about` cho tới khi có đặc tả riêng.

### 6.2 Admin

| URL mục tiêu | Quyền | Chức năng |
|---|---|---|
| `/admin/login` | Chưa đăng nhập | Đăng nhập; nếu session hợp lệ thì chuyển tới dashboard |
| `/admin` | `admin` | Dashboard tóm tắt và liên kết quản trị |
| `/admin/projects` | `admin` | Danh sách, sắp xếp, sửa, xóa dự án |
| `/admin/projects/new` | `admin` | Tạo dự án |
| `/admin/projects/[id]/edit` | `admin` | Sửa dự án, giữ nguyên ID |
| `/admin/site/home` | `admin` | Thêm, xóa, sắp xếp ảnh slideshow |
| `/admin/site/logo` | `admin` | Xem và thay logo |
| `/admin/site/about` | `admin` | Sửa hồ sơ About |

`Settings` trong source cũ chỉ là placeholder nên không thuộc phạm vi bắt buộc.

Protected admin layout phải gọi `GET /api/v1/auth/me` ở server với cookie của request:

- `200` và role `admin`: render.
- `401`: redirect `/admin/login?next=<current-path>`.
- `403`: render trang không có quyền.
- Backend không phản hồi: render error state có nút thử lại, không giả định là đã logout.

## 7. Domain types dùng chung

```ts
export type Id = number;

export interface AssetRef {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface SiteLogo {
  url: string;
  publicId?: string;
}

export interface HomeSlide {
  id: Id;
  image: AssetRef;
  position: number;
}

export interface ProjectSummary {
  id: Id;
  name: string;
  coverImage: AssetRef;
  priority: number;
}

export interface ProjectImage {
  id: Id;
  image: AssetRef;
  position: number;
}

export interface ProjectDetail extends ProjectSummary {
  displayName: string;
  year: number;
  location: string;
  siteArea: string;
  floorArea: string;
  client: string;
  photographer: string;
  ideaTitleEn?: string;
  ideaTitleVi?: string;
  descriptionEn: string;
  descriptionVi: string;
  images: ProjectImage[];
}

export interface AboutProfile {
  avatar?: AssetRef;
  name: string;
  title?: string;
  education: string;
  skills: string;
  experience: string;
  bio: string;
  email: string;
  studioPhone: string;
  personalPhone: string;
  website: string;
  address: string;
}

export interface AuthUser {
  id: Id;
  email: string;
  role: "admin";
}

export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}
```

## 8. Hợp đồng API frontend sử dụng

Base URL lấy từ `API_BASE_URL` ở server. Chỉ biến thực sự cần lộ ra browser mới dùng tiền tố `NEXT_PUBLIC_`.

### 8.1 Public và auth

| Method | Endpoint | Response `data` |
|---|---|---|
| GET | `/api/v1/site/logo` | `SiteLogo` |
| GET | `/api/v1/site/home-slides` | `HomeSlide[]` theo `position ASC` |
| GET | `/api/v1/projects` | `ProjectSummary[]` theo `priority ASC, id ASC` |
| GET | `/api/v1/projects/:id` | `ProjectDetail` đã gồm gallery |
| GET | `/api/v1/about` | `AboutProfile` |
| POST | `/api/v1/auth/login` | `AuthUser`; đồng thời set cookie |
| GET | `/api/v1/auth/me` | `AuthUser` |
| POST | `/api/v1/auth/refresh` | `AuthUser`; rotate cookie |
| POST | `/api/v1/auth/logout` | `{ success: true }`; clear cookie |

Login request:

```json
{
  "email": "admin@example.com",
  "password": "secret"
}
```

### 8.2 Admin

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/api/v1/admin/media/images` | Upload một ảnh multipart, trả `AssetRef` |
| PUT | `/api/v1/admin/site/logo` | Thay logo hiện tại |
| POST | `/api/v1/admin/site/home-slides` | Thêm slide |
| PATCH | `/api/v1/admin/site/home-slides/reorder` | Sắp xếp slide |
| DELETE | `/api/v1/admin/site/home-slides/:id` | Xóa slide |
| PUT | `/api/v1/admin/about` | Thay toàn bộ hồ sơ About |
| GET | `/api/v1/admin/projects` | Danh sách dành cho CMS |
| GET | `/api/v1/admin/projects/:id` | Dữ liệu đầy đủ để điền form sửa |
| POST | `/api/v1/admin/projects` | Tạo dự án nguyên tử |
| PATCH | `/api/v1/admin/projects/:id` | Cập nhật dự án, giữ ID |
| DELETE | `/api/v1/admin/projects/:id` | Xóa dự án và dữ liệu con |
| PATCH | `/api/v1/admin/projects/reorder` | Cập nhật priority |

Payload tạo/sửa dự án:

```json
{
  "name": "Project name on listing",
  "coverImage": { "url": "https://...", "publicId": "portfolio/covers/x" },
  "priority": 10,
  "displayName": "Project name on detail",
  "year": 2025,
  "location": "Ho Chi Minh City",
  "siteArea": "120 m²",
  "floorArea": "300 m²",
  "client": "Private client",
  "photographer": "Photographer name",
  "ideaTitleEn": "Idea",
  "ideaTitleVi": "Ý tưởng",
  "descriptionEn": "Multiline English text",
  "descriptionVi": "Nội dung tiếng Việt nhiều dòng",
  "images": [
    { "url": "https://...", "publicId": "portfolio/projects/x/1", "position": 0 }
  ]
}
```

Payload reorder:

```json
{
  "items": [
    { "id": 8, "position": 0 },
    { "id": 3, "position": 1 }
  ]
}
```

Frontend phải xử lý ít nhất các status: `400` validation, `401` chưa đăng nhập, `403` sai role/CSRF, `404` không tồn tại, `409` xung đột, `413` ảnh quá lớn, `422` file sai loại, `429` quá nhiều request và `500` lỗi hệ thống.

## 9. Đặc tả từng màn hình public

### 9.1 Header/footer dùng chung

- Header cao xấp xỉ `90px` trên desktop.
- Logo ở giữa; click về `/`. Dùng logo từ API, fallback text `180 STUDIO` nếu chưa cấu hình.
- Menu desktop ở bên trái/phía dưới: `Projects`, `About`, `Contact` nếu đã có đích hợp lệ.
- Mobile phải có menu thu gọn; source cũ không xử lý tốt trường hợp logo/menu quá chật.
- Footer nền tối, chữ sáng, căn giữa. Nội dung bản quyền lấy từ cấu hình hoặc dùng `© <current year> 180 Studio. All rights reserved.`; không hard-code năm 2025.
- Link, nút và menu có focus state, aria label và vùng bấm tối thiểu phù hợp mobile.

### 9.2 Trang chủ `/`

- Hiển thị slideshow phủ vùng nhìn chính; ảnh `cover`, căn giữa.
- Lấy danh sách theo `position ASC`.
- Preload ảnh đầu tiên trước khi bỏ full-screen loader.
- Mỗi ảnh hiển thị khoảng 4 giây; hiệu ứng fade khoảng 600–1000 ms.
- Không chạy timer khi tab bị ẩn; tôn trọng `prefers-reduced-motion` bằng cách tắt animation hoặc giảm chuyển động.
- Không có slide: hiển thị empty state có thương hiệu, không để loader vô hạn.
- Ảnh lỗi: bỏ qua ảnh lỗi và chuyển sang ảnh tiếp theo.

### 9.3 Danh sách `/projects`

- Desktop/tablet: 2 cột như source cũ; mobile: 1 cột.
- Ảnh bìa tỷ lệ khoảng `2:1`, `object-fit: cover`, góc vuông.
- Tên dự án nằm trên lớp nền đen mờ ở góc dưới trái.
- Toàn card click được, dẫn tới `/projects/:id`.
- Thứ tự tuyệt đối theo API; không tự sort theo tên ở client.
- Có skeleton/loading, empty state và retry state.

### 9.4 Chi tiết `/projects/[id]`

- Hero toàn viewport dùng gallery; ảnh đầu tiên xuất hiện đầu tiên, sau đó tự luân phiên mỗi 4 giây.
- Phần dưới hero chia tối đa 3 cột desktop:
  1. Tên, năm, địa điểm, site area, floor area, client, photographer và gallery thumbnail.
  2. Tiêu đề/nội dung tiếng Anh.
  3. Tiêu đề/nội dung tiếng Việt.
- Mobile xếp dọc theo đúng thứ tự trên.
- Bảo toàn xuống dòng của hai đoạn mô tả (`white-space: pre-wrap` hoặc render paragraph an toàn).
- Gallery thumbnail 2 cột, click mở lightbox; Escape/overlay/nút close đều đóng được; khóa scroll nền khi mở.
- Không dùng HTML thô từ API. Nếu sau này hỗ trợ rich text phải sanitize.
- `404` từ API render trang not-found dự án; không dùng error page chung cho trường hợp không tồn tại.
- Metadata/OG nên dùng tên, ảnh bìa và mô tả dự án.

### 9.5 About `/about`

- Desktop: card hai vùng, trái khoảng 4/12 và phải 8/12; mobile xếp dọc.
- Trái: avatar tròn 180×180, tên, title, email, điện thoại cá nhân/studio, website, địa chỉ.
- Phải: bio, education, skills, experience; giữ xuống dòng.
- Email dùng `mailto:`, số điện thoại dùng `tel:`, website là external link an toàn.
- Nếu không có avatar dùng fallback nội bộ, không gọi avatar ngẫu nhiên bên ngoài.

## 10. Đặc tả khu admin

### 10.1 Đăng nhập/đăng xuất

- Form gồm email và password, required, không có credential mẫu trong placeholder.
- Submit khóa nút và hiển thị loading; lỗi xác thực không tiết lộ email có tồn tại hay không.
- Thành công chuyển tới `next` hợp lệ hoặc `/admin`.
- Nếu vào login khi session còn hợp lệ, redirect dashboard.
- Logout gọi backend, dù request lỗi vẫn không được tự xóa dấu vết session server; hiển thị lỗi và cho thử lại.
- Không gọi `localStorage.clear()`/`sessionStorage.clear()` vì có thể xóa dữ liệu không thuộc ứng dụng.

### 10.2 Admin layout

- Header có logo, Dashboard, Home slides, Projects, Logo, About và Logout.
- Không render link `Contact`/`Settings` khi chưa có module thật.
- Khi API admin trả `401`, thử refresh đúng một lần; nếu vẫn lỗi, về login.
- Khi trả `403`, giữ nguyên trang và hiển thị thông báo không có quyền.

### 10.3 Quản lý dự án

- List dùng cùng ảnh/tên như public và có nút thêm, sửa, xóa, kéo-thả sắp xếp.
- Xóa bắt buộc mở confirm dialog nêu rõ tên dự án; chỉ cập nhật list sau khi API thành công.
- Form create/edit dùng chung component và cùng schema validation.
- Trường form:
  - ảnh bìa;
  - tên ở listing;
  - tên ở detail;
  - priority;
  - năm;
  - địa điểm;
  - site area;
  - floor area;
  - client;
  - photographer;
  - tiêu đề ý tưởng EN/VI (không bắt buộc);
  - mô tả EN/VI;
  - gallery 1–4 ảnh, có preview, xóa và sắp xếp.
- `year` là số nguyên từ 1900 tới năm hiện tại.
- Trim chuỗi; URL/file phải hợp lệ; chặn submit khi upload chưa hoàn tất.
- Edit chỉ gọi một endpoint admin đầy đủ, không ghép dữ liệu từ ba endpoint như source cũ.
- Sau thành công chuyển về `/admin/projects`, không chuyển tới route `/admin/dashboard` không tồn tại.

### 10.4 Logo, slideshow và About

- Logo: tải logo hiện tại, chọn ảnh, preview, upload, lưu; không cho submit khi ảnh chưa upload xong.
- Home slides: hiển thị list hiện tại, thêm ảnh, xóa có xác nhận, kéo-thả và lưu thứ tự. Mọi request admin đều có cookie.
- About: prefill dữ liệu hiện tại; avatar upload riêng; textarea cho education/skills/experience/bio; validation email, URL và số điện thoại ở mức hợp lý.
- Không dùng `alert()`; dùng toast hoặc inline feedback nhất quán.

## 11. Upload và hiển thị ảnh

Luồng bắt buộc:

1. Admin chọn file.
2. FE kiểm tra MIME (`image/jpeg`, `image/png`, `image/webp`, tùy chọn AVIF), kích thước và dung lượng trước.
3. FE gửi multipart tới `POST /api/v1/admin/media/images` với cookie.
4. API trả `AssetRef`; FE lưu ref này vào form.
5. Submit entity chỉ sau khi mọi upload hoàn tất.

Không đưa Cloudinary API secret vào frontend. Không hard-code cloud name `dasqsts9r` hoặc unsigned preset `nguyen` như source cũ. URL object preview phải được `URL.revokeObjectURL` khi thay/xóa/unmount.

`next/image` cần cấu hình allowlist hostname; luôn có `sizes`, width/height hoặc `fill`, và `alt`. Ảnh hero có thể ưu tiên tải; thumbnail còn lại lazy-load.

## 12. API client, cache và lỗi

- Một wrapper duy nhất parse JSON, gắn cookie, map `ApiFailure`, timeout bằng `AbortController` và ghi request ID nếu backend trả về.
- Server Components gọi backend bằng URL server-only. Client Components chỉ gọi endpoint khi có tương tác.
- Public content có thể cache ngắn; sau mutation admin cần backend/FE invalidation để người xem thấy dữ liệu mới.
- Không cache response auth hoặc admin.
- Không để catch chỉ `console.error` rồi giữ spinner vô hạn.
- Mỗi màn hình có bốn trạng thái rõ: loading, success, empty, error.
- Không hiển thị raw stack trace hoặc thông điệp nội bộ.

## 13. SEO, accessibility và responsive

- Metadata mặc định: `180 Studio`, mô tả portfolio kiến trúc và logo/OG image.
- Trang chi tiết sinh metadata theo project; URL canonical dùng route mới.
- Ảnh có alt từ tên dự án và vị trí; ảnh trang trí dùng alt rỗng.
- Heading đúng thứ bậc, mọi input có label, lỗi form liên kết bằng `aria-describedby`.
- Lightbox/dialog có focus trap; menu dùng được bằng bàn phím.
- Kiểm tra tối thiểu các viewport 360, 768, 1024 và 1440 px.

## 14. Biến môi trường FE

```dotenv
API_BASE_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_IMAGE_HOST=res.cloudinary.com
```

- `API_BASE_URL` ưu tiên server-only.
- Không sao chép `CLOUDINARY_URL` hoặc secret sang biến `NEXT_PUBLIC_*`.
- Kiểm tra env lúc khởi động/build và báo lỗi rõ nếu thiếu.

## 15. Kiểm thử bắt buộc

### Unit/component

- Mapping response API sang domain type.
- Validation project/About/login.
- Slideshow chuyển ảnh, cleanup timer, empty list và reduced motion.
- Project card, metadata, multiline text và lightbox.
- Confirm delete, upload state và reorder payload.

### Integration/end-to-end

- Public: home → projects → detail → About.
- 404 dự án và lỗi API có retry.
- Login sai/đúng, redirect `next`, session hết hạn và logout.
- Admin tạo/sửa/xóa/sắp xếp dự án; edit giữ nguyên ID.
- Thay logo/About/slides rồi public thấy nội dung mới.
- Upload sai MIME, quá dung lượng và upload lỗi.
- Người chưa đăng nhập không truy cập được route admin.

## 16. Các lỗi source cũ tuyệt đối không sao chép

- Access token được code hết hạn 10 giây dù comment/cookie nói 15 phút.
- Update project xóa bản ghi trước rồi tạo lại, đổi ID và có nguy cơ mất dữ liệu.
- Create project ghi nhiều bảng không có transaction, có thể tạo dữ liệu dở dang.
- Admin thêm background không gửi `credentials: "include"` nên lỗi khi chạy khác origin.
- Form edit phải gọi ba API và có race condition khi merge state.
- Redirect sau edit tới `/admin/dashboard` nhưng route này không tồn tại.
- API/logo trả mảng dù UI cần một URL; model admin còn đọc nhầm field `link` trong khi DB là `url`.
- Nút Contact/Settings không có đích; component settings chỉ là placeholder.
- Upload Cloudinary hard-code unsigned preset/cloud name trong trình duyệt.
- Loading/error có nhánh không kết thúc spinner.
- Nội dung tiếng Việt trong một số file bị lỗi encoding mojibake.
- Footer hard-code năm 2025; responsive header chưa đủ cho mobile.

## 17. Definition of Done cho FE mới

Frontend được coi là hoàn thành khi:

- Tất cả route public/admin trong tài liệu hoạt động và không còn link chết.
- Public render được với JavaScript hydration chậm; phần tương tác nâng cấp sau hydrate.
- API contract khớp `BE_NESTJS_REBUILD_SPEC.md`.
- Cookie auth hoạt động ở môi trường dev và production, kể cả khi FE/BE khác origin theo cấu hình.
- CRUD project nguyên vẹn, upload/reorder ổn định và edit không đổi ID.
- Không có secret/hard-coded Cloudinary credential trong bundle.
- Có loading/empty/error/success cho mọi màn hình dữ liệu.
- Test luồng chính chạy qua, lint/type-check/build đều thành công.
- Lighthouse/accessibility không có lỗi nghiêm trọng do code ứng dụng.

## 18. Mapping nhanh từ source cũ

| Source cũ | Module mới |
|---|---|
| `component/user/home/*` | `HomeSlideshow` + `/page.tsx` |
| `component/user/projects/projects.js` | `/projects/page.tsx` + `ProjectCard` |
| `component/user/detail_project/*` | `/projects/[id]/page.tsx` + gallery/lightbox |
| `component/user/about-us/about_us.js` | `/about/page.tsx` |
| `component/user/header`, `footer`, `layout` | public layout |
| `helpers/authContext.js`, `ProtectedRoute.js` | server session helper + protected admin layout |
| `component/admin/login/login.js` | `/admin/login/page.tsx` |
| `component/admin/all_projects/*` | `/admin/projects` |
| `component/admin/add_project`, `edit` | shared `ProjectForm` |
| `component/admin/logo/logo.js` | `/admin/site/logo` |
| `component/admin/about-us/about_us.js` | `/admin/site/about` |

