# 🐿️ 다람이의 도토리 기억 숲 — Unity 기술 스택 & 설계 문서

> 유아 대상 교육용 기억력 게임 (우포늪 생태 테마) — **Unity 앱 버전**  
> **목표**: 앱스토어 정식 출시 / 오프라인 키오스크 설치형 고퀄리티 게임

---

## 🗺️ 전체 아키텍처 개요

```
[유아 / 태블릿 앱 (iOS · Android)]
            ↓
[Unity 2D — C# 게임 로직]
            ↓
[Unity Animator — 다람이 캐릭터 애니메이션]
            ↓ 파티클 시스템
[Unity Particle System — 낙엽 / 별 이펙트]
            ↓ 사운드
[Unity Audio Mixer — 배경음 / 효과음]
            ↓ 선택적 백엔드
[Firebase (점수 저장 · Analytics)]
            ↓ 배포
[Google Play Store · Apple App Store]
```

---

## 🎮 Unity 선택 시 장단점

### ✅ 장점

| 항목 | 내용 |
|------|------|
| **에디터 기반 제작** | 씬, 스프라이트, 애니메이터를 드래그앤드롭으로 배치 |
| **Animator 시스템** | 다람이의 걷기 / 놀람 / 기쁨 상태를 State Machine으로 직관적 관리 |
| **파티클 시스템** | 낙엽 낙하·별 이펙트를 에디터에서 실시간 미리보기하며 조정 |
| **앱 출시 가능** | iOS · Android · Windows 멀티플랫폼 단일 코드베이스 |
| **에셋 스토어** | 유아 교육 게임용 무료/유료 에셋 대량 활용 가능 |
| **확장성** | 향후 3D 씬 추가, AR(증강현실) 모드 확장 용이 |

### ⚠️ 단점

| 항목 | 내용 |
|------|------|
| **배포 허들** | 앱스토어 심사 수일~수주 소요 |
| **WebGL 로딩** | 브라우저 배포 시 초기 로딩 30초~1분 (유아에 불리) |
| **에디터 용량** | Unity Hub + 에디터 설치 파일 수 GB |
| **빌드 용량** | 최소 최적화 기준 APK 30~80MB |
| **업데이트 배포** | 수정 후 앱스토어 재심사 필요 |

---

## 1. 개발 환경

| 도구 | 버전 | 역할 |
|------|------|------|
| **Unity Editor** | `2022.3 LTS` (안정성 최우선) | 게임 제작 통합 환경 |
| **C#** | `.NET Standard 2.1` | 게임 로직 스크립팅 |
| **Visual Studio 2022** or **Rider** | 최신 | C# IDE |
| **Unity Hub** | 최신 | 프로젝트 · 에디터 버전 관리 |

> ⚠️ `Unity 6` 은 2024년 출시되었으나 LTS 안정성 면에서 `2022.3 LTS` 권장

---

## 2. 핵심 Unity 기술 스택

### 렌더링

| 항목 | 선택 | 이유 |
|------|------|------|
| **렌더 파이프라인** | **URP (Universal Render Pipeline)** | 2D 최적화, 모바일 성능 우수, 라이팅 셰이더 지원 |
| **카메라** | `Camera.orthographic = true` | 2D 게임 표준 직교 카메라 |
| **해상도 대응** | Canvas Scaler `Scale With Screen Size` (1280×720 기준) | 태블릿·폰 화면 자동 대응 |

### 2D 시스템

| 기술 | 역할 |
|------|------|
| **Sprite Renderer** | 배경, 장소 아이콘, 도토리 이미지 렌더링 |
| **Sprite Atlas** | 스프라이트 묶음 → 드로우콜 최소화 (성능 최적화) |
| **Tilemap** | 우포늪 배경 타일 배치 (선택적) |
| **9-Slice Sprite** | 말풍선, 버튼 UI 늘어남 없는 스케일 처리 |

---

## 3. 프로젝트 폴더 구조

```
Assets/
├── _Game/
│   ├── Scripts/
│   │   ├── Managers/
│   │   │   ├── GameManager.cs          # 게임 단계 FSM 관리
│   │   │   ├── AudioManager.cs         # 사운드 싱글턴
│   │   │   └── UIManager.cs            # UI 팝업 관리
│   │   ├── Gameplay/
│   │   │   ├── HidingSpot.cs           # 장소 클릭 처리
│   │   │   ├── AcornController.cs      # 도토리 등장/숨김 애니메이션
│   │   │   └── LeafFaller.cs           # 낙엽 파티클 트리거
│   │   ├── UI/
│   │   │   ├── ResultPopup.cs          # 결과 팝업 (성공/실패)
│   │   │   ├── PhaseUI.cs              # 단계 안내 텍스트
│   │   │   └── ProgressIndicator.cs   # 찾은 도토리 개수 표시
│   │   └── Data/
│   │       └── SpotData.cs             # 장소 ScriptableObject
│   ├── Scenes/
│   │   ├── BootScene.unity             # 에셋 로딩
│   │   ├── MainMenu.unity              # 시작 화면
│   │   └── GameScene.unity             # 메인 게임 (단일 씬 권장)
│   ├── Prefabs/
│   │   ├── HidingSpot.prefab
│   │   ├── Acorn.prefab
│   │   └── LeafParticle.prefab
│   ├── Animations/
│   │   ├── Squirrel/                   # 다람이 애니메이션 클립
│   │   └── Acorn/                      # 도토리 팝업 클립
│   ├── Audio/
│   │   ├── BGM/
│   │   └── SFX/
│   ├── Sprites/
│   │   ├── Background/
│   │   ├── Characters/
│   │   └── UI/
│   └── ScriptableObjects/
│       └── Spots/                      # 장소 데이터 에셋
├── Plugins/
│   └── DOTween/                        # 트윈 애니메이션 플러그인
└── StreamingAssets/
    └── Audio/                          # 외부 오디오 (TTS 음성)
```

---

## 4. 핵심 플러그인 & 패키지

| 패키지 | 역할 | 비용 |
|--------|------|------|
| **DOTween Pro** | 도토리 팝업 트윈, 낙엽 회전·낙하, UI 슬라이드인 | 무료/유료 |
| **TextMeshPro** | 고품질 한글 텍스트 렌더링 (Unity 내장) | 무료 |
| **Unity Particle System** | 낙엽 낙하, 별 파티클, 성공 이펙트 (Unity 내장) | 무료 |
| **Unity Animator** | 다람이 캐릭터 State Machine 애니메이션 (Unity 내장) | 무료 |
| **Firebase Unity SDK** | 점수 저장(Firestore), 이벤트 분석(Analytics) | 무료 티어 |
| **Unity Localization** | 한국어/영어 다국어 텍스트 관리 | 무료 (Package Manager) |
| **Unity Addressables** | 에셋 번들 분리 로딩 → 초기 용량 절감 | 무료 (Package Manager) |

---

## 5. 게임 단계별 Unity 구현 상세

### 1단계 — 도토리 숨기기

```csharp
// HidingSpot.cs
public class HidingSpot : MonoBehaviour, IPointerClickHandler
{
    [SerializeField] private SpotData spotData;
    [SerializeField] private GameObject acornPrefab;

    private bool isSelected = false;

    public void OnPointerClick(PointerEventData eventData)
    {
        if (isSelected || GameManager.Instance.SelectedCount >= 5) return;

        isSelected = true;
        GameManager.Instance.RegisterSpot(spotData.spotId);

        // 도토리 팝업 트윈 (DOTween)
        GameObject acorn = Instantiate(acornPrefab, transform.position, Quaternion.identity);
        acorn.transform.localScale = Vector3.zero;
        acorn.transform
            .DOScale(1f, 0.4f).SetEase(Ease.OutBack)
            .OnComplete(() =>
                acorn.transform.DOScale(0f, 0.3f).SetDelay(0.5f)
                    .OnComplete(() => Destroy(acorn))
            );

        // 반짝임 글로우 (선택 표시)
        GetComponent<SpriteRenderer>().DOColor(Color.yellow, 0.2f)
            .SetLoops(2, LoopType.Yoyo);
    }
}
```

### 2단계 — 기억 시간 (낙엽 연출)

```csharp
// LeafFaller.cs
public class LeafFaller : MonoBehaviour
{
    [SerializeField] private ParticleSystem leafParticle;
    [SerializeField] private float waitDuration = 3f;

    public IEnumerator PlayAndWait()
    {
        leafParticle.Play();
        // 다람이 화면 밖 퇴장
        squirrelTransform.DOMoveX(-300f, 1.2f).SetEase(Ease.InQuad);

        yield return new WaitForSeconds(waitDuration);

        leafParticle.Stop();
        GameManager.Instance.ChangePhase(GamePhase.FindPhase);
    }
}
```

### 3단계 — 도토리 찾기

| 결과 | Unity 구현 | 사운드 |
|------|-----------|--------|
| **정답** | 도토리 Prefab Instantiate + DOScale + 별 ParticleSystem Play | `AudioManager.PlaySFX("correct")` |
| **오답** | 낙엽 ParticleSystem 짧게 Play + Shake 트윈 | `AudioManager.PlaySFX("rustle")` |

### 4단계 — 결과 팝업

```csharp
// ResultPopup.cs
public class ResultPopup : MonoBehaviour
{
    [SerializeField] private ParticleSystem confettiParticle;
    [SerializeField] private TMP_Text resultText;

    public void Show(bool isSuccess)
    {
        gameObject.SetActive(true);

        // 팝업 슬라이드인 (DOTween)
        transform.localScale = Vector3.zero;
        transform.DOScale(1f, 0.5f).SetEase(Ease.OutBack);

        if (isSuccess)
        {
            resultText.text = "성공! 다람이가 도토리를\n모두 찾았어요! 🎉";
            confettiParticle.Play();
        }
        else
        {
            resultText.text = "괜찮아! 잊어버린 도토리가\n우포늪의 참나무가 되었어요. 🌳";
        }
    }
}
```

---

## 6. 게임 상태 관리 (FSM)

```csharp
// GameManager.cs
public enum GamePhase
{
    Idle,
    HidePhase,   // 1단계: 도토리 숨기기
    WaitPhase,   // 2단계: 낙엽 + 대기
    FindPhase,   // 3단계: 도토리 찾기
    Result       // 4단계: 결과
}

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public GamePhase CurrentPhase { get; private set; }
    public List<string> SelectedSpotIds { get; private set; } = new();
    public int SelectedCount => SelectedSpotIds.Count;
    public int FoundCount { get; private set; }

    public void ChangePhase(GamePhase next) { ... }
    public void RegisterSpot(string spotId) { ... }
    public void CheckSpot(string spotId) { ... }
}
```

---

## 7. ScriptableObject 기반 장소 데이터

```csharp
// SpotData.cs
[CreateAssetMenu(menuName = "Game/SpotData")]
public class SpotData : ScriptableObject
{
    public string spotId;        // "acorn-nest"
    public string displayName;   // "억새숲"
    public Sprite spotSprite;
    public Vector2 position;
}
```

> 에디터에서 장소 추가/수정 시 코드 수정 없이 에셋만 추가하면 됨

---

## 8. 에셋 & 디자인 전략

### 이미지 / 일러스트

| 에셋 | 추천 소스 | 비고 |
|------|-----------|------|
| 우포늪 배경 | **Midjourney v6** / Adobe Firefly | "우포늪 가을 숲, 수채화, 동화 스타일" |
| 다람이 캐릭터 | **Spine 2D** (골격 애니메이션) 또는 Unity Animator | Spine → Unity 플러그인 연동 |
| 도토리 / 낙엽 | Figma 직접 제작 | 투명 PNG → Sprite Atlas |
| 장소 아이콘 | Stable Diffusion 또는 일러스트레이터 의뢰 | 8종 |

### 사운드

| 사운드 | 추천 소스 |
|--------|-----------|
| 배경음 (숲 소리) | Freesound.org (CC0) |
| 효과음 | Pixabay 무료 효과음 |
| TTS 음성 | **Google Cloud TTS** `ko-KR-Wavenet-A` → MP3 생성 후 StreamingAssets |

---

## 9. 반응형 & 접근성

| 항목 | 구현 방법 |
|------|-----------|
| **태블릿 해상도 대응** | Canvas Scaler `Scale With Screen Size` 1280×720 |
| **터치 지원** | `EventSystem` + `IPointerClickHandler` 인터페이스 |
| **클릭 영역 보장** | Collider2D 히트 영역 최소 `80×80px` |
| **색맹 배려** | 정답/오답 → 색깔 + 모양 + 사운드 3중 피드백 |
| **안전 영역** | `Screen.safeArea` API로 노치·홈바 영역 회피 |

---

## 10. 빌드 & 배포

| 플랫폼 | 빌드 방법 | 스토어 |
|--------|-----------|--------|
| **Android** | `Build Settings → Android` → APK / AAB | Google Play Store |
| **iOS** | `Build Settings → iOS` → Xcode 빌드 → IPA | Apple App Store |
| **Windows (키오스크)** | `Build Settings → PC` → EXE | 직접 설치 |
| **WebGL (옵션)** | `Build Settings → WebGL` → Vercel 호스팅 | (로딩 최적화 필수) |

### 빌드 최적화 체크리스트

```
[ ] Sprite Atlas 적용 (드로우콜 최소화)
[ ] Audio Clip Compression 설정 (Vorbis / ADPCM)
[ ] Addressables로 에셋 번들 분리
[ ] IL2CPP 빌드 (Mono 대비 성능 향상)
[ ] Android minSdkVersion 22 이상 설정
[ ] iOS Deployment Target 14.0 이상
[ ] 앱 아이콘 / 스플래시 스크린 설정
```

---

## 11. 개발 로드맵

```
Week 1  │ Unity 프로젝트 세팅 + URP 설정 + 에셋 임포트
Week 2  │ 씬 구성 + HidingSpot 클릭 + DOTween 도토리 팝업
Week 3  │ 낙엽 ParticleSystem + WaitPhase + FindPhase 정답/오답 처리
Week 4  │ ResultPopup + AudioManager + TTS 음성 연동
Week 5  │ 다람이 Animator State Machine + 캐릭터 연출
Week 6  │ 반응형 처리 + 빌드 최적화 + 내부 테스트
Week 7  │ 앱스토어 심사 제출 준비 (스크린샷, 설명문, 심사 서류)
Week 8  │ 심사 통과 후 출시 + Firebase Analytics 모니터링
```

---

## 12. 확장 가능성 (v2 아이디어)

| 기능 | Unity 구현 방법 |
|------|----------------|
| 난이도 조절 (장소 수 3/5/8) | `GameConfig ScriptableObject` 값 변경 |
| 계절 테마 (봄/여름/가을/겨울) | `Sprite Atlas` 스왑 + `Color Grading` |
| 점수 저장 & 리더보드 | Firebase Firestore |
| AR 모드 (카메라로 찾기) | AR Foundation + ARCore/ARKit |
| 부모용 학습 리포트 | Firebase Analytics 이벤트 |
| 다국어 지원 | Unity Localization Package |

---

## ✅ 최종 추천 스택 요약 (Unity 버전)

```
게임 엔진       : Unity 2022.3 LTS
렌더 파이프라인  : URP (Universal Render Pipeline)
언어            : C# (.NET Standard 2.1)
IDE             : Visual Studio 2022 / JetBrains Rider
트윈 애니메이션  : DOTween Pro
텍스트 렌더링   : TextMeshPro (한글 최적화)
캐릭터 애니메이션: Unity Animator (또는 Spine 2D)
파티클          : Unity Particle System
사운드          : Unity Audio Mixer + Howler.js 대체
TTS             : Google Cloud TTS (ko-KR) → MP3 변환
데이터 관리     : ScriptableObject
백엔드 (선택)   : Firebase (Firestore + Analytics)
배포 플랫폼     : Google Play + Apple App Store
```

> 💡 **Phaser 3 버전과의 선택 기준**
>
> | 목표 | 추천 |
> |------|------|
> | 교육 현장에서 URL로 즉시 실행 | [`game_tech_stack.md`](./game_tech_stack.md) — Phaser 3 |
> | 앱스토어 정식 출시 / 오프라인 설치형 | 이 문서 — Unity |
