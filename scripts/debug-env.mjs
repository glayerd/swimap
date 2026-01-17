import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. 현재 위치 확인
console.log("📍 현재 실행 위치:", process.cwd());

// 2. .env 파일이 진짜 있는지 확인
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  console.log("✅ .env 파일을 찾았습니다!");
} else {
  console.error("❌ .env 파일이 없습니다! swimap 폴더 바로 아래에 만들어야 합니다.");
}

// 3. 내용 읽어보기
dotenv.config();
const key = process.env.GEMINI_API_KEY;

if (key) {
  console.log("✅ 키를 가져왔습니다:", key.slice(0, 5) + "..." + "(보안상 뒷부분 생략)");
  console.log("🎉 이제 upload-data.mjs를 실행해도 좋습니다!");
} else {
  console.error("❌ .env 파일은 있는데, 안에 GEMINI_API_KEY 내용이 비어있거나 읽지 못했습니다.");
}