import { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery"

function App() {
  const [randomImages, setRandomImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = () => {
      const imageArray = Array.from({ length: 100 }, (_, index) => `https://picsum.photos/200/300?random=${index + 1}`);
      setRandomImages(imageArray);
    };

    fetchImages();
  }, []);

  return (
    <main style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
      <h1>IntersectionObserver 구현하기</h1>
      <div style={{ maxWidth: 600, maxHeight: 500, width: '100%', overflowY: 'scroll', border: '20px solid #eee', borderRadius: '10px' }}>
        <ImageGallery images={randomImages} />
      </div>
    </main >
  )
}

export default App
