# 🐿️ 다람이의 도토리 기억 숲 — AR 증강현실 버전 기술 스택 & 설계 문서

> 유아가 **직접 몸을 움직여** 실제 공간에서 도토리를 숨기고 찾는 AR 교육 게임  
> **목표**: 실내/실외 공간을 우포늪으로 변환 — 신체 활동 + 기억력 + 생태 교육 통합

---

## 🌿 AR 버전 게임 컨셉 변경

```
[기존 웹/앱 버전]          [AR 버전]
화면 속 장소 클릭    →    실제 공간을 걸어다니며 장소 탐색
도토리 드래그        →    손가락 탭 or 손 제스처로 도토리 배치
결과 팝업            →    눈앞 공간에 3D 결과 이펙트 등장
```

### 핵심 차별점
- 유아가 **실제로 걷고 앉고 뒤지며** 도토리를 찾음
- 교실·거실·실외 공원 어디서든 "현실 공간이 우포늪이 됨"
- 신체 활동 유도 → 단순 터치 게임 대비 몰입감·교육 효과 극대화

---

## 🗺️ 기술 선택 분기도

```
AR 게임을 만들고 싶다
        │
        ├─── 스마트폰 / 태블릿 앱?
        │           │
        │           ├── 네이티브 고퀄  →  Unity + AR Foundation  ✅ 추천
        │           └── 빠른 프로토타입 →  8th Wall (WebAR)
        │
        ├─── 웨어러블 안경?
        │           │
        │           ├── Meta Quest     →  Unity + Meta XR SDK
        │           └── HoloLens       →  Unity + MRTK
        │
        └─── 브라우저에서 바로?        →  WebXR + Three.js / A-Frame
```

---

## 🎯 시나리오별 최종 추천 스택

| 시나리오 | 추천 스택 | 난이도 | 비용 |
|---------|-----------|--------|------|
| **① 태블릿 앱 (교육 현장 메인)** | Unity + AR Foundation | ⭐⭐⭐ | 무료 |
| **② 브라우저 AR (설치 없이 바로)** | 8th Wall + Three.js | ⭐⭐⭐ | 유료($) |
| **③ 브라우저 AR (완전 무료)** | WebXR + A-Frame | ⭐⭐ | 무료 |
| **④ VR 헤드셋 (몰입형)** | Unity + Meta XR SDK | ⭐⭐⭐⭐ | 기기 필요 |

> 이 문서는 **① Unity + AR Foundation** (교육 현장 태블릿 최적) 을 메인으로,  
> **② 8th Wall WebAR** 을 보조로 상세 설명합니다.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🥇 메인 추천: Unity + AR Foundation
## ━━━━━━━━━━━━━━━━━━━━━━━━━━

### 전체 아키텍처

```
[유아 / 태블릿 카메라]
        ↓ 카메라 영상
[AR Foundation — 평면 감지 / 이미지 추적]
        ↓
[Unity 2022.3 LTS — 게임 로직 / 3D 오브젝트 배치]
        ↓ ARCore (Android) / ARKit (iOS)
[디바이스 AR 플랫폼]
        ↓
[Unity XR Interaction Toolkit — 터치 / 손 제스처]
        ↓ (선택)
[Firebase — 점수 저장 / 분석]
```

---

## 1. 개발 환경

| 도구 | 버전 | 역할 |
|------|------|------|
| **Unity Editor** | `2022.3 LTS` | 게임 개발 통합 환경 |
| **AR Foundation** | `5.x` | iOS ARKit · Android ARCore 통합 추상화 레이어 |
| **ARCore XR Plugin** | `5.x` | Android AR 백엔드 |
| **ARKit XR Plugin** | `5.x` | iOS AR 백엔드 |
| **XR Interaction Toolkit** | `2.5.x` | 터치 · 레이캐스트 인터랙션 |
| **C#** | `.NET Standard 2.1` | 게임 로직 |

---

## 2. AR Foundation 핵심 기능 활용

### 평면 감지 (Plane Detection)

```
바닥 / 책상 / 잔디밭을 자동 감지
        ↓
감지된 평면 위에 "억새숲", "나무 밑" 등 AR 장소 오브젝트 자동 배치
```

```csharp
// ARPlacementManager.cs
public class ARPlacementManager : MonoBehaviour
{
    [SerializeField] private ARPlaneManager planeManager;
    [SerializeField] private ARRaycastManager raycastManager;
    [SerializeField] private GameObject hidingSpotPrefab;

    private List<ARRaycastHit> hits = new();

    void Update()
    {
        // 화면 터치 시 AR 평면 위에 장소 오브젝트 배치
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            if (raycastManager.Raycast(Input.GetTouch(0).position, hits, TrackableType.PlaneWithinPolygon))
            {
                Pose hitPose = hits[0].pose;
                Instantiate(hidingSpotPrefab, hitPose.position, hitPose.rotation);
            }
        }
    }
}
```

### 이미지 트래킹 (Image Tracking) — 선택적 활용

```
우포늪 그림 카드(마커)를 출력해서 카메라로 비추면
        ↓
해당 위치에 다람이 캐릭터 또는 도토리 AR 오브젝트 등장
```

```csharp
// ARImageTracker.cs
public class ARImageTracker : MonoBehaviour
{
    [SerializeField] private ARTrackedImageManager imageManager;

    void OnEnable() => imageManager.trackedImagesChanged += OnTrackedImagesChanged;
    void OnDisable() => imageManager.trackedImagesChanged -= OnTrackedImagesChanged;

    void OnTrackedImagesChanged(ARTrackedImagesChangedEventArgs args)
    {
        foreach (var image in args.added)
        {
            // 마커 이름에 따라 다른 오브젝트 생성
            SpawnARObject(image.referenceImage.name, image.transform.position);
        }
    }
}
```

---

## 3. 프로젝트 폴더 구조

```
Assets/
├── _AR/
│   ├── Scripts/
│   │   ├── AR/
│   │   │   ├── ARPlacementManager.cs     # 평면 감지 + 오브젝트 배치
│   │   │   ├── ARImageTracker.cs         # 이미지 마커 트래킹
│   │   │   ├── ARSessionController.cs    # AR 세션 초기화 / 권한 처리
│   │   │   └── AROcclusionHandler.cs     # 실물 뒤로 AR 오브젝트 숨김 (깊이감)
│   │   ├── Gameplay/
│   │   │   ├── ARHidingSpot.cs           # AR 공간 내 장소 오브젝트
│   │   │   ├── ARAcorn.cs                # 도토리 3D 오브젝트 + 애니메이션
│   │   │   ├── ARLeafParticle.cs         # 낙엽 파티클 (3D)
│   │   │   └── PlayerProximityChecker.cs # 유아가 장소에 가까이 왔는지 감지
│   │   ├── Managers/
│   │   │   ├── GameManager.cs            # 게임 단계 FSM
│   │   │   ├── AudioManager.cs           # 공간 3D 사운드
│   │   │   └── UIManager.cs              # AR 위에 오버레이 UI
│   │   └── Motion/
│   │       ├── BodyTrackingController.cs # 신체 움직임 감지 (옵션)
│   │       └── GestureHandler.cs         # 손 제스처 처리
│   ├── Scenes/
│   │   ├── ARMainScene.unity
│   │   └── MainMenu.unity
│   ├── Prefabs/
│   │   ├── AR/
│   │   │   ├── ARHidingSpot.prefab       # 억새숲, 나무밑 등 3D 오브젝트
│   │   │   ├── ARAcorn.prefab            # 도토리 3D 모델
│   │   │   └── ARSquirrel.prefab         # 다람이 3D 캐릭터
│   │   └── UI/
│   ├── 3DModels/                         # FBX / glTF 3D 모델
│   ├── Animations/
│   └── Audio/
└── XRI/                                  # XR Interaction Toolkit 기본 설정
```

---

## 4. AR 게임 단계별 구현

### 1단계 — AR 공간에 장소 배치

```
앱 시작
    ↓
"바닥을 천천히 비춰주세요" 안내 + 평면 감지 시각화
    ↓
평면 감지 완료 → 자동으로 6~8곳 장소 오브젝트 공간 배치
    (반경 1~2m 내 랜덤 배치 → 유아가 걸어다니며 탐색)
    ↓
유아가 장소에 가까이 가면 → 하이라이트 + "여기에 숨길까요?" 말풍선
    ↓
태블릿 화면 탭 or 고개 끄덕임 → 도토리 숨김 애니메이션
```

```csharp
// PlayerProximityChecker.cs
// 유아(카메라)가 AR 장소에 가까이 갔는지 거리 기반 감지
public class PlayerProximityChecker : MonoBehaviour
{
    [SerializeField] private float interactionRadius = 0.5f; // 0.5m 이내
    private Transform cameraTransform;

    void Start() => cameraTransform = Camera.main.transform;

    void Update()
    {
        float dist = Vector3.Distance(cameraTransform.position, transform.position);
        if (dist < interactionRadius)
            OnPlayerNearby();
    }

    void OnPlayerNearby()
    {
        // 장소 오브젝트 강조 + UI 말풍선 표시
        GetComponent<ARHidingSpot>().Highlight();
    }
}
```

### 2단계 — 기억 시간

```
5개 숨김 완료
    ↓
"다람이가 잠깐 다른 곳을 다녀올게!" 음성 + AR 텍스트 공중 등장
    ↓
AR 공간 전체에 낙엽 3D 파티클 흩날림 (3초)
    ↓
장소 오브젝트 반투명 처리 (숨김)
    ↓
FindPhase 전환
```

### 3단계 — 도토리 찾기 (몸으로 탐색)

```
유아가 실제로 걸어다니며 장소 탐색
    ↓
장소에 가까이 가면 진동 피드백 (Haptic) + 사운드 힌트
    ↓
태블릿 탭 → 정답이면 도토리 3D 팝업 + 파티클
            오답이면 낙엽 휙~ + 다람이 고개 젓기 애니메이션
```

```csharp
// 햅틱 피드백
#if UNITY_IOS
    Handheld.Vibrate();
#elif UNITY_ANDROID
    AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
    AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
    AndroidJavaObject vibrator = currentActivity.Call<AndroidJavaObject>("getSystemService", "vibrator");
    vibrator.Call("vibrate", 200L);
#endif
```

### 4단계 — 결과

```
성공: AR 공간 전체에 색종이 파티클 폭발 + 다람이 춤 애니메이션
실패: 위로 메시지 + 공중에 참나무 3D 모델 서서히 성장 애니메이션
```

---

## 5. 신체 움직임 감지 옵션

### 옵션 A — 거리 기반 (기본, 권장)
- 카메라(태블릿) 위치와 AR 오브젝트 간 거리 계산
- 구현 간단, 모든 기기 지원
- **유아가 태블릿을 들고 걸어다니는 방식**

### 옵션 B — ML Kit Pose Detection (고급)
```
Google ML Kit (무료) 활용
        ↓
카메라로 유아의 전신 골격 17개 포인트 실시간 감지
        ↓
손을 뻗는 동작 → 도토리 집기
쪼그려 앉는 동작 → 도토리 숨기기
손뼉 치기 → 정답 확인
```

| 항목 | 내용 |
|------|------|
| **SDK** | Google ML Kit `Pose Detection` (Unity 플러그인) |
| **정확도** | 실내 조명 충분 시 95%+ |
| **기기 요구** | Android 7.0+ / iOS 12+ |
| **추가 비용** | 무료 |

### 옵션 C — 음성 명령 (접근성 강화)
```
"여기!" → 가장 가까운 장소에 도토리 배치
"찾았다!" → 현재 위치의 장소 확인
```
- **Google Cloud Speech-to-Text** 또는 Unity의 `Microphone` API + 온디바이스 인식

---

## 6. 3D 에셋 & 디자인 전략

### 3D 모델

| 에셋 | 추천 소스 | 포맷 |
|------|-----------|------|
| 다람이 캐릭터 | **Mixamo** (무료 리깅) + Blender 커스텀 | FBX |
| 도토리 3D | **Sketchfab** CC0 에셋 또는 Blender 직접 제작 | glTF / FBX |
| 억새숲 / 나무 오브젝트 | Unity Asset Store (Low Poly Nature Pack) | Prefab |
| 낙엽 파티클 텍스처 | Figma → PNG → Unity Particle | PNG |

### AR 비주얼 품질 향상

| 기법 | Unity 구현 | 효과 |
|------|-----------|------|
| **AR Occlusion** | `AROcclusionManager` | 실물 뒤로 AR 오브젝트가 가려짐 → 현실감 ↑ |
| **환경 조명 반영** | `AREnvironmentProbeManager` | 실제 조명이 3D 오브젝트에 반영 |
| **그림자** | AR Plane 위 실시간 그림자 | 오브젝트가 바닥에 붙어있는 느낌 |
| **안개 이펙트** | `RenderSettings.fog` | 숲 분위기 연출 |

---

## 7. 공간 3D 사운드

```csharp
// AudioManager.cs — 3D 공간 사운드
// 장소 오브젝트마다 Audio Source 부착
// 유아가 가까이 갈수록 소리 커짐 (거리 감쇠)

AudioSource audioSource = hidingSpot.GetComponent<AudioSource>();
audioSource.spatialBlend = 1.0f;          // 완전 3D 공간 사운드
audioSource.minDistance = 0.3f;           // 0.3m 이내 최대 볼륨
audioSource.maxDistance = 3.0f;           // 3m 이상 안들림
audioSource.rolloffMode = AudioRolloffMode.Logarithmic;
```

> 유아가 장소에 가까이 갈수록 "바스락~" 소리가 커지며 힌트 역할

---

## 8. 기기 요구 사항

| 항목 | 최소 사양 | 권장 사양 |
|------|-----------|-----------|
| **Android** | Android 7.0 + ARCore 지원 기기 | Android 11+ 태블릿 (삼성 갤럭시 탭) |
| **iOS** | iPhone 6s / iPad (2018) 이상 + iOS 12 | iPad Air 4세대 이상 |
| **카메라** | 후면 카메라 (자동초점) | 와이드 앵글 후면 카메라 |
| **RAM** | 3GB 이상 | 6GB 이상 |
| **저장공간** | 500MB 이상 여유 | 1GB 이상 |

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🥈 보조 추천: 8th Wall WebAR (설치 없는 브라우저 AR)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━

> 앱 설치 없이 **브라우저 URL 하나**로 AR 체험 가능

### 아키텍처

```
[유아 / 스마트폰 브라우저 카메라]
            ↓
[8th Wall — SLAM 기반 WebAR 엔진]
            ↓
[Three.js / A-Frame — 3D 씬 렌더링]
            ↓
[Vercel 호스팅]
```

### 기술 스택

| 기술 | 역할 |
|------|------|
| **8th Wall** | 브라우저 기반 평면 감지 / SLAM 트래킹 |
| **Three.js** | 3D 오브젝트 렌더링 |
| **A-Frame** | HTML 기반 3D 씬 구성 (빠른 프로토타입) |
| **GSAP** | UI 애니메이션 |
| **Howler.js** | 사운드 재생 |

```html
<!-- A-Frame + 8th Wall 예시 -->
<a-scene xrweb="disableWorldTracking: false">
  <a-assets>
    <a-asset-item id="acorn-model" src="./models/acorn.glb"></a-asset-item>
  </a-assets>

  <!-- 평면 감지 후 배치될 도토리 숨길 장소 -->
  <a-entity
    id="hiding-spot-1"
    gltf-model="#acorn-model"
    position="0 0 -1"
    class="ar-spot"
    event-set__click="visible: true">
  </a-entity>
</a-scene>
```

### 8th Wall 장단점

| 항목 | 내용 |
|------|------|
| ✅ **장점** | 앱 설치 불필요, URL 공유만으로 즉시 AR 체험 |
| ✅ **장점** | iOS Safari / Android Chrome 모두 지원 |
| ✅ **장점** | 이미지 트래킹, 평면 감지, 얼굴 트래킹 모두 지원 |
| ❌ **단점** | **유료** (월 $99~, 교육기관 할인 있음) |
| ❌ **단점** | Unity 대비 3D 연출 퀄리티 낮음 |
| ❌ **단점** | 복잡한 게임 로직 구현 어려움 |

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🥉 무료 브라우저 AR: WebXR + A-Frame
## ━━━━━━━━━━━━━━━━━━━━━━━━━━

```html
<!-- WebXR Hit Test API + A-Frame -->
<a-scene webxr="requiredFeatures: hit-test,local-floor">
  <a-entity id="reticle"
    gltf-model="./models/reticle.glb"
    ar-hit-test="target: #reticle">
  </a-entity>
</a-scene>
```

| 항목 | 내용 |
|------|------|
| ✅ **장점** | 완전 무료, 오픈소스 |
| ⚠️ **단점** | Android Chrome만 안정 지원 (iOS Safari 미지원) |
| ⚠️ **단점** | 8th Wall 대비 평면 감지 정확도 낮음 |

---

## 9. 전체 AR 옵션 최종 비교

| 항목 | Unity + AR Foundation | 8th Wall WebAR | WebXR + A-Frame |
|------|----------------------|----------------|-----------------|
| **배포 방식** | 앱 설치 | URL 즉시 실행 | URL 즉시 실행 |
| **평면 감지 정확도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **3D 퀄리티** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **신체 움직임 감지** | ✅ ML Kit 연동 가능 | ⚠️ 제한적 | ❌ 어려움 |
| **iOS 지원** | ✅ ARKit | ✅ | ⚠️ 불안정 |
| **Android 지원** | ✅ ARCore | ✅ | ✅ |
| **비용** | 무료 | 유료 ($99~/월) | 무료 |
| **오프라인 사용** | ✅ | ❌ | ❌ |
| **개발 난이도** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **교육 현장 적합도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

---

## 10. 개발 로드맵 (Unity + AR Foundation 기준)

```
Week 1  │ Unity AR Foundation 세팅 + ARCore/ARKit 플러그인 + 기기 테스트
Week 2  │ 평면 감지 + AR 장소 오브젝트 배치 시스템 구현
Week 3  │ 거리 기반 근접 감지 + 도토리 숨기기 인터랙션
Week 4  │ 낙엽 3D 파티클 + WaitPhase + FindPhase 정답/오답 처리
Week 5  │ 3D 사운드 연동 + 햅틱 피드백 + TTS 음성
Week 6  │ AR Occlusion + 환경 조명 반영 + 시각 퀄리티 polish
Week 7  │ ML Kit Pose Detection 연동 (신체 동작 감지) — 선택
Week 8  │ 유아 대상 실사용 테스트 + UI/UX 개선
Week 9  │ 앱스토어 심사 제출 + 배포
```

---

## 11. 교육적 활용 시나리오

```
📍 실외 활용 (공원 / 원 마당)
─────────────────────────────
선생님이 태블릿을 들고 공원 바닥을 비춤
  → AR 장소 8곳이 실제 잔디·돌 위에 배치됨
  → 아이들이 뛰어다니며 각자 도토리 숨기기
  → 기억 시간 후 돌아다니며 찾기

📍 실내 활용 (교실 / 거실)
─────────────────────────────
책상·의자·책가방 옆에 AR 장소 배치
  → 실제 사물이 게임 오브젝트가 됨
  → 집에서 혼자도 즐길 수 있음

📍 마커 카드 활용 (이미지 트래킹)
─────────────────────────────
우포늪 동물 카드 8장을 바닥에 깔아두기
  → 카드마다 다른 AR 장소 등장
  → 카드를 뒤집으면 도토리가 숨겨짐 / 등장
```

---

## ✅ 최종 추천 스택 요약 (AR 버전)

```
AR 엔진           : Unity 2022.3 LTS + AR Foundation 5.x
AR 백엔드         : ARCore (Android) + ARKit (iOS)
렌더 파이프라인   : URP (Universal Render Pipeline)
언어              : C# (.NET Standard 2.1)
신체 감지 (선택)  : Google ML Kit Pose Detection
트윈 애니메이션   : DOTween Pro
3D 사운드         : Unity Audio Mixer (spatialBlend = 1.0)
햅틱 피드백       : Unity Handheld.Vibrate / Android Vibrator API
TTS               : Google Cloud TTS (ko-KR-Wavenet-A)
백엔드 (선택)     : Firebase Firestore + Analytics
배포              : Google Play + Apple App Store
```

> 💡 **세 버전 연계 전략**
>
> | 단계 | 버전 | 역할 |
> |------|------|------|
> | **1단계** | [Phaser 3 웹](./game_tech_stack.md) | 빠른 프로토타입 · 교육 현장 URL 배포 |
> | **2단계** | [Unity 앱](./game_tech_stack_unity.md) | 앱스토어 출시 · 오프라인 지원 |
> | **3단계** | **이 문서 — Unity AR** | 신체 활동 · 몰입형 체험 프리미엄 버전 |
