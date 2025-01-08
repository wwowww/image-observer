import { useRef, useEffect } from "react";

function ImageGallery({ images }: { images: string[] }) {
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleImageLoad = (entries: any, observer: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const image = entry.target;

        if (image) {
          const newURL = image.getAttribute("data-src");
          if (newURL) {
            console.log(`Image loaded: ${newURL}`);
            image.src = newURL;
          }
          observer.unobserve(image);
        }
      }
    });
  };

  useEffect(() => {
    const imageOptions = {
      rootMargin: "100px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleImageLoad, imageOptions);

    imageRefs.current.forEach((image) => {
      if (image) observer.observe(image);
    });

    return () => observer.disconnect();
  }, [images]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
      {images && images.map((image, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            ref={(el) => (imageRefs.current[index] = el)}
            data-src={image}
            src="https://via.placeholder.com/200x300?text=Loading"
            alt={`Image ${index}`}
            style={{ width: "100%", height: "200px", objectFit: "cover", backgroundColor: 'gray' }}
          />
        </div>
      ))}
    </div>
  );
}

export default ImageGallery;
