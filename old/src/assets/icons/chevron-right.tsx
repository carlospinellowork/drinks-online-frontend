const ChevronRight = ({ width = 24, height = 24, color = "currentColor" }: { width?: number; height?: number; color?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export default ChevronRight;
