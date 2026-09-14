import * as React from "react"

/**
 * Simple Image component - a plain forwardRef <img> wrapper.
 * Replaces Base44's complex Wix Media Platform pipeline.
 */
const Image = React.forwardRef(({ src, alt, className, ...props }, ref) => {
  return <img ref={ref} src={src} alt={alt} className={className} {...props} />
})
Image.displayName = "Image"

export { Image }
