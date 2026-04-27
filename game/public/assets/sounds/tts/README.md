# TTS 음성 파일 안내

## 필요한 파일 목록

| 파일명 | 텍스트 |
|--------|--------|
| `welcome.mp3` | "안녕하세요! 다람이와 함께 도토리를 찾아봐요!" |
| `memorize.mp3` | "다람이가 도토리를 숨기고 있어요. 잘 기억해 두세요!" |
| `play.mp3` | "어디에 숨겼을까요? 장소를 클릭해 보세요!" |
| `correct.mp3` | "맞았어요! 정말 잘했어요!" |
| `wrong.mp3` | "아쉬워요. 다음엔 찾을 수 있을 거예요!" |
| `complete.mp3` | "게임이 끝났어요! 정말 대단해요!" |

## 무료 MP3 생성 방법 (추천 순)

### 1. CLOVA Voice (한국어 최고 품질) ⭐⭐⭐⭐⭐
- https://clova.ai/voice
- 언어: 한국어 / 목소리: Nara(여성) 또는 Dain(어린이)
- 속도: 0.9 / 다운로드 → mp3로 저장

### 2. TYPECAST (감정 표현 가능) ⭐⭐⭐⭐⭐
- https://typecast.ai
- 무료 플랜: 월 1,000자
- 어린이/친근한 목소리 다수

### 3. ElevenLabs ⭐⭐⭐⭐⭐
- https://elevenlabs.io
- 무료: 10,000자/월
- 언어: Korean 선택

### 4. Google TTS (개발자용)
```bash
# gcloud CLI 설치 후
gcloud auth login
```

## 파일 배치 경로
```
game/public/assets/sounds/tts/
├── welcome.mp3
├── memorize.mp3
├── play.mp3
├── correct.mp3
├── wrong.mp3
└── complete.mp3
```
