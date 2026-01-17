// [중요] dotenv를 가장 먼저 불러와서 실행합니다.
import dotenv from "dotenv";
dotenv.config();

// 그 다음에 다른 도구들을 불러옵니다.
import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";
import fs from "fs";

// .env에서 키를 꺼내옵니다.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 키가 잘 읽혔는지 확인하는 '보안관' 코드
if (!GEMINI_API_KEY) {
  console.error("❌ 에러: .env 파일에서 GEMINI_API_KEY를 찾을 수 없습니다.");
  console.error("💡 힌트: .env 파일이 swimap 폴더 최상위에 있는지, 키 이름이 정확한지 확인하세요.");
  process.exit(1);
}

// --- Firebase 연결 설정 ---
try {
  // serviceAccountKey.json 파일 읽기
  const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
  
  // 이미 초기화되었는지 확인 후 초기화
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error("❌ 에러: serviceAccountKey.json 파일을 찾을 수 없습니다.");
  console.error("💡 힌트: 파이어베이스 콘솔에서 받은 키 파일을 프로젝트 폴더(swimap) 바로 아래에 두었는지 확인하세요.");
  process.exit(1);
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateAndUpload() {
  console.log("🤖 1. Gemini에게 수영장 데이터 생성을 요청합니다...");

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" }); // 모델명 최신화

  const prompt = `
    서울 지역의 실제 수영장 정보 5개를 JSON 배열 형식으로 만들어줘.
    상상하지 말고 최대한 실제 데이터를 기반으로 해줘. (마포구민체육센터, 올림픽수영장 등)
    
    필수 필드:
    - name (수영장 이름)
    - location (도로명 주소)
    - lat (위도, 숫자)
    - lng (경도, 숫자)
    - status (현재 상태: "OPEN" 또는 "CLOSED" 중 하나 랜덤)
    - time (운영시간 예: "06:00 - 22:00")
    - freeSwimTime (자유수영 시간 예: "08:00 - 08:50")
    - price (가격 예: "4,000원")
    - tags (특징 태그 배열 예: ["50m레인", "해수풀"])

    출력은 오직 JSON 데이터만 해줘. 마크다운(json) 쓰지 말고 순수 텍스트로.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // 혹시 마크다운이 섞여있으면 제거
    text = text.replace(/```json/g, "").replace(/```/g, "");
    
    // JSON 파싱 시도
    let poolData;
    try {
        poolData = JSON.parse(text);
    } catch (e) {
        console.error("❌ JSON 파싱 실패. Gemini가 이상한 응답을 줬을 수 있습니다.");
        console.log("응답 내용:", text);
        return;
    }

    console.log(`📦 2. 데이터 ${poolData.length}개 생성 완료! Firebase에 저장을 시작합니다.`);

    const batch = db.batch(); 
    
    poolData.forEach((pool) => {
      const docRef = db.collection("pools").doc(); 
      batch.set(docRef, pool);
    });

    await batch.commit();
    console.log("✅ 3. 저장 완료! Firebase 콘솔에서 'pools' 컬렉션을 확인해보세요.");

  } catch (error) {
    console.error("❌ 에러 발생:", error);
    // 400 에러일 경우 힌트 출력
    if (error.message.includes("400") || error.message.includes("API key not valid")) {
        console.error("💡 힌트: .env 파일에 저장된 API 키가 정확한지, 혹시 만료되지는 않았는지 확인해주세요.");
    }
  }
}

generateAndUpload();