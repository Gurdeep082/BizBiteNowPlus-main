import { Camera, User } from "lucide-react";

const Avatar = ({
  src,
  alt = "Avatar",
  name = "",
  size = "md",
  editable = false,
  online = false,
  verified = false,
  onChange,
  className = "",
}) => {
  const sizes = {
    xs: {
      wrapper: "h-8 w-8",
      icon: 14,
      camera: "h-5 w-5",
      cameraIcon: 12,
      text: "text-xs",
    },

    sm: {
      wrapper: "h-10 w-10",
      icon: 18,
      camera: "h-6 w-6",
      cameraIcon: 14,
      text: "text-sm",
    },

    md: {
      wrapper: "h-14 w-14",
      icon: 22,
      camera: "h-7 w-7",
      cameraIcon: 16,
      text: "text-base",
    },

    lg: {
      wrapper: "h-20 w-20",
      icon: 30,
      camera: "h-8 w-8",
      cameraIcon: 18,
      text: "text-xl",
    },

    xl: {
      wrapper: "h-32 w-32",
      icon: 44,
      camera: "h-10 w-10",
      cameraIcon: 20,
      text: "text-3xl",
    },
  };

  const current = sizes[size];

  const initials = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  return (
    <div
      className={`
        relative
        inline-flex

        ${className}
      `}
    >
      <div
        className={`
          relative

          overflow-hidden

          rounded-full

          border-4
          border-white dark:border-[#181A1B]

          bg-slate-100 dark:bg-white/10

          shadow-md

          ${current.wrapper}
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <div
            className="
              flex
              h-full
              w-full

              items-center
              justify-center

              font-bold

              text-white
            "
            style={{
              background: "var(--primary-color)",
            }}
          >
            <span className={current.text}>
              {initials}
            </span>
          </div>
        ) : (
          <div
            className="
              flex
              h-full
              w-full

              items-center
              justify-center

              text-slate-400 dark:text-slate-500
            "
          >
            <User size={current.icon} />
          </div>
        )}
      </div>

      {editable && (
        <>
          <label
            htmlFor="avatar-upload"
            className={`
              absolute
              bottom-0
              right-0

              flex
              cursor-pointer

              items-center
              justify-center

              rounded-full

              border-2
              border-white

              text-white

              shadow-lg

              ${current.camera}
            `}
            style={{
              background: "var(--primary)",
            }}
          >
            <Camera size={current.cameraIcon} />
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
        </>
      )}

      {online && (
        <span
          className="
            absolute
            bottom-1
            right-1

            h-4
            w-4

            rounded-full

            border-2
            border-white

            bg-green-500
          "
        />
      )}

      {verified && (
        <span
          className="
            absolute
            -right-1
            -top-1

            flex
            h-6
            w-6

            items-center
            justify-center

            rounded-full

            border-2
            border-white

            text-xs
            font-bold

            text-white
          "
          style={{
            background: "var(--primary-color)",
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
};

export default Avatar;