# Intersection Observer로 이미지 최적화하기

## 파일 실행 방법

pnpm을 설치하고 dev 모드로 실행합니다.
```
pnpm install
pnpm dev
```

## 링크에서 확인하기

👉 Click: https://image-observer.vercel.app/

## 설명

### IntersectionObserver
> `IntersectionObserver API`는 타켓 요소와 상위 요소 또는 최상위 document의 viewport 사이의 intersection 내의 변화를 비동기적으로 관찰하는 방법입니다. (교차 관찰자 API)

```typescript
const observer = new IntersectionObserver(handleImageLoad, imageOptions);
```
- `handleImageLoad` 함수는 관찰 중인 이미지가 뷰포트에 들어오면, 그 이미지를 로드하는 작업을 합니다.
- `imageOptions` 객체는 `rootMargin`과 `threshold`를 설정해 이미지를 언제 로드할지 결정합니다.

### handleImageLoad 함수

```typescript
const handleImageLoad = (entries: any, observer: any) => {
  entries.forEach((entry: any) => {
    if (entry.isIntersecting) {
      const image = entry.target;

      if (image) {
        const newURL = image.getAttribute("data-src");
        if (newURL) {
          console.log(`Image loaded: ${newURL}`);
          image.src = newURL;  // 실제 이미지를 src에 설정
        }
        observer.unobserve(image);  // 이미지 로드 후 관찰 해제
      }
    }
  });
};
```
- `IntersectionObserver`에서 전달되는 `entries` 배열은 관찰된 요소들에 대한 정보를 포함합니다. 
- 각 요소는 `entry`를 나타내며, `entry.isIntersecting`이 true일 때, 그 요소가 뷰포트에 들어왔다는 것을 의미합니다.
- `entry.target`은 현재 관찰되는 이미지입니다.
- `data-src` 속성에는 실제 이미지 url이 저장돼 있습니다. 이미지는 기본적으로 src에 로딩 중 이미지를 넣고, 뷰포트에 들어왔을 때 `data-src`에서 실제 이미지를 가져와 src에 설정해줍니다.
- 이미지가 로드되면 `observer.unobserve(image)`를 호출해 더 이상 그 이미지를 관찰하지 않게 합니다. 즉, 이미 로드된 이미지는 처리되지 않습니다.

### useEffect
```typescript
useEffect(() => {
  const imageOptions = {
    rootMargin: "100px", // 관찰 대상의 여백 지정
    threshold: 0.1,      // 이미지가 10% 이상 보일 때 로드, 50%면 50%이상 보일 때 콜백을 호출합니다.
  };

  const observer = new IntersectionObserver(handleImageLoad, imageOptions);

  // 각 이미지에 대해 observer 설정
  imageRefs.current.forEach((image) => {
    if (image) observer.observe(image);
  });

  return () => observer.disconnect(); // 컴포넌트 언마운트 시 observer 해제
}, [images]); // images 배열이 변경될 때마다 observer 새로 설정
```
- `useEffect`는 컴포넌트가 랜더링된 후 한 번만 실행됩니다. images가 변경될 때마다 새로운 observer를 생성하고 각 이미지에 대해 observer를 등록합니다.
- `observer.observe(image)`를 호출해 각 이미지가 뷰포트에 들어올 때 이미지를 로드하도록 설정합니다.
- `return () => observer.disconnect()`는 컴포넌트가 언마운팅될 때 IntersectionObserver의 관찰을 해제합니다.

### 컴포넌트 설정
```typescript
return (
  ...
 {images && images.map((image, index) => (
    <img
      ref={(el) => (imageRefs.current[index] = el)}
      data-src={image} // 실제 이미지 URL을 data-src에 저장
      src="https://via.placeholder.com/200x300?text=Loading" // 로딩 중 이미지
      alt={`Image ${index}`}
      style={{ width: "100%", height: "200px", objectFit: "cover", backgroundColor: 'gray' }}
    />
  ))}
  ...
)
```

- 각 이미지에는 `ref` 속성으로 `imageRefs` 배열에 이미지 DOM 요소를 저장하고, `data-src`에는 실제 이미지 URL을 저장합니다. (IntersectionObserver를 사용하려면 DOM 요소에 접근해야 하는데, ref는 해당 DOM 요소에 직접적인 참조를 제공하므로 스크롤에 따른 이미지 로딩을 효율적으로 사용할 수 있음)
- src에는 로딩 중 표시될 이미지를 설정합니다.
- 이미지가 화면에 보일 때, IntersectionObserver가 동작해 실제 이미지 url을 src에 설정합니다.

![화면기록](https://github.com/user-attachments/assets/97c38c1d-4cc2-42b9-b525-9e2f608d512b)

## 이미지 지연 로딩을 위한 라이브러리에는 뭐가 있을까?
|라이브러리|성능|장점|단점|적합한 프로젝트|
|------|---|---|---|----------|
|react-lazyload|IntersectionObserver 기반, 성능 최적화|다양한 DOM 요소에 대해 지연 로딩 제공|이미지 이외의 콘텐츠 처리에 제한이 있을 수 있음|간단한 이미지 및 요소 지연 로딩 필요 시 사용에 적합|
|react-intersection-observer|IntersectionObserver 기반, 고급 설정 가능|다양한 요소에 대한 교차 상태 감지, 커스터마이징 용이|초기 설정이 다소 복잡할 수 있음|고급 커스터마이징 및 성능 최적화가 중요한 프로젝트|

## 회고
이미지 지연 로딩에는 라이브러리로만 사용해봐서 내장된 IntersectionObserver API를 처음 사용해 봤습니다. 초기 설정에서 data-src를 사용하지 않아, 이미지가 제대로 불러와지지 않는 등의 실수가 있었습니다. IntersectionObserver에서 관찰 대상이 되었을 때(뷰포트에 보여질 때), data-src 값을 src 속성에 할당해주는 로직을 추가해 문제를 해결할 수 있었습니다. 이 과정을 통해 IntersectionObserver의 동작 방식을 이해할 수 있었습니다. 처음에는 설정이 복잡했지만 API 문서를 참고하며 문제를 해결하고, 실제로 페이지 로딩 성능이 개선되는 것을 확인할 수 있었습니다.
