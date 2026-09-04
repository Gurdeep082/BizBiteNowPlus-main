import { useRef, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";

export default function ImageUploader({
  multiple = false,
  onChange,
}) {
  const inputRef = useRef(null);

  const [images, setImages] = useState([]);

  const handleFiles = (files) => {
    const selected = Array.from(files);

    const preview = selected.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updated = multiple
      ? [...images, ...preview]
      : preview;

    setImages(updated);

    if (onChange) {
      onChange(updated.map((i) => i.file));
    }
  };

  return (
    <div className="space-y-5">

      {/* Upload Box */}

      <div
        onClick={() => inputRef.current.click()}
        className="
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          border-slate-300
          p-10
          text-center
          transition
          hover:border-[#1A4D2E]
          hover:bg-slate-50
        "
      >
        <UploadCloud
          size={42}
          className="mx-auto text-slate-500"
        />

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Upload Product Images
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Drag & Drop or Click to Upload
        </p>

        <input
          ref={inputRef}
          hidden
          multiple={multiple}
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFiles(e.target.files)
          }
        />
      </div>

      {/* Preview */}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          {images.map((img, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-slate-200"
            >
              <img
                src={img.url}
                alt=""
                className="h-36 w-full object-cover"
              />

              <button
                onClick={() =>
                  setImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
                }
                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white"
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}