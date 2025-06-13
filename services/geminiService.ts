
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// Import CalorieEstimation and FoodItemDetail from types.ts
import { CalorieEstimation, FoodItemDetail } from '../types';

// Removed local definitions:
// export interface FoodItemDetailForGemini { ... }
// export interface CalorieEstimation { ... }


const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY 환경 변수가 설정되지 않았습니다.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });
const model = "gemini-2.5-flash-preview-04-17";

const getPrompt = () => {
  return `이 이미지에 있는 음식 항목을 분석해주세요. 식별된 각 음식 항목의 이름은 한국어로, 예상 개별 칼로리 수치, 대략적인 제공량(예: "중간 크기 1개", "약 100g")을 한국어로 제공해주세요. 또한 각 항목의 칼로리 추정에 대한 신뢰도 수준(예: "높음", "중간", "낮음")을 한국어로 포함해주세요. 모든 항목의 총 예상 칼로리를 제공해주세요. 불확실성, 이미지 품질 문제 또는 항목을 식별할 수 없는 경우 한국어로 간략한 노트를 포함해주세요.

응답은 단일하고 유효한 JSON 객체 문자열이어야 합니다. 이 JSON 객체 외부에는 텍스트, 설명 또는 마크다운 형식(\`\`\`json ... \`\`\` 등)을 포함하지 마십시오.
JSON 객체는 모든 키와 문자열 값에 큰따옴표를 사용하고 후행 쉼표가 없는 이 구조를 엄격하게 따라야 합니다. JSON 내의 모든 문자열 값은 적절히 이스케이프 처리되어야 합니다 (예: 줄바꿈은 "\\n", 큰따옴표는 "\\\"").

필요한 JSON 구조의 예시:
\`\`\`json
{
  "totalCalories": 250,
  "items": [
    {
      "name": "사과",
      "calories": 95,
      "servingSize": "중간 크기 1개",
      "confidence": "높음"
    },
    {
      "name": "바나나",
      "calories": 105,
      "servingSize": "중간 크기 1개",
      "confidence": "중간"
    }
  ],
  "notes": "이미지가 선명합니다. 두 항목 모두 적절한 신뢰도로 식별되었습니다."
}
\`\`\`

음식을 식별하거나 칼로리를 안정적으로 추정할 수 없는 경우, "totalCalories"를 0으로, "items"를 빈 배열로 설정하고 "notes" 필드에 그 이유를 한국어로 설명해주세요.
"식별된 음식 없음" 예시:
\`\`\`json
{
  "totalCalories": 0,
  "items": [],
  "notes": "이미지에서 음식 항목을 명확하게 식별할 수 없습니다. 더 선명한 사진이나 다른 각도로 시도해 주세요."
}
\`\`\`

분석 중 내부 오류가 발생하면 "notes"와 함께 JSON에 "error" 필드를 한국어로 제공할 수 있습니다:
\`\`\`json
{
  "totalCalories": 0,
  "items": [],
  "notes": "분석 중 내부 오류가 발생했습니다.",
  "error": "이미지 처리 실패"
}
\`\`\`
`;
};


export const estimateCaloriesFromImage = async (
  base64Image: string,
  mimeType: string
): Promise<CalorieEstimation> => { // Return type is now from types.ts
  if (!API_KEY) {
    return {
      totalCalories: 0,
      items: [],
      notes: "설정 오류: API 키가 누락되었습니다. API_KEY 환경 변수가 설정되어 있는지 확인하세요.",
      error: "API 키 누락"
    };
  }
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: getPrompt(),
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [imagePart, textPart] }],
      config: {
        responseMimeType: "application/json",
      },
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as CalorieEstimation; // Cast to imported CalorieEstimation
      
      // Basic validation based on the CalorieEstimation interface
      if (typeof parsedData.totalCalories !== 'number' || !Array.isArray(parsedData.items)) {
        console.error("파싱된 JSON이 CalorieEstimation 구조와 일치하지 않습니다:", parsedData);
        console.error("원본 문제 JSON 문자열:", jsonStr);
        return { 
            totalCalories: 0, 
            items: [], // items should be FoodItemDetail[]
            notes: "AI로부터 예상치 못한 형식의 응답을 받았습니다. 데이터 구조가 예상과 다릅니다. 다시 시도해 주세요.",
            error: "잘못된 AI 응답 형식"
        };
      }
      if (parsedData.items) {
        for (const item of parsedData.items) { // item is FoodItemDetail
          // Basic validation for FoodItemDetail structure
          if (typeof item.name !== 'string' || typeof item.calories !== 'number') {
            console.error("파싱된 JSON 항목이 FoodItemDetail 구조와 일치하지 않습니다:", item);
            console.error("원본 문제 JSON 문자열:", jsonStr);
            return { 
                totalCalories: 0, 
                items: [], 
                notes: "AI로부터 음식 항목에 대해 예상치 못한 형식의 응답을 받았습니다. 다시 시도해 주세요.",
                error: "잘못된 AI 항목 형식"
            };
          }
        }
      }
      return parsedData;
    } catch (parseError) {
      console.error("Gemini로부터 JSON 응답 파싱 실패:", parseError);
      console.error("AI 원본 응답 텍스트 (파싱 시도 전):", response.text);
      console.error("파싱 실패 문자열 (마크다운 제거 후):", jsonStr);
      return {
        totalCalories: 0,
        items: [],
        notes: `AI 응답 처리 중 오류가 발생했습니다. AI가 JSON이 아닌 텍스트를 반환했을 수 있습니다. 세부 정보: ${(parseError as Error).message}`,
        error: "JSON 파싱 오류"
      };
    }
  } catch (error) {
    console.error("Gemini API 호출 오류:", error);
    const errorMessage = error instanceof Error ? error.message : "AI 서비스에서 알 수 없는 오류가 발생했습니다.";
    return {
      totalCalories: 0,
      items: [],
      notes: `칼로리 분석에 실패했습니다. ${errorMessage}`,
      error: "API 호출 실패"
    };
  }
};