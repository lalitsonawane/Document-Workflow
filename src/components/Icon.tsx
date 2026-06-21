import type { IconName } from '../types';

export const Icon = ({ name, size = 18 }: { name: IconName; size?: number }) => {
  const paths: Record<IconName, React.ReactNode> = {
    save: (
      <>
        <path d="M5 3h11l3 3v15H5z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
      </>
    ),
    export: (
      <>
        <path d="M12 3v12M7 8l5-5 5 5" />
        <path d="M5 13v8h14v-8" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5M10 7l-5 5 5 5" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 12h6M9 16h6" />
      </>
    ),
    check: <path d="M5 12l4 4L19 6" />,
    chevron: <path d="M9 7l5 5-5 5" />,
    edit: (
      <>
        <path d="M4 20h4L19 9l-4-4L4 16z" />
        <path d="M13 7l4 4" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="12" rx="1" />
        <path d="M16 8V4H5v12h3" />
      </>
    ),
    print: (
      <>
        <path d="M7 9V3h10v6M7 17v4h10v-4" />
        <rect x="4" y="9" width="16" height="8" rx="2" />
      </>
    ),
    grip: (
      <>
        <circle cx="9" cy="6" r="1.3" />
        <circle cx="9" cy="12" r="1.3" />
        <circle cx="9" cy="18" r="1.3" />
        <circle cx="15" cy="6" r="1.3" />
        <circle cx="15" cy="12" r="1.3" />
        <circle cx="15" cy="18" r="1.3" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};
